import { validatedDocuments, type KnowledgeDocument } from './documents'

/**
 * Iowa corn terminology synonyms — maps farmer plain-language to the
 * technical vocabulary used in the knowledge base.
 */
const synonyms: Record<string, string[]> = {
  // ── Crop ─────────────────────────────────────────────────────────────────
  corn: ['maize', 'corn'],
  maize: ['corn', 'maize'],

  // ── Nutrients ─────────────────────────────────────────────────────────────
  nitrogen: ['nitrogen', 'N', 'nitrate'],
  'nitrate-n': ['nitrate', 'nitrogen'],
  potassium: ['potassium', 'K', 'potash'],
  sulfur: ['sulfur', 'sulphur', 'S'],
  phosphorus: ['phosphorus', 'P', 'phosphate'],
  fertilizer: ['fertilizer', 'nitrogen', 'nutrient'],
  n: ['nitrogen', 'nitrate'],

  // ── Nitrogen loss/management ───────────────────────────────────────────────
  denitrification: ['denitrification', 'nitrogen loss'],
  leaching: ['leaching', 'nitrogen loss'],
  'rescue n': ['rescue nitrogen', 'sidedress'],
  sidedress: ['sidedress', 'in-season nitrogen'],
  psnt: ['pre-sidedress nitrate test', 'PSNT', 'late spring nitrate test'],
  lsnt: ['late spring nitrate test', 'LSNT', 'PSNT'],
  mrtn: ['maximum return to nitrogen', 'MRTN', 'optimum N rate'],
  'yield goal': ['nitrogen rate', 'MRTN'],

  // ── Yellowing / deficiency ─────────────────────────────────────────────────
  yellow: ['yellow', 'yellowing', 'chlorosis', 'deficiency'],
  yellowing: ['yellow', 'chlorosis', 'N deficiency'],
  chlorosis: ['yellow', 'chlorosis', 'deficiency'],
  'wet feet': ['saturated soil', 'flooded', 'wet roots'],
  saturated: ['saturated soil', 'wet feet', 'flooded'],

  // ── Replant ───────────────────────────────────────────────────────────────
  replant: ['replant', 'replanting', 're-plant'],
  replanting: ['replant', 'stand evaluation'],
  stand: ['stand count', 'plants per acre', 'emergence'],
  'stand count': ['stand count', 'plants per acre'],
  gdu: ['growing degree unit', 'GDU', 'heat unit'],
  emergence: ['emergence', 'germination', 'GDU'],
  hail: ['hail', 'hail damage', 'storm damage'],
  flood: ['flooding', 'submersion', 'saturated soil'],
  flooding: ['flood', 'wet feet', 'saturated soil'],

  // ── Disease ───────────────────────────────────────────────────────────────
  rust: ['rust', 'southern rust', 'pustules'],
  'southern rust': ['southern rust', 'Puccinia polysora', 'rust'],
  fungicide: ['fungicide', 'disease control', 'spray'],
  gls: ['gray leaf spot', 'GLS', 'Cercospora'],
  'gray leaf spot': ['gray leaf spot', 'GLS', 'Cercospora'],
  nclb: ['northern corn leaf blight', 'NCLB', 'cigar-shaped'],
  'northern corn leaf blight': ['NCLB', 'cigar-shaped lesion'],
  'tar spot': ['tar spot', 'Phyllachora maydis', 'black spots'],
  'bacterial leaf streak': ['bacterial leaf streak', 'wavy lesions', 'Xanthomonas'],

  // ── Weeds ─────────────────────────────────────────────────────────────────
  waterhemp: ['waterhemp', 'Amaranthus tuberculatus', 'weed resistance'],
  'palmer amaranth': ['Palmer amaranth', 'pigweed', 'waterhemp'],
  pigweed: ['waterhemp', 'Palmer amaranth'],
  herbicide: ['herbicide', 'weed control', 'post-emergence'],
  'pre-emergence': ['pre-emergence', 'pre-em', 'residual herbicide'],
  preen: ['pre-emergence', 'residual'],
  resistance: ['herbicide resistance', 'weed resistance'],
  burndown: ['burndown', 'preplant', 'pre-emergence'],

  // ── Planting ──────────────────────────────────────────────────────────────
  'soil temperature': ['soil temperature', '50°F', 'planting conditions'],
  planting: ['planting', 'planting date', 'seeding'],
  'late planting': ['late planting', 'delayed planting', 'yield penalty'],
  maturity: ['relative maturity', 'RM', 'hybrid maturity'],
  'no-till': ['no-till', 'no till', 'conservation tillage'],
  notill: ['no-till', 'residue', 'soil warming'],
  residue: ['residue', 'no-till', 'cover crop'],
  'row cleaner': ['row cleaner', 'soil warming', 'no-till'],
  depth: ['planting depth', 'seed depth'],

  // ── Pests ─────────────────────────────────────────────────────────────────
  aphid: ['corn aphid', 'aphid', 'threshold'],
  aphids: ['corn aphid', 'aphid threshold'],
  rootworm: ['corn rootworm', 'Diabrotica', 'lodging'],
  'corn rootworm': ['rootworm', 'Diabrotica virgifera'],
  'black cutworm': ['black cutworm', 'cutworm', 'moth trapping'],
  'japanese beetle': ['Japanese beetle', 'silk clipping', 'threshold'],
  lodging: ['lodging', 'stalk strength', 'rootworm'],

  // ── Harvest / Storage ─────────────────────────────────────────────────────
  harvest: ['harvest', 'combine', 'grain quality'],
  moisture: ['moisture', 'grain moisture', 'drying'],
  drying: ['drying', 'artificial drying', 'LP gas'],
  storage: ['storage', 'grain storage', 'aeration'],
  shrink: ['shrink', 'shrinkage', 'weight loss'],
  frost: ['frost', 'freeze', 'black layer'],
  'black layer': ['black layer', 'physiological maturity'],
  combine: ['combine', 'harvest settings', 'rotor'],

  // ── Economics ─────────────────────────────────────────────────────────────
  breakeven: ['breakeven', 'cost of production', 'margin'],
  roi: ['return on investment', 'ROI', 'economics'],
  'cost of production': ['breakeven', 'cost', 'margin'],
  rotation: ['crop rotation', 'corn-after-corn', 'soybean'],
  'corn after corn': ['continuous corn', 'corn-after-corn', 'rotation'],

  // ── Cover crops / compaction ───────────────────────────────────────────────
  'cover crop': ['cover crop', 'cereal rye', 'termination'],
  'cereal rye': ['cover crop', 'termination'],
  termination: ['cover crop termination', 'burndown'],
  compaction: ['compaction', 'tillage', 'soil structure'],
  tillage: ['tillage', 'compaction', 'spring tillage'],

  // ── English variants ───────────────────────────────────────────────────────
  spots: ['lesion', 'disease', 'spots'],
  spot: ['lesion', 'disease'],
  blight: ['blight', 'disease'],
  rot: ['rot', 'seed rot', 'rotten'],
  bugs: ['insect', 'pest'],
  bug: ['insect', 'pest'],
  spray: ['fungicide', 'herbicide', 'insecticide'],
  worms: ['caterpillar', 'cutworm', 'armyworm'],
  worm: ['caterpillar', 'cutworm'],
  losing: ['economics', 'loss', 'cost'],
  money: ['economics', 'breakeven', 'profit'],
}

const stopwords = new Set(
  'a an the is are was were be my our your of to in on for and or with what how why when do does i we it this that there can should which from at by me have has will would could n ma sa get got'.split(
    ' ',
  ),
)

export function tokenize(text: string): string[] {
  const base = text
    .toLowerCase()
    .replace(/[^a-z0-9\s'_\-]/g, ' ')
    .split(/\s+/)
    .filter((t) => t.length > 1 && !stopwords.has(t))
  const expanded: string[] = []
  for (const t of base) {
    expanded.push(t)
    const stem = t.replace(/(ing|tion|es|ed|s)$/, '')
    if (stem !== t && stem.length > 2) expanded.push(stem)
    for (const s of synonyms[t] ?? []) expanded.push(...s.split(' '))
  }
  return expanded
}

interface IndexedDoc {
  doc: KnowledgeDocument
  tf: Map<string, number>
  length: number
}

const index: IndexedDoc[] = validatedDocuments.map((doc) => {
  const tokens = tokenize(`${doc.title} ${doc.tags.join(' ')} ${doc.tags.join(' ')} ${doc.body}`)
  const tf = new Map<string, number>()
  for (const t of tokens) tf.set(t, (tf.get(t) ?? 0) + 1)
  return { doc, tf, length: tokens.length }
})

const avgLength = index.reduce((s, d) => s + d.length, 0) / Math.max(index.length, 1)

function idf(term: string) {
  const n = index.filter((d) => d.tf.has(term)).length
  return Math.log(1 + (index.length - n + 0.5) / (n + 0.5))
}

export interface RetrievalHit {
  id: string
  title: string
  topic: string
  source: string
  validatedBy: string
  region: string
  score: number
  excerpt: string
}

/** Minimum BM25 score for a passage to count as grounding. Below it, the agent must refuse. */
export const MIN_SCORE = 0.5

export function search(query: string, k = 3): RetrievalHit[] {
  const terms = [...new Set(tokenize(query))]
  const k1 = 1.4
  const b = 0.75
  return index
    .map(({ doc, tf, length }) => {
      let score = 0
      for (const term of terms) {
        const f = tf.get(term)
        if (!f) continue
        score += idf(term) * ((f * (k1 + 1)) / (f + k1 * (1 - b + (b * length) / avgLength)))
      }
      return { doc, score }
    })
    .filter((h) => h.score >= MIN_SCORE)
    .sort((a, b) => b.score - a.score)
    .slice(0, k)
    .map(({ doc, score }) => ({
      id: doc.id,
      title: doc.title,
      topic: doc.topic,
      source: doc.source,
      validatedBy: doc.validatedBy,
      region: doc.region,
      score: Math.round(score * 100) / 100,
      excerpt: doc.body,
    }))
}
