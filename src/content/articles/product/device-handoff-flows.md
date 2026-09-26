---
title: "Continue on your phone: handoff UX that doesn't lose people"
description: "Session and device handoff done properly: continue-on-another-device flows, magic links vs QR codes, delayed-resume UX and the honest security boundaries."
slug: device-handoff-flows
cluster: product
tags: [cross-device UX, handoff, mobile web, onboarding, product design]
date: 2026-09-08
author: June Okafor
keywords: [device handoff UX, cross-device flows, magic link UX, session continuity, mobile web flows]
readingTime: 8
---

The most common multi-device journey in the world isn't the one product teams design for. It's not "start on desktop, seamlessly continue on mobile" in a single flowing session. It's this: someone starts your form at their desk, realises it wants a photo of their licence card, mutters something unprintable, and emails themselves the link. Ninety minutes later, on the couch, they open it on their phone — and the form has forgotten everything.

That ninety minutes is the reality of handoff. Context switches are long, attention is reset, and the device that *can* do the step (camera, thumb, sofa) is rarely the device that *started* the step. Products that accept this and design for delayed, messy, self-inflicted handoff convert dramatically better than products that design for Apple's Handoff fantasy video. This piece is the pattern language we've converged on after building these flows for finance, travel and health clients — who favour the highest-friction steps imaginable.

## Spot the steps that want to move

Handoff design starts with an audit, and the audit question is precise: **which steps in this flow have a device-shaped mismatch?** Look for steps that want a camera (document capture, QR scanning, visual verification), steps that want sustained attention and a keyboard (long forms, financial declarations), steps that want privacy (health information typed on a shared family iPad is a real pattern we've watched in research), and steps that want a location (on-site check-in, card present).

The giveaway in analytics: step-level drop-off that splits hard by device class. If 18% of desktop users abandon at the document-upload step and mobile users sail through it, that step is telling you where it wants to live. On the [Sundial Travel booking flow](/work/sundial-travel-booking), travellers research on desktop for days and complete on whatever device is nearest — passport photo capture was the highest desktop abandonment in the entire funnel until "continue on your phone" turned it into the highest *completion* step. The step didn't get easier. It got relocated.

Design principle zero: handoff is not a feature you bolt on at the end. It's a sentence in the step itself — "this part is easier on your phone" — offered at the moment of friction, not buried in settings.

## The two transport mechanisms, honestly

Everything reduces to: how does the session-in-progress move to another device? You have two honest options, and both earn their place.

**Magic link — email or SMS to yourself.** The user enters their email address (usually pre-filled — they just logged in with it, so really it's one tap on "Email me a link"). The link arrives carrying a signed, short-lived token that resumes the session on whatever device opens it. Its superpowers: it survives time (works ninety minutes later, works tomorrow), it works cross-ecosystem, and the inbox *is* the to-do list for a huge slice of humanity — the emailed link sits there as a self-written reminder, which is a retention feature disguised as plumbing. Its weaknesses: email latency, spam folders, and the dread of flows that require switching apps *on the same phone* — the link that opens a browser when the user expected the app.

**QR code.** The richer device displays a code that encodes a resume link; the leaner device scans and opens. Its superpower is immediacy: two seconds, no typing, no inbox trip, and the camera is already the app's interface to physical space. Its weaknesses are structural — the sending and receiving devices must be *co-located*, so QR is a same-room mechanism; it does nothing for the couch-ninety-minutes-later journey. And scanned-into-desktop-browser is a dead end nearly always: the wrong direction.

The verdict we keep reaching: these are complementary, not competing. **QR for the same room, magic link for later.** The strongest flows offer both in one affordance — "Continue on your phone — [scan this code] or [email me a link]" — and we've never seen the pair confuse anyone in testing. Choice here reads as competence.

## Security boundaries without the lecture

A resume link is a bearer token, full stop, and handoff UX lives or dies on refusing to pretend otherwise. The rules we treat as floor, not ceiling — the deeper [auth patterns](/journal/engineering/auth-patterns-content-commerce) piece covers passkeys and the recovery side; here it's just the handoff-specific part:

- **Scope the token to the step, not the account.** The emailed link should resume *this flow at this step* — not log the phone into the whole account. If the account requires a fresh sign-in on a new device for other surfaces, so be it; the handoff token buys completion of one journey, nothing else.
- **Short, honest expiry — stated in the copy.** Fifteen minutes for finance and health, up to 24 hours for low-stakes flows, and the link says so ("this link works for the next 30 minutes"). Stated expiry prevents the worst failure: a user planning their evening around a link that died silently.
- **Bind to the flow, degrade on mismatch.** Token resumes the draft; if anything sensitive must be *viewed*, require re-auth on the new device. Resuming a half-completed application is safe; resuming with account details displayed is not.
- **Kill the token on completion.** One journey, one token. And single-use is right for the money-adjacent steps.

Note what isn't on that list: forcing an app install. The handoff flow that demands an app download converts a two-minute step into a store visit, a password they don't remember, and a funeral for your conversion rate. Mobile web carries the handoff; the app, if one exists, can be offered after the task completes — a calm [progressive-disclosure](/journal/product/progressive-disclosure-complexity) moment, not a toll gate.

## Delayed resume is a re-onboarding problem

Here is the part almost everyone misses. When the user returns ninety minutes later, they are not your in-flow user. They're a stranger with context. Their environment changed, their attention reset, they may not remember which step they abandoned or why. The resumed screen that simply re-renders "Step 4 of 9" is throwing them into cold water.

Treat resume as a gentle re-entry:

- **A one-line recap, not a tour.** "Back to your application — you were adding your licence details." One sentence, in the spot a hero headline would sit.
- **Show the steps that are done, collapsed.** Progress so far is the strongest re-orientation signal there is — it's evidence of their own effort, and it answers "how much is left" instantly. This is the same respect-for-sunk-effort principle as [wizard flow design](/journal/product/multi-step-flows-wizards): never make returning users re-read what they already survived.
- **The step they abandoned gets a sentence of why.** "We need a photo of the card so we can verify it's you — takes about a minute. This is why you came to your phone." You've just re-sold the step at the exact moment of maximum dropout risk.
- **Draft state is sacred.** Everything typed before the handoff must be there after. Every re-typed field is a small betrayal, and three of them is a lost user.

## The email-yourself-a-link pattern, fully grown

Since users will do it anyway, make the self-directed route excellent rather than grudging. The best version of "pick this up later" is a persistent, first-class object: every in-progress flow gets a stable resume URL visible in the UI ("Link to this application: sundial.travel/r/kq3f… — copied") and a copy button. No account gymnastics, no email field, works in a notes app, a WhatsApp-to-self, a bookmark. The email-a-link variant remains for the forgetful; the copyable link is for the competent, and serving both costs nothing extra — they're the same signed URL.

A craft detail that pays: the resume page must survive the token *expiring*. Not an error page — a humane one: "This link has expired — [email me a fresh one]" with the address pre-filled, recovering the flow in two taps. Expiry is inevitable; expiration UX is optional, and it's the difference between a retry and an abandonment.

## Measuring handoff without lying to yourself

Handoff flows corrupt funnels if you measure naively: the desktop session "abandons" at step four and a new mobile session "arrives" at step five, and now step four looks broken and mobile looks miraculous. The fixes: emit a `handoff_initiated` event with the transport and target step, join the resume event back to the origin session by token id (the tokens make this free), and report the *journey* funnel alongside the session funnel. The metric that matters is cross-device completion rate of the *flow*, not per-device step completion. And watch the time-to-resume distribution — we've seen medians of four minutes (QR crowd) and seven hours (email crowd) in the same product, which tells you you're really running two different products wearing one UI.

Finally: instrument abandoned handoffs. A user who emailed themselves a link and never opened it is your warmest lead for a [lifecycle follow-up](/journal/growth/lifecycle-email-architecture) — they self-identified as intending to finish. A single, useful reminder 24 hours later ("your application is one step from done") outperforms every generic winback we've tested it against.

## Key takeaways

- Audit for device-shaped mismatch: camera steps, keyboard steps, privacy steps. Device-split abandonment shows you where handoff belongs.
- QR codes are for the same room; magic links are for later. Offer both in one affordance — the pair never confuses anyone.
- A resume token is a bearer credential: scope it to the step, expire it honestly, and never let it become a full login by the back door. Don't demand an app install mid-handoff.
- Delayed resume is re-entry, not resumption: one-line recap, collapsed completed steps, and re-sell the abandoned step at the moment of maximum dropout.
- Give every in-progress flow a stable, copyable resume URL — users email themselves links anyway, so grow the pattern properly.
- Measure journey completion across devices, joined by token, not per-session step funnels that lie in both directions.

## FAQ

**Should we build native Handoff / App Links continuity first?**
Platform continuity (Apple Handoff, Android's equivalents) is lovely for the minority already signed into your *app* on both devices — a rounding error for most products' true traffic mix. Build the transport-generic version (token, link, QR) first; it works for everyone, including a laptop-to-phone jump between ecosystems, and platform features can layer on later as gravy.

**What about WebSockets — keep the two devices live in sync instead of handing off?**
Live co-session (fill on desktop, see progress on phone) is genuinely better UX where the devices are simultaneous — document capture flows love it: the desktop shows the photo the moment the phone takes it. But it's a sync system with all the [multi-window consistency](/journal/product/multi-window-state-consistency) questions attached, resting on assumption of simultaneity. Offer it as the same-room premium path; never as the only bridge, because the couch-in-ninety-minutes user doesn't have two live devices, they have one memory.

**How do we hand off *to* desktop, not from it?**
Rare, real, and easy to forget: someone taps a deal in an email on their phone, hits the twelve-field tax form, and wants a keyboard. Same tokens, reversed, with "email me a link" carrying the load (QR doesn't travel that direction). The [bottom-sheet affordance](/journal/product/bottom-sheets-mobile-web) is a good mobile container for the offer — the page context stays visible behind it.

**Is "continue in our app" ever the right move?**
Only when the step is impossible on the web — a hardware capability, regulated identity verification your web flow genuinely can't meet. If your reason is "we want app installs", the honest move is to complete the user's task first and earn the install after. A handoff that ends in an app-store interstitial isn't a handoff; it's a heist.
