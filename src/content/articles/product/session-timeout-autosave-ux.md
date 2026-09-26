---
title: "Timeouts, autosave and recovery: designing for interruption"
description: "Autosave contracts, session timeouts that warn without punishing, crash recovery and 'unsaved changes' guards that don't cry wolf: interruption-proof UX, end to end."
slug: session-timeout-autosave-ux
cluster: product
tags: [autosave, session management, form UX, recovery, trust]
date: 2025-08-19
author: Aiko Tanaka
keywords: [autosave ux, session timeout design, draft recovery ux, unsaved changes warning, form interruption design, conflict resolution ui]
readingTime: 9
---

Nobody finishes anything in one sitting. The intake form gets abandoned because a patient walks in. The quarterly budget survives three meetings, two coffees and a laptop lid slam. And then the product says "Your session has expired," discards forty minutes of work, and presents a login screen like nothing happened. The user doesn't file a ticket. They file the product under *cannot be trusted with real work* — a classification from which few return.

Interruption is not an edge case; it is the default environment your product lives in. This piece is the design brief we give squads before they build anything with long forms, expensive edits or collaborative state: the autosave contract and its five honest states, session timeouts that respect WCAG and human attention alike, crash recovery that actually recovers, and the "unsaved changes" guard that only fires when there is genuinely something to lose. It pairs with our thinking on [graceful error messages](/journal/product/error-messages-that-help) and [undo-first design](/journal/product/undo-not-confirm) — all three are the same argument: the product carries the risk, not the user.

## The autosave contract

"Autosave" is a promise, and most products keep it badly. The promise has terms, and the interface must state them continuously. We model draft state as a machine with five states, and every state gets a visible, unambiguous rendering:

| State | UI rendering | The rule |
| --- | --- | --- |
| **Idle / clean** | "All changes saved · 2:41 pm" | Only shown when the server has confirmed the write |
| **Dirty** | subtle dot, no message yet | Local edits not yet flushed; debounce window open |
| **Saving** | "Saving…" | Flush in flight; short-lived, low-contrast |
| **Saved** | timestamp updates, dot clears | Confirmation arrived; timestamp is the receipt |
| **Error** | "Couldn't save. Your work is kept locally. Retry" | Persistent, actionable, never auto-dismissed |

Three rules make this contract trustworthy. First, **never say "saved" on the client's say-so** — the word appears only after the server acknowledges. A status that lies once is dead forever; users notice, and they start doing the paranoid Ctrl+A, Ctrl+C dance before every navigation. Second, **keep drafts through the error state**: if the save fails, the payload sits in local storage (or an outbox queue) and the UI says so explicitly. "Couldn't save" with no mention of the work's whereabouts reads as "it's gone," even when it isn't. Third, **debounce for humans, not for tidy architecture**: 600–900ms after the last keystroke, plus an immediate flush on blur of a field and on any navigation attempt. Longer windows save pennies of server load and cost real work on every tab close.

If your persistence story runs deeper than a draft — true offline operation, multiplayer documents — that's a sync-engine conversation, and it deserves its own architecture. Our notes on [local-first sync engines](/journal/engineering/offline-first-sync-engines) cover when to make that jump. For most products, an honest autosave contract gets you ninety percent of the trust at ten percent of the cost.

## Session timeouts that warn with dignity

Timeouts exist for good reasons — shared machines in clinics, compliance regimes that mandate re-authentication — and terrible implementations. The hostile pattern: silent expiry, followed by a login screen that has eaten the form. The compliant pattern, and the humane one, looks like this:

- **Warn early enough to act.** WCAG 2.1's timing-adjustable criterion wants users warned and able to extend; in practice we show the warning at two minutes remaining, as a modal that says exactly what will happen: "For your security, you'll be signed out in about 2 minutes. Everything you've entered is saved." Note the second sentence — the warning is also a reassurance, and it only works if the autosave contract above makes it true.
- **Treat activity broadly.** Keystrokes, clicks, scrolls and *focus returning to the tab* all reset the clock. A user reading a long document for ten minutes is active; a timeout that only watches keystrokes will sign out your most engaged readers.
- **Extend by default, expire on silence.** If the user is present when the warning appears, one tap (or pressing Enter, since the modal's extend button holds focus) renews the session. If the countdown reaches zero with the warning never acknowledged — genuinely abandoned session — then expire.
- **Re-authenticate in place.** When expiry was unavoidable, the sign-in challenge should appear as a layer over the frozen form, not a redirect that discards context. After re-auth, restore the exact view, scroll position and draft. Pylon Health's care-coordination tool does this: nurses cited mid-visit sign-outs as their top complaint, and in-place re-auth plus server-side drafts took the "lost my note" support category from a weekly stream to a rounding error.

And a rule for the roadmap: timeouts should be as long as the threat model allows and configurable per workspace. A solo founder on a laptop in her kitchen does not share a threat model with a kiosk in an emergency department, and one global fifteen-minute limit serves neither.

## Crash recovery that actually recovers

Autosave handles the network; recovery handles everything else — the browser crash, the dead battery, the OS update that restarts mid-sentence. The bar here is brutal and simple: **open the product, get the work back, unprompted.** Anything requiring the user to know recovery exists has already failed; grief-stricken people do not explore menus.

The pattern we ship:

1. **Layered persistence.** Every commit to the draft writes to durable local storage (IndexedDB, not localStorage, for anything over a few kilobytes) *and* queues a server write. The local copy is the crash parachute; the server copy is the device-switch story.
2. **A recovery banner, not modal roulette.** On next open, if the local draft is newer than the server version, a persistent banner appears at the top of the relevant surface: "We recovered an unsent draft from 9:14 pm. [Review] [Discard]" — never auto-applied, because a recovered draft can also be a stale regret the user deliberately abandoned. The user chooses, but they choose from solid ground.
3. **Bounded history.** Keep the last few draft revisions with timestamps, not just the latest. When the "recovered" version turns out to be the wrong one — the user had already retyped and improved it elsewhere — a version picker saves a second heartbreak.

When we rebuilt the grant-application flow for a non-profit client, this exact loop — layered persistence plus a review-first recovery banner — cut application abandonment by 31% (illustrative, but directionally what every team sees): long forms stopped being acts of faith and became resumable work.

## "Unsaved changes" guards that don't cry wolf

The `beforeunload` guard is the seatbelt alarm of product design: invaluable when accurate, intolerable when hypersensitive. The failure mode is always the same — the guard fires when nothing meaningful changed, users learn to ignore it, and then it fails to protect the one exit that mattered.

Accuracy requires real dirty-tracking, which is harder than it sounds. Diff the current form values against the last-saved snapshot; do *not* count programmatic touches (a date-pickers's focus side-effect, a select initialising its value, a currency input reformatting on blur) as user edits. Fields the user never touched but the framework re-rendered are the source of most false positives. Two policies finish the job: autosaved products show the guard only when there's a *failed or in-flight* save, because a healthy autosave means there is nothing to lose; and within-app navigation gets the soft version ("Discard changes?") while tab closure gets the browser's native guard, since you cannot style that one anyway.

Rate-limit yourself on the user's behalf: if you can't explain precisely which keystroke would be lost, don't interrupt.

## Conflict states in collaborative editing

The moment two people can edit the same record, autosave's promise gets a new clause. Last-write-wins is the default nobody chose: quiet, lossy, and the root cause of the classic support ticket "my edits disappeared" — they didn't disappear; a colleague's save paved over them.

The honest middle tier for form-based products (short of full collaborative text):

- **Presence signals cheapen conflicts.** "Priya is viewing this record" with an avatar deters most collisions before they happen.
- **Field-level merging beats record-level clobbering.** If Priya changed the phone number and Sam changed the email, both saves should succeed; only true same-field collisions conflict.
- **On true conflict, show both versions.** "Priya saved '0433…' at 2:03 pm; your field has '0421…'. Keep hers / keep mine." Side-by-side diff, explicit choice, no silent arbitration.

And keep the receipts: conflicts resolved, drafts recovered, versions restored all belong in the record's [activity feed and audit log](/journal/product/activity-feeds-audit-logs). "Can't lose work" is only half the promise; "can always see what happened" is the other half. This is squarely what we mean by [product design and engineering](/services/product) as one discipline — the interaction contract and the persistence layer are designed together or they lie to each other.

## Key takeaways

- Autosave is a contract with five visible states; "Saved" appears only on server confirmation, and the error state must say where the work lives.
- Timeout warnings double as reassurance — but only if drafts genuinely survive re-authentication. Warn at two minutes, count reading as activity, extend in one keystroke.
- Crash recovery must be unprompted and review-first: recover the draft, show a banner, let the user keep or discard.
- Dirty-tracking must diff against the last saved state and ignore programmatic touches, or the "unsaved changes" guard becomes background noise.
- Presence, field-level merges and side-by-side conflict resolution cover nearly every multi-editor collision short of true real-time documents.

## FAQ

**Won't constant autosaving hammer our servers?**
Debounced drafts produce modest write traffic — a few kilobytes every few seconds per active editor. Compact the draft rows (one open draft per user per object), flush on field blur rather than per keystroke, and you'll find the load trivial next to the search bar.

**Should we autosave destructive actions too?**
No. Autosave governs drafts and field edits. Destructive actions stay explicit — and ideally [reversible](/journal/product/undo-not-confirm) rather than confirmation-walled.

**How long should we keep recovered drafts?**
Thirty days is our default for local copies, ninety for server-side drafts on paid workspaces. Whatever you choose, show the expiry on the banner: "Recoverable until 14 Jan" converts a mystery into a deadline users can act on.

**Do session timeout rules apply to mobile apps?**
The threat model shifts (personal devices, biometrics), but the contract stands: warn before expiry of long flows, preserve drafts through re-auth, and never let an OS backgrounding event silently destroy in-progress work. If anything, mobile raises the bar, because interruption on mobile is *guaranteed*.

**Where do we start if our product currently loses work?**
Fix the error state first — "couldn't save, work kept locally, retry" — then the recovery banner, then timeout warnings, then conflict handling. Trust compounds in that order, and each layer makes the next one believable.
