---
title: "LLMs in the design process: acceleration with a seatbelt"
description: "How we use LLMs in the studio: synthetic drafts, copy pressure-testing, edge-case generation — and the verification rules that keep AI-assisted design honest."
slug: ai-in-design-process
cluster: ai
tags: [ai, design process, prototyping, research, workflow]
date: 2026-09-02
author: June Okafor
keywords: [llm design process, ai prototyping workflow, synthetic user research limits, ai-assisted ux design]
readingTime: 10
---

Two years ago our studio's answer to "do you use AI in design?" was a sheepish "for moodboards, sometimes". Today it's threaded through most of our process — drafting synthetic personas we'll later replace with real interviews, breaking our own copy before users can, generating the thirty edge-case states nobody sketches. We've also watched it quietly degrade work when used lazily: the persona that sounds plausible and teaches nothing, the "user feedback" that is vibes in a trenchcoat. The difference is not the tool. It's whether there's a seatbelt — rules about what the machine's output is *for*, and what must never skip verification.

This is our current rulebook. It will age; the principles shouldn't. And a caveat up front: nothing here replaces real research. If you read this article as permission to skip interviewing users, read [our JTBD script](/journal/product/jtbd-interviews-that-work) instead and come back.

## Where LLMs genuinely accelerate design

Three jobs have proven themselves repeatedly, with numbers attached.

**Copy pressure-testing.** Before a headline ever meets a user, we make it survive the machine's confusion. We feed a model the copy with roles: "You are a sceptical CFO who has been burned by three SaaS vendors. What is this page claiming, what don't you believe, and what would you ask next?" The output isn't truth — it's a cheap adversarial reader available at 11pm. On a recent marketing-site sprint, pressure-testing surfaced the two questions the client's FAQ didn't answer; both later appeared verbatim in real interview transcripts. Cost: an afternoon. The technique pairs naturally with our [voice guardrails](/journal/ai/ai-brand-voice-guardrails) work — you can also ask the machine to grade drafts *against* the voice spec and catch drift before review does.

**Edge-case and state enumeration.** Humans design the happy path beautifully and the fifth-deepest error state never. We now generate the inventory mechanically: paste the flow spec, ask for every state the system can be in — loading, partial, empty, denied, expired, rate-limited, offline, optimistic-then-rejected — then have a designer triage the list. A kanban tool we designed last year had 41 distinct states identified before a single screen was drawn; the previous record in the studio was "we'll figure it out in QA". This is the single highest-leverage use we've found, because the failure mode it fixes — the unconsidered state — is precisely where error messages and [empty states](/journal/product/empty-states-design) go to die.

**First-draft divergence.** Fixing the blank canvas. When a brief says "dashboard for logistics coordinators", the model produces six mediocre-but-distinct structural directions in ten minutes, and mediocrity is fine: the point is to give the critique session something to push against. We treat these as conversation starters, never as candidates. The card you keep is rarely in the output; the *vocabulary* to reject the others almost always is.

## Where it quietly poisons the work

**Synthetic users as research.** Here is the line, held in red: LLM-generated "users" may inform *hypothesis formation* and may never inform *decisions*. A model asked to react to your pricing page will produce the median opinion of the internet about pricing pages. It cannot tell you that your actual customers churn because the invoice export breaks their accountant's workflow — no pattern in its weights contains your users' specific lives. We use synthetic personas in exactly one sanctioned way: to stress-test our research plan ("what would this persona care about that our interview script doesn't ask?"). The moment synthetic output starts substituting for real research that gets read and argued with, you are designing for a fictional market that validates you back, having never once interviewed it.

**Plausible sameness.** Models regress to the mean — it's the job description. Visual directions, naming territories, brand voices all drift toward competent-generic ("sleek, modern, trustworthy"), which is why the divergence step above requires a human with taste at the wheel. If you can't articulate what's wrong with the machine's directions, you don't have a direction yet either.

**Confidence laundering.** The model writes fluent rationales for anything, including bad ideas, and fluent rationale is dangerous in a critique. We've learned to strip generated justifications before pinning work on the wall — critique the artifact, not its press release.

## The seatbelts: five rules we actually enforce

1. **Provenance labels on everything.** Every AI-derived artifact in our files carries a tag — `synthetic` — visible in the filename, the FigJam stickie, the research repo. Nobody should ever mistake a generated persona quote for a real one. This rule has teeth: we've watched unlabelled synthetic insights survive three rounds of meetings and surface in a client deck as "user sentiment". Once is enough; the tagging rule exists because of that week.
2. **The machine proposes, the sprint decides.** Generated options must pass the same Thursday critique as human ones — same specificity bar, same "be specific or be quiet". Output fluency earns no leniency. If anything the bar for generated rationales is *higher*, because they're free.
3. **No synthetic data ships.** Wireframe copy can be drafted by the machine; production copy gets a human writer and, for anything user-facing in a shipped AI feature, passes our responsible-AI review. The seam where "prototype placeholder" becomes "shipped content" is where most AI-assisted embarrassment lives.
4. **Verify everything factual, always.** When the machine summarises competitor features or cites "industry benchmarks" during discovery, every claim gets checked against primary sources before it enters a strategy document. The model's citation of a real-sounding Gartner stat is a genre of fiction. We built an eval habit for our *products* — [evals before features](/journal/ai/evals-practical-guide) — and we apply the same suspicion to our *process* inputs.
5. **Time-box the assist.** If a prompt thread exceeds twenty minutes without producing a decision, close it. The tool's economics seduce you into polishing commodity outputs; twenty minutes of generated divergence is worth two hours of it, not twenty.

## What this changed about staffing and speed

Honest numbers from the studio: discovery phases compress by about a third — mostly because synthesis of sticky-note chaos into opportunity framings is now hours, not days, and a human spends the saved time on the judgement calls. Visual concept phases compress less (maybe 15%) because the divergence stage was never the long pole; decision-making was, and decision-making barely accelerates. The team shape didn't change: we did not replace a researcher with a prompt writer. We gave the researcher a faster draught-horse and kept the researcher. Studios claiming AI halves their design team are usually telling you they skipped the research.

The deeper shift is in what juniors learn. Generated first drafts mean a junior designer's training moves from *production* to *critique* earlier — which is good, provided someone senior keeps enforcing taste, because the machine will happily keep them company in mediocrity forever. Our apprenticeship now includes "marking the model's homework" as a formal exercise: critique a generated flow for an hour, list every assumption it made, check which ones were wrong. It's the fastest empathy-for-constraints training we've found.

## Key takeaways

- Use LLMs where acceleration is real: copy pressure-testing, edge-case enumeration, first-draft divergence. The blank canvas and the unconsidered state are where the hours live.
- Synthetic users inform hypotheses, never decisions. The model knows the median internet opinion, not your customers' lives.
- Tag every AI-derived artifact `synthetic` and keep the tag visible through every file and deck. Provenance rot is the silent killer.
- Strip generated rationales before critique; fluent justification is the machine's most dangerous skill.
- Time-box prompt threads at twenty minutes. The tool's economics reward polishing outputs that don't deserve it.
- Speed gains concentrate in synthesis and divergence, not decision-making. Staff accordingly — and keep juniors critiquing, not just generating.

## FAQ

**Isn't pressure-testing copy with an LLM just testing what the model thinks of the copy?**
Yes — and that's still useful, because the model is a decent proxy for "a literate sceptic with no context". It reliably surfaces ambiguity, unsupported claims and missing answers. What it can't do is tell you whether your specific buyer believes you. That still needs humans, which is why pressure-testing feeds interview scripts rather than replacing them.

**How do you stop clients from treating synthetic research as real?**
By showing them the tag. Every synthetic artifact we present is marked, and we walk clients through what it can and can't support in the same meeting we introduce it. Clients don't misuse synthetic research because they're reckless; they misuse it because nobody told them where the wall was. Draw the wall out loud, early.

**Which model or tool do you recommend for the studio workflow?**
Deliberately naming none — the tools change quarterly and the rules don't. Pick whatever your team can wire into serious workflows with a [prompt library treated like a design system](/journal/ai/prompt-design-systems): versioned prompts, shared examples, one owner who prunes. The discipline outlasts any vendor.

**Does using LLMs in concepting dilute the studio's craft identity?**
Only if the craft was decoration. Our craft was always in selection, editing and taste — generating more raw material makes those muscles *more* load-bearing, not less. The studios at risk are the ones whose process was already producing the median.

**What would make you change these rules?**
Evidence. Every rule here is one embarrassing incident away from revision, and we revise the rulebook twice a year in the open, the same way we update our approach to [how we work](/approach). If a rule stops preventing real failures, it gets cut; the rules are tools, not scripture.
