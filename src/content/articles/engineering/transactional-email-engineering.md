---
title: "Transactional email is a product surface: engineer it like one"
description: "SPF, DKIM and DMARC without tears, email HTML that survives Outlook, suppression lists, and why templates belong in CI — email as a product surface."
slug: transactional-email-engineering
cluster: engineering
tags:
  - email
  - deliverability
  - backend
  - product-engineering
date: 2025-11-05
author: Tomás Reyes
keywords:
  - transactional email
  - email deliverability
  - DKIM SPF DMARC
  - email HTML templates
readingTime: 11
---

Your product sends three kinds of emails: the ones users asked for (receipts, password resets), the ones users tolerate (receipts for things they half-remember buying), and the ones that quietly decide whether users can use your product at all — the magic link that never arrives, the invoice that went to spam, the renewal reminder that existed only in your logs.

And yet: email is usually the last thing engineered, the first thing to rot, and the only product surface where QA means one developer squinting at Gmail on their phone. Meanwhile the receipts application earns more trust per pixel than the marketing site does — a receipt that arrives instantly, renders correctly on a 2016 Android mail client, and says exactly the right thing in the subject line is doing more for the brand than any hero animation ever will. Email is a product surface. Treat it like one.

This is the transactional-email stack Brassfern installs on every engagement: authentication, rendering, suppression, and testing. It's tuned for small teams and shipping fast, not for enterprise deliverability departments.

## Authentication: SPF, DKIM, DMARC, and the honest version

The alphabet soup is the part that scares teams, and it's smaller than it looks. All three records exist to answer one question for the receiving server: *"is this sender who they claim to be?"*

**SPF** is a DNS record listing the servers allowed to send for your domain. One line. Most providers hand it to you. The traps: (1) the 10-DNS-lookup limit, which you exceed when every SaaS tool in the company has added an `include:` to your record, and (2) having *two* SPF records, which is invalid and makes receiving servers shrug. Merge includes, keep it under the limit, delete the duplicates.

**DKIM** is a cryptographic signature on each message, verified against a public key in your DNS. Your provider signs; you publish the key. The traps are key rotation (schedule it alongside certificate renewal, or you'll find out when it isn't working) and misaligned selectors when you change providers mid-flight and the old DNS record lingers.

**DMARC** is the one that ties identity together and the one teams avoid because it sounds complicated. It isn't. Start with `p=none` and a `rua` reporting address — this means "watch, and tell me what you see." In a month you'll know exactly who's sending as your domain (usually: your app, a newsletter tool, and one invoicing service someone forgot about). Then tighten to `quarantine`, then `reject`. The entire journey is three DNS edits, taken weeks apart, each of which is reversible. The fear of DMARC costs more than DMARC.

**Subdomain strategy.** Transactional mail gets its own subdomain (`mail.yourproduct.com`) separate from marketing (`news.yourproduct.com`). Reputation is per-domain, and the day your marketing blast gets a spam-complaint spike, you do not want your password resets to inherit the fever. This is a ten-minute decision that small teams skip and regrettably-expensive teams fix during an incident. It's the same instinct as keeping [third-party scripts audit](/journal/engineering/third-party-scripts-audit)-ed and fenced: containment beats trust.

## Rendering: HTML email is a different browser matrix

You know how people joke about supporting old browsers? Email HTML supports the 2007 rendering engine in Microsoft Word, because that's what desktop Outlook uses. The rules, internalised:

- **Tables for layout.** Not ironically. A two-column email is a `<table>` with two `<td>`s because enough clients ignore flexbox entirely that pretending otherwise is self-harm. Modern clients will render your grid; Outlook will render your apology.
- **Inline styles at build time.** Most clients strip `<style>` blocks or ignore `<link>` entirely — so the build step inlines every style. Hand-inlining is masochism; use an inliner in the template pipeline and never think about it again.
- **Web fonts are a garnish, not a base.** The fallback stack is the design. If the email falls apart without your brand font, it was never going to survive a hospital email client anyway. Test with fonts blocked; if the hierarchy disappears, the hierarchy was the font's, not the email's.
- **Dark mode is a second design.** Clients that honour dark mode will invert your colours, badly, unless you tell them not to — `color-scheme` meta, explicit light-background declarations on images with transparency, and testing actual dark-mode rendering rather than assuming. (The full diligence we apply to dark-mode email is a whole article; for now: if you haven't tested in Apple Mail dark mode, you don't know what your emails look like.)
- **Alt text is content, not compliance.** Images-blocked is the default on many clients; alt text is the email those users *actually see*. This isn't a checkbox — it's the reason your hero image says "Your order from Acme is on its way" in the bones of the markup even when the pixels never load.

Build a small set of battle-tested blocks: header, body copy, button, invoice line-items, footer. Compose everything from those. The alternative — five bespoke templates that each surprise you — is the template graveyard every product eventually digs.

## Templates in the repo, tests in CI

Email templates are code. They live in the repo, next to the components they share design tokens with. They branch with features, they review in PRs, and — critically — they render in CI.

The pipeline that works: templates compile to HTML with every build; a snapshot test renders each template against a fixture of realistic-but-horrible data (the very long product name, the real name with twenty characters, the `null` city); and the rendered output ships to a shared inbox where the team can see every email the product sent in the last week. The shared-inbox habit is the cheapest possible email QA and nobody does it, which is baffling — one look at the actual receipts your actual product sent last Tuesday will find more bugs than a week of synthetic review.

This is the same instinct as our [preview-environments](/journal/engineering/preview-environments-every-pr) rule: the test of a template is what it looks like in the world, so put that in front of people early and often.

A note on [schema validation](/journal/engineering/schema-validation-shared-contracts): your templates have an implicit contract with your data layer — `{{ user.firstName }}` assumes `firstName` exists. Validate the fixture data against the same schema you use in the app and templates can never silently reference a field that stopped existing. The template test *is* the schema test, for data shapes the app sends.

## Suppression, bounces, and not being a spammer by accident

Deliverability has a hard rule: **only send to addresses that can receive mail, and stop immediately when they say no.** In code:

- **A suppression list, applied at send time.** Bounced addresses, complained addresses, unsubscribed-from-this-category addresses. Send to a suppressed address and providers notice; do it at scale and they throttle you; do it at real scale and you're warming up a new domain from scratch, which takes months. The suppression list is not a nice-to-have — it *is* your deliverability.
- **Bounce types matter.** Hard bounces (the address doesn't exist) → suppress immediately, forever. Soft bounces (mailbox full, server busy) → retry with backoff, then suppress after a threshold. Providers report both; few teams act differently on them, and their suppression lists fill up with addresses that were just temporarily down.
- **One-click unsubscribe is the law now**, for anything remotely marketing-shaped, via the `List-Unsubscribe-Post` header. Receipts and password resets are exempt — but overreach hurts you. If a user can unsubscribe from "product updates" without unsubscribing from "your invoice," your suppression categories were designed correctly.
- **Bounce and complaint rates are graphs**, reviewed monthly, alertable at thresholds. Sender reputation is a compost heap: slow to build, one bad afternoon to ruin. We've covered the general approach in [observability for small teams](/journal/engineering/frontend-observability-small-teams) — email needs the same discipline one layer up.

## The cadence that keeps it working

None of this holds without routine. Ours, per product:

- **Weekly**: look at the shared inbox of sent email for anything odd. Five minutes.
- **Monthly**: review bounce/complaint rates, check domain reputation, prune the suppression list of ancient entries only if a human confirms.
- **Quarterly**: re-authenticate everything — SPF still under 10 lookups? DKIM keys rotated on schedule? DMARC ready to tighten?
- **On any template change**: CI renders, one human glances at the result in the shared inbox before merge. The same bar as any other UI change.

Four habits. None of them grand. All of them cheaper than one deliverability incident — and considerably cheaper than explaining to a client why their onboarding emails have been landing in spam since March.

## Key takeaways

- Transactional email is a product surface: receipts, resets and magic links carry more trust per pixel than your homepage. Engineer, design and test them to the same standard.
- Authentication is three DNS records — SPF, DKIM, DMARC — rolled out in weeks, not hours. Start DMARC on `p=none`, watch, tighten.
- HTML email targets a 2007 rendering engine: tables for layout, inlined styles, fonts as garnish, dark mode as a deliberate design. Write to the worst client your users have.
- Templates live in the repo, compile in CI, render against horrible fixtures, and land in a shared inbox the team actually looks at.
- Suppression lists applied at send time are your deliverability. Hard bounces suppress forever; soft bounces get grace; categories let users opt out of marketing without losing their receipts.

## FAQ

**Do we really need a separate subdomain for marketing mail?** Yes, the first time your newsletter gets a complaint spike, and the pain of splitting after an incident dwarfs the pain of splitting on day one. Ten minutes now; a deliverability project later. Take the ten minutes.

**Should we use a drag-and-drop email builder?** For actual marketing campaigns, sure — the tool is fine. For transactional email, no: the template belongs in version control with your components, next to the design tokens and the tests. A receipt edited in a drag-and-drop UI is a receipt that can change without a code review, which is precisely the kind of thing that lands in production broken and stays there.

**How long does DMARC enforcement take?** Six weeks, pleasantly. Week one: `p=none`, reports flowing. Weeks two to four: reconcile who's actually sending as your domain. Week five: `quarantine`. Week six: `reject`, and a genuinely satisfying feeling. There's no legitimate shortcut, and "we never got around to reject" means spoofing your domain is still free — the reports tell you how free.

**What's the worst transactional-email mistake you've seen?** Sending password-reset email from a marketing domain that had been throttled for spam complaints. Users were locked out for six hours while the team "fixed the email provider." The provider was fine. The domain was poisoned, by an email someone sent in a hurry three months earlier. Subdomain separation: ten minutes.

---

*Email is one surface among many — the same engineering discipline runs through every [product we build](/services/product). [See how we work](/approach), or [bring us your stack](/contact).*
