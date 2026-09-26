---
title: "Will your logo survive your product?"
description: "Identity work gets judged at 16 pixels. Favicons, avatar crops, dark surfaces, motion restraint, and the logo-usage contract that keeps engineers on side."
slug: logo-survival-in-product-ui
cluster: brand
tags: [logo design, favicon, brand system, product design, design tokens]
date: 2026-08-06
author: June Okafor
keywords: [logo favicon, product UI branding, brand identity system, logo small sizes, design tokens]
readingTime: 10
---

There's a ceremony in every identity project where the new logo is presented at the size of a dinner plate, on an artboard the size of a window, kerned within an inch of its life. Applause. Sign-off. Then the mark goes out into the world and spends the rest of its life at sixteen pixels in a browser tab, cropped to a circle in a Slack sidebar, knocked out of a navy app header at 2× on a cracked Android screen in bright sunlight.

The question nobody asks in the presentation is the one that decides whether the identity works: *will this mark survive the product?* Not "does it look good" — it looked good on the artboard. Survive. Because for a product company, the venues where the logo does its daily work are harsh, tiny and owned by engineers, and an identity system that doesn't plan for them gets quietly butchered by whatever's fastest. This is the checklist we run before we call a mark done — the unglamorous sequel to why we design [logo systems, not logos](/journal/brand/logo-systems-not-logos).

## The 16px legibility test

Shrink the master mark to sixteen pixels square and render it as an actual rasterised favicon — not a zoomed-out vector, an export. Three questions, no mercy: can you identify the mark, can you distinguish it from the competitor set in a crowded tab bar, and does anything at this size look like an accident (a serif that turned into a smudge, a counter that closed up, a gap that vanished)?

Most marks fail. That's expected — the master mark isn't the answer, it's the parent of the answer. The system needs an explicit **small-size variant**: a simplified redraw, not a shrink. Strokes thickened, counters opened, detail amputated without sentimentality. The fern loses ten leaflets and keeps its posture. The wordmark doesn't go at all — wordmarks are over below roughly 120 pixels wide, and pretending otherwise is how you get favicons that read as "a colourful rectangle, possibly a bank."

Budget this redraw as a deliverable, not a favour. It is the most-seen version of the brand most customers will ever get. Write the sizes into the spec: 16, 32, 180 (touch icon), 192 and 512 (PWA manifest), each exported from the variant that was *drawn* for that range, plus the maskable-safe version with the mark at 80% within the safe zone — because Android will apply a circular mask and crop the corners of whatever you ship, them's the rules of the platform.

## Avatar crops are a design constraint, not an accident

Every social profile, Slack workspace, GitHub org, app-store listing and team-picker dropdown wants a square that it may circle-crop at will. The classic casualty is the horizontal lockup — wordmark beside symbol — crammed into a square by whoever set up the company X account at 11pm, producing a thumbnail of meaningless letterforms.

The system's answer is a dedicated **avatar lockup**: symbol centred in the square, optically — not mathematically — centred, with enough clear space that a circular crop loses nothing and a superellipse mask loses nothing. Test it by actually crop-previewing at 48 pixels, because that is the size your customers see in their sidebar all day, every day. If the symbol alone doesn't work at 48, the identity has a gap that no amount of guidelines prose will fill: people will improvise, and improvisation is how brands quietly die, one Slack workspace at a time.

## Dark surfaces are a second identity

The logo looked great on the cream background of the brand deck. The product header is `#141c15`. Here's what goes wrong, in descending order of tragedy:

- **Knockout without redraw.** Reversing a mark to white changes its apparent weight — light-on-dark reads thicker — and any mark drawn with ink traps or fine hairlines for print-on-paper will close up. The dark-surface variant is a redraw with compensated strokes, not a colour filter.
- **Colour tokens that don't survive inversion.** The brand green is `11.2:1` on paper and `1.8:1` on the dark header. The identity isn't done until every approved surface — dark, tinted, photographic — has a named token pairing, because otherwise developers guess, and [dark mode is a second design system](/journal/web-design/dark-mode-second-design-system), not a media query.
- **The wordmark on photography.** Marketing loves a hero image under the logo; the logo has opinions about that. Define the scrim rules and a minimum-contrast region test, or every campaign image becomes a negotiation.

The deeper point: identity and product surfaces now share one token pipeline, so the correct fix is architectural, not editorial. The logo's approved colours and variants live in the same [design-token pipeline](/journal/engineering/design-tokens-pipeline-ci) the engineers already consume, versioned and tested in CI — when the brand green shifts, the product header shifts with the release instead of drifting for two quarters until someone files a bug against *the logo*.

## Motion: one behaviour, everywhere, rarely

Animated logos are the siren song of identity presentations — a mark that assembles itself is catnip in a boardroom. In the product, the rules are strict because the audience is captive: the logo animates **once per session at most**, only in transitional moments (app launch, first load), runs under 400 milliseconds total with the bulk of the motion in a fast-in, ease-out curve, and never, ever loops. A logo that performs on every page view is a brand scraping its fingernails across the user's patience.

And the animated variant must pass the same fitness tests as everything else: reduced-motion preference swaps it for the static mark automatically, it's a Lottie or SVG+SMIL export under 30KB — not a 2MB video someone plays with `autoplay` muted — and its absence (script blocked, CPU throttled) leaves the static mark as the default rather than a blank. Motion that's conditional on everything going right isn't an identity layer; it's a liability. This is the same bar our motion team sets for everything: [it earns its keep or gets cut](/journal/brand/motion-identity-design).

## The logo-usage contract for engineers

Everything above fails the same way if it only lives in a PDF: a developer on a deadline opens the shared drive, finds `logo_final_FINAL.svg`, and uses it — the master mark with the detail meant for print, on the dark header, at 18 pixels. Nobody did anything wrong. The system just wasn't consumable.

So the last deliverable of every identity project we ship is a **usage contract**: not guidelines prose, but an engineering interface. It contains:

1. **A canonical SVG source library**, one file per variant, named by function — `mark-default`, `mark-small`, `mark-dark`, `mark-avatar`, `lockup-horizontal` — served from the design system's package so there's exactly one place the truth lives.
2. **Explicit "never do this" rules as constraints, not prose.** Min sizes per variant, the clearspace formula, forbidden transforms. Where possible, express them as the component's API — a `<Logo variant="small" surface="dark">` that *can't* render the wrong file beats a paragraph asking people not to.
3. **Export recipes** for the surfaces engineering doesn't control: the favicon set, the touch icons, the social card templates, the email-header PNG at 3× for the rendering-engine hellscape that is Outlook.
4. **An owner.** A named human on the brand side who answers "which file do I use for…?" within a day, and a named human on the product side who owns bumps when the package changes. Unowned contracts rot at exactly the speed of re-orgs.

This is, not coincidentally, the same pattern as [living brand guidelines](/journal/brand/brand-guidelines-living): the artefact that gets used is the one that lives where the work happens. Engineers will follow the contract perfectly if the contract is a component, and ignore it perfectly if the contract is a PDF.

## A quick survival checklist

Run this on the current identity — yours, not a client's — before approving anything new:

- The 16px favicon is a purpose-drawn variant, not a shrink, and reads in a crowded tab bar.
- The avatar lockup survives circle and superellipse crops at 48px.
- Every approved background (dark, tinted, photographic) has a redrawn, tokenised logo pairing.
- The animated mark is a sub-400ms, reduced-motion-respecting, sub-30KB artefact that never loops, with static as default.
- All variants ship from the design system package with constraint-level API, and two named humans own the contract.

Fail three or more and the problem isn't the logo — it's that nobody designed the logo's *life*. Fix the life; the mark will usually do. And if the identity genuinely can't survive its smallest venues, that's a finding worth taking to whoever runs [brand and identity](/services/brand-identity) before the next product release multiplies the damage.

## Key takeaways

- A logo's real venues are 16px tabs, circular crops and dark app headers — design for survival there, not for the artboard.
- Small-size variants are redraws, not shrinks. Budget them as first-class deliverables.
- Dark surfaces need stroke-compensated knockouts and token-paired colours, delivered through the same pipeline the product uses.
- Animate the logo once per session, under 400ms, never looped, with static as the default state.
- Replace PDF guidelines with a consumable usage contract: a canonical package, constraints as API, export recipes, two named owners.

## FAQ

### Should the favicon just be the first letter of the wordmark?

Only if the letterform earns it. A great initial in a distinctive cut — sure. A default-geometric-sans initial is the most generic rectangle on the internet; you'd be claiming the world's most valuable 256 pixels and saying "a company." A symbol or a distinctive ligature almost always beats a letter. Test all candidates at 16px in an actual tab bar next to competitors before deciding in a meeting.

### How many logo variants is too many?

More than about six and the system starts improvising again. The functional set usually lands at: master, small-size, dark-surface, avatar, one horizontal and one stacked lockup, plus the animated variant if you've earned one. If a surface seems to need a seventh variant, first check whether one of the six solves it — proliferation is the guidelines failing at the edges.

### Who should own the logo in a product company — brand or design systems?

Design systems should host it (they own the component, the tokens, the release process), brand should curate it (they own what the variants *are*). Make it explicit in both teams' charters: systems can never redraw, brand can never bypass the package. The failure mode is the shadow asset folder either team keeps "temporarily" — which is every logo butchery story you've ever heard, in one sentence.

### Is it worth commissioning variable-font or responsive logo technology?

Responsive marks — variants that swap by rendered size, driven by container queries or media queries — are real and we ship them, but the technology is the easy 10%; the hard 90% is that someone designed a genuinely good small variant and the contract routes to it. Solve the variants and the pipeline first. Then, if you're running a design system mature enough to consume it, automatic swap is a delightful upgrade rather than a rescue mission.
