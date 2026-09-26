#!/usr/bin/env node
/**
 * Scans src/content, validates frontmatter, and writes src/generated/content.ts
 * (metas only — bodies are lazy-loaded per file at runtime).
 *
 * Run automatically via `predev`/`prebuild`. Exits 1 on fatal problems
 * (duplicate slugs, missing required fields) so a bad article can't ship.
 */
import fs from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'

const ROOT = process.cwd()
const CONTENT = path.join(ROOT, 'src/content')
const OUT_DIR = path.join(ROOT, 'src/generated')
const OUT = path.join(OUT_DIR, 'content.ts')

const CLUSTERS = ['web-design', 'engineering', 'product', 'brand', 'growth', 'ai', 'ecommerce', 'playbooks']

// Canonical author roster, parsed from src/data/people.ts (single source of truth).
const peopleSrc = fs.readFileSync(path.join(ROOT, 'src/data/people.ts'), 'utf8')
const AUTHOR_ROSTER = [...peopleSrc.matchAll(/name:\s*'([^']+)'/g)].map((m) => m[1])
if (AUTHOR_ROSTER.length === 0) {
  console.error('✖ Could not parse author roster from src/data/people.ts')
  process.exit(1)
}

// Writers sometimes add a job title ("June Okafor, Design Director") or invent
// near-roster names. Normalise to the canonical name so the build survives.
const AUTHOR_ALIASES = {
  'june okonkwo': 'June Okafor',
  'priya raghunathan': 'Priya Nair',
  'priya raghavan': 'Priya Nair',
  'imogen hart': 'June Okafor',
  'marisol vane': 'Leonie Marsh',
  'felix ashwood': 'Felix Brandt',
  'felix marlowe': 'Felix Brandt',
  'theo marchetti': 'Tomás Reyes',
  'rafe delacroix': 'Felix Brandt',
  'wren callaghan': 'Priya Nair',
}

function canonicalAuthor(raw, file) {
  if (!raw) return raw
  // strip any ", Job Title" suffix
  const base = String(raw).split(',')[0].replace(/^"|"$/g, '').trim()
  if (AUTHOR_ROSTER.includes(base)) return base
  const alias = AUTHOR_ALIASES[base.toLowerCase()]
  if (alias) {
    warnings.push(`${file}: author "${raw}" normalised to "${alias}"`)
    return alias
  }
  fatals.push(`${file}: author "${raw}" is not on the team roster — use a name from src/data/people.ts exactly (no job titles)`)
  return base
}

const ARTICLE_REQUIRED = ['title', 'description', 'slug', 'cluster', 'tags', 'date', 'author', 'keywords', 'readingTime']
const WORK_REQUIRED = ['title', 'description', 'slug', 'tags', 'date', 'author', 'keywords', 'readingTime', 'client', 'industry', 'services', 'year', 'stack']

const warnings = []
const fatals = []

function* mdFiles(dir) {
  if (!fs.existsSync(dir)) return
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name)
    if (entry.isDirectory()) yield* mdFiles(p)
    else if (entry.name.endsWith('.md')) yield p
  }
}

function cleanMeta(data, file, cluster) {
  const m = { ...data }
  if (cluster) m.cluster = cluster
  m.tags = Array.isArray(m.tags) ? m.tags.map(String) : []
  m.keywords = Array.isArray(m.keywords) ? m.keywords.map(String) : []
  if (m.services) m.services = Array.isArray(m.services) ? m.services.map(String) : []
  if (m.stack) m.stack = Array.isArray(m.stack) ? m.stack.map(String) : []
  if (typeof m.date !== 'string') m.date = m.date instanceof Date ? m.date.toISOString().slice(0, 10) : String(m.date ?? '')
  if (typeof m.readingTime !== 'number') m.readingTime = Number(m.readingTime) || 0
  if (m.year) m.year = Number(m.year)
  if (m.author) m.author = canonicalAuthor(m.author, file)
  return m
}

function validate(meta, required, file) {
  for (const key of required) {
    const v = meta[key]
    if (v === undefined || v === null || v === '' || (Array.isArray(v) && v.length === 0)) {
      fatals.push(`${file}: missing required frontmatter field "${key}"`)
    }
  }
  if (meta.description && (meta.description.length < 110 || meta.description.length > 170)) {
    warnings.push(`${file}: description is ${meta.description.length} chars (target 120–160)`)
  }
  if (meta.date && !/^\d{4}-\d{2}-\d{2}/.test(meta.date)) {
    warnings.push(`${file}: date "${meta.date}" is not ISO (YYYY-MM-DD)`)
  }
  const fileSlug = path.basename(file, '.md')
  if (meta.slug && meta.slug !== fileSlug) {
    warnings.push(`${file}: frontmatter slug "${meta.slug}" != filename "${fileSlug}" (filename wins in URLs)`)
  }
  if (meta.author && !AUTHOR_ROSTER.includes(String(meta.author))) {
    fatals.push(`${file}: author "${meta.author}" is not on the team roster after normalisation — fix frontmatter`)
  }
}

const articles = []
const work = []
const seen = new Map()

for (const file of mdFiles(path.join(CONTENT, 'articles'))) {
  const cluster = path.basename(path.dirname(file))
  if (!CLUSTERS.includes(cluster)) {
    fatals.push(`${file}: unknown cluster "${cluster}"`)
    continue
  }
  const { data, content } = matter(fs.readFileSync(file, 'utf8'))
  const meta = cleanMeta(data, file, cluster)
  validate(meta, ARTICLE_REQUIRED, file)
  const words = content.trim().split(/\s+/).length
  if (words < 900) warnings.push(`${file}: only ~${words} words (journal target 1,100–2,200)`)
  const key = `article:${cluster}/${meta.slug}`
  if (seen.has(key)) fatals.push(`${file}: duplicate slug — also in ${seen.get(key)}`)
  seen.set(key, file)
  articles.push(meta)
}

for (const file of mdFiles(path.join(CONTENT, 'work'))) {
  const { data, content } = matter(fs.readFileSync(file, 'utf8'))
  const meta = cleanMeta(data, file, 'work')
  validate(meta, WORK_REQUIRED, file)
  const words = content.trim().split(/\s+/).length
  if (words < 900) warnings.push(`${file}: only ~${words} words (case studies need 900+)`)
  const key = `work:${meta.slug}`
  if (seen.has(key)) fatals.push(`${file}: duplicate slug — also in ${seen.get(key)}`)
  seen.set(key, file)
  work.push(meta)
}

for (const w of warnings) console.warn(`  ⚠ ${w}`)
if (fatals.length > 0) {
  console.error('\n✖ Content index failed:')
  for (const f of fatals) console.error(`  ✖ ${f}`)
  process.exit(1)
}

// Manifest of generated stills under public/images/work/<slug>.jpg — lets
// pages reference demo showcase shots without needing a filesystem at runtime.
const WORK_IMAGES_DIR = path.join(ROOT, 'public/images/work')
const workImages = fs.existsSync(WORK_IMAGES_DIR)
  ? fs.readdirSync(WORK_IMAGES_DIR).filter((f) => f.endsWith('.jpg')).map((f) => f.replace(/\.jpg$/, ''))
  : []

fs.mkdirSync(OUT_DIR, { recursive: true })
const ts = `// AUTO-GENERATED by scripts/build-content-index.mjs — do not edit.
import type { ArticleMeta, CaseStudyMeta } from '../lib/types'

export const articleIndex: ArticleMeta[] = ${JSON.stringify(articles, null, 2)}

export const caseIndex: CaseStudyMeta[] = ${JSON.stringify(work, null, 2)}

export const workImages: string[] = ${JSON.stringify(workImages)}
`
fs.writeFileSync(OUT, ts)
console.log(`content index: ${articles.length} articles, ${work.length} case studies, ${workImages.length} work images, ${warnings.length} warnings`)
