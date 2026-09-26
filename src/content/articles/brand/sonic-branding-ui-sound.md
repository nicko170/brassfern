---
title: "Sonic branding: the layer most products mute"
description: "UI sound is brand identity nobody briefs: sonic layers, notification tones, testing with accessibility in mind — and knowing when silence wins."
slug: sonic-branding-ui-sound
cluster: brand
tags: [sonic branding, sound design, notification design, accessibility, brand identity]
date: 2025-11-05
author: Hannah Yeo
keywords: [sonic branding, UI sound design, audio branding, notification sounds, product sound identity]
readingTime: 9
---

Here's a test. Put your product on a table, close your eyes, and have someone else use it. What do you hear? For most products the answer is: nothing, a system-default click, or a notification chime designed by an operating system vendor in 2014. You've art-directed the type to the half-pixel, chosen photography one lighting language at a time, [tuned the motion to the millisecond](/journal/brand/motion-identity-design) — and the entire acoustic identity of the product is delegated to whatever OS happens to play it. Sound is the most emotionally direct sense a product can touch, and almost nobody briefs it.

Mostly that's because sound done badly is worse than silence, and everyone knows it. We've all been ambushed by an autoplaying tab. But silence isn't a neutral choice either — it's the loudest brand statement you can make, and it should be made *on purpose*. This is how we run the sonic layer when a client is ready to make it on purpose.

## Why sound is the layer that gets skipped

Three honest reasons, and they're worth confronting before any design starts:

1. **Nobody owns it.** Sound sits between brand, product and engineering, so it sits nowhere. The fix is bureaucratic before it's creative: someone in the brief must own the acoustics the way someone owns type.
2. **Everyone remembers the bad examples.** Autoplay, beeping kiosks, hold music. The counter-argument isn't that sound is good; it's that *unconsidered* sound is bad, and sound is currently unconsidered by default.
3. **The web trained us to mute.** Decades of abuse made silent-by-default the polite baseline. Respect that. Any sonic identity we ship has to earn trust inside products where the user has already opted in — not leak onto pages where they haven't.

The strategy question, then, isn't "what's our sonic logo?" It's: **where does this product live in someone's attention, and does sound deepen that relationship or spend it?** A meditation app and a project-management tool have opposite answers. Both are correct.

## The sonic layer cake

We structure sonic identity the same way we structure [voice](/journal/brand/brand-voice-charts): a small system with strict hierarchy, not a pile of assets.

- **The signature (one, optional).** The two-second mnemonic — the sound of the brand itself. Reserve it for true moments of ceremony: completing onboarding, publishing the thing, a successful payment on a commerce app. Played constantly it becomes a jingle; played rarely it becomes a ritual. If you can't protect its scarcity, don't make one.
- **Functional confirmations.** Success, failure, sent, saved. These are the working sounds, and the rule is strict: confirm the outcome, never narrate the interface. A "saved" tick is information; a whoosh on every screen transition is the product talking to itself.
- **Notifications.** The hardest working sounds in the system, and the ones users will learn to hate fastest. One tone family, distinct urgency levels, and versioning for channels (a delivery arriving and a colleague pinging you should be distinguishable blindfolded — that's a service to the user, not decoration). Our [notification design principles](/journal/product/notification-design-respect) apply acoustically: you're a guest, not the main character.
- **Ambience (usually none).** Background beds in products are nearly always wrong on the web. Games and immersive experiences earn them; dashboards don't.

Names help the system stay disciplined. Ours ship like design tokens: `tone.success`, `tone.error`, `notify.urgent`, `signature.ceremony`. A sound with a token name is a component. A sound called `chime_final_v3.wav` is a liability.

## Designing sounds that survive repetition

Visual designers get to hide their mistakes in peripheral vision. Sound has no periphery — the user's ear audits every repetition. The craft rules that hold up:

**Short, soft-attack, no tail.** Most product sounds want a 100–300ms envelope with a gentle onset. Sharp attacks read as alarms; long tails clutter the next sound. Design for the fiftieth play, not the first.

**Pitch is meaning.** Rising intervals confirm, falling resolve or warn. This grammar is near-universal across cultures, and it's why the error sound and the success sound must never share a shape. Use pitch relationships the way you'd use a type scale: a fixed set of intervals, applied consistently.

**Loudness is a brand attribute.** Master the whole set to one loudness target and *test it on laptop speakers, quietly*. If your confirmation tick is audible across an open-plan office, it's wrong. Good product sound sits just above the threshold of attention, matched to device speakers rather than studio monitors.

**Steal from instruments, not from cinema.** Real instruments — a soft marimba strike, a brushed drum, a plucked string — age well and feel warm. Cinematic sweeps and synthesized risers feel impressive on b-roll and exhausting in software. When we built the audio identity alongside the listening experience for [Holloway Records](/work/holloway-records-label-site), every functional sound came from one recorded instrument family. Three years on, nothing about it has dated.

## Silence is a strategy, not an absence

The most mature sonic decision most brands can make is a *deliberate* silence default with opt-in sound in the right contexts. Design that too. The states:

- **Muted by default, discoverable.** Sound turns on where the user already expects an acoustic relationship (media, calls, games, guided flows) and stays off where they don't (reading, browsing, filling forms).
- **Respect every system mute.** OS-level silent mode, focus modes, browser autoplay policies — these are the user's stated preferences, and honouring them instantly is brand behaviour. A product that plays over someone's silent switch tells you everything about its respect for [accessibility and consent](/journal/product/wcag-aa-product-teams).
- **Quiet hours.** If your product sends notifications, time-of-day quiet defaults are part of sonic identity. Being the app that knows not to chime at 2am is brand-building; being the app that doesn't is brand erosion at scale.

A useful sentence for the brief: *our product should sound the way it feels to be trusted with someone's attention.* Usually that means fewer sounds, better chosen.

## Testing sound like you mean it

Sound testing has a trap: people judge novel sounds generously and familiar sounds harshly. Your new chime will test well in week one and be despised by week forty. Test for that:

- **The repetition test.** Play candidate sounds fifty times in a session to actual users doing actual work. Fatigue shows up around repetition thirty. Any sound that gets *more* noticeable with repetition fails.
- **The loudspeaker test.** Every sound auditions on a phone speaker in a kitchen and a laptop in a café, not just studio headphones. Thin reverb-heavy sounds disappear; sharp attacks become harsh.
- **The accessibility pass.** Screen-reader users already live in a dense acoustic channel — your sounds must not collide with speech output or mask system cues. Maintain a text-and-visual equivalent for every acoustic signal (a sound can confirm, but it must never be the *only* confirmation). Users living with auditory processing differences, tinnitus, or plain misophonia are part of the audience; an instant global mute is the price of entry.
- **The blindfold check.** Can users tell success from error, urgent from casual, blindfolded? Audio legibility is as testable as colour contrast — and as non-negotiable.

Ship with a kill switch. Usage data on sound opt-outs is the most honest feedback loop in branding: if users mute you, the system has a bug, and the fix is usually subtraction.

## Key takeaways

- Sound is the most emotionally direct and least briefed layer of brand identity. Unconsidered sound is bad sound — but unconsidered silence is still a choice you didn't make.
- Build a tokenised sonic layer cake: one rare signature, functional confirmations, a disciplined notification family, and almost never ambience.
- Design for the fiftieth play: short, soft-attack, pitch-means-meaning, mastered quiet for real speakers.
- Silence is a strategy. Mute-by-default with discoverable opt-in, honour every system mute, and give notices quiet hours.
- Test for repetition fatigue, real speakers, screen-reader collisions, and blindfold legibility — and ship a kill switch.

## FAQ

**Does a small product really need sonic branding?**
It needs a sonic *decision*. A two-person SaaS probably doesn't need a mnemonic, but it absolutely needs to decide whether its notifications chime, what its error state feels like acoustically, and which default it respects. Most of the value lives in a six-sound functional set, not the ceremony.

**Where do we even get sounds made?**
For functional sets, a good sound designer will build you thirty source recordings and a tokenised library in about the time a brand photoshoot takes. Resist asset libraries for anything the user hears daily — those sounds belong to ten thousand other products, and the ear recognises a stranger's voice even when the eye can't.

**How does sound relate to our motion system?**
They're one system. Motion durations set the envelope for sound (a 160ms ease-out pairs with a ~200ms sound, never an 800ms shimmer), and both should answer the same question: did the thing the user intended actually happen? Choreograph them together or the product feels haunted — visual action with a lagging acoustic ghost.

**What about voice — assistants, readouts, IVR?**
Voice is its own brief on top of this one: timbre, pace, and script tone should extend your written [voice principles](/journal/brand/brand-voice-survives-handover) rather than importing a neutral assistant persona. The cardinal rule is the same as notifications: only speak when the user has invited the conversation.
