---
title: "Frontend observability for teams without an SRE"
description: "Frontend observability without an SRE: the three signals that matter, sourcemaps done privately, and the dashboards a small team will actually open."
slug: frontend-observability-small-teams
cluster: engineering
tags:
  - observability
  - performance
  - monitoring
  - real user monitoring
date: 2026-04-09
author: Tomás Reyes
keywords:
  - frontend observability
  - real user monitoring
  - error tracking
  - web performance monitoring
readingTime: 10
---

Every frontend observability guide assumes you have a platform team, a Grafana instance with opinions, and someone whose job title includes the word "reliability." Most product teams have none of these. They have six engineers, a roadmap, and a growing suspicion that users are hitting errors nobody reports.

This is the setup we install for clients in that exact position — the one where a two-day investment buys you 90% of what a full observability programme would. It rests on a claim we'll defend: **for a frontend, three signals answer almost every incident question you'll ever ask.** Everything else is garnish.

## The three signals that matter

Strip the discipline to its studs and a frontend incident is always one of three things:

1. **JavaScript errors.** Something threw. The page went blank, the button went dead, the checkout spinner spun forever.
2. **Real-user performance.** Not Lighthouse in a lab — actual LCP, INP and CLS from actual devices on actual networks. The lab numbers tell you what you shipped; the field numbers tell you what users got, and we keep the distinction sharp in our [Core Web Vitals field guide](/journal/engineering/core-web-vitals-field-guide).
3. **Business-path events.** Did signups complete? Did checkouts submit? A "money path" step count, emitted from the client, is the fastest detector of the worst class of bug: the silent one where nothing throws but the flow is broken.

That's it. Session replay, distributed tracing, custom metric pipelines — all legitimate, all optional. If a team tells us they're drowning in data and starving for insight, the cause is almost never too few signals. It's signals nobody owns.

## One tool per signal, wired together

Our default stack for a team without an SRE is deliberately unglamorous:

- **Error tracking:** Sentry or an equivalent, with release tagging turned on. Not optional: every error must know which deploy it came from, or you can never answer "did we just break this?"
- **RUM for Web Vitals:** the `web-vitals` library posting to your analytics or a small endpoint, with page, device class and connection type attached. Seven lines of code, genuinely transformative.
- **Money-path events:** your existing product analytics. Add explicit step events (`checkout_started`, `payment_submitted`, `order_confirmed`) rather than inferring funnels from page views — page-view funnels lie the moment you have a single-page flow.

The wiring between them matters more than the tools. Attach a shared session ID to all three so that when a metric dips, you can pull the errors from the affected sessions. This one correlation saves hours per incident; without it you're doing archaeology.

On sampling: sample your RUM aggressively (10% is plenty for vitals) and your errors never. Errors are rare and precious; page loads are cheap and numerous. Teams that do the inverse have a bill problem and a blindness problem simultaneously.

## Sourcemaps without the privacy hangover

Unreadable stack traces are the most common reason error dashboards get ignored. `TypeError: undefined is not an object at n.render (app.8f3a2.js:1:48213)` is not a bug report; it's a riddle. Uploading sourcemaps fixes it, and the privacy concern — "we'd be publishing our source" — is mostly a myth worth retiring:

- Upload sourcemaps to your error tool at build time, then **don't ship them publicly**. Delete them from the deploy artefact, or serve them with an auth-gated path. Your bundles are already readable to anyone determined; sourcemaps add little real exposure but enormous debugging value.
- Strip query strings and form values from error context. The thing that will actually embarrass you is a user's email or a reset token sitting in a breadcrumb, not your component names.
- Set `sendDefaultPii: false` (or your tool's equivalent), then deliberately allow-list the context you want: release, route, feature flags in their non-sensitive form.

That last point deserves emphasis: knowing which flags were on during an error is the difference between "mystery regression" and "that experiment, obviously." Flag hygiene is its own discipline — we wrote up the lifecycle in [feature flags without the graveyard](/journal/engineering/feature-flags-craft) — but at minimum, log which flag set was active.

## Alert on symptoms, page on money

Without an SRE, every alert lands on a product engineer with feature work to do. Alert fatigue isn't a risk; it's the default outcome unless you're ruthless. Our rules:

- **Alert on symptom rates, not cause counts.** "Error rate on checkout above 2% for five minutes" pages someone. "A new error type appeared" goes to a digest. New error types happen daily; most are someone's ad blocker.
- **A daily digest beats a noisy channel.** One message each morning: new error types, count, affected release, affected users. Triageable over coffee by whoever's on support duty. The [third-party scripts audit](/journal/engineering/third-party-scripts-audit) mindset applies — most noisy errors aren't even yours:
  - Script errors from browser extensions: filter, don't chase.
  - Network failures on flaky connections: aggregate, threshold, ignore singletons.
- **The money path gets the only pager.** If `order_confirmed` volume drops to zero while traffic is normal, that page-worthy. A CLS regression is a ticket. This triage is what lets a six-person team keep alerting on at all.

## The three dashboards that get looked at

Dashboards have a survival rate like houseplants: most are dead within a quarter. The ones that live are the ones tied to a recurring human ritual. We install three, each with a standing appointment:

**1. The health board — looked at every stand-up, twelve seconds.** One screen: error rate yesterday vs. trailing week, p75 LCP/INP for the top five routes, money-path completion rate. Green/amber/red, nothing clickable. Its job is to be glanced at, and to occasionally make someone say "huh."

**2. The release diff — opened on every deploy.** Errors by release, vitals by release, side by side for the current and previous version. This dashboard exists because "did the deploy break anything?" is the question you'll ask most often and answer worst without tooling. With release tagging done right, this view is free.

**3. The weekly deep dive — thirty minutes, Fridays, rotating owner.** Session replays of the five most-thrown errors. Vitals distribution (not averages — averages hide the long tail where your users' misery lives). This is where a team without an SRE does its actual reliability work: in a calendar slot, not an on-call rota.

The deep-dive ritual is also where accessibility failures surface — errors thrown only on keyboard navigation, layouts that collapse at 200% zoom. Reliability and accessibility are the same work seen from different angles, which is why we treat [accessibility as an engineering practice](/journal/engineering/accessibility-as-engineering-practice) and not a separate workstream.

## Rolling it out in thirty days

Week one is plumbing: error tool, sourcemap upload, release tagging, RUM beacon. Week two is money-path events and the first dashboard. Week three is the digest and alert thresholds — set them loose on purpose, then tighten when you see real numbers, because thresholds set from guesses are how alert channels die. Week four is your first deep dive and the first honest retro on the data.

The failure mode to resist: adding signal number four before signal one is trusted. We've watched teams add tracing before they'd fixed their stack traces. Instrument depth beats instrument breadth, always. And if the rollout surfaces more fires than your team can ever put out — a common and slightly traumatic discovery — that's a scope problem we're happy to help triage through our [product engineering practice](/services/product), starting with the [contact form](/contact).

## Key takeaways

- Three frontend signals answer almost every incident question: errors, real-user vitals, and money-path step events. Own these before buying anything else.
- Release-tag everything. "Did the deploy break it?" is your most common incident question; make it a ten-second answer.
- Upload sourcemaps at build time and don't ship them publicly. The privacy risk is overblown; the debugging gain is not.
- Alert on symptom rates with a daily digest for the noise; reserve the pager exclusively for the money path.
- Dashboards survive only when tied to a ritual: stand-up glance, deploy check, Friday deep dive. A dashboard without an appointment is a screensaver.

## FAQ

### Can't we just use our analytics instead of proper error tracking?

No, and the reason is stack traces. Analytics tells you *that* a flow broke; error tracking tells you *where the code threw*, with the release, the route, and the user context attached. They're complementary — analytics measures outcomes, error tracking explains failures — and a team running only analytics will spend its Fridays guessing.

### How do we set thresholds when we have no baseline?

Measure two weeks in silence first. Then set alerts at roughly 2–3× the observed p95 rate. Never adopt a threshold from a blog post, including this one — thresholds are fingerprints of your traffic shape, and borrowed ones either cry wolf or sleep through fires.

### Is session replay worth the cost and the privacy review?

Situationally, yes — after the three core signals are stable. Replay is unmatched for "users say the page feels broken but nothing throws" mysteries. Get legal sign-off on masking rules (mask all inputs by default, allow-list read-only content), treat it as an investigation tool rather than an always-on record, and the review is usually painless.

### We're on Next.js/Remix/Nuxt — does SSR change any of this?

It adds one signal rather than replacing any: server-side render errors and timing for the document request. Track TTFB p75 per route alongside INP — a slow document poisons every downstream metric. The same three dashboards work; the release diff just gains a server column, and you grow one alert: 5xx rate on document requests.
