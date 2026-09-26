---
title: "Auth for content and commerce: passkeys, magic links, and the recovery flow"
description: "Passkeys, magic links, or passwords with rules? How we choose auth for content and commerce sites — and the account-recovery flows everyone forgets to design."
slug: auth-patterns-content-commerce
cluster: engineering
tags: [authentication, security, ux, ecommerce, web platform]
date: 2026-05-07
author: Tomás Reyes
keywords: [passkeys authentication, magic links login, webauthn implementation, account recovery flow, checkout login ux]
readingTime: 11
---

Nobody has ever bought a product because the login was good. But carts die at login screens every day, in a very specific way: the user who bought from you eleven months ago, on a different device, facing a password field that remembers nothing about them. Auth is the purest example of infrastructure that only exists in the negative — invisible when it works, fatal when it doesn't — and it's the place where a security decision and a conversion decision are the same decision wearing two hats.

This is how we choose auth for content and commerce sites in 2026, the flow we ship most often, and the account-recovery corner that everyone leaves for "later," where later means support tickets forever.

## The decision tree, in honest form

**If returning users transact more than twice a year: passkeys first, magic link as the fallback.** That covers subscriptions, repeat-purchase commerce, and any membership product. Passkeys eliminate the password reset flow — the single largest auth support cost and the largest login-dropoff cliff we've ever measured — and on modern devices the ceremony is genuinely faster than typing anything.

**If users transact rarely or the audience skews to shared and older devices: magic links first, passkeys offered after the second login.** A once-a-year gift buyer does not have a passkey for your store and will not make one for you this Christmas. An email link is universal, needs nothing remembered, and converts the login problem into a notification problem — one the user already solved by owning an inbox.

**Passwords persist as a third option, not a founding member.** Where a legacy userbase has them, we keep them working behind the passkey prompt; where it's a greenfield build in 2026, we now launch without passwords entirely on roughly half of projects, and the sky has yet to fall. The platform moment documented in our [Baseline 2026 review](/journal/engineering/web-platform-baseline-2026) is real: passkeys are table stakes, not a demo.

## The passkey flow that actually ships

The happy path is short, which is why articles about passkeys are short and projects about passkeys are not. The production details:

**Registration is a post-login offer, not a gate.** We never interrupt the first purchase to enroll a passkey. The user completes checkout as a guest or magic-link user; the passkey prompt appears on the order confirmation screen, framed as what it is — "check out in one tap next time" — with a dismissible, un-badgering placement. Enrollment from that placement runs four times higher than enrollment from an account-settings page nobody visits, and it has the decency to show up when the user's success is fresh.

**Conditional UI is the quiet killer feature.** Autofilling passkeys in the email field — the browser offering the credential as the field focuses — removes the "which method did I use here?" fumble, which is the real passkey failure mode. Users don't forget their passkey; they forget *that* they have one, and try to reset a password that doesn't exist. Conditional UI makes the browser remember for them, and it turns passkey login into the median two-second interaction.

**One user, several credentials, no orphaning.** Users enroll a passkey on their phone, then arrive on a laptop that can't see it. The cross-device QR ceremony handles this well enough that we no longer special-case it — but the instrumentation matters more than the ceremony. We log enrollment method, subsequent login method and abandonment point per user agent, because the flows that fail fail in device-specific ways, and aggregate numbers hide exactly the cases you built passkeys for.

## Sessions and tokens: boring on purpose

Underneath the method choice, the session model for content-plus-commerce is the least fashionable, most load-bearing decision in the stack. Our defaults:

- **Opaque session cookies, `HttpOnly`, `SameSite=Lax`, short idle window with sliding renewal.** No JWTs in `localStorage` — not because tokens are evil, but because a token in web storage is one XSS away from departure, while a cookie you can't read from JavaScript is a much smaller blast radius. The supply-chain reality from our [security write-up](/journal/engineering/supply-chain-security-js-teams) applies: every dependency you ship is code that can read whatever the page can read.
- **Server-side sessions you can revoke.** A shopping site with account takeover risk needs a "sign out everywhere" button that means something. Stateless tokens that live until expiry make that button theatre. Revocable sessions make it real, and incident response boring.
- **Commerce needs tiers of freshness, not one login state.** Browsing the order list? Recent session is fine. Changing the shipping address of next week's delivery or the stored card? Require a re-auth — a fresh passkey tap or a fresh magic link — within the last few minutes. Designing this freshness ladder is a product decision disguised as a security feature, and it's where the [state-machine discipline](/journal/engineering/state-machines-ui-flows) pays: session state, freshness and consent are explicit states with explicit transitions, not a boolean and a prayer.

## The recovery flow everyone forgets to design

Every auth system demo ends at successful login. Every production auth system lives at recovery — the user whose email address lapsed with their old job, whose authenticator phone is in a lake, whose account holds three years of order history and a renewing subscription.

The flow we now design in discovery, not in a support panic:

1. **Magic link to the email on file** covers the vast majority. The unglamorous work is deliverability: auth emails get their own transactional stream, their own domain reputation monitoring, and an arrival-time SLO, because a magic link that lands in eight minutes is a login screen with extra steps.
2. **Verified second factor of contact** — a recovery email or phone added post-enrollment, framed as account insurance, not surveillance. Opt-in rates are decent when the copy says what it's for and what it will never be used for (marketing), which requires that to be true.
3. **The human path, pre-designed.** When channels fail, recovery becomes a support decision: which evidence is sufficient to restore which account capabilities? We write that policy during the build — order-number plus billing-postcode verification restores a commerce account but never changes the email address without a cooling period, and so on. The e-commerce teams we work with, from the [Hearthbrew subscription club](/work/hearthbrew-subscription-club) onward, now treat this document as a launch deliverable alongside the checkout. An improvised recovery decision made by a stressed support agent at 6pm is the incident; the designed one is a cost line, and a small one.

## Where it meets the checkout

Commerce auth has one rule that outranks the rest: **checkout must never require an account.** Guest checkout with a post-purchase account offer converts the login wall from a gate into an invitation — the same conversion logic as our [e-commerce practice](/services/ecommerce) applies everywhere else. On stores where we've replatformed auth this way, the movement in checkout completion is consistently larger than any single field-level UX fix we can point to.

The second rule: form mechanics are auth mechanics. Autocomplete attributes, `inputmode`, paste-allowed one-time codes, an email field that doesn't fight autofill — our [form architecture notes](/journal/engineering/form-architecture-scale) live next door to this article because in practice it's one continuous surface. The passkey ceremony fails alongside a broken `autocomplete="username webauthn"` attribute more often than it fails at WebAuthn.

## Key takeaways

- Choose the method by transaction frequency: passkeys first for repeat purchasers, magic links first for rare or shared-device audiences; passwords as a legacy option, not a default.
- Enroll passkeys on the order-confirmation screen, with conditional UI doing the remembering on return.
- Opaque, revocable server sessions over JWTs in storage; design a freshness ladder for sensitive commerce actions.
- Write the account-recovery policy in discovery: channels, evidence rules, cooling periods, and the support runbook.
- Guest checkout always; the account is an offer, not a toll.
- Instrument method-specific abandonment — passkey failures are device-shaped, and averages lie.

## FAQ

**Are passkeys ready for a mainstream, non-technical customer base?**
With conditional UI and a magic-link fallback, yes — the user who doesn't understand passkeys never has to, because the browser offers the right credential in the right field. The readiness gap in 2026 is no longer the platform; it's flows designed by teams who haven't tested them on the customer's actual devices. Test on the phones in the returns pile.

**Should we build auth in-house or use an identity provider?**
For most content and commerce builds, a provider with solid WebAuthn support is the honest choice — the cost of hand-rolling credential storage, rate limiting and recovery correctly exceeds a decade of vendor fees. Build in-house when identity itself is the product, or compliance demands it; otherwise, buy the plumbing and spend the saved months on the recovery flow and the enrollment UX, where differentiation actually lives.

**How do you handle account linking when a user has two emails?**
Deterministically and manually: one account is primary, orders merge behind it, and the merge is support-assisted with verification on both addresses. Automatic email-based merging is a takeover vector wearing a UX costume.

**What breaks most often in production?**
Email deliverability and clock skew on one-time codes, in that order — both boring, both measurable, both ignored until launch week. The third is session-expiry copy that says "error" instead of "you've been signed out"; a dead-end message where a sentence and a link would have kept the session recoverable and the user shopping.
