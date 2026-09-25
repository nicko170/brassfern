import { withBase } from './base'

/**
 * Brassfern's own small Markdown renderer — deterministic, dependency-free at
 * runtime, and base-path aware. Supports what the house style uses: headings
 * (##–####), paragraphs, bold/italic/code, links, images, lists, blockquotes,
 * fenced code, tables and horizontal rules.
 */

const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

function inline(src: string): string {
  let s = esc(src)
  // images
  s = s.replace(/!\[([^\]]*)\]\(([^)\s]+)(?:\s+"([^"]*)")?\)/g, (_m, alt, url, title) => {
    const src2 = /^https?:\/\//.test(url) ? url : withBase(url)
    return `<img src="${src2}" alt="${alt}" loading="lazy"${title ? ` title="${title}"` : ''} />`
  })
  // links — internal paths get the base prefix
  s = s.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_m, text, url) => {
    const external = /^(https?:)?\/\//.test(url) || /^mailto:/.test(url)
    const href = external ? url : withBase(url)
    const rel = external ? ' rel="noopener" target="_blank"' : ''
    return `<a href="${href}"${rel}>${text}</a>`
  })
  s = s.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
  s = s.replace(/(^|[^*])\*([^*\n]+)\*/g, '$1<em>$2</em>')
  s = s.replace(/`([^`]+)`/g, '<code>$1</code>')
  return s
}

export function stripFrontmatter(raw: string): string {
  return raw.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/, '')
}

export function renderMarkdown(source: string): string {
  const src = stripFrontmatter(source).replace(/\r\n/g, '\n')
  const lines = src.split('\n')
  const out: string[] = []
  let i = 0

  const isUl = (l: string) => /^\s*[-*]\s+/.test(l)
  const isOl = (l: string) => /^\s*\d+\.\s+/.test(l)
  const isTableRow = (l: string) => /^\s*\|.*\|\s*$/.test(l)
  const isTableSep = (l: string) => /^\s*\|[\s:|-]+\|\s*$/.test(l)

  while (i < lines.length) {
    const line = lines[i]

    if (line.trim() === '') {
      i++
      continue
    }

    // fenced code
    const fence = line.match(/^```(\w*)\s*$/)
    if (fence) {
      const buf: string[] = []
      i++
      while (i < lines.length && !/^```\s*$/.test(lines[i])) buf.push(lines[i++])
      i++
      out.push(`<pre><code${fence[1] ? ` class="lang-${fence[1]}"` : ''}>${esc(buf.join('\n'))}</code></pre>`)
      continue
    }

    // headings
    const h = line.match(/^(#{2,4})\s+(.*)$/)
    if (h) {
      const level = h[1].length
      const text = inline(h[2].trim())
      const id = h[2].trim().toLowerCase().replace(/<[^>]+>/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
      out.push(`<h${level} id="${id}">${text}</h${level}>`)
      i++
      continue
    }

    // horizontal rule
    if (/^\s*(---|\*\*\*|___)\s*$/.test(line)) {
      out.push('<hr />')
      i++
      continue
    }

    // blockquote
    if (/^\s*>\s?/.test(line)) {
      const buf: string[] = []
      while (i < lines.length && /^\s*>\s?/.test(lines[i])) {
        buf.push(lines[i].replace(/^\s*>\s?/, ''))
        i++
      }
      out.push(`<blockquote>${inline(buf.join(' '))}</blockquote>`)
      continue
    }

    // table
    if (isTableRow(line) && i + 1 < lines.length && isTableSep(lines[i + 1])) {
      const cells = (l: string) =>
        l.trim().replace(/^\||\|$/g, '').split('|').map((c) => c.trim())
      const head = cells(line)
      i += 2
      const rows: string[][] = []
      while (i < lines.length && isTableRow(lines[i])) rows.push(cells(lines[i++]))
      const thead = `<thead><tr>${head.map((c) => `<th>${inline(c)}</th>`).join('')}</tr></thead>`
      const tbody = `<tbody>${rows
        .map((r) => `<tr>${r.map((c) => `<td>${inline(c)}</td>`).join('')}</tr>`)
        .join('')}</tbody>`
      out.push(`<table>${thead}${tbody}</table>`)
      continue
    }

    // lists
    if (isUl(line) || isOl(line)) {
      const ordered = isOl(line)
      const items: string[] = []
      const test = ordered ? isOl : isUl
      while (i < lines.length && test(lines[i])) {
        items.push(lines[i].replace(/^\s*(?:[-*]|\d+\.)\s+/, ''))
        i++
      }
      const tag = ordered ? 'ol' : 'ul'
      out.push(`<${tag}>${items.map((it) => `<li>${inline(it)}</li>`).join('')}</${tag}>`)
      continue
    }

    // paragraph — gather until a blank line or block start
    const buf: string[] = []
    while (
      i < lines.length &&
      lines[i].trim() !== '' &&
      !/^#{1,4}\s/.test(lines[i]) &&
      !/^```/.test(lines[i]) &&
      !/^\s*>\s?/.test(lines[i]) &&
      !isUl(lines[i]) &&
      !isOl(lines[i]) &&
      !(isTableRow(lines[i]) && i + 1 < lines.length && isTableSep(lines[i + 1])) &&
      !/^\s*(---|\*\*\*|___)\s*$/.test(lines[i])
    ) {
      buf.push(lines[i])
      i++
    }
    out.push(`<p>${inline(buf.join(' '))}</p>`)
  }

  return out.join('\n')
}
