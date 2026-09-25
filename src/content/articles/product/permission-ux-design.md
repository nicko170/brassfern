---
title: "Permission UX: roles, extras and the politics of access"
description: "Role systems are where products quietly rot. RBAC patterns admins actually understand, invitation flows that convert, and audit trails designed as a kindness."
slug: permission-ux-design
cluster: product
tags: [permissions, rbac, enterprise ux, admin design, security ux]
date: 2025-06-04
author: Felix Brandt
keywords: [permissions ux, rbac interface design, user roles design, admin ux]
readingTime: 11
---

Every B2B product ships its first permission system as an afterthought — a boolean called `is_admin` — and spends the next five years paying interest on it. By the time customers say "we need roles", the product usually gets the worst possible fix: a matrix of forty checkboxes nobody understands, least of all the support team fielding calls about it.

Permissions are a UX problem wearing an engineering costume. The data model is the easy part; any competent team can implement role-based access control in a sprint. The hard part is that permissions are **politics rendered as interface** — who is trusted, who is blamed when money moves wrongly, who has to ask whom for access. Get the UX wrong and you don't get angry tweets. You get shadow workarounds: shared logins, credentials in wikis, "just make everyone an admin". Every one of those is your failed interface, outsourced onto your customer's security posture.

Here's the shape of permission UX that survives contact with real organisations, drawn from work like the [Northwind Ledger dashboard rebuild](/work/northwind-ledger-dashboard-rebuild) — where accountants, bookkeepers and clients all needed different doors into the same numbers — and the [Copperline Mutual community bank project](/work/copperline-community-bank), where access errors were measured in regulator phone calls.

## Model the org chart user's brain, not your schema

The first mistake is presenting your internal model directly. Engineers (I say this with love, as one) reach for the full expressive power of the system: resource × action × scope, composable roles, inheritance trees. Admins reach for exactly one question: **"Can Priya see payroll?"**

Design the interface around the admin's questions, in the order they ask them:

1. Who is this person, and what can they do?
2. Who else can do that?
3. Something went wrong — who did this?

Notice what's absent: "show me the role entity". Roles are an implementation convenience that admins tolerate, not a concept they seek out. The best permission screens we've shipped are **person-centric on the surface, role-centric underneath**. You open a person's page and see, in plain language: "Priya is a *Manager* — she can approve expenses up to $5,000, view her team's reports, and invite new team members. She cannot access payroll settings." That description is generated from the role definition; the role definition is where you edit it. Both views read from one source of truth, so they can never disagree.

When we tested role-picker-first designs for Northwind Ledger, admins completed access changes correctly but couldn't answer "what did I just grant?" afterwards. Person-centric summaries fixed comprehension at the cost of one extra click for bulk role edits — a trade we'd make every time.

## Three roles and an extras drawer

The strongest opinion we hold: **ship three well-named roles before you ship one flexible one.** Owner, Manager, Member (names tuned to the domain — the bank used Officer, Teller, Viewer) cover roughly 90% of real organisations' actual access patterns. The remaining 10% wants *one thing different* — and this is where products overreach into full custom-role builders, when what users need is an **extras drawer**: per-person exceptions on top of a base role.

The pattern:

- **Base roles are sentences, not matrices.** "Manager" is documented in human language, with a link to the full capability list for those who want it. Nobody reads nine-by-twelve grids; give the grid to support staff, not admins.
- **Exceptions are explicit and visible.** "Priya is a Manager, **plus** can view payroll, **minus** cannot invite members." Exceptions render in the person's summary, are searchable ("who has payroll access?"), and carry an optional note ("added for the audit, remove after June"). Exceptions without expiry are where access reviews go to die.
- **Custom roles are a trapdoor, marked as such.** Some customers genuinely need them. Fine — put the builder behind "Advanced", prefill it from an existing role, and show a live preview of the *diff* ("This role is Manager, minus X, plus Y"). A role described as a diff stays comprehensible; a role described as forty toggles becomes archaeology within a quarter.

One more naming rule: role names must survive being read in an accusation. "Can a *Viewer* do that?" works in a tense meeting. "Can a *Purple Tier-2* do that?" does not. Boring names are a security feature.

## "Who can see this?" is a first-class affordance

The most neglected pattern in permission UX is also the highest-leverage: the ability, from any sensitive object, to answer **who can access this thing right now?**

Admins think in people; but in the worst moments — a confidential document, a salary report, an incident — they think in objects. We now build a standard affordance into every access-controlled surface in our products: a small avatars-and-count chip ("Visible to 8 people") that expands to the list, with *why* each person has access. "Sam Whitfield — Manager on Project Fern" is an answer; "inherited from role #7" is an apology.

Two details make this affordance trustworthy:

- **It must be computed, not remembered.** Derive the list from the same resolution code that enforces access. Hand-maintained "who can see this" copy drifts and lies within a month.
- **Show effective access, including the boring paths.** The person who can see the document *because they're an Owner of the whole workspace* is exactly the answer an admin forgets and later regrets. Include the implicit grants and label them.

This one chip does more for customer trust than any compliance badge. On Copperline it became the single most-praised feature in admin research — "I can finally answer the auditor's question in one click."

## Invitations are onboarding, not an edge case

The invitation flow is where permission UX meets growth, and it is consistently under-designed. The mechanics are trivial (a token, an email). The failures are human:

**Invites with no context convert terribly.** "You've been invited to Acme Workspace" from `noreply@` is phishing cosplay. The invite should carry the inviter's name and face, the workspace name, and — critically — *the role being granted, in plain words*: "Priya invited you to join Northwind Ledger as a **Viewer**: you can view the Q3 board pack but not edit it." Informed acceptance is both a conversion tactic and a consent practice.

**The inviter needs a receipt.** After inviting, show the pending state where the inviter can see it, resend, revoke, and — the killer detail — *nudge with a note*. "Still waiting on Dev's acceptance? Resend with a message." Most stalled onboarding is one awkward "did you get my email?" away from completion; build the nudge in. This mirrors a principle from our [onboarding checklist work](/journal/product/onboarding-checklist-patterns): social asks succeed when the product carries the awkwardness for the user.

**Seat limits must never surprise.** If inviting a twelfth member costs money, say so on the invite screen, by name, before the send button. The single most support-ticket-generating pattern in SaaS permissions is the invite that silently becomes a line item.

**Deprovisioning deserves equal design.** Offboarding a person should be one action with a consequences preview: "Removing Priya will revoke her access and reassign 14 open tasks to you. Her comments and approvals remain in the record." The record-continuity sentence matters enormously in finance and health contexts — see how we handled data continuity anxiety in the [Pylon Health telehealth work](/work/pylon-health-telehealth-flow).

## Audit trails as a kindness

The audit log is usually built for the compliance checkbox and designed for nobody: a reverse-chronological firehose of `user_8821 UPDATE role_permissions`. An audit trail that serves humans has three properties:

- **Written in sentences.** "Felix granted Priya permission to view payroll (+exception), with note: 'for the June audit'." Diff-style for machines, prose for people, same event.
- **Filtered by the moments that matter.** Default views: access granted, access revoked, money-adjacent actions, exports. The full firehose stays available, but nobody's first screen should be it.
- **Legible to the subject.** Letting a user see actions taken *on their own account* converts the audit trail from surveillance into fairness. It's the access-controls version of the [notification design principle](/journal/product/notification-design-respect) that transparency calms rather than annoys.

Do this well and something unexpected happens: the audit log becomes a sales asset. Security-conscious buyers ask "can we see who did what?" in every enterprise evaluation; a beautiful, honest answer shortcuts weeks of procurement.

## Where to start

If you're staring at `is_admin` and a customer asking for roles, the sequence we've found works: define three base roles in prose *before* any schema work; build person-centric summaries so every change is explainable; add per-person exceptions with notes; build "who can see this" as a shared component from day one; treat invitations as onboarding. Schema last — the interface decisions above constrain it less than you'd think, and in the right direction.

This is the kind of structural UX work our [product design practice](/services/product) does in fixed-scope sprints — if your permissions are shared-logins-shaped, [talk to us](/contact).

## Key takeaways

- Design around the admin's questions — who is this person, who else can do that, who did this — not around your role schema.
- Ship three named base roles plus per-person exceptions with notes and expiry. Custom roles live behind "Advanced" and are always displayed as diffs.
- Put "who can see this?" on every sensitive object, computed from enforcement code, including implicit grants.
- Invitations carry the inviter, the role in plain words, and the price. Give inviters receipts, resends and nudges. Design deprovisioning with a consequences preview.
- Audit trails written in sentences, filtered by moments that matter, and visible to their subjects become a trust and sales asset.

## FAQ

**How many roles should a product ship with?**
Three, tuned to your domain's real vocabulary. Fewer and enterprises can't distinguish trust levels; more and admins can't keep the distinctions in their heads. Add a fourth only when you can name the recurring human being who needs it. Everything else should be per-person exceptions before it's a role.

**When do we need attribute-based access control (ABAC) instead of roles?**
Later than you think. ABAC earns its complexity when access genuinely depends on context — time, location, data sensitivity tier — not just identity. Most "we need ABAC" requests decompose into roles plus two or three well-chosen attributes. Start role-based with a resolution layer that *could* evaluate attributes, so the upgrade path is a refactor, not a rewrite.

**Should admins be able to impersonate users?**
"View as" — read-only, loudly badged, fully logged — is one of the best support and debugging tools a permission system can have. True impersonation (acting *as* someone) is a liability: it poisons your audit trail, which is the one artefact that must never lie. Build view-as; say no to act-as.

**How do we migrate from a single admin flag to real roles without breaking customers?**
Map the current boolean onto your richest and poorest default roles, migrate overnight, and email every admin a plain-language summary of what their people can now do — inviting corrections. Expect a two-week window of exception requests; treat each as research for your extras drawer rather than a reason to add roles.
