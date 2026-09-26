import { team, type Person } from '../data/people'
import type { CaseStudyMeta } from './types'

/**
 * Derived "squad" for a case study. Writers never maintain a team list —
 * the strip is assembled from the case study's author plus the seniors whose
 * roles match the services delivered, with the producer closing the loop.
 * Deterministic per case study so prerendered HTML matches the client.
 */
const SQUAD_ROLES: Record<string, RegExp[]> = {
  'Brand & identity': [/creative director/i, /design director/i, /product designer/i],
  Websites: [/head of engineering/i, /principal engineer/i, /motion designer/i],
  'Product design & engineering': [/senior product designer/i, /engineer/i],
  'E-commerce': [/e-commerce lead/i, /design director/i],
  'AI products': [/ai lead/i, /engineer/i],
  Growth: [/growth/i, /content lead/i],
}

const PRODUCER = team.find((p) => /producer/i.test(p.role))

export function squadFor(cs: CaseStudyMeta, cap = 4): Person[] {
  const squad: Person[] = []
  const push = (p: Person | undefined) => {
    if (p && !squad.includes(p) && squad.length < cap) squad.push(p)
  }
  // The author leads the account (words by = case owner on the site).
  push(team.find((p) => p.name === cs.author))
  for (const service of cs.services) {
    const patterns = SQUAD_ROLES[service] ?? []
    for (const re of patterns) {
      const match = team.find((p) => re.test(p.role) && !squad.includes(p))
      if (match) {
        push(match)
        break
      }
    }
  }
  push(PRODUCER)
  return squad
}
