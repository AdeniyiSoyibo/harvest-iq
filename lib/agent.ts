import 'server-only'
import { ToolLoopAgent, Output, generateText, isStepCount, tool } from 'ai'
import { z } from 'zod'
import { search, tokenize, type RetrievalHit } from './knowledge/retrieve'
import { findEntity, neighbourhood, type GraphFact } from './knowledge/graph'
import { assessRisk } from './safety'
import {
  addMessage,
  createEscalation,
  getFarmer,
  type AnswerStatus,
  type Channel,
  type Language,
  type Trace,
} from './store-legacy'

const MODEL = process.env.AI_MODEL ?? ''

const SMS_LIMIT = 300

const REFUSE =
  "Sorry, I don't have a verified ISU Extension or USDA source that directly answers that question, so I won't guess. Please contact your ISU Extension office, crop insurance agent, or certified crop adviser."

const ESCALATE =
  'Your question has been forwarded to a human agronomist or adviser. They will follow up with you shortly.'

const SOURCE_PREFIX = 'Src'

const answerSchema = z.object({
  status: z
    .enum(['answered', 'refused'])
    .describe('"refused" if the retrieved sources do not directly support an answer.'),
  answer: z.string().describe('Plain-language reply in the farmer language. Short sentences.'),
  citedSourceIds: z.array(z.string()).describe('IDs of knowledge-base documents the answer relies on.'),
  needsHumanAdvisor: z.boolean().describe('True if a human advisor should follow up.'),
})

function instructions(channel: Channel, highStakes: boolean) {
  const format =
    channel === 'voice'
      ? 'The reply will be read aloud over the phone. Use 3–5 short spoken sentences. No symbols, no lists, no abbreviations.'
      : `The reply may be delivered as an SMS or on-screen message. Keep it under ${SMS_LIMIT - 40} characters. Plain text, no markdown, no emoji.`

  return `You are Harvest IQ, an AI farm adviser for corn farmers in Iowa, USA. You serve farmers of all sizes — from small family operations to larger farms.

GROUNDING RULES (non-negotiable):
- Always call searchKnowledge first. You may call queryKnowledgeGraph to connect corn diseases, pests, nutrients, and practices.
- Only state facts that appear in the retrieved ISU Extension, USDA-ARS, CIMMYT, CGIAR, or peer-reviewed documents. Never use outside knowledge.
- If no document directly answers the question, set status "refused". Do not guess. Tell the farmer to contact their ISU Extension office or certified crop adviser.
- List every document you used in citedSourceIds.
- Never give specific pesticide mixing rates, herbicide rates per acre, or crop insurance policy specifics — for those, set needsHumanAdvisor true and direct to their crop insurance agent or certified applicator.
${highStakes ? '- THIS QUESTION IS HIGH-STAKES. It is already being sent to a human adviser. Give only safe general steps from the sources and confirm an adviser will follow up.\n' : ''}
STYLE:
- Reply in plain, direct American English. Use everyday words a corn farmer in Iowa would use. Be warm and practical.
- ${format}
- Lead with the single most useful action or answer.`
}

/**
 * Degraded mode when the model is unreachable: quote the most relevant
 * validated passage verbatim. Still fully grounded and cited.
 */
const WARM_OPENERS: Record<string, string> = {
  nitrogen:    "Good question about nitrogen.",
  replant:     "Here's what I'd look at for replanting.",
  disease:     "Let's talk about what might be hitting your crop.",
  weeds:       "Here's the deal on weeds.",
  planting:    "On planting — here's what matters most.",
  pests:       "Let me tell you what to watch for.",
  harvest:     "Here's what to know about harvest.",
  economics:   "On the numbers side —",
  'cover-crops': "Cover crops are worth it. Here's the key thing.",
  soil:        "Soil compaction can hurt you. Here's what to do.",
}

function extractiveAnswer(query: string, retrieved: Map<string, RetrievalHit>, toolCalls: string[]) {
  toolCalls.push('fallback:extractive')
  const [top] = search(query, 1)
  if (!top) return null
  retrieved.set(top.id, top)
  const terms = new Set(tokenize(query))
  const sentences = top.excerpt.split(/(?<=\.)\s+/)
  const ranked = sentences
    .map((s, i) => ({ s, i, score: tokenize(s).filter((w) => terms.has(w)).length }))
    .sort((a, b) => b.score - a.score || a.i - b.i)
    .slice(0, 3)
    .sort((a, b) => a.i - b.i)
  const body = ranked.map((r) => r.s).join(' ')
  const opener = WARM_OPENERS[top.topic] ?? "Here's what the research says."
  return { id: top.id, answer: `${opener} ${body}` }
}

export interface AdviceResult {
  reply: string
  trace: Trace
}

export async function runAdvisor(input: {
  phone: string
  channel: Channel
  question: string
  language?: Language
  observations?: string
}): Promise<AdviceResult> {
  const started = Date.now()
  const farmer = getFarmer(input.phone)
  const language = input.language ?? farmer?.language ?? 'en'
  void language // English-only MVP; kept for API compatibility
  const risk = assessRisk(input.question)

  addMessage({
    phone: input.phone,
    channel: input.channel,
    direction: 'in',
    author: 'farmer',
    text: input.question,
  })

  const retrieved = new Map<string, RetrievalHit>()
  const graphFacts: GraphFact[] = []
  const toolCalls: string[] = []
  let agentRequestedEscalation: string | null = null

  const prompt = input.observations
    ? `Farmer sent a photo. Visual observations (not a diagnosis): ${input.observations}\nFarmer's message: ${input.question || '(no caption)'}`
    : input.question

  let status: AnswerStatus = 'refused'
  let answer = REFUSE
  let cited: string[] = []
  let needsHuman = false

  if (MODEL) {
    // ── AI agent path (requires a configured AI_MODEL + API key) ─────────────
    try {
      const agent = new ToolLoopAgent({
        model: MODEL,
        instructions: instructions(input.channel, risk.highStakes),
        stopWhen: isStepCount(6),
        output: Output.object({ schema: answerSchema }),
        tools: {
          searchKnowledge: tool({
            description:
              'Search the Iowa corn knowledge base validated by ISU Extension, USDA-ARS, CIMMYT, and CGIAR. Query in plain English using corn farming terms. Covers nitrogen management, replanting, diseases (rust, gray leaf spot, tar spot), weeds (waterhemp), planting, pests, harvest, storage, economics, cover crops, and compaction.',
            inputSchema: z.object({ query: z.string() }),
            execute: async ({ query }) => {
              toolCalls.push(`searchKnowledge("${query}")`)
              const hits = search(query)
              for (const h of hits) retrieved.set(h.id, h)
              if (hits.length === 0) return { results: [], note: 'No validated source found.' }
              return { results: hits.map(({ id, title, excerpt }) => ({ id, title, text: excerpt })) }
            },
          }),
          queryKnowledgeGraph: tool({
            description:
              'Look up how a corn entity (disease, pest, nutrient, practice, condition) is linked to others in Iowa corn production.',
            inputSchema: z.object({ entity: z.string().describe('e.g. "corn", "southern rust", "waterhemp", "nitrogen", "corn rootworm", "tar spot"') }),
            execute: async ({ entity }) => {
              toolCalls.push(`queryKnowledgeGraph("${entity}")`)
              const found = findEntity(entity)
              if (!found) return { facts: [], note: 'Entity not in graph.' }
              const facts = neighbourhood(found.id)
              graphFacts.push(...facts)
              return { entity: found.label, facts }
            },
          }),
          escalateToAdvisor: tool({
            description:
              'Send the question to a human agronomist, certified crop adviser (CCA), or ISU Extension specialist. Use for specific herbicide rates, crop insurance details, pesticide mixing rates, or anything outside the validated sources.',
            inputSchema: z.object({ reason: z.string() }),
            execute: async ({ reason }) => {
              toolCalls.push(`escalateToAdvisor("${reason}")`)
              agentRequestedEscalation = reason
              return { queued: true }
            },
          }),
        },
      })
      const { output } = await agent.generate({ prompt })
      cited = output.citedSourceIds.filter((id) => retrieved.has(id))
      needsHuman = output.needsHumanAdvisor
      if (output.status === 'answered' && cited.length > 0 && output.answer.trim()) {
        status = 'answered'
        answer = output.answer.trim()
      }
    } catch (error) {
      console.log('[Harvest IQ] Agent error, falling back to extractive:', error instanceof Error ? error.message : error)
      const fallback = extractiveAnswer(`${input.question} ${input.observations ?? ''}`, retrieved, toolCalls)
      if (fallback && !risk.highStakes) {
        status = 'answered'
        answer = fallback.answer
        cited = [fallback.id]
      }
    }
  } else {
    // ── Extractive fallback path (no AI_MODEL configured) ────────────────────
    // Directly searches the validated knowledge base and quotes the most
    // relevant passage. Fully grounded and cited — no AI model required.
    const fallback = extractiveAnswer(`${input.question} ${input.observations ?? ''}`, retrieved, toolCalls)
    if (fallback && !risk.highStakes) {
      status = 'answered'
      answer = fallback.answer
      cited = [fallback.id]
    }
  }

  const shouldEscalate = risk.highStakes || needsHuman || agentRequestedEscalation !== null
  let escalationId: string | undefined

  if (shouldEscalate) {
    const farmerRecord = getFarmer(input.phone)
    const esc = createEscalation({
      phone: input.phone,
      farmerName: farmerRecord?.name,
      district: farmerRecord?.district,
      country: farmerRecord?.country,
      channel: input.channel,
      question: input.observations
        ? `${input.question || '(photo, no caption)'}\n[Photo observations] ${input.observations}`
        : input.question,
      category: risk.category ?? (status === 'refused' ? 'insufficient-sources' : 'agent-requested'),
      reason: risk.reason ?? agentRequestedEscalation ?? 'Model flagged for human follow-up',
    })
    escalationId = esc.id
    status = 'escalated'
    answer = cited.length > 0 ? `${answer} ${ESCALATE}` : ESCALATE
  }

  let reply = answer
  if (cited.length > 0 && input.channel !== 'voice') {
    const tag = ` [${SOURCE_PREFIX}: ${cited.join(',')}]`
    const room = SMS_LIMIT - tag.length
    reply = (answer.length > room ? `${answer.slice(0, room - 1).trimEnd()}…` : answer) + tag
  }

  const trace: Trace = {
    status,
    risk: risk.category,
    sources: cited.map((id) => {
      const h = retrieved.get(id)
      return { id, title: h?.title ?? id, source: h?.source ?? '', validatedBy: h?.validatedBy ?? '' }
    }),
    graphFacts: graphFacts.filter((f) => cited.includes(f.docId)).slice(0, 8),
    toolCalls,
    observations: input.observations,
    escalationId,
    latencyMs: Date.now() - started,
  }

  addMessage({
    phone: input.phone,
    channel: input.channel,
    direction: 'out',
    author: 'agent',
    text: reply,
    trace,
  })

  return { reply, trace }
}

/** Vision step: extracts observable symptoms only. Grounded diagnosis happens in runAdvisor. */
export async function describePhoto(image: Uint8Array, mediaType: string) {
  if (!MODEL) return { usable: false, subject: '', observations: '' }
  const { output } = await generateText({
    model: MODEL,
    output: Output.object({
      schema: z.object({
        usable: z.boolean().describe('False if the photo is too dark, blurry or not a plant/animal.'),
        subject: z.string().describe('e.g. "corn leaf", "corn stalk", "corn ear", "weed"'),
        observations: z.string().describe('Visible symptoms only, in plain English. No diagnosis, no treatment.'),
      }),
    }),
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: 'A smallholder farmer sent this photo from a basic phone camera. Describe only what is visibly wrong (colours, holes, spots, insects, droppings, posture, lesion shape). Do not diagnose or recommend any treatment.',
          },
          { type: 'file', mediaType, data: image },
        ],
      },
    ],
  })
  return output
}
