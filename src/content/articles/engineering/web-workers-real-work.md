---
title: "Web workers for real work: what we move off the main thread"
description: "Web workers aren't a WebGL party trick. CSV parsing, fuzzy search, image pipelines, zipping exports — how we move real work off the main thread without the plumbing pain."
slug: web-workers-real-work
cluster: engineering
tags: [performance, web-workers, javascript, architecture]
date: 2026-03-21
author: Tomás Reyes
keywords: [web workers javascript, main thread performance, comlink web worker, off main thread architecture, worker pool]
readingTime: 9
---

The main thread of a web app is a surprisingly small kitchen. Every frame it must respond to input, run your JavaScript, lay out the page and paint it — and if any one of those takes longer than about 50ms, the user feels the app *stutter* in their hands. INP doesn't care that your CSV parser is elegant; it cares that a click took 900ms to acknowledge.

Web workers are the obvious answer — a separate thread, no DOM, no shared kitchen — and yet most teams treat them as exotic. Partly it's the API (`postMessage` and deserialised clones feel like faxing yourself JSON), and partly it's a vague sense that workers are for games and WebGL. Neither is true. We reach for workers constantly in ordinary product work, and this is our honest account of which jobs earn a worker, which don't, and how to keep the plumbing humane.

## The jobs that actually earn a worker

A worker pays rent when the task is big, bursty and off the critical path of rendering. Our shortlist, all shipped in production:

**Parsing big user files.** CSV imports are the classic: a 40MB spreadsheet exported from some ERP will block the main thread for seconds while your drop zone spins and the tab appears hung. In a worker, the parse streams, reports progress ("Row 12,401 of 63,000"), and the page stays buttered. On the Meridian Climate data explorer ([case study](/work/meridian-climate-data-explorer)), council emissions CSVs get parsed, normalised and indexed in a worker pool before a single chart renders — the UI shows staged skeletons rather than a frozen tab. That pattern pairs naturally with [skeleton screens that don't lie](/journal/web-design/skeleton-screens-done-right).

**Client-side search over big archives.** Fuzzy-matching 30,000 records with an inverted index is fast per query but brutal to *build* the index. Build it in a worker at load, and queries run there too; the main thread only receives ranked IDs and renders. The user types, results stream, and typing never drops a frame.

**Image work.** Resizing uploads, generating thumbnails, reading EXIF, encoding AVIF/WebP with WASM codecs. Canvas-plus-encode of a 12-megapixel phone photo will happily eat 800ms of main-thread time. In a worker it's invisible — and on mobile, invisible is the difference between a form that feels instant and one that feels broken.

**Zipping exports and generating files.** "Download my data" is a trust feature ([graceful failure work](/journal/engineering/error-boundaries-resilient-ui) depends on it being available as an escape hatch), and building a 200MB export zip while keeping the rest of the app usable is worker-shaped work.

**Diffing, deduping, syncing.** Local-first sync engines do awkward set arithmetic. If you're exploring that territory — see our honest notes on [local-first sync engines](/journal/engineering/local-first-sync-engines) — the merge belongs off-thread, because sync happens exactly when the user is trying to do something else.

## The jobs that don't

Just as important. Workers have real costs: message serialisation, duplicated memory, loading code twice, and a debugging experience that still makes grown engineers sigh. Skip the worker when:

- The task runs in well under 50ms once. Serialisation overhead will eat your winnings.
- The task is I/O-bound, not CPU-bound. `fetch` is already async; a worker buys nothing except ceremony.
- You need the answer to render the current frame. Workers are for work that can be a promise.
- The data is tiny but frequent. A 2KB message every mousemove pays the structured-clone tax sixty times a second for no benefit.

A rough heuristic that's served us well: **if the task can exceed 100ms on a mid-range phone, and the user doesn't need the result this frame, it belongs in a worker.**

## Making it humane: Comlink, or nothing

Raw `postMessage` is why teams try workers once and never again. [Comlink](https://github.com/GoogleChromeLabs/comlink) wraps a worker in an RPC layer so calling worker code feels like calling an async function:

```ts
// csv.worker.ts
export async function parseCsv(file: File, onProgress: (n: number) => void) {
  const text = await file.text()
  // ...parse in chunks, call onProgress(rowCount) as you go
  return rows
}

// main thread
const api = wrap<CsvApi>(new Worker(new URL('./csv.worker.ts', import.meta.url)))
const rows = await api.parseCsv(file, proxy((n) => setProgress(n)))
```

Callbacks cross the boundary via `proxy()`, results come back as promises, errors propagate. With Vite, `new Worker(new URL(...), { type: 'module' })` gives you a separately bundled chunk with full module support — no `importScripts` archaeology.

Two disciplines keep worker code healthy. **First, design the boundary as an API, not a tunnel.** One or two well-named async functions with typed payloads, not a generic `run(op, data)` message bus. Same philosophy as [APIs frontend teams love](/journal/engineering/api-design-frontends-love), just smaller. **Second, share validation.** The data crossing the boundary should be checked with your [shared schema contracts](/journal/engineering/schema-validation-shared-contracts) on the *receiving* side — a worker that crashes on malformed input throws errors your UI can otherwise never catch, because structured clone can't carry an `Error`'s stack gracefully.

## Transferables and pools: the performance craft

The default structured-clone copy is the silent killer of worker wins. Passing a 40MB ArrayBuffer by clone means two copies of 40MB. **Transferables** fix this: passing `buffer` in the transfer list *moves* ownership across the thread in zero-copy time, and the sender's reference becomes neutered (length zero) immediately. One gotcha that bites weekly: the neutered buffer is genuinely gone — if your main-thread code needs a copy afterwards, transfer a copy, or reconstruct.

Three more recipes from the field:

- **Pool workers, don't spawn them.** Worker startup is ~50–150ms and each one holds its own memory. Keep a pool of 2–4 lazily started workers behind a tiny scheduler that hands out jobs. Chrome will let you spawn dozens; your user's fan will not forgive you.
- **Send instructions, receive payloads.** Chunk big inputs across messages rather than one giant one, so progress reporting is honest and GC pressure stays flat. Row-by-row beats document-at-once.
- **Cancel from the UI.** Workers can't be interrupted from the main thread except by `terminate()` — a rude but honest tool. For long jobs, support a cancel token checked between chunks, and only `terminate()` when the token goes stale. Nothing is more broken-feeling than "Cancel" that doesn't cancel.

## Measuring it: proof over vibes

Workers are a performance intervention, which means they're guilty until measured. Our checklist before shipping any worker migration:

1. Record a performance trace of the worst realistic input *before* the change, on a throttled mid-range device — the same discipline as [our Core Web Vitals field work](/journal/engineering/core-web-vitals-field-guide). Film the jank.
2. After, verify INP in the field, not just in the lab. Lab traces feel great on an M-series laptop; your users have a 2021 Android and twelve tabs.
3. Watch total memory. Workers duplicate code and sometimes data; a 60-frame UI with 900MB of heap is not a win, it's a different complaint.

On the Meridian project, streaming the parse through a pool of two workers with transferable buffers took worst-case long-task time from 4.2 seconds to effectively zero main-thread blocking and — the number the client cared about — cut "the explorer froze" support tickets to single digits a month. The charts didn't change. The *kitchen* did.

## Key takeaways

- Workers are for big, bursty, CPU-bound work whose result you don't need this frame: parsing, searching, imaging, archiving, syncing.
- Don't worker I/O, tiny tasks, or render-critical paths. The serialisation tax is real.
- Use Comlink (or similar) and design the worker boundary as a small typed API with schema-checked payloads.
- Transferables are zero-copy but ownership moves — the neutered buffer is really gone.
- Pool 2–4 workers behind a scheduler; report progress honestly; make cancellation real.
- Prove the win with traces on throttled devices and field INP, not laptop vibes.

## FAQ

**Is `requestIdleCallback` or `scheduler.yield()` enough instead of a worker?**
Chunking on the main thread fixes total blockage but not per-chunk cost: a single 300ms parse chunk still janks. Yielding is right for many small cheap tasks; workers are right when any individual chunk is expensive or when you want genuine parallelism on multicore phones.

**What about SharedArrayBuffer and threads-with-shared-memory?**
Powerful, but gated behind cross-origin isolation headers that break third-party embeds and CDNs awkwardly. We reach for it only on highly controlled internal tools. Transferables get you 90% of the win with none of the header surgery.

**Do workers work in Safari, really?**
Yes — module workers landed in Safari 15 and the remaining quirks are around `import.meta.url` resolution when bundling. Test on real WebKit early; that's our standing advice for anything exotic on the platform.

**Service workers or web workers?**
Different animals. A service worker is a network proxy with lifecycle drama ([we've written that guide](/journal/engineering/service-workers-honest-guide)); a web worker is just a thread you own. You can, and often should, run both.
