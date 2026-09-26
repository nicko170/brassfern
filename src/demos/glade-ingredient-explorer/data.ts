/**
 * GLADE Rituals — data layer. Fully deterministic, fictional-but-plausible
 * skincare data. Every ingredient carries a plain-English "what it actually
 * does", provenance, an honest concentration band and an evidence rating.
 * Every GLADE formulation discloses each component's percentage, and every
 * component cross-references the index — nothing sits outside the ledger.
 */

export type Category =
  | 'hydrator'
  | 'barrier'
  | 'active'
  | 'exfoliant'
  | 'antioxidant'
  | 'soother'
  | 'sunscreen'
  | 'base'

export const CATEGORY_LABELS: Record<Category, string> = {
  hydrator: 'Hydrator',
  barrier: 'Barrier lipid',
  active: 'Active',
  exfoliant: 'Exfoliant',
  antioxidant: 'Antioxidant',
  soother: 'Soother',
  sunscreen: 'UV filter',
  base: 'Base & texture',
}

export type TimeOfDay = 'am' | 'pm' | 'both'

export interface Ingredient {
  id: string
  name: string
  inci: string
  category: Category
  time: TimeOfDay
  /** "What it actually does" — one honest sentence. */
  does: string
  /** The longer note a formulator would write. */
  detail: string
  provenance: string
  /** Typical leave-on band, e.g. "2–5%". */
  band: string
  bandNote: string
  evidence: 1 | 2 | 3 | 4 | 5
  benefits: string[]
  pairs: string[]
}

export const EVIDENCE_LABELS: Record<number, string> = {
  5: 'Strong — randomised trials',
  4: 'Good — controlled studies',
  3: 'Promising — small studies',
  2: 'Emerging — early data',
  1: 'Traditional — formulative',
}

export const ALL_BENEFITS = [
  'redness',
  'dark spots',
  'texture',
  'pores',
  'dehydration',
  'barrier repair',
  'breakouts',
  'fine lines',
  'dullness',
  'sensitivity',
] as const

export const INGREDIENTS: Ingredient[] = [
  // ── Actives ──────────────────────────────────────────────────────────
  {
    id: 'niacinamide',
    name: 'Niacinamide',
    inci: 'Niacinamide',
    category: 'active',
    time: 'both',
    does: 'Calms redness, refines pores, quietly rebuilds the barrier.',
    detail:
      'Vitamin B3, and one of the most-studied molecules in skincare. It lowers transepidermal water loss, blunts pigment transfer to skin cells and settles visible flushing. It gets on with almost everything — the disputes you read about are mostly myth.',
    provenance: 'Synthesised from a corn-derived intermediate in a closed-loop reactor, Basel.',
    band: '2–5%',
    bandNote: 'Above 5% the flush risk climbs while the benefit does not. We cap at 4% pairings.',
    evidence: 5,
    benefits: ['redness', 'pores', 'barrier repair', 'sensitivity'],
    pairs: ['zinc-pca', 'ceramide-np', 'hyaluronic-acid', 'tranexamic-acid'],
  },
  {
    id: 'azelaic-acid',
    name: 'Azelaic acid',
    inci: 'Azelaic Acid',
    category: 'active',
    time: 'both',
    does: 'Fades dark spots, clears congestion, and behaves on reactive skin.',
    detail:
      'A quiet overachiever. Prescription-strength in some countries, sold cosmetically at 10% in Australia. Mildly antibacterial, anti-keratinising and one of the few actives broadly considered compatible with pregnancy. Slow, steady, undramatic — like the results it gives.',
    provenance: 'Produced by ozonolysis of oleic acid; originally isolated from grain fungi.',
    band: '10%',
    bandNote: 'The OTC ceiling in AU. Prescription gels run 15–20%.',
    evidence: 4,
    benefits: ['dark spots', 'breakouts', 'redness'],
    pairs: ['tranexamic-acid', 'panthenol', 'niacinamide'],
  },
  {
    id: 'retinal',
    name: 'Retinal',
    inci: 'Retinaldehyde',
    category: 'active',
    time: 'pm',
    does: 'The fast retinoid: turnover, texture and lines, one conversion step from the drug.',
    detail:
      'Retinaldehyde converts to retinoic acid in a single enzymatic step, where retinol needs two — so it acts roughly ten times faster per unit and the irritation curve arrives earlier too. Encapsulation buys you tolerance. Respect week one.',
    provenance: 'Bio-fermented, then encapsulated in a cyclodextrin shell to slow oxidation.',
    band: '0.05–0.1%',
    bandNote: 'We use 0.06%. Double the number is not double the result.',
    evidence: 5,
    benefits: ['fine lines', 'texture', 'breakouts'],
    pairs: ['bisabolol', 'squalane', 'centella'],
  },
  {
    id: 'retinol',
    name: 'Retinol',
    inci: 'Retinol',
    category: 'active',
    time: 'pm',
    does: 'The reference retinoid — decades of data behind it.',
    detail:
      'Two conversion steps from retinoic acid, so gentler and slower than retinal. The most-studied cosmetic active after sunscreen. If a site sells you retinol and a leave-on AHA in the same breath, read our conflict ledger.',
    provenance: 'Stabilised by micro-encapsulation in cellulose beads; oxygen-scavenged filling line.',
    band: '0.2–0.5%',
    bandNote: 'Start at 0.2%, two nights a week. Ego is not a skincare input.',
    evidence: 5,
    benefits: ['fine lines', 'texture', 'dark spots'],
    pairs: ['ceramide-np', 'bakuchiol', 'colloidal-oat'],
  },
  {
    id: 'bakuchiol',
    name: 'Bakuchiol',
    inci: 'Bakuchiol',
    category: 'active',
    time: 'both',
    does: 'A gentler, retinoid-adjacent plant meroterpene.',
    detail:
      'Not a retinoid, whatever the jar says. One randomised trial found comparable improvement in photoageing to 0.5% retinol with meaningfully less stinging. The honest read: a good option for retinoid-intolerant skin, not a straight substitute.',
    provenance: 'Extracted from Psoralea corylifolia (babchi) seeds, standardised to 99%.',
    band: '0.5–1%',
    bandNote: 'The trial dose. Lower reads well on a label and does little else.',
    evidence: 3,
    benefits: ['fine lines', 'sensitivity', 'texture'],
    pairs: ['retinal', 'squalane', 'bisabolol'],
  },
  {
    id: 'tranexamic-acid',
    name: 'Tranexamic acid',
    inci: 'Tranexamic Acid',
    category: 'active',
    time: 'both',
    does: 'Interrupts the cellular chatter that manufactures dark spots.',
    detail:
      'A synthetic haemostat repurposed by dermatology. Orally it is serious medicine; topically it dampens the plasmin pathway that upregulates melanin after UV and inflammation. The topical dataset is smaller than the hype — we rate it promising, not proven.',
    provenance: 'Fully synthetic; the molecule is cheap, the standardisation is the work.',
    band: '2–5%',
    bandNote: 'Evidence clusters around 3–5% in combination products.',
    evidence: 3,
    benefits: ['dark spots', 'dullness'],
    pairs: ['niacinamide', 'alpha-arbutin', 'azelaic-acid'],
  },
  {
    id: 'alpha-arbutin',
    name: 'Alpha-arbutin',
    inci: 'Alpha-Arbutin',
    category: 'active',
    time: 'both',
    does: 'Slows tyrosinase so new pigment forms more slowly.',
    detail:
      'A stabilised, synthetically refined relative of bearberry extract. It inhibits the enzyme that makes melanin rather than bleaching what exists — think prevention, not erasure. Pairs politely with almost everything.',
    provenance: 'Enzymatically synthesised from hydroquinone glucose donors; the alpha isomer only.',
    band: '1–2%',
    bandNote: '2% is the sweet spot; the EU safety review landed on 2% for face products.',
    evidence: 3,
    benefits: ['dark spots', 'dullness'],
    pairs: ['tranexamic-acid', 'niacinamide'],
  },
  {
    id: 'benzoyl-peroxide',
    name: 'Benzoyl peroxide',
    inci: 'Benzoyl Peroxide',
    category: 'active',
    time: 'pm',
    does: 'The most bactericidal thing in the cabinet. Bleaches towels, honestly.',
    detail:
      'Releases oxygen into the pore and Cutibacterium acnes cannot develop resistance to it — unique among acne treatments. Also oxidises vitamin C and retinoids on contact, which is why our ledger marks those pairings as never-in-the-same-session.',
    provenance: 'Synthesised from benzoyl chloride and hydrogen peroxide; micronised for even dispersion.',
    band: '2.5–5%',
    bandNote: '2.5% works about as well as 10% with half the irritation. The data is old and clear.',
    evidence: 5,
    benefits: ['breakouts'],
    pairs: ['colloidal-oat', 'glycerin'],
  },
  {
    id: 'copper-peptides',
    name: 'Copper peptides',
    inci: 'Copper Tripeptide-1',
    category: 'active',
    time: 'both',
    does: 'A carrier peptide that nudges repair signalling.',
    detail:
      'GHK-Cu shuttles copper ions to enzymes involved in wound repair. Interesting biology, a thinner human dataset than the price implies, and a genuine chemistry problem: strong acids can strip the copper off and inactivate it. Keep it away from low-pH vitamin C.',
    provenance: 'Fermentation-derived tripeptide complexed with pharmaceutical-grade copper salts.',
    band: '0.1–0.3%',
    bandNote: 'Effective cosmetic use levels are low; the blue tint is the copper, not dye.',
    evidence: 3,
    benefits: ['fine lines', 'barrier repair'],
    pairs: ['hyaluronic-acid', 'panthenol'],
  },
  {
    id: 'matrixyl',
    name: 'Matrixyl',
    inci: 'Palmitoyl Pentapeptide-4',
    category: 'active',
    time: 'both',
    does: 'The workhorse "collagen message" signal peptide.',
    detail:
      'A fatty-acid-tagged fragment that mimics a broken bit of collagen, tricking fibroblasts into housekeeping. Supplier trials are small and industry-funded, but the mechanism is coherent and two decades of cosmetic use have been uneventful.',
    provenance: 'Solid-phase peptide synthesis, palmitoylated for skin penetration.',
    band: '2–4% of a 100ppm solution',
    bandNote: 'Labels quote the solution, not the peptide. Ours states both.',
    evidence: 3,
    benefits: ['fine lines'],
    pairs: ['hyaluronic-acid', 'ceramide-np'],
  },
  {
    id: 'caffeine',
    name: 'Caffeine',
    inci: 'Caffeine',
    category: 'soother',
    time: 'am',
    does: 'Constricts vessels briefly — de-puffs by morning light.',
    detail:
      'Honest note: the effects are real but measured in hours. Caffeine tightens superficial capillaries and moves fluid along. If an eye cream promises structural change from caffeine alone, the structure doing the changing is the marketing.',
    provenance: 'Synthetic; identical to the molecule in your flat white, without the milk solids.',
    band: '1–5%',
    bandNote: 'Eye products sit near 5%; face serums near 2%.',
    evidence: 2,
    benefits: ['dullness', 'redness'],
    pairs: ['green-tea', 'hyaluronic-acid'],
  },

  // ── Exfoliants ───────────────────────────────────────────────────────
  {
    id: 'glycolic-acid',
    name: 'Glycolic acid',
    inci: 'Glycolic Acid',
    category: 'exfoliant',
    time: 'pm',
    does: 'Dissolves the glue between dead cells. The smallest AHA penetrates fastest — and stings first.',
    detail:
      'Sugarcane-derived alpha hydroxy acid with the best evidence base of the peel family. Fast and effective, and the ingredient most responsible for the phrase "I overdid it with the acids". Buffer it with boring moisturisers and a calendar.',
    provenance: 'Fermentation of sugarcane molasses; buffered with sodium hydroxide to pH 3.8.',
    band: '5–10%',
    bandNote: 'Leave-on retail tops out near 10%. Clinic peels are another discipline entirely.',
    evidence: 4,
    benefits: ['texture', 'dullness', 'dark spots'],
    pairs: ['beta-glucan', 'colloidal-oat'],
  },
  {
    id: 'lactic-acid',
    name: 'Lactic acid',
    inci: 'Lactic Acid',
    category: 'exfoliant',
    time: 'pm',
    does: 'A larger, kinder AHA that exfoliates and mildly hydrates at once.',
    detail:
      'The second-oldest peeling agent in recorded use and still the correct first AHA for most faces. Its larger molecule penetrates slower than glycolic, and it doubles as a humectant. Our Rake tonic pairs it with a PHA so the entry curve is gentle.',
    provenance: 'Fermented from corn glucose by Lactobacillus cultures.',
    band: '2–5%',
    bandNote: '5% twice weekly outperforms 10% used in a panic.',
    evidence: 4,
    benefits: ['texture', 'dullness', 'dehydration'],
    pairs: ['gluconolactone', 'glycerin'],
  },
  {
    id: 'mandelic-acid',
    name: 'Mandelic acid',
    inci: 'Mandelic Acid',
    category: 'exfoliant',
    time: 'pm',
    does: 'The largest common AHA — slow penetration, suited to reactive and darker skin tones.',
    detail:
      'Bitter-almond derived. Its molecular size means a shallower, slower peel, which lowers the risk of the post-inflammatory pigmentation that stronger acids can trigger in melanin-rich skin. Mildly antibacterial too.',
    provenance: 'Hydrolysed from bitter almond extract; synthetic, chirally pure.',
    band: '5–10%',
    bandNote: 'Pleasant at percentages that would have glycolic users writing letters.',
    evidence: 3,
    benefits: ['texture', 'breakouts', 'sensitivity'],
    pairs: ['centella', 'panthenol'],
  },
  {
    id: 'salicylic-acid',
    name: 'Salicylic acid',
    inci: 'Salicylic Acid',
    category: 'exfoliant',
    time: 'both',
    does: 'Oil-soluble, so it unclogs pores from the inside rather than sanding the top.',
    detail:
      'The beta hydroxy acid. Because it dissolves in oil it gets inside the pore lining and loosens the plug — the only exfoliant that truly works below the surface. In a rinse-off cleanser it is gentle enough for daily use; leave-on, treat it as an acid.',
    provenance: 'Synthesised from sodium phenolate and CO₂ — the Kolbe–Schmitt reaction, unchanged since 1860.',
    band: '0.5–2%',
    bandNote: '2% leave-on is the cosmetic ceiling in most markets.',
    evidence: 4,
    benefits: ['pores', 'breakouts', 'texture'],
    pairs: ['niacinamide', 'green-tea'],
  },
  {
    id: 'gluconolactone',
    name: 'Gluconolactone',
    inci: 'Gluconolactone',
    category: 'exfoliant',
    time: 'both',
    does: 'A polyhydroxy acid that exfoliates so gently sensitive skin barely notices.',
    detail:
      'A PHA: too big to penetrate deeply, antioxidant as a bonus, and non-photosensitising. The trade for that kindness is subtlety — results arrive in weeks, not mornings. The right choice for skin that has filed complaints about every other acid.',
    provenance: 'Oxidised from corn glucose.',
    band: '2–5%',
    bandNote: 'Often blended under a headline AHA, where it quietly does the soothing.',
    evidence: 2,
    benefits: ['texture', 'sensitivity', 'dullness'],
    pairs: ['lactic-acid', 'beta-glucan'],
  },

  // ── Antioxidants ─────────────────────────────────────────────────────
  {
    id: 'ascorbic-acid',
    name: 'Vitamin C (L-ascorbic)',
    inci: 'Ascorbic Acid',
    category: 'antioxidant',
    time: 'am',
    does: 'Brightens, evens tone, and thickens your sunscreen’s defensive line.',
    detail:
      'Pure vitamin C — the form with the evidence, and the fuss. It needs a pH under 3.5, air-tight packaging and fresh stock; an amber bottle is a dead bottle. It regenerates oxidised vitamin E and, with ferulic acid, roughly doubles measured photoprotection of the formula.',
    provenance: 'Fermented from sorbitol via the Reichstein process; packed under nitrogen.',
    band: '8–15%',
    bandNote: 'We use 10%. Above 15% the irritation curve outruns the benefit curve.',
    evidence: 5,
    benefits: ['dark spots', 'dullness', 'fine lines'],
    pairs: ['ferulic-acid', 'tocopherol', 'hyaluronic-acid'],
  },
  {
    id: 'ascorbyl-glucoside',
    name: 'Ascorbyl glucoside',
    inci: 'Ascorbyl Glucoside',
    category: 'antioxidant',
    time: 'both',
    does: 'A stable vitamin C derivative for daily, low-drama brightness.',
    detail:
      'Vitamin C with a glucose passenger; skin enzymes snip it free slowly, so it neither stings nor spoils. The human data is thinner than for the pure acid — steadier, gentler, modest. The right trade for many faces.',
    provenance: 'Enzyme-coupled synthesis; water-clear and shelf-stable for two years.',
    band: '2–5%',
    bandNote: 'The studies that exist cluster at 2%.',
    evidence: 3,
    benefits: ['dullness', 'dark spots', 'sensitivity'],
    pairs: ['niacinamide', 'tocopherol'],
  },
  {
    id: 'tocopherol',
    name: 'Vitamin E',
    inci: 'Tocopherol',
    category: 'antioxidant',
    time: 'both',
    does: 'Mostly here to protect the formula — which protects you.',
    detail:
      'Oil-soluble antioxidant that sacrifices itself so the expensive actives do not oxidise in the bottle. On skin it supports the barrier and pairs famously with vitamin C, which regenerates it after it takes the hit.',
    provenance: 'Sunflower-seed derived, non-GMO, mixed tocopherol profile.',
    band: '0.5–1%',
    bandNote: 'More than 1% adds cost and tack, not protection.',
    evidence: 3,
    benefits: ['barrier repair', 'dullness'],
    pairs: ['ascorbic-acid', 'ferulic-acid', 'squalane'],
  },
  {
    id: 'ferulic-acid',
    name: 'Ferulic acid',
    inci: 'Ferulic Acid',
    category: 'antioxidant',
    time: 'am',
    does: 'The stabiliser that doubles vitamin C’s photoprotection.',
    detail:
      'A plant-cell-wall antioxidant that stops the C+E pair from oxidising and, in the landmark Duke work, doubled the combination’s measured protection against UV-generated free radicals. Unsexy. Load-bearing.',
    provenance: 'Extracted from rice bran; the same molecule that flavours old books.',
    band: '0.5%',
    bandNote: 'That oddly precise figure is straight from the patent literature.',
    evidence: 3,
    benefits: ['dullness', 'dark spots'],
    pairs: ['ascorbic-acid', 'tocopherol'],
  },
  {
    id: 'green-tea',
    name: 'Green tea (EGCG)',
    inci: 'Camellia Sinensis Leaf Extract',
    category: 'antioxidant',
    time: 'both',
    does: 'A standardised antioxidant with a mild calming streak.',
    detail:
      'The active fraction is EGCG; unstandardised "green tea extract" can be tea-flavoured water, so we state the standardisation on pack. Ours assays at 90% polyphenols. Effects are real and modest.',
    provenance: 'Shizuoka-grown leaves, water-extracted, standardised to 90% polyphenols.',
    band: '1–2%',
    bandNote: 'Enough to matter, below the level that tints the cream beige.',
    evidence: 2,
    benefits: ['redness', 'dullness'],
    pairs: ['caffeine', 'niacinamide'],
  },
  {
    id: 'resveratrol',
    name: 'Resveratrol',
    inci: 'Resveratrol',
    category: 'antioxidant',
    time: 'pm',
    does: 'Powerful in the petri dish; delivery into skin is the hard part.',
    detail:
      'The red-wine molecule. Gorgeous in-vitro results, frustrating bioavailability — it degrades in light and barely penetrates. We include it micro-encapsulated in one night formula and publish the stability data. Judge accordingly.',
    provenance: 'Fermentation-derived, micro-encapsulated in lipid vesicles.',
    band: '0.5–1%',
    bandNote: 'Without encapsulation, most of it is decoration by week six.',
    evidence: 2,
    benefits: ['dullness', 'fine lines'],
    pairs: ['tocopherol', 'ubiquinone'],
  },
  {
    id: 'ubiquinone',
    name: 'Coenzyme Q10',
    inci: 'Ubiquinone',
    category: 'antioxidant',
    time: 'both',
    does: 'The skin’s own mitochondrial antioxidant, topped up from outside.',
    detail:
      'Skin makes less of it with age. Topical CoQ10 has a plausible mechanism and modest but real trial data for fine lines. Its deep yellow means the effective dose is visible — an honesty test for any "high-strength" Q10 cream sold in white.',
    provenance: 'Yeast fermentation; the yellow hue is the molecule itself.',
    band: '0.3–1%',
    bandNote: 'If the cream is white, ask questions.',
    evidence: 2,
    benefits: ['fine lines', 'dullness'],
    pairs: ['tocopherol', 'squalane'],
  },

  // ── Hydrators ────────────────────────────────────────────────────────
  {
    id: 'glycerin',
    name: 'Glycerin',
    inci: 'Glycerin',
    category: 'hydrator',
    time: 'both',
    does: 'Pulls water into the outer skin layers and keeps it there. Boring and essential.',
    detail:
      'The backbone humectant of essentially every good moisturiser ever made. Cheap, skin-identical, decades of safety data, and the reason a $46 cream can beat a $460 one. We state its percentage because most brands will not.',
    provenance: 'Vegetable-derived, rapeseed and soy, pharmaceutical grade.',
    band: '3–10%',
    bandNote: 'Over 15% feels sticky; under 2% is decoration.',
    evidence: 5,
    benefits: ['dehydration', 'barrier repair'],
    pairs: ['hyaluronic-acid', 'ceramide-np', 'panthenol'],
  },
  {
    id: 'hyaluronic-acid',
    name: 'Hyaluronic acid',
    inci: 'Sodium Hyaluronate',
    category: 'hydrator',
    time: 'both',
    does: 'Holds water at the skin surface for immediate, camera-visible plumping.',
    detail:
      'A humectant that binds many times its weight in water. We use three molecular weights: large for surface film, small for slightly deeper hydration, and we say "slightly" because no hyaluronic acid reaches the dermis. The plumping is real and temporary — it is a great morning ingredient.',
    provenance: 'Bacterial fermentation; no animal sourcing since the 1990s.',
    band: '0.1–0.5%',
    bandNote: 'It gels at low percentages; 2% solutions are mostly marketing arithmetic.',
    evidence: 4,
    benefits: ['dehydration', 'fine lines'],
    pairs: ['glycerin', 'beta-glucan', 'squalane'],
  },
  {
    id: 'panthenol',
    name: 'Panthenol',
    inci: 'Panthenol',
    category: 'hydrator',
    time: 'both',
    does: 'Hydrates and measurably speeds barrier recovery.',
    detail:
      'Provitamin B5. Converts to pantothenic acid in skin and feeds into coenzyme A — actual biochemistry, not vibes. One of the few humectants with decent data for wound-adjacent barrier repair.',
    provenance: 'Synthesised; D-panthenol only, the bioactive isomer.',
    band: '1–5%',
    bandNote: 'The repair studies run 2–5%.',
    evidence: 4,
    benefits: ['dehydration', 'barrier repair', 'sensitivity'],
    pairs: ['niacinamide', 'allantoin', 'centella'],
  },
  {
    id: 'sodium-pca',
    name: 'Sodium PCA',
    inci: 'Sodium PCA',
    category: 'hydrator',
    time: 'both',
    does: 'A skin-identical humectant — part of your own natural moisturising factor.',
    detail:
      'Your skin already uses PCA salts to hold water in the outer layer; this tops up the supply. Lightweight, invisible, and the sort of ingredient that never gets a billboard.',
    provenance: 'Fermented from beet-sugar amino acids.',
    band: '0.5–2%',
    bandNote: 'More feels tacky before it feels helpful.',
    evidence: 3,
    benefits: ['dehydration'],
    pairs: ['glycerin', 'niacinamide'],
  },
  {
    id: 'beta-glucan',
    name: 'Beta-glucan',
    inci: 'Beta-Glucan',
    category: 'hydrator',
    time: 'both',
    does: 'Hydrates deeply and calms reactivity — some data says deeper than hyaluronic acid.',
    detail:
      'An oat- or yeast-derived polysaccharide. Smaller fractions penetrate further than HA despite the larger molecule, and there is reasonable evidence for soothing post-procedure skin. Quietly one of our favourite ingredients.',
    provenance: 'Oat-derived, enzymatically fractionated.',
    band: '0.5–2%',
    bandNote: 'A little goes a long, slippery way.',
    evidence: 3,
    benefits: ['dehydration', 'sensitivity', 'redness'],
    pairs: ['hyaluronic-acid', 'colloidal-oat'],
  },

  // ── Barrier lipids ───────────────────────────────────────────────────
  {
    id: 'squalane',
    name: 'Squalane',
    inci: 'Squalane',
    category: 'barrier',
    time: 'both',
    does: 'A weightless emollient that mimics your skin’s own lipids.',
    detail:
      'Hydrogenated squalene — stable where its parent oxidises. Ours is sugarcane-derived; the historical source was shark liver, which is a sentence this industry should have to say out loud more often. Spreads like a dry oil, suits nearly everyone.',
    provenance: 'Sugarcane fermentation, hydrogenated. Never shark-derived.',
    band: '5–15%',
    bandNote: 'Pure squalane oils are fine too; in emulsions 5–10% is the sweet spot.',
    evidence: 4,
    benefits: ['dehydration', 'barrier repair', 'sensitivity'],
    pairs: ['ceramide-np', 'retinal', 'tocopherol'],
  },
  {
    id: 'ceramide-np',
    name: 'Ceramide NP',
    inci: 'Ceramide NP',
    category: 'barrier',
    time: 'both',
    does: 'Re-mortars the skin barrier’s brick wall.',
    detail:
      'The most abundant ceramide in healthy stratum corneum. It works best in the physiological ratio with cholesterol and fatty acids — roughly 3:1:1 — which is exactly how we formulate Hedgerow and exactly why we list all three percentages on the pack.',
    provenance: 'Bio-fermented; structurally identical to human ceramide NP.',
    band: '1–3%',
    bandNote: 'Alone it is half a mortar. Look for the full lipid trio.',
    evidence: 4,
    benefits: ['barrier repair', 'sensitivity', 'dehydration'],
    pairs: ['cholesterol', 'linoleic-acid', 'glycerin'],
  },
  {
    id: 'cholesterol',
    name: 'Cholesterol',
    inci: 'Cholesterol',
    category: 'barrier',
    time: 'both',
    does: 'The forgotten third of the barrier lipid trio.',
    detail:
      'Skip cholesterol and a ceramide cream underperforms — the lipid lamellae need all three members in ratio. Not glamorous, rarely on the front of the jar, always in our formula table.',
    provenance: 'Lanolin-derived, ultra-refined to remove allergenic alcohols.',
    band: '0.5–1.5%',
    bandNote: 'We run ceramide:cholesterol:fatty-acid at roughly 3:1:1 by design.',
    evidence: 3,
    benefits: ['barrier repair', 'dehydration'],
    pairs: ['ceramide-np', 'linoleic-acid', 'shea-butter'],
  },
  {
    id: 'linoleic-acid',
    name: 'Linoleic acid',
    inci: 'Linoleic Acid',
    category: 'barrier',
    time: 'both',
    does: 'The essential fatty acid your barrier cannot make for itself.',
    detail:
      'Omega-6, the third member of the barrier trio. Acne-prone skin is frequently low in it — sebum deficient in linoleate is thicker and more comedogenic. Topical replenishment is one of the better-supported dietary-adjacent claims in skincare.',
    provenance: 'Cold-pressed safflower oil fraction, nitrogen-flushed.',
    band: '1–3%',
    bandNote: 'Oxidises on exposure to air; fresh stock matters.',
    evidence: 3,
    benefits: ['barrier repair', 'breakouts'],
    pairs: ['ceramide-np', 'cholesterol'],
  },
  {
    id: 'jojoba-oil',
    name: 'Jojoba oil',
    inci: 'Simmondsia Chinensis Seed Oil',
    category: 'barrier',
    time: 'both',
    does: 'A liquid wax ester, not an oil — which is why skin tolerates it so well.',
    detail:
      'Structurally the closest botanical match to human sebum. Exceptionally oxidation-stable, non-greasy at sensible doses, and a fine vehicle for oil-soluble actives.',
    provenance: 'Cold-pressed from Sonoran-desert jojoba, first pressing only.',
    band: '2–10%',
    bandNote: 'Stable enough to outlive the jar, the shelf and possibly the brand.',
    evidence: 2,
    benefits: ['dehydration', 'barrier repair', 'sensitivity'],
    pairs: ['squalane', 'tocopherol'],
  },
  {
    id: 'rosehip-oil',
    name: 'Rosehip oil',
    inci: 'Rosa Canina Fruit Oil',
    category: 'barrier',
    time: 'pm',
    does: 'A nourishing omega oil with traces of natural trans-retinoic acid — traces being the honest word.',
    detail:
      'You will read that rosehip is "nature’s retinol". It contains detectable all-trans retinoic acid at levels hundreds of times below a 0.06% retinal serum. Enjoy it as a lovely linoleic-rich oil; do not retire your retinoid.',
    provenance: 'Cold-pressed Chilean rosehip seed, batch-tested for peroxide value.',
    band: '2–10%',
    bandNote: 'Refrigerate the raw oil; it goes rancid with enthusiasm.',
    evidence: 2,
    benefits: ['dehydration', 'dullness'],
    pairs: ['tocopherol', 'bisabolol'],
  },
  {
    id: 'shea-butter',
    name: 'Shea butter',
    inci: 'Butyrospermum Parkii Butter',
    category: 'barrier',
    time: 'both',
    does: 'A rich occlusive that seals water in overnight.',
    detail:
      'Occlusion is unglamorous and wildly effective: reduce water escape and the barrier repairs itself. Shea does this with a useful unsaponifiable fraction that has mild soothing data of its own.',
    provenance: 'Ghanaian fair-trade cooperative, hand-finished, unrefined grade.',
    band: '2–8%',
    bandNote: 'The unrefined grade keeps the soothing fraction; it also keeps the nutty smell.',
    evidence: 3,
    benefits: ['barrier repair', 'dehydration', 'sensitivity'],
    pairs: ['ceramide-np', 'colloidal-oat', 'squalane'],
  },

  // ── Soothers ─────────────────────────────────────────────────────────
  {
    id: 'centella',
    name: 'Centella asiatica',
    inci: 'Centella Asiatica Extract',
    category: 'soother',
    time: 'both',
    does: 'Calms visible redness and supports repair after strong actives.',
    detail:
      'Cica. The triterpenes (asiaticoside, madecassoside) have real wound-healing literature behind them — the herb has been in pharmacopoeias for centuries. We use a standardised extract, because "contains centella" without an assay is indistinguishable from "contains lawn".',
    provenance: 'Madagascan-grown, standardised to 40% asiaticosides.',
    band: '0.5–1%',
    bandNote: 'Standardised extract at 1% outperforms raw powder at 5%.',
    evidence: 3,
    benefits: ['redness', 'sensitivity', 'barrier repair'],
    pairs: ['retinal', 'panthenol', 'bisabolol'],
  },
  {
    id: 'colloidal-oat',
    name: 'Colloidal oatmeal',
    inci: 'Avena Sativa Kernel Flour',
    category: 'soother',
    time: 'both',
    does: 'A TGA-listed skin protectant that earns the listing.',
    detail:
      'One of very few cosmetic ingredients with a formal therapeutic monograph. Beta-glucans, avenanthramides and a lipid fraction combine into genuine anti-itch, anti-redness activity. Grandmother-approved, regulator-approved.',
    provenance: 'Australian-grown oats, micronised to a 75-micron suspension.',
    band: '1–2%',
    bandNote: 'The monograph concentration for leave-on products.',
    evidence: 4,
    benefits: ['sensitivity', 'redness', 'barrier repair'],
    pairs: ['shea-butter', 'beta-glucan', 'ceramide-np'],
  },
  {
    id: 'allantoin',
    name: 'Allantoin',
    inci: 'Allantoin',
    category: 'soother',
    time: 'both',
    does: 'Softens, soothes, and takes the edge off actives.',
    detail:
      'Nature makes it in comfrey root; we synthesise the identical molecule rather than strip fields. Keratolytic in the gentlest sense — it loosens dead cells while calming the ones staying. Almost never the star; frequently the reason the star is tolerable.',
    provenance: 'Synthesised; structurally identical to the comfrey molecule.',
    band: '0.2–1%',
    bandNote: 'Precipitates above ~0.5% in watery formulas — texture is the limit, not safety.',
    evidence: 3,
    benefits: ['sensitivity', 'texture'],
    pairs: ['panthenol', 'azelaic-acid'],
  },
  {
    id: 'bisabolol',
    name: 'Bisabolol',
    inci: 'Bisabolol',
    category: 'soother',
    time: 'both',
    does: 'Chamomile’s active fraction, isolated and dosed properly.',
    detail:
      'Levomenol, the (-)-alpha-bisabolol isomer, carries most of chamomile’s calming activity. Small anti-inflammatory trials exist; more importantly it lets retinoid users stay retinoid users.',
    provenance: 'Steam-distilled from Candeia wood or synthesised; we assay isomer purity either way.',
    band: '0.1–0.5%',
    bandNote: 'Effective well under 1%; listed doses above that are rounding errors in disguise.',
    evidence: 3,
    benefits: ['redness', 'sensitivity'],
    pairs: ['retinal', 'centella', 'squalane'],
  },
  {
    id: 'zinc-pca',
    name: 'Zinc PCA',
    inci: 'Zinc PCA',
    category: 'soother',
    time: 'both',
    does: 'Tempers surface oil and takes the heat out of breakout-prone skin.',
    detail:
      'Zinc bonded to skin-identical PCA so it actually penetrates. Modest data for sebum reduction and mild antibacterial action; as a supporting player in a niacinamide serum it punches sensibly.',
    provenance: 'Mineral zinc chelated with fermented PCA.',
    band: '0.5–1%',
    bandNote: 'Over 1% the formula starts tasting like lozenges smell.',
    evidence: 2,
    benefits: ['pores', 'breakouts', 'redness'],
    pairs: ['niacinamide', 'salicylic-acid'],
  },

  // ── UV filters ───────────────────────────────────────────────────────
  {
    id: 'zinc-oxide',
    name: 'Zinc oxide',
    inci: 'Zinc Oxide',
    category: 'sunscreen',
    time: 'am',
    does: 'The broad-spectrum mineral filter — UVA and UVB in one powder.',
    detail:
      'A physical filter that also quietly calms skin (ask any nappy cream). Non-nano in our fluid: slightly less invisible, considerably less argued-about. The regulatory gold standard in the US and a backbone everywhere else.',
    provenance: 'French-process zinc, non-nano, surface-coated for dispersion.',
    band: '12–25%',
    bandNote: 'High SPF from zinc alone needs big percentages — and honest texture trade-offs.',
    evidence: 5,
    benefits: ['sensitivity', 'redness'],
    pairs: ['tinosorb-s', 'niacinamide'],
  },
  {
    id: 'tinosorb-s',
    name: 'Tinosorb S',
    inci: 'Bis-Ethylhexyloxyphenol Methoxyphenyl Triazine',
    category: 'sunscreen',
    time: 'am',
    does: 'A photostable modern filter that guards UVA and UVB without wearing out.',
    detail:
      'Bemotrizinol. Older filters degrade in sunlight — the product photographs its own failure. Tinosorb S does not, and it stabilises everything around it. Not approved in the US (an FDA queue problem, not a safety finding), completely standard in Australia and the EU.',
    provenance: 'Swiss-made, micronised, oil-phase dispersed.',
    band: '2–4%',
    bandNote: 'EU and TGA cap it at 10% and 10% respectively; real formulas sit far lower.',
    evidence: 5,
    benefits: ['dark spots', 'fine lines'],
    pairs: ['uvinul-a-plus', 'zinc-oxide'],
  },
  {
    id: 'uvinul-a-plus',
    name: 'Uvinul A Plus',
    inci: 'Diethylamino Hydroxybenzoyl Hexyl Benzoate',
    category: 'sunscreen',
    time: 'am',
    does: 'The best UVA1 filter in general use — the deep-ageing rays.',
    detail:
      'UVA1 (340–400nm) sneaks through glass and through most sunscreens’ weak spot. This filter exists specifically to close that gap, photostably. Unphotogenic INCI name, excellent at its one job.',
    provenance: 'German-synthesised, photostability-tested to 25 MED.',
    band: '1–3%',
    bandNote: 'Small dose, big UVA-PF contribution.',
    evidence: 5,
    benefits: ['dark spots', 'fine lines'],
    pairs: ['tinosorb-s', 'zinc-oxide'],
  },

  // ── Base & texture ───────────────────────────────────────────────────
  {
    id: 'cocamidopropyl-betaine',
    name: 'Cocamidopropyl betaine',
    inci: 'Cocamidopropyl Betaine',
    category: 'base',
    time: 'both',
    does: 'Cleanses at skin-neutral pH without the squeak — the squeak is damage.',
    detail:
      'A coconut-derived amphoteric surfactant that softens harsher detergents in the blend. "Squeaky clean" is your barrier lipids leaving the building; this molecule is why ours do not.',
    provenance: 'Coconut fatty acids reacted with a betaine group; highly purified to cut amidoamine residues.',
    band: '6–12% (rinse-off)',
    bandNote: 'Rinse-off rules differ from leave-on; residue after rinsing is near zero.',
    evidence: 4,
    benefits: ['sensitivity'],
    pairs: ['glycerin', 'panthenol'],
  },
  {
    id: 'kaolin',
    name: 'Kaolin',
    inci: 'Kaolin',
    category: 'base',
    time: 'pm',
    does: 'A soft white clay that wicks surface oil without stripping.',
    detail:
      'The gentlest of the mask clays. It binds sebum by surface area, not by dissolving your barrier, which is why it suits weekly use on skin that bentonite would sandblast.',
    provenance: 'Kaolinite from Cornish deposits, water-washed, unbleached.',
    band: '10–25% (rinse-off)',
    bandNote: 'A mask is a moment, not a lifestyle. Once or twice a week.',
    evidence: 2,
    benefits: ['pores', 'breakouts'],
    pairs: ['glycolic-acid', 'allantoin'],
  },
  {
    id: 'licorice',
    name: 'Licorice root',
    inci: 'Dipotassium Glycyrrhizate',
    category: 'soother',
    time: 'both',
    does: 'Calms redness and quietly discourages new pigment.',
    detail:
      'The glycyrrhizate salt soothes; the related glabridin fraction inhibits tyrosinase. We use the salt for its water solubility and tolerability, and we say plainly that the brightening effect is a supporting act, not a headline.',
    provenance: 'Cultivated Glycyrrhiza glabra, salt-extracted and purified.',
    band: '0.2–0.5%',
    bandNote: 'Effective far below 1%; a wash-off dose is a courtesy to your rinse water.',
    evidence: 2,
    benefits: ['redness', 'dark spots', 'sensitivity'],
    pairs: ['green-tea', 'niacinamide'],
  },
]

export const INGREDIENT_BY_ID = new Map(INGREDIENTS.map((i) => [i.id, i]))

// ── Conflict ledger ─────────────────────────────────────────────────────

export type Severity = 'avoid' | 'caution' | 'fine'

export interface Conflict {
  a: string
  b: string
  severity: Severity
  note: string
}

export const CONFLICTS: Conflict[] = [
  {
    a: 'retinal',
    b: 'retinol',
    severity: 'avoid',
    note: 'Two retinoids is double the peel, not double the result. Pick one molecule and learn it.',
  },
  {
    a: 'retinal',
    b: 'glycolic-acid',
    severity: 'avoid',
    note: 'Retinal over leave-on glycolic stacks irritation for no measured gain. Alternate nights instead.',
  },
  {
    a: 'retinal',
    b: 'lactic-acid',
    severity: 'avoid',
    note: 'A gentler AHA, but the same rule: retinoid nights and acid nights should alternate.',
  },
  {
    a: 'retinol',
    b: 'glycolic-acid',
    severity: 'avoid',
    note: 'The classic over-exfoliation injury. Retinol nights and glycolic nights must not share a pillow.',
  },
  {
    a: 'retinol',
    b: 'lactic-acid',
    severity: 'avoid',
    note: 'Alternate nights. Your barrier will write a thank-you note.',
  },
  {
    a: 'retinal',
    b: 'mandelic-acid',
    severity: 'caution',
    note: 'Mandelic is the gentlest AHA and some skins tolerate the pairing. Introduce one at a time, weeks apart.',
  },
  {
    a: 'retinal',
    b: 'salicylic-acid',
    severity: 'caution',
    note: 'Leave-on BHA under retinal needs a slow ramp. A wash-off BHA cleanser earlier in the routine is fine.',
  },
  {
    a: 'retinol',
    b: 'salicylic-acid',
    severity: 'caution',
    note: 'Same caution: leave-on BHA plus retinol irritates more often than it helps. Keep the BHA in a cleanser.',
  },
  {
    a: 'retinal',
    b: 'benzoyl-peroxide',
    severity: 'avoid',
    note: 'Benzoyl peroxide oxidises retinoids on contact — each deactivates the other. Split AM/PM or alternate days.',
  },
  {
    a: 'retinol',
    b: 'benzoyl-peroxide',
    severity: 'avoid',
    note: 'Same chemistry, same verdict: together they neutralise and irritate. Never the same session.',
  },
  {
    a: 'ascorbic-acid',
    b: 'benzoyl-peroxide',
    severity: 'avoid',
    note: 'Peroxide turns vitamin C into dehydroascorbic acid within minutes. Different halves of the day.',
  },
  {
    a: 'ascorbic-acid',
    b: 'copper-peptides',
    severity: 'caution',
    note: 'Low-pH ascorbic acid can strip the copper from GHK-Cu and inactivate it. Separate them by half a day.',
  },
  {
    a: 'ascorbic-acid',
    b: 'retinal',
    severity: 'caution',
    note: 'Acidic vitamin C under retinal irritates some skins. The classic split — C in the morning, retinal at night — exists for a reason.',
  },
  {
    a: 'ascorbic-acid',
    b: 'retinol',
    severity: 'caution',
    note: 'Workable for hardy skin, unwise for most. Keep vitamin C to AM and retinol to PM.',
  },
  {
    a: 'ascorbic-acid',
    b: 'niacinamide',
    severity: 'fine',
    note: 'The old “they cancel each other out” claim comes from 1960s stability tests that do not apply on skin. They coexist happily; mild warmth is possible at high doses.',
  },
  {
    a: 'bakuchiol',
    b: 'retinal',
    severity: 'fine',
    note: 'Early evidence suggests bakuchiol buffers retinoid irritation rather than adding to it. A sensible pair.',
  },
  {
    a: 'bakuchiol',
    b: 'retinol',
    severity: 'fine',
    note: 'The trial that made bakuchiol famous used it alongside retinol-style regimens. They get along.',
  },
  {
    a: 'glycolic-acid',
    b: 'salicylic-acid',
    severity: 'caution',
    note: 'Two leave-on exfoliants in one session is a texture gamble. Cap acid nights at two per week.',
  },
  {
    a: 'lactic-acid',
    b: 'salicylic-acid',
    severity: 'caution',
    note: 'Possible for seasoned skin, pointless for a Tuesday. Alternate.',
  },
  {
    a: 'glycolic-acid',
    b: 'lactic-acid',
    severity: 'caution',
    note: 'Two AHAs rarely beat one used consistently. Pick the molecule that suits your skin and keep a calendar.',
  },
  {
    a: 'azelaic-acid',
    b: 'retinal',
    severity: 'caution',
    note: 'Usually tolerated — azelaic is mild — but on reactive skin introduce them weeks apart.',
  },
  {
    a: 'azelaic-acid',
    b: 'retinol',
    severity: 'caution',
    note: 'A dermatologist-approved pair at prescription level, but cosmetic users should still ramp slowly.',
  },
  {
    a: 'ascorbic-acid',
    b: 'ferulic-acid',
    severity: 'fine',
    note: 'The famous pairing: ferulic stabilises vitamin C and roughly doubles the formula’s measured photoprotection.',
  },
  {
    a: 'ascorbic-acid',
    b: 'tocopherol',
    severity: 'fine',
    note: 'Vitamin C regenerates oxidised vitamin E. Formulated together since before it was fashionable.',
  },
]

export interface ConflictHit extends Conflict {
  /** Which half of the day the collision happened in, set by the caller. */
  when?: 'am' | 'pm'
}

/** All conflicts touching one ingredient. */
export function conflictsFor(id: string): Conflict[] {
  return CONFLICTS.filter((c) => c.a === id || c.b === id)
}

/** Conflicts ignited by a set of ingredients used in one session. */
export function conflictsBetween(ids: string[]): Conflict[] {
  const set = new Set(ids)
  return CONFLICTS.filter((c) => set.has(c.a) && set.has(c.b))
}

// ── Formulations ────────────────────────────────────────────────────────

export const RADAR_AXES = ['Hydration', 'Barrier', 'Brightness', 'Calm', 'Defence'] as const
export type RadarAxis = (typeof RADAR_AXES)[number]

export type Slot = 'cleanse' | 'treat' | 'hydrate' | 'seal' | 'protect'

export const SLOT_ORDER: Slot[] = ['cleanse', 'treat', 'hydrate', 'seal', 'protect']

export const SLOT_LABELS: Record<Slot, string> = {
  cleanse: 'Cleanse',
  treat: 'Treat',
  hydrate: 'Hydrate',
  seal: 'Seal',
  protect: 'Protect',
}

export interface FormulaEntry {
  ing: string
  pct: number
  purpose: string
}

export interface Formula {
  id: string
  name: string
  kind: string
  price: number
  size: string
  slot: Slot
  timeSuggest: TimeOfDay
  does: string
  wont: string
  formula: FormulaEntry[]
  radar: Record<RadarAxis, number>
}

export const FORMULAS: Formula[] = [
  {
    id: 'field-notes',
    name: 'Field Notes',
    kind: 'Gel cleanser',
    price: 28,
    size: '150 ml',
    slot: 'cleanse',
    timeSuggest: 'both',
    does: 'Removes sunscreen and the day without the squeak.',
    wont: 'Treat anything. It is a wash-off — no cleanser can.',
    formula: [
      { ing: 'cocamidopropyl-betaine', pct: 9, purpose: 'Primary surfactant — coconut-derived, pH 5.5' },
      { ing: 'glycerin', pct: 5, purpose: 'Humectant; stops the wash from stripping' },
      { ing: 'panthenol', pct: 1, purpose: 'Barrier support in the rinse window' },
      { ing: 'green-tea', pct: 1, purpose: 'Antioxidant, standardised — functional rinse-off dose' },
      { ing: 'licorice', pct: 0.3, purpose: 'Calming co-solute' },
    ],
    radar: { Hydration: 2, Barrier: 2, Brightness: 1, Calm: 4, Defence: 1 },
  },
  {
    id: 'plot-nine',
    name: 'Plot 9',
    kind: 'Niacinamide serum',
    price: 42,
    size: '30 ml',
    slot: 'treat',
    timeSuggest: 'both',
    does: 'Calms, de-shines, slowly evens tone.',
    wont: 'Resurface, peel, or fade deep-set pigment.',
    formula: [
      { ing: 'niacinamide', pct: 4, purpose: 'Redness, pores, barrier — capped at 4% on purpose' },
      { ing: 'panthenol', pct: 2, purpose: 'Hydration plus repair co-factor' },
      { ing: 'beta-glucan', pct: 1.5, purpose: 'Deep humectant, reactivity calmer' },
      { ing: 'zinc-pca', pct: 1, purpose: 'Oil tempering for shine-prone skin' },
      { ing: 'sodium-pca', pct: 1, purpose: 'Skin-identical humectant' },
    ],
    radar: { Hydration: 4, Barrier: 4, Brightness: 3, Calm: 4, Defence: 1 },
  },
  {
    id: 'morning-proof',
    name: 'Morning Proof',
    kind: 'Vitamin C 10%',
    price: 54,
    size: '30 ml',
    slot: 'treat',
    timeSuggest: 'am',
    does: 'Brightens, evens, and hardens your sunscreen’s line.',
    wont: 'Work from an amber bottle. Oxidised C is expensive tea.',
    formula: [
      { ing: 'ascorbic-acid', pct: 10, purpose: 'The evidence-backed form, at pH 3.2 because it must be' },
      { ing: 'tocopherol', pct: 1, purpose: 'The E in the classic CE pairing; C regenerates it' },
      { ing: 'ferulic-acid', pct: 0.5, purpose: 'Stabilises the pair; doubles measured photoprotection' },
      { ing: 'panthenol', pct: 1, purpose: 'Takes the acid’s edge off' },
      { ing: 'hyaluronic-acid', pct: 0.3, purpose: 'Slip and surface hydration' },
    ],
    radar: { Hydration: 2, Barrier: 1, Brightness: 5, Calm: 1, Defence: 3 },
  },
  {
    id: 'night-margin',
    name: 'Night Margin',
    kind: 'Retinal 0.06%',
    price: 58,
    size: '30 ml',
    slot: 'treat',
    timeSuggest: 'pm',
    does: 'Turnover, texture, lines — the evening engine.',
    wont: 'Be gentle in week one. That would be a lie.',
    formula: [
      { ing: 'squalane', pct: 8, purpose: 'Emollient vehicle; cushions the retinoid' },
      { ing: 'shea-butter', pct: 2, purpose: 'Occlusion through the night hours' },
      { ing: 'centella', pct: 1, purpose: 'Standardised cica — repair while you turn over' },
      { ing: 'tocopherol', pct: 0.5, purpose: 'Protects the retinal from oxidising in the bottle' },
      { ing: 'bisabolol', pct: 0.3, purpose: 'Chamomile’s active fraction, for week one' },
      { ing: 'retinal', pct: 0.06, purpose: 'The engine. One conversion step from retinoic acid' },
    ],
    radar: { Hydration: 2, Barrier: 3, Brightness: 2, Calm: 3, Defence: 1 },
  },
  {
    id: 'hedgerow',
    name: 'Hedgerow',
    kind: 'Barrier cream',
    price: 46,
    size: '50 ml',
    slot: 'seal',
    timeSuggest: 'both',
    does: 'Re-mortars the wall. Fixes winter face.',
    wont: 'Brighten, peel, or tingle. That is the point.',
    formula: [
      { ing: 'shea-butter', pct: 6, purpose: 'Occlusive backbone, fair-trade unrefined' },
      { ing: 'glycerin', pct: 6, purpose: 'The humectant that does the quiet heavy lifting' },
      { ing: 'squalane', pct: 5, purpose: 'Weightless lipid, skin-identical feel' },
      { ing: 'linoleic-acid', pct: 3, purpose: 'The fatty-acid third of the barrier ratio' },
      { ing: 'ceramide-np', pct: 2, purpose: 'Re-mortars the brick wall' },
      { ing: 'cholesterol', pct: 1, purpose: 'The forgotten third — the ratio needs it' },
      { ing: 'colloidal-oat', pct: 1, purpose: 'Monographed skin protectant' },
    ],
    radar: { Hydration: 4, Barrier: 5, Brightness: 1, Calm: 4, Defence: 1 },
  },
  {
    id: 'field-day',
    name: 'Field Day',
    kind: 'SPF50 fluid',
    price: 38,
    size: '50 ml',
    slot: 'protect',
    timeSuggest: 'am',
    does: 'Broad-spectrum SPF50 that closes the UVA1 gap.',
    wont: 'Feel like nothing. Honest SPF rarely does.',
    formula: [
      { ing: 'zinc-oxide', pct: 12, purpose: 'Mineral broad-spectrum filter, non-nano' },
      { ing: 'glycerin', pct: 4, purpose: 'Humectant — sunscreen should not dry you out' },
      { ing: 'tinosorb-s', pct: 3, purpose: 'Photostable modern filter; stabilises the whole system' },
      { ing: 'uvinul-a-plus', pct: 2.5, purpose: 'The UVA1 specialist' },
      { ing: 'niacinamide', pct: 2, purpose: 'Calms under the filter load' },
    ],
    radar: { Hydration: 2, Barrier: 2, Brightness: 1, Calm: 2, Defence: 5 },
  },
  {
    id: 'clearing',
    name: 'Clearing',
    kind: 'Azelaic lotion',
    price: 44,
    size: '30 ml',
    slot: 'treat',
    timeSuggest: 'both',
    does: 'Fades spots and calms congestion, gently.',
    wont: 'Work in a fortnight. Give it eight honest weeks.',
    formula: [
      { ing: 'azelaic-acid', pct: 10, purpose: 'The OTC ceiling in Australia' },
      { ing: 'tranexamic-acid', pct: 3, purpose: 'Interrupts the pigment signal upstream' },
      { ing: 'panthenol', pct: 3, purpose: 'Repair support for breakout-stressed skin' },
      { ing: 'allantoin', pct: 0.5, purpose: 'Softens the active’s edge' },
    ],
    radar: { Hydration: 2, Barrier: 2, Brightness: 4, Calm: 4, Defence: 1 },
  },
  {
    id: 'rake',
    name: 'Rake',
    kind: 'Lactic tonic',
    price: 36,
    size: '100 ml',
    slot: 'treat',
    timeSuggest: 'pm',
    does: 'Gentle resurfacing; a twice-weekly glow on a schedule.',
    wont: 'Replace a retinoid — or your judgement.',
    formula: [
      { ing: 'lactic-acid', pct: 5, purpose: 'The kinder AHA, buffered to pH 3.8' },
      { ing: 'glycerin', pct: 3, purpose: 'Hydrates while the acid works' },
      { ing: 'gluconolactone', pct: 2, purpose: 'PHA softener for the acid curve' },
      { ing: 'beta-glucan', pct: 1, purpose: 'Post-acid calm' },
    ],
    radar: { Hydration: 3, Barrier: 1, Brightness: 3, Calm: 2, Defence: 1 },
  },
]

export const FORMULA_BY_ID = new Map(FORMULAS.map((f) => [f.id, f]))

// ── Routine analysis ────────────────────────────────────────────────────

export interface Notice {
  severity: Severity | 'info'
  text: string
}

/** Ingredient ids present in a set of formulas. */
export function ingredientIdsOf(formulaIds: string[]): string[] {
  const ids: string[] = []
  for (const fid of formulaIds) {
    const f = FORMULA_BY_ID.get(fid)
    if (f) for (const e of f.formula) ids.push(e.ing)
  }
  return ids
}

/** All active-category ingredient ids in a formula (used for conflict checks). */
export function activesOf(f: Formula): string[] {
  return f.formula
    .filter((e) => {
      const ing = INGREDIENT_BY_ID.get(e.ing)
      return ing && (ing.category === 'active' || ing.category === 'exfoliant' || ing.category === 'antioxidant')
    })
    .map((e) => e.ing)
}

export function analyseRoutine(am: string[], pm: string[]): Notice[] {
  const notices: Notice[] = []

  for (const [when, ids] of [['am', am], ['pm', pm]] as const) {
    if (!ids.length) continue
    const ingIds = ingredientIdsOf(ids)
    for (const c of conflictsBetween(ingIds)) {
      const an = INGREDIENT_BY_ID.get(c.a)?.name ?? c.a
      const bn = INGREDIENT_BY_ID.get(c.b)?.name ?? c.b
      notices.push({
        severity: c.severity,
        text: `${when === 'am' ? 'Morning' : 'Evening'}: ${an} × ${bn} — ${c.note}`,
      })
    }
  }

  const amFormulas = am.map((id) => FORMULA_BY_ID.get(id)).filter(Boolean) as Formula[]
  const pmFormulas = pm.map((id) => FORMULA_BY_ID.get(id)).filter(Boolean) as Formula[]

  if (am.length && !amFormulas.some((f) => f.slot === 'protect')) {
    notices.push({
      severity: 'caution',
      text: 'Morning: no UV step. Every brightening active you own is quietly undone without one.',
    })
  }
  if (pm.length && !pmFormulas.some((f) => f.slot === 'cleanse')) {
    notices.push({ severity: 'info', text: 'Evening: no cleanse step. Actives perform better on a clean face.' })
  }
  if (am.length && !amFormulas.some((f) => f.slot === 'cleanse')) {
    notices.push({ severity: 'info', text: 'Morning: no cleanse. A water rinse or a gentle gel — your call, sleep is clean-ish.' })
  }

  for (const [label, formulas] of [['Morning', amFormulas], ['Evening', pmFormulas]] as const) {
    const acids = formulas.filter((f) => activesOf(f).some((id) => INGREDIENT_BY_ID.get(id)?.category === 'exfoliant'))
    if (acids.length > 1) {
      notices.push({
        severity: 'caution',
        text: `${label}: ${acids.length} exfoliating products in one session. The ledger recommends one acid per session.`,
      })
    }
    const order = formulas.map((f) => SLOT_ORDER.indexOf(f.slot))
    const sorted = [...order].sort((a, b) => a - b)
    if (order.length > 1 && order.some((v, i) => v !== sorted[i])) {
      notices.push({
        severity: 'info',
        text: `${label}: steps run out of the usual order. Thin to thick: cleanse → treat → seal → protect.`,
      })
    }
  }

  if (am.length || pm.length) {
    const all = [...amFormulas, ...pmFormulas]
    const spend = all.reduce((n, f) => n + f.price, 0)
    notices.push({
      severity: 'info',
      text: `Shelf cost: the full ritual prices at $${spend} AUD — ${all.length} product${all.length === 1 ? '' : 's'}, every percentage disclosed.`,
    })
  }
  return notices
}

// ── Share encoding ──────────────────────────────────────────────────────

export interface RoutineShare {
  am: string[]
  pm: string[]
}

export function encodeRoutine(r: RoutineShare): string {
  const json = JSON.stringify({ a: r.am, p: r.pm })
  return btoa(json).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

export function decodeRoutine(s: string): RoutineShare | null {
  try {
    const b64 = s.replace(/-/g, '+').replace(/_/g, '/')
    const json = atob(b64 + '='.repeat((4 - (b64.length % 4)) % 4))
    const parsed = JSON.parse(json) as { a?: unknown; p?: unknown }
    const ok = (v: unknown): v is string[] => Array.isArray(v) && v.every((x) => typeof x === 'string' && FORMULA_BY_ID.has(x))
    if (ok(parsed.a) && ok(parsed.p)) return { am: parsed.a, pm: parsed.p }
    return null
  } catch {
    return null
  }
}

export function routineToText(name: string, am: string[], pm: string[]): string {
  const lines: string[] = [`GLADE — ${name}`, '']
  const half = (label: string, ids: string[]) => {
    if (!ids.length) return
    lines.push(label)
    ids.forEach((fid, i) => {
      const f = FORMULA_BY_ID.get(fid)
      if (f) lines.push(`  ${i + 1}. ${f.name} — ${f.kind} ($${f.price}, ${f.size})`)
    })
    lines.push('')
  }
  half('MORNING', am)
  half('EVENING', pm)
  for (const n of analyseRoutine(am, pm)) {
    const tag = n.severity === 'avoid' ? '✕' : n.severity === 'caution' ? '△' : n.severity === 'fine' ? '✓' : 'ℹ'
    lines.push(`${tag} ${n.text}`)
  }
  lines.push('', 'Every concentration disclosed at glade.example — a fictional demo by Brassfern.')
  return lines.join('\n')
}
