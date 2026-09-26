---
title: "Structured outputs: making LLMs renderable"
description: "Free-text LLM output is a compatibility bug waiting to ship. JSON schema modes, constrained decoding, boundary validation, and safely rendering streamed partial objects."
slug: structured-outputs-reliable-ui
cluster: ai
tags: [ai engineering, structured outputs, json schema, streaming, interface design]
date: 2026-09-02
author: Dev Khatri
keywords: [llm structured outputs, json mode llm, constrained decoding, ai generated ui]
readingTime: 11
---

Somewhere in your product right now, if you shipped an LLM feature the obvious way, there is a regex parsing a chatbot's homework. It extracts the price from "The total comes to approximately **$1,240** (plus GST)" and feeds it to a component that renders a number. It works until the model says "roughly twelve forty" or adds a conversion to yen or writes the sentence in French. Then the UI silently renders nothing, and someone files a bug that takes three days to trace because the failure is a conversation, not an exception.

This is the actual case for structured outputs. Not elegance. Not purity. The moment a language model's words feed an interface, you have an integration boundary, and integration boundaries need contracts. Free text is the absence of a contract. This piece is how we structure LLM output so a React component can trust it — the techniques, in the order we reach for them, and the failure-handling that makes the whole thing production-grade.

## The contract comes first, not the prompt

The mistake we see most often: the prompt is written first, and the schema is reverse-engineered from "what the model tends to say". Invert it. Start from the interface. If the feature is a travel itinerary card, the component needs a list of days, each with a title, a bulleted set of activities, times where they're known, and a confidence-free way to say "time not confirmed". That — not the prompt — is where design starts. We write the TypeScript type before anything else:

```ts
type Itinerary = {
  days: Array<{
    title: string
    activities: Array<{
      name: string
      time: string | null  // null = not confirmed
      notes?: string
    }>
  }>
}
```

Two things to notice. The `null` is deliberate: it's the type system encoding honesty, so the UI can render "time TBC" instead of inheriting the model's tendency to invent a plausible 10:00. And there is no `summary: string` field for vibe text. Every string in a structured output is a liability — the model will happily put a paragraph where you wanted a label. Keep free-text fields short, few, and rendered as plain text, never as markup.

This is the same boundary-validation discipline we apply to [CMS content](/journal/engineering/type-safe-cms-content) — the schema is the product, and the thing upstream of it (authoring UI, model, import script) is a detail. The LLM is just the least cooperative content author you've ever integrated.

## Technique 1: Schema modes and function calling

Every major provider now offers some form of structured output: a JSON mode ("respond with valid JSON"), a schema mode ("respond matching this JSON Schema"), or tool/function calling ("invoke this function with these arguments"). The ranking is simple. Function calling or strict schema mode everywhere you can; JSON mode as a fallback; begging in the prompt ("Respond ONLY with JSON") nowhere.

Two practical notes from the field. First, strictness has a size limit. Schemas with deep nesting, large enums or many optional fields degrade — providers impose caps, and accuracy drops as the schema's token footprint grows. Split big generations into stages (outline first, detail per section) rather than demanding one mega-object. Second, be precise with `required` and `additionalProperties`. Strict modes often require every key to be listed as required with explicit `null` allowed — which is annoying in code and clarifying in design. Half our schema reviews end with a designer realising the component actually can handle every case, and the model wasn't the ambiguous one.

## Technique 2: Constrained decoding when you own the serving

If you're running open-weight models yourself (or through a serving layer that supports it), constrained decoding is the stronger guarantee: the decode step itself is constrained so that tokens outside the grammar are never sampled. Not "the model tries to emit valid JSON and you hope" — invalid JSON is literally unreachable, the way a parser generator makes malformed input impossible rather than unlikely.

Reach for it when the output grammar is rigid (forms, DSLs, structured extraction at volume) and when the cost of one malformed response out of ten thousand is high — think bulk pipelines, not chat. The trade-off is flexibility: constrained decoding can distort generation toward shorter, safer outputs, and grammar compilation adds latency to the first token. For most product UI, a provider's strict schema mode plus validation is enough. Constrained decoding is what you graduate to when the failure budget tightens.

## Technique 3: Validate at the boundary, always

Whatever the providers promise, treat model output as untrusted input — an [LLM feature is an integration](/journal/ai/shipping-llm-features-lessons), and integrations get validated. Every structured response passes through a parser that checks the shape, coerces where safe (`"yes"` → `true` is not safe; absent optional keys → defaults is), and returns either a typed value or a structured failure. In TypeScript that's a schema library at the boundary; the principle matters more than the library.

Crucially, validation errors should be *actionable back to the model*. When validation fails, we don't just retry the same prompt and pray — we send the validation error itself back as context: "The field `days[2].activities` was a string; the schema requires an array. Correct the output." Models are extremely good at fixing concrete, specific complaints. This repair loop recovers the overwhelming majority of failures, and it's a one-time engineering cost. Log every repair, though: a repair rate that creeps from 0.4% to 2% is your earliest warning that a prompt change or model version has drifted, and it feeds straight into the [eval harness](/journal/ai/evals-practical-guide) as a first-class metric.

## Technique 4: Streaming partial objects safely

Here's where it gets interesting, because users should not wait for the whole object. A five-section itinerary that takes eleven seconds to generate should render its first day in under two. That's the thesis of [streaming UX](/journal/ai/streaming-ux-patterns) — latency should feel like thought, not loading — but streaming raw token text is easy and streaming *structured* output is where teams get hurt.

The problem: a partial JSON document is not a document. `{"days": [{"title": "Arrival in Hoba` is valid tokens and invalid JSON. The solutions, in order of preference:

- **Incremental parsers.** Libraries exist that parse partial JSON and yield the largest complete value available at each step. You re-parse on every token batch and render whatever fully-formed subtrees exist — day one renders while day three is still arriving. This is the sweet spot for most products: one dependency, no model-level changes, and rendering logic that just consumes the growing object.
- **Stream-friendly schema ordering.** Put fields in the order the UI reveals them. If the itinerary title renders at the top, generate it first. Schemas are ordered documents; use that.
- **Section-by-section generation.** For very large payloads, request each section as its own call against a shared outline and stream the sections in. More requests, cleaner merge logic, and natural parallelism.

Rule one of partial rendering: a component that receives an incomplete subtree renders its honest incomplete state — a skeleton row, a "time TBC" line — or nothing at all, and never a guess. Partial data is what nullability is for. If you find components inventing display values for missing fields, the schema has failed you.

## Technique 5: Let the UI vocabulary constrain the model

The most powerful use of structure isn't extraction — it's constraining generative UI. When the model composes an interface (a dashboard layout, a form, a next-steps panel), the right architecture is a closed vocabulary: the model chooses from a fixed set of registered components with typed props. It emits `"component": "statCard", "props": {...}` — it does not emit HTML, it does not emit CSS, and it absolutely does not emit JavaScript to run.

This gives you three protections at once. Injection becomes structurally hard, because the model can only arrange whitelisted parts. Visual coherence is guaranteed, because every outcome is made of your design system's actual components. And evaluation gets tractable — you can assert on layouts and prop values in tests instead of judging prose. It's the difference between hiring a contractor who can only use your kitchen's existing fixtures and handing them an angle grinder.

## The honest costs

Structure isn't free. Schema tokens eat context on every call — large strict schemas on [cost-sensitive features](/journal/ai/llm-cost-engineering) can add meaningfully to the bill, which is another argument for small staged schemas. Extremely constrained outputs can flatten model quality on creative tasks: a model forced into a box writes box-shaped text, so for generative copy we usually generate freely first and extract structure in a second, cheaper pass. And schemas ossify: once a contract is in the prompt, changing it touches prompt, validator, component and tests. Version your schemas like APIs, because that's what they are.

## Key takeaways

- Treat any LLM output that feeds a UI as an integration boundary. Free text is a missing contract, and the UI will pay for it eventually.
- Write the TypeScript type before the prompt. Nullability is how the type system encodes "the model doesn't know".
- Prefer strict schema modes or function calling over prompt pleading; use constrained decoding where you own serving and the failure budget is tight.
- Validate at the boundary, and feed validation errors back to the model as a repair loop. Log repair rates as a drift metric.
- Stream structured output with incremental parsers and schema ordering that matches reveal order. Incomplete subtrees render honest skeletons, never guesses.
- For generative UI, give the model a closed vocabulary of components with typed props. Never let it emit markup.

## FAQ

### Is prompt-only "respond in JSON" ever acceptable?

For a throwaway prototype, fine. For anything a user touches, no — you will eventually ship a parse failure to production. The cost of doing it properly is one schema and one validation call.

### Won't strict schemas hurt answer quality on open-ended tasks?

They can. Split the pipeline: let the model think and draft freely in one step, then run a small extraction or formatting pass into the schema. Cheap models are excellent at "turn this prose into this shape".

### How do we test structured-output features?

Golden inputs with expected shapes and spot-checked values, run on every prompt or model change — the same harness described in our [evals guide](/journal/ai/evals-practical-guide). Add the repair rate and schema-validation failure rate as production metrics.

### Should citations and sources be part of the structured output?

Yes — citations are fields on the object, not decorations on prose. That's its own discipline; we cover it in [citation design for AI answers](/journal/ai/citation-design-ai-features).
