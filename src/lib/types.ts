export type Cluster =
  | 'web-design'
  | 'engineering'
  | 'product'
  | 'brand'
  | 'growth'
  | 'ai'
  | 'ecommerce'
  | 'playbooks'

export const CLUSTERS: Cluster[] = [
  'web-design',
  'engineering',
  'product',
  'brand',
  'growth',
  'ai',
  'ecommerce',
  'playbooks',
]

export const CLUSTER_LABELS: Record<Cluster, string> = {
  'web-design': 'Web design',
  engineering: 'Engineering',
  product: 'Product',
  brand: 'Brand',
  growth: 'Growth',
  ai: 'AI',
  ecommerce: 'E-commerce',
  playbooks: 'Playbooks',
}

export interface ArticleMeta {
  title: string
  description: string
  slug: string
  cluster: Cluster
  tags: string[]
  date: string
  author: string
  keywords: string[]
  readingTime: number
  heroImage?: string
  heroAlt?: string
}

export interface CaseStudyMeta {
  title: string
  description: string
  slug: string
  tags: string[]
  date: string
  author: string
  keywords: string[]
  readingTime: number
  heroImage?: string
  heroAlt?: string
  client: string
  industry: string
  services: string[]
  year: number
  stack: string[]
  demo?: string
  cluster: 'work'
}
