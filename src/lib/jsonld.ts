import { absoluteUrl } from './base'
import { personSlug, type Person } from '../data/people'
import type { Job } from '../data/jobs'
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

/**
 * JobPosting schema for job pages. Salary bands + posting windows come from
 * jobs.ts (fictional roles on a concept site, marked as such on-page).
 */
export function jobPostingLd(job: Job) {
  const description = [
    `<p>${job.summary}</p>`,
    '<p>What you will do:</p>',
    `<ul>${job.doing.map((d) => `<li>${d}</li>`).join('')}</ul>`,
    '<p>What you will bring:</p>',
    `<ul>${job.bring.map((b) => `<li>${b}</li>`).join('')}</ul>`,
  ].join('')
  return {
    '@context': 'https://schema.org',
    '@type': 'JobPosting',
    title: job.title,
    description,
    datePosted: job.posted,
    validThrough: `${job.closes}T23:59:59Z`,
    employmentType: job.type.toUpperCase().replace(/[^A-Z]/g, '_') || 'FULL_TIME',
    hiringOrganization: {
      '@type': 'Organization',
      name: 'Brassfern',
      sameAs: absoluteUrl('/'),
      logo: absoluteUrl('favicon.svg'),
    },
    ...(job.office
      ? {
          jobLocation: {
            '@type': 'Place',
            address: {
              '@type': 'PostalAddress',
              addressLocality: job.office,
              addressCountry: job.applicantLocations[0],
            },
          },
        }
      : {}),
    ...(job.remote
      ? {
          jobLocationType: 'TELECOMMUTE',
          applicantLocationRequirements: job.applicantLocations.map((c) => ({
            '@type': 'Country',
            name: c,
          })),
        }
      : {}),
    baseSalary: {
      '@type': 'MonetaryAmount',
      currency: job.salary.currency,
      value: {
        '@type': 'QuantitativeValue',
        minValue: job.salary.min,
        maxValue: job.salary.max,
        unitText: 'YEAR',
      },
    },
    url: absoluteUrl(`/careers/${job.slug}`),
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
