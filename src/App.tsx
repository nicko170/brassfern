import { Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import type { HeadCollector } from './lib/head'
import Home from './pages/Home'
import Work from './pages/Work'
import WorkCase from './pages/WorkCase'
import { LabIndex, LabDemo } from './pages/Lab'
import { ServicesIndex, ServicePage } from './pages/Services'
import { IndustriesIndex, IndustryPage } from './pages/Industries'
import Approach from './pages/Approach'
import Pricing from './pages/Pricing'
import Studio from './pages/Studio'
import Team from './pages/Team'
import { Careers, JobPage } from './pages/Careers'
import { JournalIndex, JournalCluster } from './pages/Journal'
import Article, { TagPage } from './pages/Article'
import Search from './pages/Search'
import Resources from './pages/Resources'
import Contact from './pages/Contact'
import Press from './pages/Press'
import Legal from './pages/Legal'
import NotFound from './pages/NotFound'

export default function App({ head }: { head?: HeadCollector }) {
  return (
    <Routes>
      <Route element={<Layout head={head} />}>
        <Route index element={<Home />} />
        <Route path="work" element={<Work />} />
        <Route path="work/:slug" element={<WorkCase />} />
        <Route path="lab" element={<LabIndex />} />
        <Route path="lab/:slug" element={<LabDemo />} />
        <Route path="services" element={<ServicesIndex />} />
        <Route path="services/:slug" element={<ServicePage />} />
        <Route path="industries" element={<IndustriesIndex />} />
        <Route path="industries/:slug" element={<IndustryPage />} />
        <Route path="approach" element={<Approach />} />
        <Route path="pricing" element={<Pricing />} />
        <Route path="studio" element={<Studio />} />
        <Route path="team" element={<Team />} />
        <Route path="careers" element={<Careers />} />
        <Route path="careers/:slug" element={<JobPage />} />
        <Route path="journal" element={<JournalIndex />} />
        <Route path="journal/tag/:tag" element={<TagPage />} />
        <Route path="journal/:cluster" element={<JournalCluster />} />
        <Route path="journal/:cluster/:slug" element={<Article />} />
        <Route path="search" element={<Search />} />
        <Route path="resources" element={<Resources />} />
        <Route path="contact" element={<Contact />} />
        <Route path="press" element={<Press />} />
        <Route path="legal/:page" element={<Legal />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}
