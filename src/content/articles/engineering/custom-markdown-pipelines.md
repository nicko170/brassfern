---
title: "Rolling your own markdown pipeline (and knowing when to)"
description: "When MDX stops paying rent: deterministic rendering, frontmatter validation at build time, link auditing of prose, and owning your content format end to end."
slug: custom-markdown-pipelines
cluster: engineering
tags:
  - content-engineering
  - markdown
  - build-tooling
  - static-sites
date: 2026-04-09
author: Tomás Reyes
keywords:
  - markdown pipeline
  - custom markdown renderer
  - content validation
  - static site content
  - build tooling
readingTime: 9
---

Every content-heavy site starts with the same stalemate. The writers want markdown: portable, diffable, reviewable in a pull request. The developers want MDX or a headless CMS's component blocks: escape hatches, embedded widgets, power. The site ends up with a format nobody fully owns — markdown that secretly executes JSX at runtime, frontmatter that's validated by hope, internal links that rot silently as routes change.

We've built this site — and a dozen client editorial platforms — on a deliberately unfashionable alternative: **a small, custom, brutally validated markdown pipeline we own end to end.** Roughly a thousand lines of boring code that parses, validates, renders and indexes every piece of content, fails the build loudly when anything is wrong, and renders deterministic HTML that needs no JavaScript to be correct. This is how it works, what it buys you, and — honestly — when you should absolutely not build one.

## When off-the-shelf stops paying rent

MDX is wonderful for documentation sites where prose and live components genuinely interleave — a design-system docs site with runnable examples is MDX's home ground. But most editorial content is not that. Most editorial content is headings, paragraphs, lists, quotes, tables, links, images and code fences. When you adopt MDX for that, you're importing:

- A runtime (or a heavy compile step) for features your corpus uses on two percent of pages.
- A failure mode where a typo in *prose* — a stray `<` in a sentence about generics — becomes a build error with a stack trace from a compiler plugin.
- A dependency chain (parser, plugins, sanitisers) that upgrades on its own schedule and occasionally redefines what your archive means. We've [covered dependency discipline generally](/journal/engineering/dependency-hygiene-client-code); content pipelines are where it bites hardest, because the blast radius is every page you've ever published.

The tell that you should roll your own: you can list your markdown's entire feature set on one hand, and you've written more glue code configuring plugins than the plugins save you. At that point the format is simple enough to own — and owning it means the rules become *yours*.

## The four stages, in order of importance

A content pipeline is four small programs wearing a trenchcoat. Ours, with the honest labour distribution:

**1. Validate.** This is 60% of the value and the stage off-the-shelf tools treat as an afterthought. Every file's frontmatter is checked at build time against a schema — required fields, description length bounds, dates in the accepted range, tags that exist. Authors are validated against the team roster, so a typo'd byline fails the build instead of silently orphaning an article from its author page. This is the same philosophy as our [shared validation contracts](/journal/engineering/schema-validation-shared-contracts) piece: one schema, enforced everywhere, at the cheapest moment. Invalid content doesn't get a warning and a shrug; it gets a red build and a precise error naming the file, the field and the fix.

**2. Render.** Markdown → HTML, once, deterministically. Deterministic is the key word: same input, same output, no clocks, no random IDs, no network. Determinism is what makes renders cacheable, snapshot-testable, and safe to prerender — the same HTML hydrates on the client without a flicker of mismatch. Our renderer is a few hundred lines over a CommonMark parser, emitting exactly the elements our stylesheet knows: headings with stable slug IDs (so tables of contents and deep links work), fenced code with the language as a class, tables, blockquotes, images with dimensions. Nothing else. Components don't exist at this layer, which is a feature: prose cannot call components, so prose can never break a build's rendering half an hour before a deadline.

**3. Audit.** The rendered HTML is parsed and every root-relative link is checked against the actual route table — every article, case study, service, industry, tag and demo that exists. A link to a renamed article fails the build. A link to a service page that got restructured fails the build. This single check changed how our writers work: internal links stopped being liabilities and became assets, because *someone* — the build — is keeping them honest. Rot doesn't accumulate; it's caught in the pull request that causes it.

**4. Index.** One pass over validated content produces the search index, the tag pages, the pagination metadata, the sitemap entries, the RSS feed and the "related content" graph from a single in-memory pass. Derived data has exactly one source, computed once, at build time. We've written about [rolling your own search](/journal/engineering/rolling-your-own-search) separately; the short version is that a build-time index of a corpus this size is a few dozen kilobytes and searches instantly, no service required.

## Frontmatter is a database schema — treat it like one

The frontmatter block is not metadata decoration; it's the row in your content database, and the discipline that makes a corpus of hundreds of articles manageable is treating it with database seriousness.

Every field has a type and a rule. `description` has a character floor and ceiling because it becomes the meta description and the social card text — too short reads like a shrug in a link preview, too long gets truncated mid-clause. `date` has a window. `keywords` and `tags` serve different masters (search engines vs. on-site taxonomy) and are both enforced. Writers see violations as build errors with the file path attached — not as a style guide they were supposed to have memorised.

This is the headless-CMS lesson applied in reverse. When teams [migrate to a headless CMS](/journal/engineering/headless-cms-migration-runbook), the hard part is never the API — it's that years of unstructured fields have quietly become structure nobody documented. A validated markdown corpus gives you the same guarantee from day one: if the build passes, every piece of content satisfies the contract, and a future migration is a transform, not an archaeology dig.

## The format stays yours

The deepest reason to own the pipeline is strategic, not technical. A corpus of validated markdown is *liquid*: it survives redesigns (the renderer changed, the format didn't), framework migrations, and headless-CMS experiments, because the source of truth is plain text with a strict contract rather than a vendor's block schema.

It also deprecates gracefully. When we needed images with art-directed crops, we didn't bolt on a plugin — we added one image construct to the renderer, one field to the schema, one validation rule, and the audit kept every existing article valid by construction. Three files changed. That is what "owning the format" means concretely: the changelog of your content pipeline reads like product decisions, not dependency archaeology.

One more quiet benefit: [type-safe content](/journal/engineering/type-safe-cms-content) end to end. The build script generates TypeScript types from the same schema that validates frontmatter, so the React layer that renders article indexes *cannot* reference a field that doesn't exist — the compiler enforces what the validator established.

## When not to roll your own

Honesty section, because this pattern has real edges:

- **Non-technical authors publishing unassisted.** If your editors need a GUI and a publish button, markdown-in-git is the wrong substrate entirely; build the CMS. The pipeline is for teams where content moves through pull requests.
- **Genuinely interactive documents.** Runnable examples, embedded playgrounds, computed figures — that's MDX's job or a custom block layer's job, and hand-rolling *that* is a much bigger commitment than hand-rolling a prose renderer.
- **Corpora measured in the tens of thousands.** Our pipeline is a full pass per build, minutes at most. At a hundred thousand documents you need incrementality a bespoke tool won't have, and the ecosystem's build-graph machinery starts paying its keep.
- **Teams that won't maintain it.** A thousand lines you own is still a thousand lines. If nobody wants to be the pipeline's owner, the plugin ecosystem's mediocrity beats your masterpiece's neglect. Ownership is the cost; everything else is the dividend.

## Key takeaways

- If your markdown's real feature set fits on one hand, the format is ownable — and ownership buys validation, stability and liquidity that plugins don't.
- The pipeline is four stages: validate (the most valuable), render deterministically, audit every internal link against the route table, index everything derived in one pass.
- Frontmatter is a database schema with types, bounds and build-time enforcement — invalid content fails the build with the file and the fix, not a shrug.
- Deterministic rendering enables caching, snapshot tests, clean prerendering and flicker-free hydration.
- Don't roll your own for interactive documents, GUI-driven editorial teams, huge corpora, or teams without a willing owner.

## FAQ

**Why not just validate MDX strictly instead?** Because strictness isn't MDX's problem — expressive power you don't need is. Strict MDX still carries the compile chain, the prose-vs-JSX failure modes and the upgrade treadmill. If your corpus is prose, render prose; reserve MDX for the corpus that earns components.

**Doesn't a custom renderer become its own maintenance burden?** It's a real burden and a bounded one — ours has changed meaningfully four times in two years, each change a deliberate product decision with a diff you can read in a sitting. Compare the hidden maintenance of a plugin chain, which bills you in surprise majors and subtle re-renders of your archive forever.

**How do you handle rich embeds — videos, tweets, demos?** As *routes*, not as markdown. Rich surfaces live in the application layer, linked from the prose. Prose references them; it doesn't contain them. This keeps the format stable and pushes interactivity to where interactivity is engineered and tested.

**What breaks first as you scale?** The single full-pass build, and author experience. Both have known exits: incremental rebuilds keyed on content hashes, and a lightweight editing UI that writes the same validated markdown. Neither changes the contract — which is the whole point of keeping the contract yours.

---

*Content pipelines are the quiet machinery under every [editorial platform and marketing site](/services/websites) we ship. See [how we scope them](/approach), or [start the conversation](/contact).*
