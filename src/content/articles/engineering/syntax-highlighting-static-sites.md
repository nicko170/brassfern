---
title: "Syntax highlighting with zero runtime"
description: "Syntax highlighting with zero runtime: tokenise at build time, theme code with design tokens, keep language support honest, ship an accessible copy button."
slug: syntax-highlighting-static-sites
cluster: engineering
tags:
  - performance
  - static-sites
  - developer-experience
  - css
date: 2026-07-30
author: Tomás Reyes
keywords:
  - syntax highlighting static
  - code blocks web
  - build-time rendering
  - technical blog engineering
  - developer docs design
readingTime: 9
---

View source on a lot of very good engineering blogs and you will find something odd: a page full of static code samples shipping 300 kilobytes of JavaScript whose only job is to colour words that were already written. Prism or highlight.js boots, re-parses the DOM the server just rendered, swaps in a second tree of `<span>`s — and if you're unlucky, does it visibly, after paint, so the reader watches every keyword blink into colour.

We stopped paying that tax years ago. Every code block on a Brassfern-built content site — including this one — is highlighted **at build time**, arrives as plain HTML with classes, and ships exactly zero highlighting JavaScript. This article is the whole recipe, including the parts that go wrong.

## Why runtime highlighting is a tax with no refund

Client-side highlighting costs you four things, and only one of them is bytes:

1. **The parse happens on the reader's device**, on the main thread, at the worst possible moment (during load, on a phone, on hotel Wi-Fi). A docs page with forty snippets can spend 200ms+ of scripting doing work that was already done once — when the author wrote the code.
2. **It fights your rendering pipeline.** Runtime highlighters want to own the DOM inside `<pre>` blocks, which means hydration mismatches, double-render flashes, and a permanent exception in your [Core Web Vitals budget](/journal/engineering/core-web-vitals-field-guide) you explain to nobody.
3. **The theme is trapped in a library's CSS.** Your code colours end up on a different token system than the rest of the page, so dark mode and rebrands leave code blocks behind as little fossil beds of the old palette.
4. **It lies to the reader's clipboard and screen reader** if implemented carelessly — line numbers that copy into the paste, tokens announced as separate text runs.

Moving tokenisation to build time makes all four problems someone else's — specifically, your laptop's, once, per build.

## The build-time pipeline

The architecture is three lines long: wherever your Markdown/MDX is compiled to HTML, a transform runs code blocks through a syntax highlighter, and the output is HTML with a stable, documented set of token classes.

```
// the entire idea, in pipeline form
markdown → mdast/hast → for each <pre><code class="language-x">
         → tokenise(code, x) → annotated hast → static HTML
```

We use Shiki for this — it runs TextMate grammars (the same engine as VS Code), so highlighting quality is the best available and language coverage is enormous. Expressive Code wraps it nicely if you want file titles, line markers and diffs as first-class features. Lezer-powered highlighters are a faster, smaller alternative with lower fidelity for exotic languages. Pick the fidelity level your content actually needs; both are dramatically better than shipping the parser to the browser.

The critical decision — the one that makes everything downstream pleasant — is **emitting classes, not inline styles**. Shiki will happily inline the colour of every token into `style` attributes, which produces bloated HTML and colours you can't retoken. Force it to emit semantic classes instead (`.tok-keyword`, `.tok-string`, `.tok-comment`…), and now your code is styled by your stylesheet, meaning it participates in your design system like a citizen.

On a ~200-page technical site this adds a couple of seconds to the build and removes a parser, a theme bundle and a runtime pass from every page, forever. That is the best exchange rate in web performance.

## Language support economics

"Support every language" is how a build-time pipeline quietly balloons to ten seconds per page. TextMate grammars are not free — loading 150 of them into the highlighter costs real build time, and most content sites use eight.

So we apply honest economics:

- **Load the languages your content actually contains.** We enumerate them from the corpus and wire exactly that list. A new language appearing in a draft fails the build with the *name* of the language to add, so there is no silent fallback to un-highlighted code.
- **Treat `text` and `console` as first-class languages.** Half the code on a docs site is shell output. Highlighting it as if it were JavaScript produces nonsense colours and erodes trust in the highlighting itself.
- **Alias deliberately.** `js`, `jsx`, `javascript` should map to one grammar; `tsconfig` should render as JSON with comments. The alias table is documentation of what your site claims to speak fluently.
- **Say what you won't support.** If a content team needs APL, that is a build-time decision made in a pull request, not a runtime guess.

## Theming: code is a design surface

Because tokens are classes, the code theme is a set of entries in your token layer next to everything else — the same discipline we apply in [testing design tokens in CI](/journal/engineering/design-tokens-pipeline-ci). A handful of variables covers essentially every language:

```
--code-text; --code-comment; --code-keyword; --code-string;
--code-number; --code-fn; --code-type; --code-punct;
--code-bg; --code-line-hi;   /* highlighted lines */
```

Craft notes from doing this across a dozen sites:

- **Pull hues from the brand palette, darkened or brightened to pass contrast.** Code on this site is fern, brass and clay on paper — nobody else's code looks like it, which is the point. If your code blocks are interchangeable with every Tailwind blog, you left brand equity on the table. Our [/colophon](/colophon) page shows the live specimens.
- **Contrast-check code themes separately.** Body-text contrast rules apply, and comments are the universal failure — designers love a whisper-quiet comment colour that fails WCAG. Comments are half the teaching in a snippet; give them the respect of 4.5:1.
- **Dark mode is a token swap, not a second theme file.** Because the classes are semantic, dark mode is just different values for the same variables. If you find yourself maintaining two Shiki themes, you've gone wrong — go back to classes.
- **Italic and weight are free flavour.** A keyword in italic small caps or a string in a warmer tone costs nothing at runtime. Spend it sparingly; code must stay scannable first.

## The features around the code

Highlighting is table stakes. The features readers actually love are adjacent:

**Line highlighting and diffs** should be expressed in the fenced-code info string (```ts {3-5} or ```diff) and resolved at build time to classes — `.line--hi` gets a tinted row. This is where build-time wins hardest: a runtime line-highlighter does layout math on the client; ours is a background colour.

**The copy button is the only JavaScript a code block needs**, and it deserves the same care as any component: a real `<button>` (not a div), visible on keyboard focus as well as hover, with its "Copied" confirmation announced via a polite live region — [accessible components are an engineering practice](/journal/engineering/accessibility-as-engineering-practice), and a copy button that screen readers can't confirm is a copy button that half your readers distrust. Strip line numbers and diff markers from what lands on the clipboard; copy *the code*.

**Filenames and language labels** render as an un-selectable caption bar above the block. A filename — `src/lib/search.ts` — does more teaching than ten lines of prose, and costs one `<span>`.

## The escaping pitfall (read this twice)

The one genuinely dangerous part of this pipeline: **you must escape the raw code text before tokenisation inserts markup, and never re-escape the highlighter's output.** Escape after highlighting and you turn the highlighter's own spans into visible `&lt;span&gt;` text. Escape nothing and a snippet containing `</script>` inside Markdown that eventually lands in a `<script type="application/json">` inline payload can break out of the document.

The safe order, which we encode as a lint rule on the pipeline:

1. Take the raw code string from the Markdown source.
2. Tokenise it, producing annotated HTML — the transformer escapes text nodes as it builds them (Shiki does).
3. Emit *only* the transformer's output, and treat any further string-concatenation of that HTML with suspicion in review.

Also: never pipe highlighted HTML through a generic Markdown renderer a second time, and if code originates from a CMS (editors paste strange things), run the final document through your normal HTML sanitiser as a backstop. Build-time rendering moves the XSS surface from runtime to build time — same sewer, one grate. The good news, per the [web platform baseline](/journal/engineering/web-platform-baseline-2026), is that sanitisation APIs are finally standard enough to do this without a dependency.

## Key takeaways

- Runtime syntax highlighting re-does yesterday's build work on the reader's phone; tokenise during the Markdown compile and ship annotated HTML.
- Emit semantic token classes, never inline styles — that single decision makes code a first-class citizen of your token system, theming and dark mode.
- Load only the grammars your corpus uses; fail the build loudly on unknown languages; treat shell output and aliases as first-class concerns.
- Code themes come from the brand palette at passing contrast, with comments at 4.5:1 — the comment is where the teaching lives.
- Line markers and diffs belong in the info string at build time; filenames belong in the caption; the only runtime JS is a real, focus-visible copy button with a live-region confirmation.
- Escape text nodes during tokenisation, emit only transformer output, and sanitise final documents when content comes from a CMS.

## FAQ

**Shiki, Prism or highlight.js — does it matter at build time?**
At build time the trade-offs invert: bundle size stops mattering and fidelity becomes the deciding factor. Shiki (TextMate grammars) gives the most accurate highlighting and the widest language support, at the cost of slower builds and heavier grammar loading. Prism's grammar files are lighter and fine for mainstream languages. If you only ever document TS, Python, Bash and JSON, either works — choose on theme control, not speed.

**How do I keep it fast with hundreds of code blocks?**
Cache tokenisation results keyed on a hash of the code + language, reuse one highlighter instance across the whole build, and load grammars lazily per language on first encounter. A warm cache makes rebuilds effectively free; a cold build on our largest docs site adds under three seconds.

**Won't class-based themes make HTML bigger?**
Yes — annotated HTML is typically 2–4× the raw code size — but it compresses superbly (class names repeat endlessly, which is what gzip eats for breakfast) and you're *removing* a 100–300KB JS parser/theme from the critical path. On the wire and in practice, it's a large net win.

**What about interactive code, like runnable examples?**
That's a different component, honestly named. Render the static, highlighted block for everyone, then enhance in place: a "Run" that lazy-loads the sandbox runtime only on interaction. Progressive enhancement gives you readable code on a dead connection *and* a playground on a good one — this principle is basically [islands architecture](/journal/engineering/islands-architecture-when) wearing a hard hat.
