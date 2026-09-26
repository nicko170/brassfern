import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Seo } from '../lib/head'
import { allTags, articles, caseStudies } from '../lib/content'
import { breadcrumbLd } from '../lib/jsonld'
import Crumbs from '../components/Crumbs'
import Reveal from '../components/Reveal'
import { ClusterNav } from './Journal'

interface TagGroup {
  letter: string
  tags: { tag: string; count: number }[]
}

/** Group tags by first letter; digits and symbols file under '#'. */
function groupByLetter(list: { tag: string; count: number }[]): TagGroup[] {
  const groups = new Map<string, { tag: string; count: number }[]>()
  for (const t of list) {
    const first = t.tag.charAt(0).toUpperCase()
    const letter = /[A-Z]/.test(first) ? first : '#'
    const arr = groups.get(letter) ?? []
    arr.push(t)
    groups.set(letter, arr)
  }
  return [...groups.entries()]
    .map(([letter, tags]) => ({
      letter,
      tags: tags.sort((a, b) => a.tag.toLowerCase().localeCompare(b.tag.toLowerCase())),
    }))
    .sort((a, b) => (a.letter === '#' ? 1 : b.letter === '#' ? -1 : a.letter.localeCompare(b.letter)))
}

const FAVOURITES = 18

export default function TagIndex() {
  const [query, setQuery] = useState('')
  const all = useMemo(() => allTags(), [])
  const q = query.trim().toLowerCase()
  const filtered = useMemo(() => (q ? all.filter((t) => t.tag.toLowerCase().includes(q)) : all), [all, q])
  const groups = useMemo(() => groupByLetter(filtered), [filtered])
  const favourites = useMemo(() => all.slice(0, FAVOURITES), [all])

  return (
    <>
      <Seo
        title="Journal tags"
        description={`Every topic in the Brassfern journal: ${all.length} tags across ${articles.length} articles and ${caseStudies.length} case studies — searchable, alphabetical, honest.`}
        path="/journal/tags"
        jsonLd={[
          breadcrumbLd([
            { name: 'Home', path: '/' },
            { name: 'Journal', path: '/journal' },
            { name: 'Tags', path: '/journal/tags' },
          ]),
        ]}
      />
      <header className="article-head container">
        <Crumbs items={[{ name: 'Journal', path: '/journal' }, { name: 'Tags' }]} />
        <Reveal className="overline">Tags</Reveal>
        <h1 className="display">Every tag, <em>A&nbsp;to&nbsp;Z</em></h1>
        <p className="lead">
          {all.length} tags filed across {articles.length} articles and {caseStudies.length} case
          studies. The index of indexes — filter it, don't fight it.
        </p>
      </header>

      <div className="container">
        <ClusterNav active="tags" />
        <div className="tag-filter">
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Filter tags — try “SEO”, “voice”, “retention”…"
            aria-label="Filter tags"
            autoComplete="off"
            spellCheck={false}
          />
          <span className="tag-filter__status mono" role="status" aria-live="polite">
            {q ? `${filtered.length} of ${all.length}` : all.length}
          </span>
          {q && (
            <button type="button" className="tag-filter__clear mono" onClick={() => setQuery('')}>
              Clear ×
            </button>
          )}
        </div>

        {!q && (
          <section className="tag-faves" aria-label="Most-used tags">
            <Reveal className="overline" style={{ marginBottom: 'var(--space-4)' }}>Most used</Reveal>
            <div className="chipset">
              {favourites.map((t) => (
                <Link key={t.tag} to={`/journal/tag/${encodeURIComponent(t.tag)}`} className="chip tag-chip">
                  <span>{t.tag}</span>
                  <span className="tag-chip__count">{t.count}</span>
                </Link>
              ))}
            </div>
          </section>
        )}

        {filtered.length === 0 ? (
          <div className="tag-groups">
            <p className="lead" style={{ marginTop: 'var(--space-6)' }}>
              Nothing filed under “{query}”. Try a root word — <em>voice</em>, not <em>voiceovers</em> — or{' '}
              <Link to="/search">search the whole journal</Link>.
            </p>
          </div>
        ) : (
          <div className="tag-groups">
            {groups.map((g) => (
              <section key={g.letter} className="tag-group" aria-label={`Tags beginning with ${g.letter}`}>
                <span className="tag-group__letter" aria-hidden="true">{g.letter}</span>
                <div className="tag-group__chips">
                  {g.tags.map((t) => (
                    <Link key={t.tag} to={`/journal/tag/${encodeURIComponent(t.tag)}`} className="chip tag-chip">
                      <span>{t.tag}</span>
                      <span className="tag-chip__count">{t.count}</span>
                    </Link>
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </div>
      <div className="section" aria-hidden="true" />
    </>
  )
}
