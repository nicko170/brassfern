---
title: "Dependency hygiene: the boring audit that saves the launch"
description: "Client codebases rot at the package.json line. Audit cadences, update windows, vendoring decisions, and the licence review nobody does until procurement asks."
slug: dependency-hygiene-client-code
cluster: engineering
tags: [engineering, dependencies, security, maintenance, process]
date: 2025-11-18
author: Tomás Reyes
keywords: [dependency management, npm audit, software supply chain, license compliance]
readingTime: 10
---

There's a moment in every project handover where the client's engineer opens the repo, runs an install, and watches npm emit 2,300 lines and a vulnerability summary with red numbers in it. Their face does a small, readable thing. Whatever we say next about architecture, they've already formed a view of how the codebase was cared for — and honestly, they're right to. A dependency manifest is a hygiene record. It says whether professionals lived here.

Dependency hygiene isn't glamorous, doesn’t win pitches, and compounds like plaque: invisible daily, catastrophic annually. This is the system we run on every [product engineering engagement](/services/product) — audit cadences, update windows, vendoring decisions, and the licence review that always seems to happen the week procurement asks.

## The manifest is a liability ledger

Every entry in `dependencies` is a loan. You borrowed someone else's code, and the repayments come as upgrades, breaking changes, security advisories, and — eventually — the discovery that the maintainer archived the repo eighteen months ago and the last release has a ReDoS in it. Some loans are excellent value (a battle-tested date library you never think about). Most teams never price any of them.

The pricing questions, asked at adoption time — because the manifest line is the moment of maximum leverage:

- **What does it actually replace?** Half of a typical frontend manifest is encoding decisions a junior made under time pressure: a 30-line utility that lodash got blamed for, a classnames package for a ternary. If the code it replaces is under a page long and crypto-free, write the page. Every line you own is a line you never upgrade in a panic.
- **What's the maintenance surface?** Weekly downloads are a proxy, not an answer. Look at release cadence, issue-response time, whether one person is the whole bus, and whether the changelog treats breaking changes as a sport.
- **What's the blast radius?** A dependency in your build toolchain can be forgiven a lot. A dependency in the request path of a checkout page is load-bearing and should be chosen like it. Our [supply-chain security piece](/journal/engineering/supply-chain-security-js-teams) covers the adversarial version of this question; hygiene is the everyday version.
- **Does it fight the platform?** Libraries that re-implement what browsers now do natively — animation engines, fetch wrappers, date formatting — are the first to go when [the platform catches up](/journal/engineering/web-platform-baseline-2026), and the migration cost lands on you.

Adoption discipline is the cheapest hygiene there is. The next-cheapest is what follows.

## Audit cadence: little and often, or big and catastrophic

The two failing patterns are "never" and "the greatDependencyUpgrade of Q3, which took six weeks and broke the calendar component in four browsers." The working pattern is a cadence with three rhythms:

**Weekly, automated, small:** a scheduled job opens PRs for patch and minor bumps, batched, with changelogs summarised in the PR body. CI is the gate — and this is where test coverage earns its keep. A [testing strategy that ships](/journal/engineering/testing-strategy-that-scales) plus [preview environments on every PR](/journal/engineering/preview-environments-every-pr) means a small bump can merge on green with a thirty-second visual check. The whole point is keeping the *unit of change* so small that failure is cheap to attribute.

**Monthly, human, deliberate:** thirty minutes reviewing what the automation couldn't decide — majors, anything touching auth or payments, anything with a red advisory. This is a standing agenda item, not a project. The deliverable is decisions: upgrade now, schedule for next sprint, or pin with a documented reason.

**Quarterly, structural:** the deeper audit. Dead dependencies (installed, imported nowhere — you'd be surprised), duplicated functionality (two date libraries, three HTTP clients), licences (below), and a bundle-diff review — hygiene work dovetails with [bundle budget discipline](/journal/engineering/bundle-budget-discipline) because both are asking "why is this here?" Security advisories run continuously via the registry tooling, but advisories only cover known CVEs; the structural audit covers everything else that ages.

One cultural rule makes this hold: **dependency version bumps are always their own PRs, never riders.** A bump smuggled into a feature branch turns every future regression bisect into an archaeology dig.

## Pinning, shrinking, and the lockfile religion

Concrete mechanical rules we enforce in client repos:

- **Exact versions in `dependencies` for products.** Caret ranges are for libraries that need to dedupe against hosts; an application wants reproducibility. The lockfile is committed, CI installs from it, and "works on my machine" gremlins drop noticeably.
- **Prune the transitive jungle.** When a direct dependency drags in forty transitive ones for a feature you use 2% of, that's a signal to find a narrower tool — or accept the load knowingly, on the record. `npm ls` output in a quarterly doc has killed more bad dependencies than any audit tool.
- **Engines and package-manager pinning.** Nothing rots a handover like "needs Node 14, do not ask questions." State the supported versions, enforce them in CI, and upgrade the floor on the quarterly rhythm.

## Vendoring: when you take the code in-house

Sometimes the right answer to a dying-but-critical dependency is to absorb it. Vendoring is scarier than it sounds and cheaper than it looks, but the decision needs honesty about what you're buying:

**Vendor when** the package is small (a few hundred lines), unmaintained but stable, central to your product, and its licence permits it — or when you've already forked it with three patches and are lying to yourself about that being different from owning it. A button-scroll-behaviour utility orphaned at v1.2.0? Vendor it, delete the parts you don't use, write the two tests you rely on, move on.

**Don't vendor when** the package is large, security-sensitive (crypto, auth, parsers for untrusted input), or moving under you (vendor a spec-compliant client mid-protocol-churn and you've bought a treadmill). Parsers and cryptography are rented forever at whatever price the maintainers ask; that rent is the deal of the century compared to owning them.

The middle path worth knowing: **fork-patching via the package manager's patch mechanism** keeps your diff visible, survives upgrades, and doesn't pretend to be ownership. It's the right answer maybe half the time a team says "vendor."

## The licence review procurement will eventually ask for

Every client engagement longer than a quarter ends with the same email: *"For our vendor-risk questionnaire, please confirm all open-source licences in the product."* Teams that treat this as launch-week homework spend a miserable day with a licence scanner arguing about whether `MIT OR (Apache-2.0 AND BSD-2-Clause)` in a transitive dependency of a build tool is fine. (It is, but try proving it at 6pm.)

The cheap version:

- **Generate the licence manifest in CI.** One job, on the quarterly audit, emits the full licence tree into the repo. When procurement asks, you send a file. Total marginal cost: nearly zero, forever.
- **Set a policy once.** Which licences are fine (permissive), which need counsel review (copyleft in distributed client code — the nuances depend on how the product is delivered), which are banned (SSPL-flavoured relicensing bait, unknown/"SEE LICENSE" specials). Write it in the repo. The policy converts a legal opinion into a lookup table, and it makes the *adoption-time* question above enforceable.
- **Watch for the relicensing event.** The modern failure mode isn't an obscure licence — it's a formerly-permissive dependency going source-available at vNext. Dependabot will happily PR you into a different legal relationship with the software. The monthly human review exists substantially for this; the licence manifest diff in CI flags it mechanically.

## The handover test

Our acceptance check before handover, and the one I'd suggest any client ask of any studio:

1. Fresh clone installs and builds clean on the documented toolchain, first try.
2. Zero known high-severity advisories with available fixes.
3. No dependency more than two majors behind without a recorded reason.
4. Licence manifest present and current.
5. A `DEPENDENCIES.md` listing the *judgement calls* — why the fork, why the pin, why the vendor — so the next team inherits reasoning, not just state.

That last file is the whole philosophy: hygiene isn't a version number, it's the trail of decisions that lets the next engineer be brave.

## Key takeaways

- A dependency manifest is a liability ledger; price every adoption at the moment it's cheapest — before the line is added.
- Hygiene runs on three rhythms: automated weekly bumps, a monthly human review for majors and advisories, a quarterly structural audit.
- Version bumps get their own PRs, always. Riders poison bisection.
- Vendor small, stable, central things; never crypto, auth, or parsers. Fork-patches cover the honest middle.
- Generate the licence manifest in CI on a schedule, and write the licence policy down before procurement asks. Watch for relicensing events in automated PRs.
- Hand over reasoning, not just state: a short decisions file is what turns maintenance debt into inherited judgement.

## FAQ

**Isn't keeping everything up-to-date endlessly disruptive?**
The opposite. Weekly small bumps are each nearly risk-free and individually attributable; the disruptive version is the annual mega-upgrade where forty packages move at once and nothing is attributable at all. Frequency is what makes updates boring, and boring is the goal.

**How do we convince a client to pay for maintenance time?**
Don't frame it as maintenance; frame it as risk pricing. One emergency "upgrade everything because a CVE is being exploited" week costs more than two years of the cadence. Show that math once and the argument ends.

**Are audit tools (`npm audit` and friends) sufficient?**
They're the floor, not the system. They catch known CVEs, miss licence drift, dead dependencies, duplicated functionality, and abandoned-but-unexploited packages. Treat the scanner as one input to the quarterly audit, not the audit.

**When should we intentionally stay on an old major?**
When the upgrade's cost is real and the benefit is speculative — and only with the reason recorded: what blocks it, when it gets revisited, what risk is being accepted. A pin with a documented reason is hygiene. A pin with amnesia is just debt in a nicer outfit.

**Monorepos make this worse or better?**
Mostly better: one lockfile, one upgrade PR per package, one CI gate. The caveat is that a single breaking bump now gates every app in the repo, which raises the bar on the monthly review's judgement. We covered the trade-offs in [monorepo or not?](/journal/engineering/monorepo-decisions-studios).
