---
title: "Bottom sheets that don't fight the user"
description: "When a bottom sheet beats a modal on mobile web: drag affordances, scrim honesty, snap-point logic, keyboard and screen-reader behaviour, and anti-patterns."
slug: bottom-sheets-mobile-web
cluster: product
tags: [mobile UX, bottom sheets, interaction design, overlays, accessibility]
date: 2026-08-27
author: Aiko Tanaka
keywords: [bottom sheet UX, mobile modal design, mobile interaction patterns, overlay UX mobile, touch gestures design]
readingTime: 8
---

Every mobile product eventually grows a bottom sheet. Usually by accident: a designer needs somewhere to put a filter panel, a modal feels too heavy, and suddenly there it is — a rectangle that slides up from the bottom, dimming everything behind it, asking to be dragged.

Then the bug reports arrive. The sheet traps scroll. The drag handle is decorative. The scrim eats taps meant for the map underneath. VoiceOver reads the background page through the sheet like the sheet isn't there. Nobody tested it on a 375px phone in one hand on a moving train, which is where half of mobile web usage actually happens.

The bottom sheet is not a small-screen modal. It's a different contract with the user — one about partial attention and physical control. This piece is everything we've learned shipping and unshipping them, including when to refuse to build one at all.

## The contract a sheet makes

A centred modal says: *stop, this needs your whole attention.* A bottom sheet says: *the page is still here, and this thing is attached to it.* That second promise is the entire reason the pattern exists. A sheet over a map keeps the map visible. A sheet over a booking flow keeps the chosen date in sight. The content peeks out above the sheet and stays legible as context, not furniture.

This has two consequences. First, if the underlying context doesn't matter — the user doesn't need to see the map while filtering — you didn't need a sheet; you needed a screen. Second, if your sheet covers 96% of the viewport at every snap point, you've rebuilt the modal with worse ergonomics and called it native-feeling. Full-screen sheets are a surrender, not a pattern.

## When a sheet earns its place (and when it's a modal in a trench coat)

Three questions, in order:

1. **Does the background carry live context?** Map pins, a selected product, a running total. If yes, a sheet is defensible. If the background is just *the rest of the app* dimmed to 40%, reach for a [simpler disclosure pattern](/journal/product/progressive-disclosure-complexity) instead.
2. **Is the interaction short and reversible?** Filters, share targets, a quantity stepper, a sort order. Sheets are for moments, not workflows. Anything with form fields beyond two, or a back button, or consequences — that's a screen. The moment your sheet grows a header with a chevron-left, admit what has happened and navigate properly.
3. **Will the user do this with one thumb?** Sheets put interactive surfaces in the ergonomic zone. That's their superpower. If the action is rare or high-stakes — deleting a workspace, wiring money — thumb-reach is the last thing you want, and friction is your friend. Choose a modal, and make the destructive path deliberate, along the lines of our [undo-beats-confirm](/journal/product/undo-not-confirm) argument.

We applied this triage on the [Summit & Still booking flow](/work/summit-and-still-yoga): class filters and pass selection became sheets because the timetable behind them *is* the context; the cancellation policy became a screen because nothing underneath it matters while you're reading terms. Two patterns, one flow, no confusion.

## Drag behaviour is a promise

If a sheet *looks* draggable, it must *be* draggable — from the handle, yes, but ideally from any empty region of its header. A decorative handle is a lie in an affordance costume, and users feel lied to even when they can't name why. We've watched people in usability sessions swipe at a fixed sheet's handle three times before giving up; each failed swipe is a small withdrawal from the trust account.

Snap points need discipline:

- **Two snap points beat four.** A peek height (roughly a third of viewport, chosen so the background context stays readable) and a committed height (60–90%). Every snap point you add is a state the user has to discover accidentally.
- **Snap to intent, not to position.** A drag released with downward velocity dismisses; a slow release past a threshold settles to the nearest point. Velocity and distance both matter; either alone produces sheets that feel drunk.
- **Dismissal must be complete.** No sliver left peeking over the edge inviting a tab. If dismissing leaves residue, you built a drawer, and drawers should announce themselves.
- **Respect the safe areas.** Bottom sheets live exactly where iOS puts the home indicator and Android puts gesture nav. Pad for it, and never put a primary action within accidental-swipe distance of the system gesture zone.

One non-negotiable: the sheet's internals scroll only when the sheet is at its committed height. A half-open sheet that scrolls its content *and* drags is a gesture lottery — the user never knows which one they're buying a ticket for. Gesture priority is a decision, and the honest default is: drag on the chrome, scroll on the content, no contested zones.

## The scrim must tell the truth

The dimmed layer behind the sheet is a communication channel, not a visual effect. It says two things: the background is paused, and tapping here dismisses. Most implementations get the first half right and bungle the second.

If tapping the scrim dismisses the sheet, *all* of the scrim dismisses the sheet. We've audited builds where an invisible header bar intercepted scrim taps at the top of the screen; users concluded dismissal was broken and started hunting for a close button that shouldn't need to exist. Conversely, if tapping the scrim does *not* dismiss — because the sheet holds unsaved input — then the scrim must look different (darker, or paired with a visible close affordance) and the sheet must respond to the tap with a small shake or a save prompt. A tap that does nothing with no explanation is the overlay equivalent of a dead button.

And name the stakes honestly: losing half-typed form data on an accidental scrim tap is the reason people learn to fear sheets. Draft state is cheap to keep. The [Northwind Ledger dashboard rebuild](/work/northwind-ledger-dashboard-rebuild) keeps every dismissed sheet's form state for ten minutes; recovery cost one afternoon of engineering and eliminated an entire category of support ticket.

## Accessibility: where most sheets quietly fail

Web bottom sheets are almost always implemented as positioned divs, which means nothing about them is announced as modal unless you build it. The short list that separates working sheets from announceable disasters:

- **Focus moves in and returns.** On open, focus lands on the sheet's first meaningful control — not the close button, which teaches nothing. On dismiss, focus returns to whatever triggered it. Losing focus position on a screen reader is losing the user's place in the product.
- **The background becomes inert,** genuinely — `inert` attribute or equivalent. A sheet over a still-focusable background lets keyboard and screen-reader users tab *behind the curtain* into a page they can't see. This is the single most common sheet bug we find in [accessibility audits](/journal/product/accessibility-audit-process), and it's disqualifying.
- **Announce role and name.** `role="dialog"` with an accessible name ("Filter classes", not "Bottom sheet"). Screen reader users deserve the same contract a sighted user gets from the visual hierarchy.
- **Alternative dismissal exists.** Drag-to-dismiss is a gesture; gestures aren't available to everyone. A visible close control and Esc-to-close (on hybrid devices) aren't extras — they're the mechanism by which the gesture is optional.
- **Reduce motion means it.** Under `prefers-reduced-motion`, the sheet appears and disappears without the slide. The physics are seasoning, not substance.

On native, much of this comes from the platform. On the web, every line of it is your job. Budget for it; a sheet component with proper focus management is genuinely two to three times the work of the visual one, and that ratio surprises every team the first time.

## The anti-patterns that fight back

A greatest-hits list from audits and rebuilds:

- **Sheet inception.** A sheet that opens another sheet. There is no depth model on mobile web that makes this legible; it's a stack of paper with no table. Anything inside a sheet that needs more room gets a screen.
- **The 96% sheet.** If your "peek" snap point covers everything except a sliver of status bar, you're shipping a modal with extra steps and none of the platform's modal protections.
- **Keyboard collision.** Sheets containing text inputs collapse and stutter when the virtual keyboard appears, because nobody decided what the committed height means in a 400px-tall viewport. Decide: the sheet becomes full-height on keyboard open, and the focused field scrolls into view. Test on a real, cheap Android phone — the iPhone 15 Pro is not where this breaks.
- **Swipe-jacking scroll.** If the sheet's height transitions fight the user's scroll-in-progress, cut the transition. Scroll continuity always wins; a sheet that fights the thumb loses the user.
- **The permanent fixture.** A sheet that *can* be dismissed but *shouldn't* be, lurking over critical content. Sheets are guests. Furniture that behaves like a guest confuses everyone.

## Key takeaways

- A bottom sheet is a contract of partial attention: the background stays live context. No live context, no sheet — navigate to a screen instead.
- Sheets are for short, reversible moments. Headers with back buttons, multi-field forms, and destructive stakes all disqualify the pattern.
- If it looks draggable, it drags — from the handle and the header chrome. Two snap points, velocity-aware, dismiss completely.
- The scrim is a promise: 100% of it dismisses, or it visibly doesn't. Keep draft state so dismissal never destroys work.
- Focus traps in, returns out, background goes inert, dialog gets a name. On the web, none of that is free.
- Test on a cheap Android, one thumb, moving vehicle. Desktop emulation hides every failure that matters.

## FAQ

**Can't we just use the native `<dialog>` element?**
As the accessibility substrate — focus trapping, inert background, Esc dismissal — increasingly yes, and you should; it hands you most of the hard parts. But it gives you none of the drag physics, snap logic, or keyboard-avoidance behaviour. Use `<dialog>` as the skeleton and build the sheet's motion and gesture layer on top, rather than starting from a div and re-deriving focus management from scratch.

**What about side sheets on desktop?**
Different pattern, different contract. A desktop side panel doesn't imply draggability, doesn't compete with system gestures, and usually persists alongside the main content rather than overlaying it. Don't reuse your mobile sheet component wholesale; the shared part is the content, not the container.

**How do we know if the sheet is working?**
Instrument three things: how sheets are dismissed (drag vs scrim vs close button — heavy scrim-dismissal often means the content disappointed), abandonment inside sheets with inputs, and gesture-fight rate (touchstart events that end with no state change on scrollable sheets). A healthy sheet is dismissed mostly by *completing* something.

**Is there any case for three or more snap points?**
Maps routing UIs, essentially — where peek, half and full each expose a genuinely different information hierarchy, and the pattern is already trained into users by Apple and Google Maps. Outside that genre, every extra snap point is a state discovered by accident and cursed on arrival. Two points, chosen well, cover nearly everything.
