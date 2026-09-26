---
title: "Form architecture at scale: schemas, errors and autofills"
description: "Schema-first form engineering: shared zod validation, error copy as data, correct autofill tokens, and announcements that don't double-speak."
slug: form-architecture-scale
cluster: engineering
tags: [forms, validation, accessibility, typescript, frontend architecture]
date: 2026-08-21
author: Felix Brandt
keywords: [react form architecture, zod validation, form error handling, accessible forms engineering, autofill tokens, schema validation]
readingTime: 10
---

Forms are where product engineering goes to seem easy and fail quietly. The demo takes twenty minutes; the production version takes a quarter — because production forms must validate identically in two runtimes, speak kindly to screen readers, survive browser autofill, localise their error copy, and never, ever lose what a user typed on a flaky connection.

Most codebases meet those needs with per-form improvisation. This article is the alternative we standardised on: **schema-first form architecture**, where one declarative schema drives validation, error copy, autofill semantics, and accessibility wiring. It's the system under the brief form on our own [contact page](/contact) and inside the heavier flows we've shipped for clients.

## The failure mode: per-form craft

Walk any mature codebase and count the validation dialects. The signup form checks email with a regex from Stack Overflow. The checkout form trims inputs on blur, except the postcode. The settings form validates on submit and clears errors on focus — except two fields that keep errors until change, for reasons lost to time. Server validation duplicates the client rules in a different language with subtly different messages, and support inherits the difference.

Three compounding costs:

1. **Drift.** Client and server rules diverge. Users pass client validation, get bounced by the server, and see a message about a form they can't see any more.
2. **Inconsistent voice.** Error copy written inline by whoever touched the field last reads like a committee, because it was one. Errors are product copy — see [error messages that de-escalate](/journal/product/error-messages-that-help) — and they deserve the same editorial control as headlines.
3. **Accessibility debt.** `aria-invalid` half-set, described-by relationships assembled by hand per field, live-region announcements that double-speak or don't speak at all. Every improvised form improvises its accessibility too.

## Principle one: the schema is the single source of truth

One schema per form (or per step, in multi-step flows — see [state machines for UI flows](/journal/engineering/state-machines-ui-flows)). Written once, in TypeScript, shared verbatim between client and server:

```ts
import { z } from 'zod'

export const briefSchema = z.object({
  name: z.string().trim().min(2, 'tooShort'),
  email: z.string().trim().toLowerCase().email('invalidEmail'),
  company: z.string().trim().optional(),
  budget: z.enum(['under-40', '40-100', '100-250', '250-plus'], {
    error: 'chooseBudget',
  }),
  message: z.string().trim().min(30, 'tellUsMore'),
})

export type Brief = z.infer<typeof briefSchema>
```

Everything downstream derives from this:

- **Types.** `Brief` is inferred, never hand-maintained, so the payload type cannot disagree with the validator.
- **Client validation.** A resolver feeds the schema to the form library (react-hook-form is our default); field-level rules are the schema's rules, not props smeared across JSX.
- **Server validation.** The same file runs in the API handler. Client validation is a courtesy — progressive enhancement for feedback speed — and the server is the authority. Identical schemas mean the server's answer can refocus the exact field the client already rendered.
- **Fuzz tests.** Generate garbage and near-valid data against the schema (`fast-check` or similar) and you test the *rules* once, not every form twice.

A note on error strings in the example: they're **codes**, not copy. That's deliberate, and it's principle two.

## Principle two: error copy is data, not string literals

We never write final error text in the schema or in components. The schema emits codes; a message module per form (per locale) turns codes into voice:

```ts
const messages = {
  email: {
    invalidEmail: "That email doesn't look right — check for typos?",
    taken: "That email already has an account. Sign in instead?",
  },
  message: {
    tellUsMore: "Give us a little more — goals, timeline, anything. A paragraph is plenty.",
  },
}
```

Three returns on this small ceremony:

**Editorial control.** A writer can review every error a product can produce in one file. Tone becomes reviewable; "Invalid input" dies where it was born.

**Testability.** Assertions check codes (`expect(error.code).toBe('invalidEmail')`), so copy edits never break tests and tests never police copy. Both halves of the partnership get to do their job.

**Localisation for free.** Codes are the translation keys. The day the client adds a second locale, the engineering is already done; only a message file is added.

The copy itself follows our house rules: say what happened, say what to do, blame no one — especially not the user. "Password must contain…" is a spec recitation; "Add a number or symbol and you're in" is a person helping.

## Principle three: progressive validation, tuned by intent

When to validate is a UX decision disguised as a config flag. Our defaults:

- **On blur for progressive fields.** A field you just left may tell you how it went. Validate on blur, and *re-validate on change only if the field currently shows an error* — punishment must lift as soon as it stops being deserved.
- **On submit for the whole form.** Submit performs full validation and moves focus to the first error, with errors rendered inline persistently. No toasts for form errors (they vanish; the problem doesn't), no summary-*instead-of-inline* patterns (the [WebAIM million](https://webaim.org/projects/million/) can't file your bug reports, but it documents the failures: inline, connected, persistent).
- **Never on first keystroke.** Flagging a two-character email as invalid is technically accurate and humanly rude. Interfaces that heckle users mid-thought teach people to fear the form. We covered the design side in [forms people actually finish](/journal/web-design/forms-people-finish); the engineering half is a validation scheduler that respects these timings.

Async checks (username availability, ABN lookup) get debounce, cancellation, and a visible pending state. An availability check that resolves *after* the user typed three more characters must not be allowed to declare anything.

## Principle four: autofill is a contract with the browser

The fastest form is the one the browser fills. The `autocomplete` attribute is not a nice-to-have; it's a published contract with real keywords, and getting it right is engineering:

```html
<input name="email" autocomplete="email" inputmode="email" />
<input name="given-name" autocomplete="given-name" />
<input name="tel" autocomplete="tel" />
<input name="cc-number" autocomplete="cc-number" inputmode="numeric" />
```

Hard-won specifics:

- **Part names, not frankenstein values.** `name` and `fullname` are not tokens. `given-name` and `family-name` are. Billing versus shipping gets section prefixes: `autocomplete="billing street-address"`.
- **`inputmode` is the mobile half.** `inputmode="numeric"` on card numbers and postcodes pulls the right keyboard; `type="number"` is a trap (spinners, `e` characters, lost leading zeros — use `type="text"` with `inputmode` and a schema transform).
- **Deterministic `id`/`name` pairs.** Password managers and autofill heuristics key off these. Conditionally changing names ("billingEmail" vs "email" across modes) is how you teach a browser to give up on your form.
- **Don't fight paste or autofill with listeners.** `onPaste="return false"` is a war on your own users, usually justified with a security argument that evaporates under questioning.

## Principle five: announcements that don't double-speak

The accessibility engineering that most often goes wrong in forms, decomposed:

**Wiring.** Every field gets `aria-invalid` reflected from validation state and `aria-describedby` assembled *by the form system*, pointing at the error element when present, plus the hint element when present. Nobody hand-writes these per field; per-field hand assembly is how described-by relationships rot.

**Announcement strategy.** Screen readers announce inline errors when focus lands on the field — provided the wiring above is right. That means a live region (`aria-live="polite"`) is for **form-level** events only: submission failure ("3 fields need attention — we've moved you to the first"), submission success, async availability results. The double-speak antipattern — live region *and* focus target announcing the same error, or a live region replaying every keystroke validation — comes from announcing at field level. Don't.

**Focus on failed submit.** Move focus to the first invalid field and let the inline error announce naturally. A "summary of errors" heading is a fine enhancement as long as it doesn't replace inline errors.

**Multi-step flows.** On step change, move focus to the step heading (`tabindex={-1}`) and announce progress accessibly ("Step 2 of 4 — delivery details"). We built exactly this rhythm into the Pylon Health booking flow — [drive the live demo](/lab/pylon-health-booking) — where some patients are anxious, some are unwell, and none should have to guess where the interface went.

## Putting it together: the brief form

Our own contact form is the reference implementation, small enough to hold in your head:

1. `briefSchema` (above) — one file forming the payload type, client rules, and server rules.
2. Codes → messages in one module, same voice as the rest of the site.
3. Blur/submit validation scheduling, inline persistent errors, focus management on failure.
4. Complete `autocomplete`/`inputmode` semantics so browsers and password managers do their job.
5. Server round-trip that revalidates, stores, sends email, and returns either success or field-keyed codes that refocus the offending field.

Total: a schema, a message file, one form component, one API handler. Every new form starts by writing its schema, and the skeleton — wiring, announcements, focus — is inherited rather than recreated. That's what "architecture" means at form scale: not a framework, a set of decisions you stop remaking.

If this is the shape of problem your product has at greater scale — dozens of forms, multiple locales, compliance-grade audit trails — it's bread-and-butter work on our [product engagements](/services/product).

## Key takeaways

- One schema per form, shared client/server: types, validation, and fuzz tests all derive from it, and drift becomes impossible.
- Error copy is data — schemas emit codes; a message module owns voice; tests and copy editing stop colliding.
- Validate on blur, lift errors on change, full-validate on submit; never heckle on first keystroke.
- `autocomplete` tokens, `inputmode`, and stable name/id pairs are a contract with the browser — the cheapest conversion win in front-end engineering.
- Inline errors wired with `aria-invalid`/`aria-describedby` announce themselves; reserve live regions for form-level events, and move focus on failed submit.
- The payoff isn't the first form — it's the fortieth, which inherits every decision.

## FAQ

**Which form library should we use — react-hook-form, Formik, something else?**

react-hook-form is our default for new work: uncontrolled-first rendering keeps re-renders off the critical path, schema resolvers are first-class, and the API matches the architecture above. Formik works but re-renders eagerly and shows its age in async-heavy forms. Honestly, the library matters less than the architecture — a schema-first system with disciplined announcements survives any of them.

**Doesn't shared client/server validation mean shipping our rules to the client?**

Yes, and that's fine. Client-side rules are not a security boundary; the server revalidates regardless. What you must not ship is *sensitive* logic — rate limits, fraud signals, privileged entitlements. Those live server-side and return codes the client maps to messages like everything else.

**How do you handle conditional fields in a schema?**

With discriminated unions and `superRefine`: the schema's shape branches on a discriminator field (`billingSame: false` reveals and requires billing fields). The UI reads the same discriminator to show and hide inputs. The rule: a field that's invisible but schema-required is a bug factory — visibility and requirement must derive from the same branch.

**What's your stance on masking inputs (phone, card numbers)?**

Masks that reformat as you type break caret position, autofill, and screen readers in shifting combinations. Our default: no live masking. Accept liberally (spaces, dashes), normalise in the schema transform, *display* formatted. Card-number grouping on blur is fine; caret-fighting masks are a bill you pay forever.

**How do we get there from a codebase full of improvised forms?**

Don't rewrite; ratchet. Pick the highest-traffic form, give it the schema treatment, and extract the plumbing (resolver, announcer, focus manager) into shared utilities as you go. Institute one review rule going forward: new forms must be schema-first. The inventory converts over quarters without a heroic "forms sprint" that would slip anyway.
