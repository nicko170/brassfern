---
title: "Roles and permissions: the quiet complexity of team products"
description: "Designing roles that match customer org charts, permission matrices people can read, invitation-time clarity, escalation paths and guarding against the accidental admin."
slug: roles-permissions-ux
cluster: product
tags: [roles and permissions, rbac, team products, enterprise ux, product design]
date: 2026-08-27
author: Mara Ellison
keywords: [roles permissions ux, rbac design, admin permissions interface, team roles product design]
readingTime: 9
---

Nobody demos the roles screen. Not in the sales deck, not in the product tour, not in the launch video. And yet roles and permissions are where team products quietly earn or lose enterprise trust: procurement asks about them in the security questionnaire, the IT admin evaluates them before the evaluator's boss ever logs in, and every mid-size customer eventually hits the moment where "everyone is an admin" stops being charming and starts being a breach waiting for a Tuesday afternoon. The complexity is quiet, but it is load-bearing.

We've designed these systems for ledgers, banks, clinics and classrooms. The patterns below are the ones that survived contact with real organisations — including the parts that aren't about checkboxes at all.

## Start with their org chart, not your data model

The classic failure: roles inherit the shape of the *implementation* — capabilities named after database tables ("can_edit_invoices", "can_view_timesheets") — surfaced as a 40-row matrix and called a feature. Customers don't think in capabilities. They think in people: "Sofia does our scheduling but shouldn't see payroll."

The research phase that matters: collect five real org charts from reference customers, and for each, write down the access stories in plain sentences. "The practice manager can see everything except clinical notes." "The junior accountant prepares but cannot post." "The agency contractor sees only projects they're on." Two things fall out immediately. First, the roles cluster into a small set of natural archetypes — usually 3–5 plus one "custom" escape hatch. Second, the interesting boundaries are rarely CRUD-shaped; they're *responsibility*-shaped: prepare vs approve, see vs export, belong-to vs manage. Name roles after the job people recognise — Owner, Admin, Member, Viewer is fine for many products, but in verticals like accounting or health the honest names are Bookkeeper, Practitioner, Front Desk — and the interface starts describing the customer's world instead of your schema.

The sibling problem — gating features by plan tier rather than by person — has its own politics of access, which we've covered in [permission UX for plans and extras](/journal/product/permission-ux-design). Roles are about who; tiers are about which account. Shipping only one and calling it "permissions" is how enterprise deals stall in legal.

## The 3–5 role rule, with one honest escape hatch

Products drift toward two broken states: too few roles ("Admin" and "Member", with Member unable to do their job) or a build-your-own capability matrix from day one that nobody but the implementer understands. Both are user-hostile in opposite directions.

The model that holds: **a small set of named roles that cover ~90% of real organisations, each role describable in one sentence, plus exactly one custom-roles lane** for the 10% with genuinely unusual structures — usually your largest customers, who will pay for it and forgive its rough edges. If your five roles leave a major customer's org chart unrepresentable, the answer is almost never "add role #6 with a 4-row difference"; it's "make one capability of the closest role configurable" — invites, billing visibility and export rights are the usual candidates.

One tell that you've hit the right grain: support can explain the roles over the phone without screen-sharing. "Owners do everything including delete the workspace; Admins manage people and settings; Members do the work; Viewers watch." If the explanation needs a whiteboard, the model does too.

## A permission matrix people can actually read

You will need the matrix anyway — enterprise buyers ask for it, auditors want it, your own team will need it to answer "can the intern do that?". So design it as a *document*, not a settings screen:

- **Group capabilities the way users' mental models group work** — by area of the product and by job ("Money", "People", "Publishing"), not alphabetically or by table.
- **Show all roles side by side** with plain check/cross/limited marks, and let rows expand into the second-order consequences users reliably don't know to ask about: "posts invoices → also triggers the Xero sync and the email to the client".
- **Every cell is hoverable into a sentence.** "Members — limited: can edit drafts they created; cannot publish" beats a half-filled dot that means… something.
- **Version and link it.** The matrix is a URL your support team pastes into tickets and your customers paste into compliance reviews. Treat it as public documentation; its clarity is a sales asset.

On the [Copperline Mutual](/work/copperline-community-bank) engagement, the readable matrix — one page, five roles, consequence annotations — became the artefact their compliance team cited as the reason the pilot passed review. Nobody demoed it. Everybody read it.

## Invitation time is the role-clarity moment

The single highest-leverage surface in the whole system is the invite dialog, because it's where access decisions are *actually* made — by whoever is free, in a hurry, often guessing. Everything crucial about roles must be decidable from that dialog alone: each role option gets its one-sentence description ("Members can create and edit content, but can't manage billing or invite others"), a "what they'll see" preview link, and a default that matches the safe, common case — the default is a security decision, so make Member the default and make Admin a deliberate reach.

The [invite-flow patterns](/journal/product/invite-flows-team-products) handle the social mechanics; the permission layer's job is narrower: never let someone grant access they don't understand the shape of. The test we run in usability sessions — hand a participant three colleagues' job descriptions and ask them to invite each — fails reliably wherever the dialog offers only a label dropdown with no descriptions. Nobody should have to leave the flow to learn what "Contributor" means *here*.

## Escalation paths: the missing half

Permission systems are designed around granting; real organisations run on *requesting*. The member who hits a wall — a disabled button, a 403 page, a failed export — needs a path that isn't "Slack the founder": an inline **request-access affordance** at the point of denial ("This needs Admin access — request it?") that notifies the right admins with context, lets them approve in one click, and reports the outcome back to the requester where they were blocked.

Two refinements that separate calm systems from chaos. **Temporary elevation**: time-boxed grants ("Admin for 48 hours to run the year-end close") beat permanent silent over-granting for every periodic task, and an expiry you can see is a review process that runs itself. And **denial copy with dignity**: "You don't have access to payroll. Ask your practice manager — [request]" beats "Forbidden", every time; the grammar of good [error messages](/journal/product/error-messages-that-help) applies with double force when the error is about the user's standing in their own organisation.

## The accidental admin

Every permission audit we've run on a customer's existing tool finds the same three smells: the default invite role set to Admin "to avoid friction"; ex-employees' accounts with keys still warm; and power granted broadly because one narrow grant was once annoying to process. Design against all three structurally:

- **Safe defaults** — Member by default, elevation by deliberate action, as above.
- **Blast-radius labels** — the actions with outsized blast radius (bulk operations, deletion, external sends, permission changes themselves) get their own capability lines, independent of ordinary edit rights; the same argument we make in [bulk actions](/journal/product/bulk-actions-ux), where a role may edit one record but shouldn't mutate ten thousand without an explicit grant.
- **Visibility over ceremony** — an always-available "who can do what" view and a periodic access-review digest ("14 people can export customer data; 3 haven't logged in this quarter") beat a one-time setup wizard. Security posture decays; the review surface is the maintenance schedule.
- **Every grant leaves a line in the audit feed** — who, what, granted by whom, when — in the same permanent-record grammar as everything else in the [activity and audit log](/journal/product/activity-feeds-audit-logs). The audit trail is what converts "who gave the contractor billing access?" from an incident into a lookup.

## Custom roles, honestly priced

Custom roles are legitimately an enterprise-tier feature, and it's fine to say so — the engineering (per-record scoping, capability inheritance, edge-case tooling) is real, and the customers who need it know they need it. What isn't fine is making custom roles the *escape hatch for a lazy base design*: if mid-market customers routinely need custom roles to represent a front-desk person, your base roles are wrong, and no tier can price its way out of that.

Ship the custom lane as a **capability checklist against a base role** ("like Member, plus: export data, manage integrations"), not a bare matrix — building up from a named archetype keeps the result explainable ("she's basically a Member who can export") and keeps support able to reason about it. And test your custom-role editor against the nastiest real requirement you can find in interviews — ours was "a contractor who can see two of seven clients, read-only, for six weeks" — because that's the one the Fortune-500 prospect's IT lead models in the demo.

Roles and permissions are the part of the product that represents the customer's organisation back to itself. Get it right and it disappears into the furniture, trusted, unexamined, defensible. Get it wrong and it surfaces only in incidents, reviews and churn reasons. Quiet complexity deserves loud craft.

## Key takeaways

- Model roles on customer org charts and responsibility boundaries (prepare vs approve, see vs export), not on your database capabilities.
- Ship 3–5 named roles covering ~90% of organisations, each explainable in one sentence, plus one custom lane built as "base role plus capability deltas".
- The permission matrix is a public document: grouped by job, side-by-side roles, consequence annotations, hoverable sentences, versioned and linkable.
- The invite dialog is the decision moment — role descriptions, "what they'll see" previews, and a safe Member default.
- Design the requesting half: request-access at the point of denial, one-click admin approval, temporary elevation, dignified denial copy.
- Guard against the accidental admin: safe defaults, blast-radius capabilities, access-review digests, and every grant logged in the audit feed.

## FAQ

**Should roles be per-workspace or per-project?**
Follow the trust boundary, not the taxonomy. If access realistically differs per project (agencies, firms), roles must scope to projects or you'll watch customers build parallel spreadsheets of who-shouldn't-see-what. If the workspace *is* the trust boundary, per-project roles add a dimension of setup nobody uses. When unsure, ship workspace-level with project-level "guest" access — the guest lane covers most real variance.

**How do we migrate customers when we redesign the roles model?**
Map every existing grant to the nearest new role, show each admin a diff of what changes for their people ("3 members gain export access — review"), and give an opt-out window. Never silently tighten access — a capability removed without notice is an outage wearing a security badge.

**Is "Owner" a role or an attribute?**
Treat it as an attribute with exactly one value per workspace, transfer flows, and a two-person confirmation for the transfer itself. Owners-as-a-role invite the "five co-equal owners" state, which is a support ticket genre of its own — usually filed after a disagreement.

**When is it worth building fine-grained per-field or per-record permissions?**
When two or more enterprise prospects' contracts literally depend on it and one will fund the build — per-record access multiplies every query, cache and test in the system. The honest middle step that satisfies most asks: per-record *sharing* (invite to a single item, read-only) layered on coarse roles. Reserve the full lattice for regulated verticals that will pay its weight.
