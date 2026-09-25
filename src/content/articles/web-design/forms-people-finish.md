---
title: "Designing forms people actually finish"
description: "Forms are where products lose users and revenue quietly. The field-economics, label copy, error writing and autofill respect we use to keep completion high."
slug: forms-people-finish
cluster: web-design
tags: [form design, ux writing, conversion, accessibility, interaction design]
date: 2025-05-14
author: Aiko Tanaka
keywords: [form design ux, form conversion, input design, error message design, form microcopy]
readingTime: 9
---

Every form field is a small negotiation. The product is asking for something — a name, a card number, a date of birth it probably doesn't need — and the user is deciding, field by field, whether the thing on the other side is worth it. Most form design advice obsesses over the cosmetics of that negotiation: rounded corners, floating labels, a progress bar with personality. The completion data tells a blunter story. Forms fail because they ask too much, explain too little, and punish mistakes the user didn't know they were making.

We've rebuilt forms across onboarding, booking and checkout — a [course onboarding flow](/work/brightmarsh-onboarding), a [telehealth intake](/work/pylon-health-telehealth-flow), a [restaurant reservation widget](/work/wattle-and-daub-reservations) — and the same five disciplines do nearly all the work. None of them are glamorous. All of them move numbers.

## 1. Every field barters for its place

Before designing anything, we run the field audit. One sheet of paper per form. For each field, three questions, out loud, in a room with the people who asked for the field:

- **What decision does this field enable?** Not "why is it nice to have" — which downstream process consumes it. "Marketing wants it" is occasionally a legitimate decision; write it down as such.
- **What happens if we never get it?** If the answer is "nothing", delete the field in the meeting. In a typical intake audit we delete 20–40% of fields before any design happens. The telehealth intake for [Pylon Health](/work/pylon-health-telehealth-flow) lost eleven fields this way, including — delightfully — a fax number.
- **When do we actually need it?** "Just in case" fields are how forms bloat. Phone number needed only at dispatch? Ask at dispatch. Date of birth needed to dose medication? That's a clinical need — but company size needed "for our CRM" can wait until the second login, or never.

The audit reframes everything after it. Once a stakeholder has watched a field defend itself and lose, "can we just add one more?" starts sounding like what it is: a tax on every future user.

A refinement worth stealing: mark every surviving field with one of three verbs — *identify*, *decide*, *deliver*. Identify (who are you), decide (what do you want), deliver (where does it go). If a field fits none of them, it isn't part of this form's job. It's someone's curiosity wearing a label.

## 2. Ask in the user's language, not the database's

Labels go wrong in a predictable direction: they name the column, not the question. "DOB" is a column. "Your date of birth" is a question. "Company reg. no. (ABN)" is three columns in a trench coat.

Our label rules:

- **Full questions for anything unusual.** "Email" can be a bare noun because everyone knows why it exists. "Medicare number" becomes "What's your Medicare number?" and earns a hint explaining *why we need it and what we'll do with it* — because to a first-time telehealth patient, that request is not obvious, and unexplained official-looking fields are where anxious people bail.
- **Hide the optional ones by deleting them.** If a field is optional, that's a signal it failed question one of the audit. The exceptions live behind an explicit "add" control ("Add an apartment number", "Add delivery instructions") so the default path stays narrow.
- **Placeholder text is never a label.** Placeholders vanish on focus — exactly when the user needs them — and they fail contrast requirements at typical greys. Use them for format examples only, if at all.
- **One input per concept.** Split "full name" splits are a database fetish; a single "Your name" field serves more of humanity (mononyms, multi-part surnames, name orders you haven't imagined) and shaves a field off the count. Phone numbers and card numbers can self-format with input masking instead of being chopped into three boxes.

## 3. Steps are a pricing decision, not a layout decision

"Should this be one page or a wizard?" is the most-asked form question and the most badly framed. The real question: *what is the cheapest sequence of asks?*

The behavioural economics are consistent across our projects. **Effort perception is set by the first screen.** A wizard whose first step is email-and-password converts better than a single page showing twelve fields, even though the wizard's total effort is identical — because the single page bills you everything up front. But each extra step is also a new abandonment checkpoint, and mobile makes that worse: every step transition on a janky connection is a spinner, and every spinner is an exit poll.

Our working rules:

- **Group by mental task, not by database table.** "About you", "Your appointment", "Payment" — a user can hold one of those in their head. "Step 3 of 7" they cannot.
- **First step: the cheapest ask with the clearest reward.** In the [Brightmarsh onboarding flow](/work/brightmarsh-onboarding), step one asks what you want to learn and shows a syllabus preview reshaping itself around your answer as you type. The effort-to-reward ratio is absurd, deliberately. Completion of step one became self-fuelling.
- **Progress indicators tell the truth.** If steps vary wildly in effort, a stepper that shows "2 of 5" lies about remaining work. Show a plain "About 2 minutes left" estimate instead — and keep it honest, because a "2 minutes" that becomes six is worse than no estimate.
- **One thing per screen only when things are genuinely hard.** The one-field-per-screen pattern reads as premium on a three-field NPS survey and as hostage-taking on a government form.

## 4. Errors: prevent when cheap, explain when not

Validation is where forms reveal whether they respect you. The hierarchy we build to:

**Prevent structurally first.** `type="email"`, numeric input modes, date pickers where dates are constrained, card fields that detect the brand. On the Wattle & Daub reservations widget, switching the date question from a text input to a proper picker killed an entire error class — people typing "next Friday" — overnight. Structure beats instructions.

**Validate on blur, announce on submit.** Inline validation that fires while someone is still typing punishes half-finished input ("Email address is invalid" — yes, I'm mid-way through it). Validate a field when the user leaves it; keep the submit-time pass for the full summary. Never wipe entered data on a failed submit. Ever. Nothing says "we have never watched a human use this" like a form that clears your card number because your postcode was wrong.

**Write errors as repairs, not accusations.** The difference between an error message that converts and one that doesn't:

- "Invalid input" → nothing learned, blame implied.
- "Password must contain 8+ characters, one uppercase letter…" → the requirement should have been *visible before failure*, not revealed by it.
- "That card number is 15 digits — cards have 16. Check the last four." → specific, repairable, assumes competence.

The pattern: state what happened, state what good looks like, keep the person's dignity. And put the message next to the field, wired with `aria-describedby`, because an error summary at the top of a long mobile form is a scavenger hunt.

**Errors are research.** We log validation failures by field (anonymised, no values) on every form we ship. A field with a 15% error rate isn't unlucky — it's misleading, and the fix is upstream: the label, the format, or the field's existence.

## 5. Respect the machine your user brought

Autofill is the user's power tool, and most forms jam it. The fix costs an afternoon: correct `autocomplete` tokens (`shipping street-address`, `cc-number`, `given-name`), real `<label for>` associations, no fake placeholder-as-label trickery, and **never repurposing** standard fields (the `name` field that must contain a username confuses every password manager alive).

While you're in there: keyboard order left-to-right top-to-bottom with no tabindex gymnastics, visible focus styles that survive your brand palette, and touch targets at 44px minimum. These aren't accessibility garnish bolted on for an audit — they're the form working properly for the large share of users who navigate by keyboard, autofill, or fatigue. Our [product team](/services/product) treats WCAG AA as the floor on forms specifically, because forms are where exclusion converts directly to lost revenue.

And test the failure states on your phone, on a train. A form is finished when it survives a cracked screen, a tunnel, and a distracted thumbed typo — not when it passes review on a designer's monitor.

If your signup or checkout completion is a number you apologise for, that's a fixable problem — [start a conversation](/contact).

## Key takeaways

- Audit fields before designing: what decision does it enable, what if we never get it, when do we need it? Expect to delete a fifth to a third.
- Labels are questions in the user's language. Placeholders are not labels. Unusual asks need a "why".
- Steps are priced by perception: cheapest ask first, group by mental task, honest progress, beware every step transition on mobile.
- Prevent errors structurally; validate on blur; write errors as repairs with specifics; log field-level error rates as ongoing research.
- Ship complete `autocomplete` tokens, real labels, keyboard order and 44px targets — autofill users are your fastest conversions.

## FAQ

**Do multi-step forms convert better than single-page?**
Neither wins universally. Long low-stakes asks (surveys, onboarding) do better chunked, because the first screen sets effort perception. Short high-intent asks (checkout with autofill) do better on one page, because every step transition is an abandonment point. Prototype both with real content before committing — the split often surprises stakeholders.

**Should we mark required or optional fields?**
If most fields are required, mark the optional ones ("(optional)"). If optional is the norm, mark the required. Red asterisks on nine of ten fields is just visual noise; the honest fix is usually deleting fields until the marking scheme flips.

**Are floating labels okay?**
They survive testing better than their reputation suggests, but they still degrade into placeholder behaviour on filled fields and cramp long translations. We default to always-visible labels above the input and reach for floating labels only in genuinely space-cramped contexts like sticky filter bars.

**How do we know which field is killing us?**
Instrument three events per field: focus, blur-with-error, and form abandon (last focused field). The intersection of high error rate and high abandon rate is your culprit list, ordered. Fix the top one, ship, measure. Field-level analytics outperform opinion in every form review we've run — including our own opinions.
