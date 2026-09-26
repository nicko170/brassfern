---
title: "Data visualisation on marketing pages, honestly"
description: "Charts on marketing pages answer to different rules than dashboards. Honest axes, motion in service of comprehension, and the table that saves your accessibility audit."
slug: charts-on-marketing-pages
cluster: web-design
tags: [data visualisation, marketing sites, accessibility, motion design]
date: 2026-03-12
author: June Okafor
keywords: [data visualisation web, chart design marketing, accessible charts, SaaS marketing pages, design honesty]
readingTime: 9
heroImage: /images/articles/web-design/charts-on-marketing-pages.jpg
heroAlt: "A hand-drawn ink line chart on cream card beside a brass ruler and a pressed fern frond, one clean green line rising gently with a small annotation arrow."
---

Somewhere around 2016 every SaaS homepage acquired a little animated line chart. It swoops up and to the right as it enters the viewport. It shows nothing, measures nothing, and would fail any semantics exam you sat it down for. It is a decoration wearing a chart's uniform — and it's the main reason decision-makers have stopped believing charts on marketing pages at all.

That's a shame, because an honest chart is one of the highest-converting elements a marketing page can carry. A claim in prose is an assertion. A claim with an axis, a unit and a source is an argument. The gap between the swoosh chart and the real thing is what this article is about: the rules we apply whenever data visualisation leaves the dashboard and walks onto a marketing page.

## Rule zero: the chart must survive the question "of what?"

Every chart on a marketing page should pass one test: a reader can answer "what, exactly, is being measured, over what period, from what source?" without leaving the component. That means the chart carries its own labels, its own units, and a one-line provenance note ("142 production sites, measured May 2026, CrUX field data").

If the answer to "of what?" is "vibes," the honest move is to delete the chart — not to dim the axis labels and hope nobody asks. This is not puritanism. It's strategy. The visitor on a marketing page is pre-sceptical, and a chart that withholds its labels reads as a claim you don't want examined. The same instinct that governs our [comparison pages](/journal/web-design/comparison-pages-that-convert) applies here: believability is the scarce asset. Everything on the page either compounds it or spends it.

## Product charts and marketing charts are different species

In a dashboard, the chart's job is to let someone *interrogate* data: filter, hover, drill, export. On a marketing page, the chart's job is to make one argument legible to someone who will give it four seconds. Confusing the two produces the classic failure: a full analytics widget dropped onto a homepage, complete with date pickers and a legend of nineteen series, "because we already built it for the product."

Marketing charts get different treatment:

- **One series, one point.** If the argument has three parts, use three small charts in sequence rather than one chart with three lines. Small multiples beat legends — a legend forces the reader to hold a colour-to-meaning mapping in working memory while reading, which is exactly the memory the argument needs.
- **Direct labels, not legends.** Label the line at its end. Label the bars on the bars. The legend is a tax you charge people for your layout convenience.
- **Annotated, not titled.** "±40 ms faster after the edge move" with an arrow beats "Response time (Q2)." A title names the exhibit; an annotation makes the argument. Our dashboard rule of thumb — answer first, chart second, from [dashboard design: answer first, chart second](/journal/product/dashboard-design-hierarchy) — gets *stricter* on marketing pages, not looser.
- **Pre-zoomed to the interesting window.** If the story is a step change in March, the x-axis should start in February, not in 2019.

## The axis is where honesty lives

Most marketing-chart sins are axis sins. The canonical offender is the truncated y-axis on a bar chart, which turns a 6% improvement into a visual doubling. Bars encode value through *length*, so truncating the axis is not an editorial choice — it's a falsehood rendered in geometry. Line charts can legitimately crop their y-axis (they encode position and slope, not length), but when they do, the baseline deserves a note or a break mark.

The other axis sins, in order of frequency:

1. **Cherry-picked ranges.** Showing 90 days when 12 months tells an embarrassing different story. If you zoom, say why, and link the full series.
2. **Dual y-axes.** Two scales on one chart let any two squiggles correlate if you rotate the dials enough. If both series matter, stack two charts sharing an x-axis.
3. **Smoothed-away noise.** A 12-point moving average applied silently makes every trend look destined. State your smoothing, or don't smooth.
4. **Inconsistent intervals.** Weekly points and one quarterly point on the same line, evenly spaced. Time axes are not decorative.

A useful internal heuristic: could a hostile screenshot of this chart embarrass us on social media? If yes, the axis is doing editorial work it shouldn't.

## Motion that explains, motion that decorates

Marketing charts arrive animated because somebody read that "motion increases engagement." It does — and it also increases misunderstanding when applied carelessly. The distinction we hold: **motion should encode a change in the data or the reader's relationship to it, never just celebrate the chart's existence.**

Good: drawing a line left-to-right on scroll-in, because direction is information (time flows that way). Good: transitioning between two filter states so the reader sees which points moved — object constancy is a genuine perceptual aid, and it's the same principle behind [motion that earns its keep](/journal/web-design/motion-that-earns-its-keep). Bad: bars that grow, shrink back, and grow again on a loop. Bad: a counter that spins from 0 to 10,000 every time you scroll past it — a southbound detour into carnival.

Two engineering notes that are really design notes. First, scroll-triggered animation must not wait until the chart is fully in view on a fast scroll, or fast scrollers never see the settled state — trigger early, or settle instantly if the animation was skipped. Shipping this reliably is a frame-budget problem, the kind covered in [animation is engineering](/journal/engineering/animation-engineering-60fps). Second, `prefers-reduced-motion` doesn't mean "show a broken chart"; it means render the final state immediately. The chart must be fully legible with zero animation, because for many of your readers — vestibular conditions, battery-saver mode, old hardware — that's the version they'll get.

## The accessibility layer is a table

Here is the part everyone skips and no one should: a chart is a picture of data, and the data is the content. Screen readers, copy-paste users, spreadsheet-minded analysts and search crawlers all want the numbers, not the SVG paths. The robust pattern:

- The chart figure carries a short accessible name and a one-sentence summary ("Line chart: median LCP fell from 4.1s to 1.9s between March and June 2026").
- Immediately adjacent — visually collapsible, but present in the DOM — sits a real HTML table of the underlying series. This is where the discipline from [responsive table design](/journal/web-design/responsive-table-design) comes in: that table must work at 375px too.
- Never encode meaning in colour alone. Direct labels solve most of it; distinct dash patterns solve the rest. Roughly 1 in 12 men has some form of colour-vision deficiency; a red/green performance chart with no labels is a private joke.

A pleasant side effect: pages with real tables of their charted numbers tend to earn featured snippets and citations, because the data is quotable. Accessibility and distribution, bought with the same markup.

## Print and offline: the forgotten surfaces

Marketing pages get printed more than teams expect — a champion prints the pitch for the procurement meeting, or saves the PDF into a board pack. Your animated, on-scroll chart prints as its first frame: usually empty. We're stubborn about [print stylesheets](/journal/web-design/print-stylesheets-still-matter) for exactly this reason. The print rule for charts is simple: the `print` media variant renders every chart in its final state, with annotations on. Test it once per redesign. It's one `Cmd+P` away and it will save a deal you never hear about.

## Data, but where does it come from?

Every marketing chart is one question away from trouble: "where did you get this number?" Have the answer on the page. The strongest pattern is a measurement note that would satisfy an analyst: population, window, method. "Median across 142 client sites we maintain, CrUX field data, May 2026" is unimpeachable. "Speeds you'll love" with a swoosh chart is not.

When the number is illustrative — a before/after from a case study, a projected saving — say so, in the same font size as the rest of the chart furniture. "Illustrative" is not a confession; it's a citation style. Readers extend trust to sources that mark their own confidence levels, and they should — on our own site, every outcome number on a [case study](/work) page carries exactly this framing, because fictional-polished or real-world-messy, the discipline is identical.

## A small audit you can run this week

Screenshot every chart on your marketing site. For each, answer: what is measured, what period, what source, could the axis embarrass us, does it work with motion off, does a screen reader get the numbers, does it print? Seven questions, twenty minutes. In our experience, about one chart in three survives. The ones you delete were costing you trust; the ones you fix become the strongest evidence on the page.

## Key takeaways

- A marketing chart makes one argument to a sceptic in four seconds. Design for the argument, not the widget.
- Every chart must answer "of what?" on its own: labels, units, period, source.
- Bars never truncate; lines that crop say so; dual axes and silent smoothing are forbidden.
- Motion should encode change or preserve object constancy. `prefers-reduced-motion` means instant final state, never an empty frame.
- Every chart ships with an HTML table of its data — for screen readers, copy-pasters, crawlers and the printer.
- Print renders final states. Champions print pitches for meetings you'll never know happened.
- Mark illustrative numbers as illustrative. Confidence-marking is what makes everything else believable.

## FAQ

**Should we show real product data live on the marketing site?**
If it's genuinely representative and self-updating, yes — a live status or metrics panel is powerful proof. The failure modes are graduating from "honest sample" to "we forgot this widget existed" and letting it rot, or exposing data that embarrasses a customer. Snapshot quarterly refresh beats a forgotten live feed.

**Are sparklines okay?**
Yes. Sparklines are honest almost by construction: no axes, no claims, just shape. They work as texture in stat rows. The moment a sparkline starts carrying an argument, promote it to a real chart with labels.

**What about interactive calculators — sliders and outputs?**
Different genre, same honesty rules. Show the assumptions the model runs on, next to the controls. An interactive tool with visible assumptions converts; a black box invites the reader to assume the worst. (We keep a running set of patterns in our work on [interactive tools as content](/journal/growth/interactive-tools-as-content).)

**Which charting library should we use on a marketing page?**
The lightest one that renders the three shapes you need — often hand-rolled SVG is under 3 KB and gives you print states, direct labels and exact annotations for free. Full charting suites earn their bundle weight in products, not on pages. This is a [websites](/services/websites) performance-budget question as much as a design one.
