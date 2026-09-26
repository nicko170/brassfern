---
title: "Status updates clients actually read"
description: "The one-screen weekly note format that kills the 40-slide deck: shipped, next, blocked, decisions needed — with working demos instead of jargon and metrics in context."
slug: status-updates-clients-read
cluster: playbooks
tags: [client communication, project management, status updates, agency process, reporting]
date: 2026-07-09
author: Ruby Castellanos
keywords: [client status update template, agency weekly report, project communication clients, stakeholder updates]
readingTime: 9
---

Every agency has a status update nobody reads. Usually it's a deck: forty slides of RAG statuses, a burndown chart rendered in a font from 2009, and a risks section that says "scope creep" in twelve different wordings. It took a producer half a day to build, it will be skimmed in ninety seconds, and its actual function is not communication — it's evidence. *We told them, see, slide 31.* A status update that exists to be defensible rather than readable has already failed, because the reader can smell the defensiveness.

We killed the deck years ago. What we send instead is a one-screen note, every Friday, same shape, no exceptions. Clients read it — we know because they reply to it, quote it in their own internal updates, and occasionally forward it upward with "this is how every vendor should report." This is the format, and the reasoning behind each part.

## The four-line skeleton

The entire update fits in one screen of any email client, and it has exactly four sections:

> **Shipped this week.** What is now true that wasn't true last week — linked, not described.
> **Next week.** What will be true next Friday, stated as commitments we can be held to.
> **Blocked.** What is waiting on you, with the date it started waiting.
> **Decisions needed.** Questions only you can answer, with our recommendation attached.

That's it. No percentages. No "on track" badges. The reader's eye goes top to bottom: context, plan, their obligations, their decisions. The whole thing takes a competent producer forty minutes to write, most of which is spent on the links — which is the point, because the links are the status.

## Shipped: link the work, never describe the work

The failure mode of status writing is described progress: "the checkout flow is coming along nicely, we're about 70% through the payment step." This sentence is unfalsifiable and therefore worthless. Nobody has ever replied to it. Compare: "Checkout now handles expired cards with a one-tap update flow — [try it on staging](#), card 4000 0000 0000 0341 gets you the declined path."

A link to working software is the only status format that can't be spun. Either the thing works when the client clicks it or we've been caught in a lie within four seconds of sending. That accountability is a feature, not a risk — it's why clients trust the weeks when the honest line is "shipped: less than we wanted, here's why." (This is the same reason we [demo working software weekly](/journal/playbooks/stakeholder-alignment-design) instead of presenting intentions: the demo *is* the status, and the note is just the demo's table of contents.)

Two rules keep "shipped" honest. First, every item links to something the client can touch: a staging URL, a design file frame, a published page, a merged changelog entry. No link, no line item. Second, items are phrased as outcomes, not activities. "Worked on search" is an activity. "Search now tolerates typos — try 'brouchure'" is an outcome. If you can't phrase it as an outcome, it didn't ship; it merely happened.

## Next week: commitments, not hopes

The "next week" section is where most updates go vague, because vagueness is deniable. "Continue development of onboarding" commits to nothing and can be repeated for nine consecutive weeks — we've seen client archives where it was. Our rule: every line in "next week" must be specific enough that next Friday's note can say, without interpretation, whether it happened. "Onboarding steps 2–4 clickable on staging by Thursday demo" passes. "Progress on onboarding" does not.

We also keep the list short — three to five items. A long next-week list is a quiet confession that the list-writer doesn't know what matters. Shortness is information.

## Blocked: the most important section, written without blame

Blocked items decay. A dependency that sits unmentioned for two weeks becomes nobody's problem, and then become's everyone's crisis in week eleven. So blocked items go in every note, verbatim, with the date they became blocked, until they're unblocked or escalated. "Waiting on: brand photography selects (blocked since 19 June — needed by 10 July to hold the launch date)." The date does the persuading. Nobody reads "this is urgent" as urgent after the third time; everybody reads "blocked for 16 days" correctly.

The tone discipline matters here. Blocked sections fail when they read as accusations, because blamed clients stop reading the whole note. The phrasing is always neutral mechanics: what we need, what it gates, what happens if it slips. We never write "as mentioned previously" — the reader already knows; the sentence exists to wound, and wounded readers retaliate by going quiet.

## Decisions needed: ask with a recommendation

The fastest way to stall a project is to ask open questions. "What do you want to do about the returns flow?" produces a meetings-of-meetings spiral. The same question with a recommendation produces a reply: "Returns flow: we recommend self-serve returns with instant store credit (option B from Tuesday's demo) — it removes the support load and matches how your customers already use credit notes. Say the word and it ships next sprint; option A is defensible if legal prefers manual review."

You're the expert; behave like it in the question. A decision request should contain the options in one line each, the recommendation, and the consequence of not deciding. Clients with forty unread emails will answer a well-formed decision ask between meetings. They will not answer an essay.

## The metrics paragraph, in context

Once a site or feature is live, we add one paragraph of numbers — but always in context, never as a dashboard screenshot. "Checkout completion moved from 61% to 68% since the shipping-estimate change (two weeks of data, roughly 3,100 sessions). The mobile gap we flagged in May has closed from 14 points to 6." Numbers without baselines and windows are decoration. A percentage without a comparison period is how agencies make noise look like progress; our [growth team reports in revenue and rejects vanity metrics](/services/growth) for the same reason.

When the numbers are bad, they go in the note anyway, with the hypothesis for why. Clients handle bad news fine. What they never forgive is discovering bad news you knew about first — which is why the honest weeks, paradoxically, are what make the good weeks believed.

## Cadence and the contract

The note goes out every week, including the slow weeks. Skipping a quiet week teaches the client that silence means nothing is happening (or worse, that something is wrong). The discipline is asymmetric: a good note skipped once is a relationship cost; a bad-news note sent on time is a deposit.

Fridays at a consistent hour, same subject-line shape — *Brassfern × Client: week of 7 July* — so the archive is searchable. Anything longer than one screen gets cut and linked. Anything that needs a meeting gets a meeting, with the note as the agenda. And the note never, ever contains a surprise: if a launch date is at risk, the client heard that in a call before Friday, and the note is the written confirmation, not the discovery.

## If you inherit the 40-slide deck

Migrating a client off a deck they expect takes one conversation: "We're going to try a shorter format for a month — if you're missing anything, tell us and we'll add it." Nobody has ever asked for the deck back. The executive who "needs the deck for the board" usually needs three lines they can say out loud; offer to write those three lines at the top of the note and you've saved everyone a ritual. For the fuller picture of how this cadence fits a sprint-based engagement, our [approach](/approach) page has the default rhythm, and the [launch week checklist](/journal/playbooks/launch-week-checklist) shows what the notes converge into at the end.

## Key takeaways

- A status update that exists to be defensible rather than readable has already failed. Write for the reader's ninety seconds, keep it to one screen, same shape every week.
- Four sections: shipped (linked, outcome-phrased), next week (checkable commitments), blocked (with the date it started waiting), decisions needed (with a recommendation).
- Never describe progress — link it. A staging URL is the only status format that can't be spun, and it's what makes the honest bad weeks credible.
- Blocked items repeat verbatim with dates until resolved; neutral mechanics, no blame, no "as mentioned previously."
- Report metrics with baselines and windows, bad news included. Clients forgive bad numbers; they never forgive discovering you knew first.

## FAQ

**What if nothing shipped this week — do we still send the note?**
Yes, especially then. "Shipped: nothing client-facing — the week went to the data migration, which had to be right before anything visible could land on it" is a legitimate entry. Skipping the note invites the client to invent their own explanation, and their imagination is rarely charitable.

**Should the note go to everyone or just the project owner?**
Send it to the project owner and whichever approvers are on the [decision map](/journal/playbooks/stakeholder-alignment-design), and make it forwardable by keeping it one screen. Execs read forwards; they don't read decks. If you find yourself writing a second, "executive" version, the original is too long.

**How do we handle a client who never replies?**
The note is a record, not a conversation — it works even unreplied. But pair it with the decision lapse date agreed at kickoff: decisions unanswered by the stated close are resolved by recommendation and flagged as such in the next note. Silence stops being a veto the moment that's written down.

**Won't "blocked since [date]" feel aggressive to the client?**
Only if the phrasing is. "Waiting on photography selects (blocked since 19 June; needed by 10 July to hold launch)" is logistics, not blame. What actually feels aggressive is the month of silence followed by the announcement that photography is now a launch risk.
