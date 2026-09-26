---
title: "Zero-downtime Postgres migrations, without heroics"
description: "Zero-downtime Postgres migrations with expand-migrate-contract: safe backfills, the locking hazards that catch everyone once, and our pre-flight checklist."
slug: zero-downtime-postgres-migrations
cluster: engineering
tags:
  - postgres
  - migrations
  - databases
  - deployment
date: 2026-02-26
author: Felix Brandt
keywords:
  - postgres migrations
  - zero downtime deployment
  - expand migrate contract
  - online schema change
readingTime: 11
---

The most dangerous sentence in backend engineering is "we'll just run the migration at 2am." It implies your database change is a heist: in, out, nobody notices. Sometimes that's true. Usually it's the opening line of a postmortem where a thirty-millisecond column addition took an `ACCESS EXCLUSIVE` lock on a table that serves 4,000 queries a second, and the checkout went down at 2:04am instead.

The alternative isn't heroics. It's a pattern — **expand, migrate, contract** — plus a respectful fear of locks, applied with a checklist so boring it fits on an index card. This is how Brassfern runs schema changes on live Postgres databases, and none of it requires a database specialist. It requires refusing to do the easy thing once you know why the easy thing breaks.

## The pattern: expand, migrate, contract

The whole discipline is one idea: **never let a schema change and the code that depends on it deploy in the same release.** Split every breaking change into three deploys, each independently safe, each independently reversible.

**1. Expand.** Add the new thing alongside the old: the new column, the new table, the new index. Nothing is renamed, nothing is dropped. The running application doesn't know the change happened. Adding a nullable column with no default is metadata-only in Postgres — it doesn't rewrite the table, doesn't hold a meaningful lock, finishes in milliseconds even on a hundred-million-row table.

**2. Migrate.** Deploy code that writes to both shapes and reads from the new one (falling back to the old), then backfill existing rows at leisure. This is the part everyone tries to skip, and the part that matters most, so we give it its own section below.

**3. Contract.** Once the backfill is verified and no code path touches the old shape, deploy code that reads only the new shape — then, in a later release, drop the old column. Dropping is instant in Postgres but irreversible in spirit, which is why it gets its own quiet deploy a week later rather than riding along with step two.

Three deploys where you wanted one. That's the entire cost. In exchange: every intermediate state is valid, rollbacks are real rollbacks instead of forward-fixes, and a bad migration ruins your afternoon instead of your quarter.

## Backfills that don't take the site down

The expand phase is easy. Backfills are where production gets its revenge. The rules we hold:

- **Batch, and mean it.** Update a few thousand rows per statement, committed, with a pause between batches. Not as a vibe — as a number you've tested against your replication lag. On a busy primary, unthrottled backfills show up as lag on the read replicas, which show up as users seeing stale data, which shows up as a support ticket that says "I saved it and it's gone."
- **By primary key range, not `OFFSET`.** `LIMIT 5000 OFFSET ...` rescans and costs more as you go, and worse, it's not resumable with confidence. `WHERE id > :cursor ORDER BY id LIMIT 5000` is resumable, index-friendly, and its progress is a single integer you can log.
- **Dual-writes cover the gap.** The backfill fixes the past; concurrent writes keep arriving. Code in the migrate phase must write both shapes, or your backfill is chasing a moving target and never lands. Feature flags make the dual-write erasable — which, as we've argued in [feature flags without the graveyard](/journal/engineering/feature-flags-craft), means writing the removal ticket when you write the flag.
- **Verify cheaply, continuously.** A one-line count-sanity query in the loop (`expected vs. backfilled`) printed every batch. Backfills die quietly; loud instrumentation is the only adult supervision they get.

One more trap that deserves bold type: **adding a column with a volatile default rewrites the whole table on older Postgres, and even on modern versions a non-null default must be constant to stay metadata-only.** If you need a backfilled default, do it as expand (nullable column) → batched backfill → `SET NOT NULL` via a validated check constraint, never as one grand `ALTER`.

## Locking: the hazard list

Every zero-downtime horror story is a lock story. Postgres' DDL takes heavier locks than your intuition expects, and the lock queue makes it worse — a brief `ACCESS EXCLUSIVE` waiting behind a long read blocks *everything* behind it, including ordinary writes. The hazards that have genuinely bitten us:

- **`CREATE INDEX` without `CONCURRENTLY`.** The plain form locks writes to the table for the entire build. On a large table, that's minutes of a frozen writes path. `CONCURRENTLY` runs outside a transaction, so it can't live inside a transaction-managed migration runner — a real reason to run some migrations by hand, from a runbook, rather than through your ORM's auto-apply.
- **Foreign key `NOT VALID`.** Adding an FK validates existing rows under a lock. Add it `NOT VALID` (fast, weaker lock), then `VALIDATE CONSTRAINT` in a separate statement, which only needs a `SHARE UPDATE EXCLUSIVE` lock that coexists with reads and writes.
- **The lock queue pileup.** Any heavy lock request queues; while queued, everything behind it queues too. Set a short `lock_timeout` for migrations (seconds, not minutes) so a blocked DDL fails fast instead of damming the river. A failed migration retry is cheap. A complete write stall is not.
- **`ALTER TYPE` on enums in use.** You can't add an enum value inside a transaction in older versions, and renaming values is a rewrite. Treat enums that appear in hot paths as near-constants; new states prefer a lookup table over enum surgery.

The pattern underneath all four: know which lock each statement takes, before it runs in production. `pg_locks` and `pg_stat_activity` during a staging rehearsal tell you more truth than any blog post — including, again, this one.

## The pre-flight checklist

Before any schema change to a table that matters, this card comes out. It's deliberately short — checklists that sprawl get skipped. (The same sprawl principle governs our [testing strategy](/journal/engineering/testing-strategy-that-scales): keep the ceremony small enough that people actually perform it.)

1. **Split verified.** Is this an expand, migrate, or contract step? If it's doing two, split it.
2. **Locks named.** What lock does each statement take, and is `lock_timeout` set to fail fast?
3. **Indexes concurrent.** Every `CREATE INDEX` on a hot table is `CONCURRENTLY`, run outside the migration transaction.
4. **Backfill is resumable.** Key-range cursor, batch size decided against replica lag, progress logged, dual-writes live.
5. **Rollback is real.** "Revert the deploy" works at every phase because no phase makes the old shape invalid. If the rollback plan is "restore from backup," the plan is wrong.
6. **Rehearsed on production-shaped data.** Staging with 10,000 rows teaches you nothing about locks. Rehearse against a restored snapshot or a production-scale clone.
7. **Observers ready.** Know which dashboard shows replica lag and lock waits, and have it open when you press go — the same health-board instinct as our [frontend observability setup](/journal/engineering/frontend-observability-small-teams), applied one layer down.

Item six is the one teams skip and the one that bites. We've watched a "seven-second" staging migration run for eleven minutes in production because the table was forty times larger and the autovacuum was mid-flight. Rehearse at scale, or accept that production is the rehearsal.

## When the ORM can't come

A candid note: most ORM migration tools generate exactly the dangerous statements above as defaults — non-concurrent indexes, constraint validation inline, enum surgery — and wrap them in a transaction for good measure. We still use ORMs for development speed; we just treat every generated migration as a draft. The generated file gets reviewed against the checklist, amended by hand (concurrent indexes detached, FKs split), and only then lands. If your tool diffs the schema and generates destructive changes eagerly, tell it to generate SQL without applying, forever.

For long-lived client platforms, we also keep migrations two-directional in intent even when down-migrations are fiction: the commit message goes with the expansion so a future engineer can reconstruct why the old column lingered for three releases. Archaeology is a maintenance cost; write your strata legibly. Platforms that survive handovers are a theme of our [headless CMS migration runbook](/journal/engineering/headless-cms-migration-runbook) too — different layer, same moral: reversibility is a design decision, made early.

If your schema has grown past the point where this feels controllable in-house, this is normal work for our [product engineering practice](/services/product) — a schema-debt audit is usually a two-week engagement, and it pays for itself at the first avoided 2am.

## Key takeaways

- Expand, migrate, contract: never couple a schema change with the code change that needs it. Three boring deploys beat one heroic one.
- Adding nullable columns and dropping columns are cheap; adding defaults, validating constraints and building indexes are the expensive verbs. Know the difference before you run it.
- Backfill by primary-key range, in committed batches, throttled against replication lag, with dual-writes covering the gap — and log progress every batch.
- Set `lock_timeout` on migrations so blocked DDL fails fast instead of queue-damming your writes.
- Treat ORM-generated migrations as drafts: concurrent indexes and deferred constraint validation usually require hand-editing.

## FAQ

### Is expand-migrate-contract overkill for a small app?

Scale the ceremony, not the principle. On a quiet internal tool, a single deploy with a maintenance window is fine — the checklist shrinks to "have a backup and a quiet hour." But learn the pattern early, because by the time you need it, the tables that need it are exactly the ones you can't practise on.

### How do we handle renames specifically?

Renames are expand-migrate-contract wearing a moustache: add the new column, dual-write, backfill, switch reads, drop the old one. The seductive shortcut — `ALTER TABLE RENAME COLUMN` — breaks every running connection using the old name the moment it commits. There is no atomic rename across a rolling deploy; there's only the patient version.

### What about truly huge tables, hundreds of millions of rows?

The pattern holds; the margins tighten. Backfills may run for days (fine — resumable cursors exist for this), index builds get scheduled against traffic troughs, and you may reach notebook-level coordination with whoever owns replication. Some teams graduate to logical-replication-based table rebuilds for extreme cases. Our advice: get very good at the boring pattern first; heroic tooling is for when boring demonstrably can't fit.

### Should migrations run automatically in CI/CD on merge?

Expand steps, yes — they're additive and safe to auto-apply. Anything carrying a heavy lock or a backfill gets a manual gate: run from a runbook, at a chosen time, with the lag dashboard open. Automation should remove toil, not judgement, and judgement is precisely what the risky steps need.
