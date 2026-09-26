#!/usr/bin/env node
/**
 * Internal-link audit. Scans every markdown file in src/content for
 * root-relative links (](/…)) and checks each target resolves to a real
 * route: a static page, an article, a case study, a service, an industry,
 * a team profile, a job, a tag or a demo. Broken links are fatal — this
 * runs in prebuild so a dead link can never ship.
 *
 * `](#)` placeholder links are allowed but warned (deliberate rhetorical
 * device in some case studies).
 */
import fs from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'

const ROOT = process.cwd()
const CONTENT = path.join(ROOT, 'src/content')
const DEMOS_DIR = path.join(ROOT, 'src/demos')

const CLUSTERS = ['web-design', 'engineering', 'product', 'brand', 'growth', 'ai', 'ecommerce', 'playbooks']

const STATIC_ROUTES = new Set([
  '/', '/work', '/lab', '/services', '/industries', '/approach', '/pricing',
  '/studio', '/team', '/careers', '/journal', '/search', '/resources',
  '/contact', '/press', '/legal/privacy', '/legal/terms',
])
for (const c of CLUSTERS) STATIC_ROUTES.add(`/journal/${c}`)

/* ——— collect dynamic routes ——— */
function dataSlugs(file) {
  const src = fs.readFileSync(path.join(ROOT, 'src/data', file), 'utf8')
  return [...src.matchAll(/slug:\s*'([^']+)'/g)].map((m) => m[1])
}
for (const s of dataSlugs('services.ts')) STATIC_ROUTES.add(`/services/${s}`)
for (const s of dataSlugs('industries.ts')) STATIC_ROUTES.add(`/industries/${s}`)
for (const s of dataSlugs('jobs.ts')) STATIC_ROUTES.add(`/careers/${s}`)

const peopleSrc = fs.readFileSync(path.join(ROOT, 'src/data/people.ts'), 'utf8')
for (const m of peopleSrc.matchAll(/name:\s*'([^']+)'/g)) {
  const slug = m[1]
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
  STATIC_ROUTES.add(`/team/${slug}`)
}

if (fs.existsSync(DEMOS_DIR)) {
  for (const d of fs.readdirSync(DEMOS_DIR)) {
    if (fs.existsSync(path.join(DEMOS_DIR, d, 'meta.ts'))) STATIC_ROUTES.add(`/lab/${d}`)
  }
}

const workSlugs = new Set(fs.readdirSync(path.join(CONTENT, 'work')).filter((f) => f.endsWith('.md')).map((f) => f.replace(/\.md$/, '')))
const articlePaths = new Set()
const tags = new Set()

function* mdFiles(dir) {
  if (!fs.existsSync(dir)) return
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name)
    if (entry.isDirectory()) yield* mdFiles(p)
    else if (entry.name.endsWith('.md')) yield p
  }
}

const files = [...mdFiles(CONTENT)]
for (const file of files) {
  const rel = path.relative(CONTENT, file)
  if (rel.startsWith('articles/')) {
    const parts = rel.split(path.sep)
    articlePaths.add(`/journal/${parts[1]}/${parts[2].replace(/\.md$/, '')}`)
  }
  try {
    const { data } = matter(fs.readFileSync(file, 'utf8'))
    for (const t of Array.isArray(data.tags) ? data.tags : []) tags.add(String(t))
  } catch { /* frontmatter errors are caught by the index builder */ }
}
for (const s of workSlugs) STATIC_ROUTES.add(`/work/${s}`)
for (const p of articlePaths) STATIC_ROUTES.add(p)
for (const t of tags) STATIC_ROUTES.add(`/journal/tag/${encodeURIComponent(t)}`)

/* ——— audit ——— */
const broken = []
const placeholders = []
const LINK_RE = /\[[^\]]*\]\((\/[^)\s]*)[^)]*\)/g

for (const file of files) {
  const raw = fs.readFileSync(file, 'utf8')
  const body = raw.replace(/^---[\s\S]*?---/, '') // skip frontmatter
  let m
  while ((m = LINK_RE.exec(body))) {
    const target = m[1].split('#')[0].split('?')[0].replace(/\/$/, '') || '/'
    if (m[1] === '/' && m[1].startsWith('/#')) continue
    if (!STATIC_ROUTES.has(target)) {
      const line = raw.slice(0, raw.indexOf(m[0])).split('\n').length
      broken.push(`${path.relative(ROOT, file)}:${line} → ${m[1]}`)
    }
  }
  const PH_RE = /\[[^\]]*\]\(#\)/g
  while ((m = PH_RE.exec(body))) {
    placeholders.push(`${path.relative(ROOT, file)} — “${m[0].slice(0, 70)}…”`)
  }
}

for (const p of placeholders) console.warn(`  ⚠ placeholder # link: ${p}`)
if (broken.length > 0) {
  console.error('\n✖ Link audit failed — broken internal links:')
  for (const b of broken) console.error(`  ✖ ${b}`)
  process.exit(1)
}
console.log(`link audit: ${files.length} files scanned, ${STATIC_ROUTES.size} routes known, 0 broken (${placeholders.length} deliberate # placeholders)`)
