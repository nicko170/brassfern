---
title: "Switching agencies mid-flight: a transition playbook"
description: "How to leave an agency — or inherit a fired one's work — without losing the project: asset inventories, handover audits, the two-sprint overlap rule."
slug: switching-agencies-mid-flight
cluster: playbooks
tags: [agency relationships, handover, transitions, project recovery, procurement]
date: 2026-03-05
author: Felix Brandt
keywords: [switching agencies, agency handover, firing your agency, project transition]
readingTime: 10
---

Nobody writes about switching agencies until they have to — and by then they're writing in a hurry, under NDA anxiety, usually at 11pm. We've inherited eleven mid-flight projects in recent years: some from agencies that were fired, some from agencies that folded, one from an agency that simply stopped replying. We also run the leaving side honestly — clients have left us, and the good ones left with everything they needed because we handed it over like professionals.

Both directions taught us the same lesson: transitions fail on **assets and access**, not on feelings. The code, the credentials, the design source files, the DNS — that's the project. Everything else is a conversation. This playbook is the order of operations that gets the thing out intact.

## Before anything else: read your contract

Not skim — read, with a highlighter, ideally with whoever signs things at your company. You're looking for four clauses:

- **IP assignment.** Does work product assign to you *on payment* or *on completion*? The difference matters enormously mid-flight. If assignment happens at completion and the work is incomplete, you've discovered this at the worst possible time.
- **Termination and notice.** Typically 30 days. The clock you plan against starts at written notice, not at the meeting where everyone knew.
- **Data and access on exit.** What the agency owes you: source files, repositories, hosted-environment access, documentation. Good SOWs [spell this out before signature](/journal/playbooks/reading-an-agency-sow); average ones go quiet here, which is why you're reading this article.
- **Outstanding payment.** You will be invoiced for work to date, possibly disputed. Budget for the negotiation; it happens in parallel with everything below.

Nothing in this article excuses you from what the contract says. It exists so you know what to ask for while the asking is still polite.

## The asset inventory: what you're actually taking

Do this in week one of the transition, before anyone's mood hardens. A transition asset inventory is a boring spreadsheet of **everything that would hurt to lose**, in roughly this order of pain:

1. **Credentials and ownership.** Domains and DNS (registrar logins, in whose name?). Hosting and cloud accounts. SaaS: analytics, error tracking, CMS, email platform, CI/CD, package registries. The test for each is identical: *can a client-controlled email address reset the password today?* Anything that fails that test is a hostage negotiation waiting for a date.
2. **Code.** Every repository, mirrored to a client-owned organisation. Not a zip — the git history. History is where the reasoning lives, and zips are where reasoning goes to die.
3. **Design source.** Working files (Figma or equivalents), font licences (check whether they're licensed to the agency or to you — often the former, which is a procurement item, not a crisis), asset libraries, brand guidelines as editable files, not just PDFs. Our standard is the [living handover](/journal/playbooks/design-handover-done-right) — if the files you receive can't be opened and edited by a stranger, you don't have the design, you have photographs of it.
4. **Documentation and decisions.** What exists, where, and — critically — the *decision log*: why the architecture went microservices, why the cart uses that provider. A codebase without its whys is archaeology. If there's no log, schedule the wikis-meeting below.
5. **Data and content.** CMS exports, database snapshots, media libraries, with cache-busting confirmation that exports actually re-import somewhere you've tested.
6. **Third-party relationships.** Licences, vendor accounts, support contracts bought through the agency's partner status.

For each row: owner, location, transfer method, done/not-done. The spreadsheet ends up oddly calming. Panic diffuses into checkboxes.

## The knowledge capture: the wikis-meeting

The riskiest asset in any transition is unwritten: it lives in the departing team's heads. Extract it in a structured two-hour session per area — engineering, design, accounts — with three questions running on a shared doc:

- **What's load-bearing that nobody would guess?** (The cron job that reconciles billing. The spreadsheet a "database migration" actually reads. The client stakeholder who must approve images.)
- **What would you tell your successor to never touch?**
- **Where are the bodies?** (Known bugs, tech debt with teeth, the *one* integration flakier than it looks.)

Record it. Transcribe it. Attach it to the inventory. Then — politely, while goodwill lasts — get the agency to run one *live walkthrough* of the scariest subsystem on a call with your incoming team. [Documentation people actually read](/journal/playbooks/handover-without-shelfware) is short, current and attached to the thing it documents; this meeting is how you manufacture it when it doesn't exist.

## The code handover audit

When we inherit a project, we run a two-to-three-day technical audit before promising anything. You can request the same from any incoming agency — or run a light version yourself. The audit answers:

- **Does it build?** From a clean machine, following only the readme. (Roughly a third of inherited repos fail here. It's fine — finding out now is the point.)
- **Can it deploy?** CI green, environments documented, secrets identified and rotatable. Rotate every secret on transfer day, no exceptions.
- **Where's the risk concentrated?** Outdated dependencies with known CVEs, untested paths, libraries pinned to versions from a braver era, undocumented infrastructure-as-click-ops.
- **What's the honest state of the roadmap?** Which "90% done" features are 40% done.

The deliverable is a short report: build/deploy status, risk register with rough remediation costs, and a recommended stabilisation sprint or two *before* any new feature work. Incoming agencies that skip this and start with a re-platforming proposal in week one are solving their margin problem, not yours.

## The two-sprint overlap rule

If at all possible, pay for overlap: the outgoing and incoming teams work in parallel for two sprints (four weeks), with duplicated environments and the outgoing team explicitly assigned to *enable*, not to build. It costs like a surcharge and saves like insurance. The overlap is when the "wait, why does the deploy script need that flag?" questions get answered by a human rather than by archaeology at 2am.

When overlap isn't possible — fired agencies rarely consult, and dead ones can't — compensate with the wikis-meeting intensity above, and accept that the incoming team's first two sprints are 60% discovery. Plan the roadmap accordingly. Telling a new agency to "continue at full speed" with no overlap is how quarter one becomes quarter zero.

## The diplomatic scripts

The emails you'll actually send, minus the ones you'll draft and delete:

**Giving notice (to the outgoing agency):** keep it three sentences. Decision stated, gratitude for specific good work, transition cooperation requested with a named owner and date. No post-mortems by email — they belong in the exit interview or nowhere.

**To your own stakeholders:** "We've made a change to who builds [project]. Here's what stays the same (scope, aim), here's what moves (date, by roughly X weeks), here's the single owner for questions." Silence from you breeds fan-fiction.

**To the incoming agency's leadership:** "Here's our asset inventory and wikis-meeting output. What else do you need to [onboard honestly](/journal/playbooks/agency-onboarding-first-30-days)?" This one sentence positions you as the client every good agency wants, and you'll get their senior attention accordingly.

## What to demand on the way out

A checklist, because politeness fades exactly when you need it:

- Final git mirrors verified on a client-owned host — *pull, don't trust*.
- All credentials rotated; agency access revoked on transition day, with a list confirming which accounts they held.
- Domain and DNS control confirmed by a real login test, not an assurance.
- Final invoice reconciled against the asset list — no deliverables outstanding, no surprise "final project management fee."
- Written confirmation of licence positions (fonts, stock, plugins) — what transfers, what you need to re-buy. Re-buying is normal; finding out via legal letter isn't.
- An exit interview. Thirty minutes, honest, recorded only in your notes. Agencies hear the truth rarely enough that both of you will be glad of it.

## If it goes hostile

Occasionally it does. The agency holds credentials, disputes invoices, goes quiet. The tools are, in order: your contract's exit clauses (see section one — this is why you read it), your leverage over final payment (legitimate, proportionate, lawyer-reviewed), and — in the worst case — rebuilding from what you control. This is survivable if you owned your domain, your analytics, and your content from day one. Which is the real lesson, arriving too late for comfort: **own your foundations from day one of any engagement**, and every future transition becomes logistics instead of hostage release. It belongs in your [brief](/journal/playbooks/writing-a-great-brief), your SOW, and your project kickoff.

## Key takeaways

- Transitions fail on assets and access, not feelings. Inventory first, feelings later.
- Read the contract before the conversation: IP assignment timing, notice, exit deliverables.
- The test for every credential: can a client-controlled email reset the password today?
- Run the wikis-meeting: load-bearing secrets, never-touch lists, where the bodies are.
- Audit the inherited code before promising dates; stabilise before building.
- Two sprints of paid overlap beats four sprints of archaeology.
- Own domain, DNS, analytics and content from day one, and transitions become logistics.

## FAQ

**How long does a mid-flight switch actually take?**
Budget six to eight weeks from notice to the incoming team shipping normally: two for inventory and knowledge capture, two to four of overlap or stabilisation. Anyone promising seamless continuity in a fortnight has never done one.

**Our agency was acquihired / dissolved — now what?**
Fastest version of the asset inventory above, applied to whoever still has keys. Domain registrars and cloud providers have account-recovery processes for organisations that can prove ownership — start them the same week. Everything that exists only on the departed team's laptops is gone unless a contract says otherwise; treat recovery as urgent, not casual.

**Should the incoming agency be involved before we've given notice?**
Quietly, yes — scoping only. You want their audit plan and timeline shaped so the transition begins the hour notice lands. What you *don't* do is let the two agencies trip over one another pre-notice; that's how notices leak, and leaked notices cost you the goodwill the wikis-meeting needs.

**What if we're switching for performance reasons — do we tell the new agency the gory details?**
Yes, all of them. An incoming team that inherits your optimism instead of your history will re-make the same mistakes with extra confidence. Give them the failure anatomy; it's the most valuable document you own.

**We're the agency being left. What does doing this well look like?**
Hand over everything on the list above without being asked twice, do the exit interview honestly, and write the client a reference-quality transition. A decade of observation says clients remember exits longer than launches. Our [handover standards](/journal/playbooks/design-handover-done-right) apply at the end of an engagement exactly as they do at the start.

Facing a switch and want a sober second pair of eyes? [Talk to us](/contact) — we've been on every side of this table, and we don't charge for telling you whether yours is recoverable.
