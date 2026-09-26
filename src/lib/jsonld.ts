import { absoluteUrl } from './base'
import { personSlug, type Person } from '../data/people'
import type { ArticleMeta, CaseStudyMeta } from './types'

export function organizationLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Brassfern',
    url: absoluteUrl('/'),
    logo: absoluteUrl('favicon.svg'),
    slogan: 'Software with a heartbeat',
    description:
      'Independent digital product studio — brand, websites, product engineering, e-commerce, AI and growth.',
    foundingDate: '2014',
    address: { '@type': 'PostalAddress', addressLocality: 'Surry Hills', addressRegion: 'NSW', addressCountry: 'AU' },
  }
}

export function websiteLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Brassfern',
    url: absoluteUrl('/'),
  }
}

export function articleLd(m: ArticleMeta, path: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: m.title,
    description: m.description,
    author: { '@type': 'Person', name: m.author },
    datePublished: m.date,
    mainEntityOfPage: absoluteUrl(path),
    keywords: m.keywords.join(', '),
    ...(m.heroImage ? { image: absoluteUrl(m.heroImage) } : {}),
  }
}

export function creativeWorkLd(m: CaseStudyMeta) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: m.title,
    description: m.description,
    creator: { '@type': 'Organization', name: 'Brassfern' },
    datePublished: m.date,
    keywords: m.keywords.join(', '),
    ...(m.heroImage ? { image: absoluteUrl(m.heroImage) } : {}),
  }
}

export function faqLd(faqs: { q: string; a: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  }
}

export function breadcrumbLd(items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      item: absoluteUrl(it.path),
    })),
  }
}

export function personLd(p: Person) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    mainEntity: {
      '@type': 'Person',
      name: p.name,
      jobTitle: p.role,
      description: p.line,
      worksFor: { '@type': 'Organization', name: 'Brassfern' },
      url: absoluteUrl(`/team/${personSlug(p.name)}`),
    },
  }
}
