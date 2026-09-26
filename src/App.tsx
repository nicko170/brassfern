import { Suspense, type ComponentType } from 'react'
import { Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import NotFound from './pages/NotFound'
import type { HeadCollector } from './lib/head'
import { lazyNamed, lazyPage, type Preloadable } from './lib/lazyPage'

/**
 * Every page is its own chunk. Preloadable lets the prerender warm all
 * chunks before renderToString so static HTML is complete (React 18 SSR
 * doesn't resolve Suspense). The client hydrates progressively — server
 * HTML stays visible while the page chunk loads.
 */
const Home = lazyPage(() => import('./pages/Home'))
const Work = lazyPage(() => import('./pages/Work'))
const WorkCase = lazyPage(() => import('./pages/WorkCase'))
const LabIndex = lazyNamed(() => import('./pages/Lab'), 'LabIndex')
const LabDemo = lazyNamed(() => import('./pages/Lab'), 'LabDemo')
const ServicesIndex = lazyNamed(() => import('./pages/Services'), 'ServicesIndex')
const ServicePage = lazyNamed(() => import('./pages/Services'), 'ServicePage')
const IndustriesIndex = lazyNamed(() => import('./pages/Industries'), 'IndustriesIndex')
const IndustryPage = lazyNamed(() => import('./pages/Industries'), 'IndustryPage')
const Approach = lazyPage(() => import('./pages/Approach'))
const Pricing = lazyPage(() => import('./pages/Pricing'))
const Studio = lazyPage(() => import('./pages/Studio'))
const Team = lazyPage(() => import('./pages/Team'))
const Careers = lazyNamed(() => import('./pages/Careers'), 'Careers')
const JobPage = lazyNamed(() => import('./pages/Careers'), 'JobPage')
const JournalIndex = lazyNamed(() => import('./pages/Journal'), 'JournalIndex')
const JournalCluster = lazyNamed(() => import('./pages/Journal'), 'JournalCluster')
const Article = lazyPage(() => import('./pages/Article'))
const TagPage = lazyNamed(() => import('./pages/Article'), 'TagPage')
const Search = lazyPage(() => import('./pages/Search'))
const Resources = lazyPage(() => import('./pages/Resources'))
const Contact = lazyPage(() => import('./pages/Contact'))
const Press = lazyPage(() => import('./pages/Press'))
const Legal = lazyPage(() => import('./pages/Legal'))

const allPages: Preloadable<ComponentType>[] = [
  Home, Work, WorkCase, LabIndex, LabDemo, ServicesIndex, ServicePage,
  IndustriesIndex, IndustryPage, Approach, Pricing, Studio, Team,
  Careers, JobPage, JournalIndex, JournalCluster, Article, TagPage,
  Search, Resources, Contact, Press, Legal,
]

let warmed: Promise<unknown> | null = null
/**
 * Warm every page chunk (idempotent). Called by the prerender entry.
 * Awaiting the loaders isn't enough on its own: React's lazy() memoises
 * inside the component (`_init`/`_payload`) and only flips to resolved
 * when something renders it. Nudge each component, await the thenable it
 * throws, then nudge again — so renderToString emits real markup.
 */
export async function preloadAllPages(): Promise<void> {
  warmed ??= Promise.all(allPages.map((p) => p.preload()))
  await warmed
  await Promise.all(
    allPages.map((p) => {
      const internals = p as unknown as { _payload?: unknown; _init?: (payload: unknown) => unknown }
      if (typeof internals._init !== 'function' || !internals._payload) return Promise.resolve()
      const nudge = (): unknown => {
        try {
          internals._init!(internals._payload)
          return null
        } catch (thrown) {
          if (thrown && typeof (thrown as PromiseLike<unknown>).then === 'function') return thrown
          return null
        }
      }
      const thrown = nudge()
      if (thrown && typeof (thrown as PromiseLike<unknown>).then === 'function') {
        return (thrown as Promise<unknown>).then(() => nudge(), () => nudge())
      }
      return Promise.resolve()
    }),
  )
}

function PageFallback() {
  return (
    <div className="container section">
      <div className="skel">
        <span /><span /><span /><span />
      </div>
    </div>
  )
}

export default function App({ head }: { head?: HeadCollector }) {
  return (
    <Routes>
      <Route element={<Layout head={head} />}>
        <Route index element={<Suspense fallback={<PageFallback />}><Home /></Suspense>} />
        <Route path="work" element={<Suspense fallback={<PageFallback />}><Work /></Suspense>} />
        <Route path="work/:slug" element={<Suspense fallback={<PageFallback />}><WorkCase /></Suspense>} />
        <Route path="lab" element={<Suspense fallback={<PageFallback />}><LabIndex /></Suspense>} />
        <Route path="lab/:slug" element={<Suspense fallback={<PageFallback />}><LabDemo /></Suspense>} />
        <Route path="services" element={<Suspense fallback={<PageFallback />}><ServicesIndex /></Suspense>} />
        <Route path="services/:slug" element={<Suspense fallback={<PageFallback />}><ServicePage /></Suspense>} />
        <Route path="industries" element={<Suspense fallback={<PageFallback />}><IndustriesIndex /></Suspense>} />
        <Route path="industries/:slug" element={<Suspense fallback={<PageFallback />}><IndustryPage /></Suspense>} />
        <Route path="approach" element={<Suspense fallback={<PageFallback />}><Approach /></Suspense>} />
        <Route path="pricing" element={<Suspense fallback={<PageFallback />}><Pricing /></Suspense>} />
        <Route path="studio" element={<Suspense fallback={<PageFallback />}><Studio /></Suspense>} />
        <Route path="team" element={<Suspense fallback={<PageFallback />}><Team /></Suspense>} />
        <Route path="careers" element={<Suspense fallback={<PageFallback />}><Careers /></Suspense>} />
        <Route path="careers/:slug" element={<Suspense fallback={<PageFallback />}><JobPage /></Suspense>} />
        <Route path="journal" element={<Suspense fallback={<PageFallback />}><JournalIndex /></Suspense>} />
        <Route path="journal/tag/:tag" element={<Suspense fallback={<PageFallback />}><TagPage /></Suspense>} />
        <Route path="journal/:cluster" element={<Suspense fallback={<PageFallback />}><JournalCluster /></Suspense>} />
        <Route path="journal/:cluster/:slug" element={<Suspense fallback={<PageFallback />}><Article /></Suspense>} />
        <Route path="search" element={<Suspense fallback={<PageFallback />}><Search /></Suspense>} />
        <Route path="resources" element={<Suspense fallback={<PageFallback />}><Resources /></Suspense>} />
        <Route path="contact" element={<Suspense fallback={<PageFallback />}><Contact /></Suspense>} />
        <Route path="press" element={<Suspense fallback={<PageFallback />}><Press /></Suspense>} />
        <Route path="legal/:page" element={<Suspense fallback={<PageFallback />}><Legal /></Suspense>} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}
