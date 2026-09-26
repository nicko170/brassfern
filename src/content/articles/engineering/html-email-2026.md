---
title: "HTML emails in 2026: engineering for a hostile medium"
description: "Table layouts without despair, the dark-mode inversion lottery, bulletproof buttons, image-off rendering, and a testing matrix a small team can actually run."
slug: html-email-2026
cluster: engineering
tags:
  - email
  - front-end
  - testing
  - dark-mode
date: 2026-06-11
author: Leonie Marsh
keywords:
  - HTML email engineering
  - email dark mode
  - email client testing
  - transactional email design
  - email development
readingTime: 10
heroImage: /images/articles/engineering/html-email-2026.jpg
heroAlt: "A letterpress type tray holding blank paper modules arranged like an email layout under construction, with a brass ruler and a fern frond."
---

Somewhere in your product right now is an email that renders as a beige rectangle with a broken logo and the words "view in browser" doing all the work. You know this because you've received it — from companies with design systems, from companies with eleven-figure valuations. Email is the one medium where the world's best engineering teams collectively shrug and ship tables. Not because they're lazy: because email is a genuinely hostile medium, and the hostility is structural.

The good news — the only news a small team needs — is that the hostility is *knowable*. The matrix is finite, the rules are stable, and a disciplined setup in 2026 is dramatically smaller than the folklore suggests. We've covered [authentication, deliverability and templates-in-CI](/journal/engineering/transactional-email-engineering) elsewhere; this piece is about the rendering layer itself: how to write email HTML that survives the worst clients respectably and the best clients beautifully.

## Know your enemies (there are four)

The email client matrix in 2026 has four load-bearing horror shows. Learn their names and ninety percent of email engineering stops being mysterious:

**Desktop Outlook (Windows).** Still renders with the Microsoft Word engine — a renderer whose mental model peaked in 2007. No flexbox, no grid, no `border-radius`, no `max-width` (it respects fixed widths and `mso-` conditional comments), no background images without a VML incantation. Everything you build must degrade gracefully to "a stack of boxes." Outlook for Mac and the new Outlook are modern engines — the Windows one is the relic, and it's still common in the exact industries (enterprise, government, finance) that pay for things.

**The Gmail app rendering non-Gmail addresses.** Gmail's app uses a stricter engine for IMAP/POP accounts than for Gmail addresses — no `<style>` block support, everything must carry its styles inline. Same sender, same message, two different renderings depending on which address opened it. Design for the stricter one; the laxer one is a free upgrade.

**Dark modes.** Not a mode — *three different behaviours*. Apple Mail honours your media queries and lets you design dark mode. Gmail's app *auto-inverts* your colours with an algorithm you cannot fully control. Outlook desktop draws dark panels behind your light design in ways that break pure-white territory. There is no single "dark mode email"; there are three outcomes you separately verify. Our [dark mode as a second design system](/journal/web-design/dark-mode-second-design-system) piece covers the web version of this discipline; email is the same lesson with fewer levers.

**Image blocking.** Default in Outlook, common in corporate clients, always-on in some privacy-focused ones. For a meaningful slice of your audience, your email *is* its alt text, its background colours and its layout geometry. If the message can't survive image-off, it isn't designed — it's decorated.

Everything else — Yahoo, Proton, hey.com, T-Online, the long tail of regional clients — is a variation on these four.

## Table layouts without despair

The historical guidance — "nest tables six deep, spacer GIFs, pray" — is the 2010 version. The 2026 version is a *hybrid* layout: modern HTML structure with progressive enhancement upward and ghost-table degradation sideways.

The pattern that carries ninety percent of layouts:

- **One fixed-width container** (600–640px, centred), because fixed beats fluid when `max-width` isn't supported. This is the outer table.
- **Fluid divs inside it** for everything else. Modern clients get `max-width`, padding, and sane responsive behavior from your `<style>` block; inline the same styles anyway so the strict clients match.
- **Ghost tables for Outlook's column moments.** A two-column block is two fluid divs that wrap — wrapped in an MSO conditional comment that presents them to Word's engine as a two-cell table. The comment is invisible everywhere else. It looks arcane in source and it *is* arcane; it's also eleven lines, copyable, and eternal.
- **Stack order is the responsive design.** Columns in email don't reflow cleverly; they stack source-order. Put the content column first in source if it should land on top on mobile — your design file and your DOM order must agree, which is a conversation worth having at design review, not at send time.

The mindset shift: you are not writing bad HTML, you are writing *portable* HTML — the email equivalent of a progressive-enhancement baseline. Nobody sneers at a well-chosen lowest common denominator when it's deliberate; the despair comes from discovering constraints in QA that you designed past in Figma.

## Buttons, bullets and the VML tax

The humble CTA button is where email engineering earns its reputation. Requirements: looks like a button everywhere, works when images are off, has a real hit area, and — this is the part people forget — *the whole padded shape should be clickable*, not just the text.

The padding-based button (an `<a>` with inline padding, border-radius and background, wrapped in a table cell with the same background for Outlook) covers modern clients entirely and degrades in Outlook to a clickable region around the text — acceptable for most. The VML button (a Word-vector drawing of a rounded rectangle, generated from a template) buys you full clickable-area, border-radius and hover in desktop Outlook at the cost of a conditional-comment block you'll never enjoy editing. Our rule: VML for the one transactional email whose conversion you can measure in money (password reset, magic link, invoice overdue), padding buttons everywhere else. The VML tax should be paid deliberately, per button, with a clear reason — not smeared across the template library.

A related craft rule: **never bullet lists in email critical paths**. `<ul>` rendering varies wildly (Outlook's Word engine has strong opinions about markers); a one-row-per-item table with a mid-dot or an inline SVG-free bullet character is boring and identical everywhere. Boring and identical is the entire aesthetic of email that works.

## Dark mode: three outcomes, one process

Dark mode email in 2026 is finally *engineerable* rather than merely survived:

1. **Declare your schemes.** `<meta name="color-scheme" content="light dark">` in head (and duplicated on the root element for clients that strip head) tells clients with opinions what you support. Omit it and some clients improvise — badly, on your brand colours.
2. **Design the dark version for the clients that let you.** Apple Mail and several modern clients respect `@media (prefers-color-scheme: dark)`. Write real dark styles — this is the [colour-token discipline](/journal/web-design/colour-systems-dark-mode) ported into an inlined stylesheet — and your Apple Mail dark-mode users, who skew disproportionately *attentive*, get a designed experience.
3. **Survive the auto-inverters.** Gmail's app inversion mangles saturated brand colours and devastates images with transparency over coloured backgrounds. Defences: keep critical text off images entirely (live text renders against the inverted background correctly because it *is* text), give line-art and wordmarks a subtle light outline or glow baked in so edges survive inversion, and prefer solid background regions behind imagery that can't tolerate inversion.

The test for all three is the same: send a seed to Apple Mail (dark), Gmail-app-with-Outlook-address (dark), Outlook desktop (dark), and stare at each. Forty minutes, once per template family, quarterly. Teams that skip this discover their problem from a screenshot in the founder's group chat.

## Alt text is the image-off design system

Stop writing alt text as captions and start writing it as *the experience for image-blocked users*. The alt text on your receipt's hero shouldn't be "hero image"; it should be the sentence the hero existed to say. Styled alt text — a client-supported trick where the `alt` inherits font styles — means the image-off version still has hierarchy: the alt text on your empty hero container can be set in your display size and brand colour, carrying the message in type when pixels never arrive.

Geometry matters too: explicit `width` and `height` on every image, so blocked images collapse to sensible empty regions instead of reflowing the layout into abstract expressionism. And background images simply don't exist in email engineering — anything a background image was doing, a real image or a flat colour does more reliably.

## A testing matrix a small team can run

The fantasy matrix (Litmus screenshots of forty clients) is a fine tool and a poor strategy — it answers "does it render" when the question you actually have is "what do my users see." Build the matrix from *your audience's reality*: pull email-client and device distribution from your analytics and past sends, take the top six client-plus-mode combinations, and seed accounts for each. Our usual six for a consumer SaaS: iPhone Mail light, iPhone Mail dark, Gmail app (Gmail address), Gmail app (IMAP address), Outlook Windows desktop, and one webmail in an old Android browser for humility.

The process: the template family renders in CI (per our [preview-environment discipline](/journal/engineering/preview-environments-every-pr), nobody merges a template change unseen), a send-to-seeds step fires on every merge to the template repo, and a human — one human, five minutes — glances at the six inboxes weekly. You've covered the realistic matrix of your actual audience for the cost of six email accounts and a habit. Any deeper matrix is bought on demand, when a client segment demands it, not speculatively in the abstract.

## Key takeaways

- Four horrors define the matrix: Word-engine Outlook, the Gmail app's stricter rendering for non-Gmail addresses, three distinct dark-mode behaviours, and default image blocking. Everything else is variation.
- Write portable HTML: one fixed-width container, fluid divs within, ghost tables for Outlook columns, and source order that doubles as your mobile stack order.
- Pay the VML tax deliberately — full-button clickability in Outlook for emails whose click is revenue; padding buttons elsewhere; no native bullet lists on critical paths.
- Dark mode is three separate outcomes: declare color-scheme, design for the clients that honour media queries, and harden everything else against algorithmic inversion. Alt text with styled typography is your image-off design system.
- Your testing matrix is your audience's top six client-mode combinations as seed accounts, glanced at weekly — not a forty-client screenshot fantasy.

## FAQ

**Should we use an email framework like MJML?** MJML is a reasonable compiler for teams who'd otherwise hand-hobble tables, and its output is competent. You trade control and comprehension: when something breaks in an edge client you're debugging generated markup you didn't write. We hand-roll a small block library instead — header, body, button, line-items, footer — because five hand-known blocks beat a framework at QA time. If your team won't own blocks, use MJML happily; neglect is worse than abstraction.

**Does anyone still open email in desktop Outlook?** Enterprise, government, finance and education audiences: yes, substantially. Consumer audiences: single digits and falling. This is exactly why the matrix should come from *your* analytics — a B2B invoicing email and a consumer promo need different baselines, and the honest data is one query away.

**How do we handle RTL languages in email?** `dir="rtl"` on the container works in the modern majority; the trap is mixed-direction content (an Arabic sentence containing an English product name) needing `dir="ltr"` spans *inline*, and padding/mirror layout quirks in Word-engine Outlook, which ignores much of it. Test RTL as its own seed account from day one if you send it — retroactive RTL is a rewrite.

**What about AMP for Email / interactive email?** Curiosity, not strategy, for almost everyone: support is a handful of clients, the sender-side registration is ceremony, and the fallback must exist anyway, so you're building two emails for one send. For a tiny set of high-volume transactional loops — think in-email confirmation taps — it measurably pays. Everyone else: put the interaction one click away on the web, which you control.

---

*Email is the highest-traffic interface nobody budgets for. We build it properly inside [growth engagements](/services/growth) and [product builds](/services/product) — [see how we work](/approach) or [talk to us](/contact).*
