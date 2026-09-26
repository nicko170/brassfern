---
title: "Theme persistence without the flash"
description: "Dark mode that flashes light on load is a broken promise. Boot scripts vs cookies, SSR the right class, reconciling system preference, and testing regressions."
slug: theme-persistence-fouc
cluster: engineering
tags: [engineering, dark mode, ssr, performance, ux]
date: 2026-01-19
author: Felix Brandt
keywords: [dark mode persistence, FOUC prevention, theme engineering, localStorage boot script, SSR theming]
readingTime: 10
---

You've seen the flash. A returning user who set dark mode weeks ago clicks a link at 11pm and gets a full second of blinding parchment before the page remembers who they are. It's a small thing. It's also a broken promise — the interface told them it remembered their preference, and on every navigation it publicly reveals that it only remembers *after the JavaScript wakes up*. For anyone light-sensitive, migraine-prone, or just using a phone in bed, it's worse than papercut; it's a genuine "why did I tell you anything" moment.

Theme persistence is a solved problem soldiers keep refighting because the solution crosses three layers — storage, bootstrap, and rendering — and every tutorial solves one layer. This is the whole-stack version we ship on every site and app we build (the design side lives in [dark mode is a second design system](/journal/web-design/dark-mode-second-design-system) and [colour systems that survive dark mode](/journal/web-design/colour-systems-dark-mode); this is the plumbing).

## The three themes, not two

First, the modelling decision most implementations fumble: the user's setting is not light-or-dark. It's **three states — light, dark, or system** — where "system" is the default and means "follow the OS, live, forever." A boolean `darkMode: true|false` can't represent "user has no opinion," so boolean implementations end up stamping an explicit choice onto users who never made one, and then not updating when the OS shifts at sunset. Model the preference as an explicit enum, store the enum, and resolve it against `prefers-color-scheme` at application time. Users who pick "system" and then watch their OS changesee the app follow immediately — which is the behaviour they actually expressed.

The same three-state shape applies to the other preferences you should build on the same machinery — density (comfortable/compact/system), reduced-opacity tweaks, font-size scaling. Build the storage-and-bootstrap pipeline once, generically, and each new preference is a config entry, not a new FOUC to hunt.

## Storage: localStorage, cookies, and what each is for

The choice of storage determines who can know the theme, and when:

**`localStorage`** is readable by JavaScript only, at run time, on the client. The server rendering your HTML knows nothing about it — which is precisely the origin of the flash. Any architecture that resolves the theme in client JS after first paint is architecturally committed to flashing; no amount of optimisation removes it, only shortens it.

**Cookies** travel with the request, so the server knows the theme before it renders a byte. This is the only storage that enables true server-rendered correctness. The price: cookies are per-domain plumbing with size and header hygiene considerations, and they need to be set on navigations (a tiny endpoint or middleware — it's 2026, this is not exotic).

**The pragmatic answer, which we use everywhere:** *both*. `localStorage` (or better, a single namespaced preferences blob) is the source of truth for the client; a mirror cookie is written alongside it purely so the server can render the right class. They can't drift in practice because one write path sets both. This isn't redundancy as laziness — it's each storage doing the job it's shaped for.

## The inline boot script: right answer, wrong default

If you're not server-rendering (static export, pure SPA), the standard fix is the inline blocking boot script in `<head>`: a dozen lines that read storage, resolve against `matchMedia`, and set `class="dark"` on `<html>` before first paint. It works. Everyone ships it. Two honest caveats:

**It's a blocking script by design.** Keep it tiny, keep it sync, keep it dependency-free — inlined verbatim, never bundled, never through a module loader. This is one of two legitimate inline scripts in a modern site (the font-loading bootstrap from [font loading recipes](/journal/engineering/font-loading-performance-recipes) being its sibling). Everything else in the payload should be async; the boot script is the exception that must stay exceptional.

**It can still flash on system-theme users on slow paints** if the boot script resolves "system" by reading `matchMedia` and applying a concrete class, and something later repaints during hydration when React re-resolves. Belt and braces: the boot script sets *both* the class and a data attribute recording the raw preference (`data-theme-pref="system"`), so hydration can reconcile against intent rather than re-deriving it.

And a note on CSP, since we ship [a security baseline](/journal/engineering/security-headers-csp-baseline) everywhere: the boot script needs a hash or nonce in your Content-Security-Policy. Hash is cleaner than nonce for static content (it's stable per build); either way, "allow 'unsafe-inline' for the theme script" is not a plan.

## Server-rendering the right class

If you have a server — and you generally should — cookie-plus-SSR is the cleanest architecture: middleware reads the theme cookie, resolves system server-side where the UA header hints allow, and stamps `<html class="dark" style="color-scheme: dark">`. The first byte is already correct. No boot script needed for the theme at all (keep one only as a fallback for stale-cookie edge cases, and make it a no-op when the class is already right).

Craft details that separate polished from merely correct:

- **`color-scheme` is not optional.** Set it alongside the class so scrollbars, form controls, and browser UI match the theme *before your CSS even parses*. An un-themed native scrollbar glowing white through your dark interface is the same broken promise, smaller.
- **Respect the back-forward cache.** Pages restored from bfcache don't re-run scripts; make sure the applied class survives restoration and matches current preference — the classic failure is changing theme in tab A, then hitting back in tab B into a stale-themed bfcache page.
- **Transitions on theme switch are a feature, not a flourish.** A 150ms cross-fade on colour properties when the user *manually* toggles makes the change feel physical. But that same transition must be suppressed during load and during system-driven changes — a page that fades itself at midnight because the OS switched is haunted. Gate the transition class on explicit user action only.
- **`meta theme-color` must follow the theme** so the mobile browser chrome matches. It doesn't react to CSS — update it from JS when the theme resolves.

## Testing theme regressions like they matter

Theme bugs regress constantly because they're cross-cutting: every new component is a chance to hard-code `white`. The defences:

**Token architecture as the first line.** If components can only colour themselves from semantic tokens (`--surface`, `--ink`, not `#fff` and `#000`), a theme regression becomes structurally difficult rather than merely undisciplined. This is [design tokens as an API](/journal/engineering/design-tokens-pipeline) paying its rent: the lint rule that bans raw colour literals in component CSS catches 90% of dark-mode bugs at author time.

**Visual regression in both themes, automatically.** Screenshot tests run twice — light and dark — on every PR, for the same reason you test at 375px and 1440px: it's a real variant of the product, used by half your users, invisible to the engineer who develops in light mode all day. A diff that renders nicely in one theme and illegibly in the other should fail CI, not ship and wait for a user with astigmatism to file it.

**The persistence round-trip test.** An end-to-end test that sets a preference, navigates across pages (and crucially, does a full document reload, not just client-side transitions), and asserts the correct class is present *in the initial HTML* — that's the flash, tested. Add the system-preference path via emulated `prefers-color-scheme` and you have the failure modes covered.

**Manual, once per release:** the 11pm test. System in dark, OS toggle while the app is open, theme toggle on a slow connection, bfcache back-button. Three minutes. The flash and its cousins announce themselves instantly to human eyes in ways automation still misses.

## The smaller preferences that ride the same rails

Once the machine exists — typed preference storage, cookie mirror, SSR class application, reconciliation, tests — the marginal cost of each new preference drops to nearly zero, and two are worth taking seriously from day one. **Density** (compact/comfortable) is the single most-requested preference in data-dense products; stores as spacing-scale tokens, resolves identically to theme. **Reduced-motion override** — a manual opt-down independent of the OS setting — respects users whose OS setting is off but who've told *your product* they want less animation; it composes with, never overrides, the OS-level `prefers-reduced-motion` signal. Both are the same enum-plus-tokens-plus-bootstrap pattern, and shipping them together signals something true about the product: preferences here are *remembered promises*, heavily engineered, not a settings page that writes to nowhere.

## Key takeaways

- The preference is three states — light, dark, system — and "system" must follow the OS live. The two-state boolean is the original sin of theme engineering.
- The flash is architectural: client-JS theme resolution after first paint can never be fully fixed, only moved. Resolve before paint.
- localStorage is the client's source of truth; a mirror cookie lets the server render the right class. Each storage does the job it's shaped for.
- In static/SPA architectures, the blocking inline boot script is the right answer — tiny, sync, inlined, and hashed into your CSP.
- Set `color-scheme` and `theme-color` with the theme; gate switch transitions to explicit user action; mind the bfcache.
- Test the round trip: dual-theme visual regression in CI, a persistence test asserting the class in initial HTML, and one human 11pm pass per release.

## FAQ

**Is the inline boot script a performance problem?**
At ~300 bytes compressed and synchronous-by-design, it's the cheapest insurance on the page. The danger isn't the boot script — it's letting the pattern metastasise. Keep the inline allowlist to boot-critical work (theme, fonts) and treat every new candidate as guilty until proven innocent.

**Cookie or localStorage — can't I just pick one?**
Not without trade-offs you probably don't want. Cookies alone force storage through request plumbing and complicate client-side toggles; localStorage alone guarantees the flash on every SSR'd or static page. The dual-write approach costs one extra line of code per preference change and removes both problems.

**How do we handle "system" theme on the server?**
You mostly can't know the OS theme server-side — the `Sec-CH-Prefers-Color-Scheme` client hint helps where available, with the boot script as the corrective fallback where it isn't. In practice: SSR the *recorded* preference; let the tiny boot script resolve system cases client-side. System users accept imperceptible correction; explicit-choice users get byte-level correctness.

**Does this all apply to plain static sites, or only apps?**
Plain static sites are exactly where the boot script pattern shines — no server, so correct-before-paint inlines are the whole game. SSG frameworks add the wrinkle that hydration must not fight the boot-applied class; reconcile against the recorded raw preference and the fight disappears.

**What about users who change OS theme mid-session?**
Listen to `matchMedia('(prefers-color-scheme: dark)')` changes, but apply them only when the stored preference is "system". Nothing is more jarring than an explicit "light" choice being overridden by sunset; nothing is more broken-feeling than a "system" choice *not* following it. The enum is what lets you honour both.
