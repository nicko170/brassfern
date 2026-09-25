export interface Person {
  name: string
  role: string
  location: string
  line: string
  /** hue pair for the generated geometric portrait */
  hues: [string, string]
}

/**
 * Fictional Brassfern team. Writers must use these names as article authors
 * so the masthead stays consistent.
 */
export const team: Person[] = [
  { name: 'Mara Ellison', role: 'Founder & Creative Director', location: 'Sydney', line: 'Started Brassfern in 2014 with a laptop, a grudge against mediocre software, and a very good fern.', hues: ['#1e4d33', '#c9a84c'] },
  { name: 'June Okafor', role: 'Design Director', location: 'Sydney', line: 'Believes a type scale is a moral position. Runs the Thursday critique with an iron rule: be specific or be quiet.', hues: ['#b4552d', '#f5efdf'] },
  { name: 'Tomás Reyes', role: 'Head of Engineering', location: 'Melbourne', line: 'Ships performance budgets like love letters. Has never once said "it works on my machine" without irony.', hues: ['#182116', '#c9a84c'] },
  { name: 'Felix Brandt', role: 'Principal Engineer', location: 'London', line: 'Writes the boring, load-bearing code that lets everyone else be interesting. Diagrams everything.', hues: ['#2f6a48', '#ece3cc'] },
  { name: 'Aiko Tanaka', role: 'Senior Product Designer', location: 'Wellington', line: 'Prototype first, argue later. Keeps a museum of deleted features she is quietly proud of.', hues: ['#b08a3e', '#1e4d33'] },
  { name: 'Dev Khatri', role: 'AI Lead', location: 'Singapore', line: 'Builds evals before features. Thinks the best AI interface is the one you barely notice.', hues: ['#141c15', '#c9a84c'] },
  { name: 'Priya Nair', role: 'Head of Growth', location: 'Sydney', line: 'Reports in revenue. Allergic to vanity metrics and the phrase "just make it go viral".', hues: ['#b4552d', '#1e4d33'] },
  { name: 'Leonie Marsh', role: 'Content Lead', location: 'Hobart', line: 'Edits like a gardener: prune hard, water daily. Writes the sharpest 404s in the southern hemisphere.', hues: ['#2e6b47', '#e6cc8a'] },
  { name: 'Sam Whitfield', role: 'Growth Strategist', location: 'London', line: 'Runs experiments with pre-registered kill criteria. Has ended more of his own ideas than anyone else\u2019s.', hues: ['#3d4736', '#c9a84c'] },
  { name: 'Ruby Castellanos', role: 'Producer', location: 'Sydney', line: 'The reason demos happen on Fridays. Can read a roadmap like a weather map.', hues: ['#b08a3e', '#182116'] },
  { name: 'Nate Sullivan', role: 'E-commerce Lead', location: 'Auckland', line: 'Treats checkout friction like a personal insult. Once shaved 400ms off a PDP and framed the waterfall.', hues: ['#1e4d33', '#ece3cc'] },
  { name: 'Hannah Yeo', role: 'Motion Designer', location: 'Singapore', line: 'Motion that earns its keep or gets cut. Champion of the 160ms ease-out.', hues: ['#c9a84c', '#2f6a48'] },
]

export const authorNames = team.map((p) => p.name)
