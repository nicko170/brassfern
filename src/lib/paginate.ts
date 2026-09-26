/**
 * Journal pagination — route-based so every page is a real, prerendered URL
 * (/journal/page/3, /journal/web-design/page/2 …) instead of client-only
 * state behind `href="#not really a link"` anchors.
 *
 * Page 1 of every hub lives at the hub root (/journal, /journal/web-design).
 * It carries the featured lead story; the remaining `rest` articles are what
 * get paginated — so page counts are computed from `restCountFor(total)`.
 * entry-server.tsx uses the same two helpers to enumerate prerender routes;
 * keep them in sync or routes go missing.
 */
export const JOURNAL_PAGE_SIZE = 12

/** Every non-empty hub shows exactly one featured lead, excluded from the grid. */
export function restCountFor(total: number): number {
  return total > 0 ? total - 1 : 0
}

export function journalPages(restCount: number): number {
  return Math.max(1, Math.ceil(restCount / JOURNAL_PAGE_SIZE))
}

/** Canonical href for a paginated page: page 1 is the bare hub path. */
export function pageHref(base: string, page: number): string {
  return page === 1 ? base : `${base}/page/${page}`
}

/** Windowed page numbers: first, last and current±1, with '…' gaps. */
export function pageWindow(page: number, pages: number): (number | '…')[] {
  const out: (number | '…')[] = []
  for (let p = 1; p <= pages; p++) {
    if (p === 1 || p === pages || Math.abs(p - page) <= 1) out.push(p)
    else if (out[out.length - 1] !== '…') out.push('…')
  }
  return out
}
