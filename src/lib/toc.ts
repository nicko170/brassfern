/**
 * Extracts a table of contents (h2/h3) from rendered article HTML. The
 * markdown renderer gives every heading a slugified id, so TOC entries can
 * deep-link with plain #hash anchors.
 */
export interface TocItem {
  id: string
  text: string
  level: 2 | 3
}

const ENTITIES: Record<string, string> = {
  '&amp;': '&',
  '&lt;': '<',
  '&gt;': '>',
  '&quot;': '"',
  '&#39;': "'",
}

export function parseToc(html: string): TocItem[] {
  const out: TocItem[] = []
  const re = /<h([23]) id="([^"]+)">([\s\S]*?)<\/h\1>/g
  let m: RegExpExecArray | null
  while ((m = re.exec(html))) {
    let text = m[3].replace(/<[^>]+>/g, '').trim()
    for (const [ent, ch] of Object.entries(ENTITIES)) text = text.split(ent).join(ch)
    if (text) out.push({ id: m[2], text, level: m[1] === '3' ? 3 : 2 })
  }
  return out
}
