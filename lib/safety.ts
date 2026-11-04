import 'server-only'

/**
 * Safety assessment for Iowa corn MVP.
 * Flags questions that require human expert review before the model answers.
 */

export type RiskCategory =
  | 'pesticide-rate'
  | 'crop-insurance-specific'
  | 'human-health'
  | 'insufficient-sources'
  | 'agent-requested'

export interface RiskAssessment {
  highStakes: boolean
  category?: RiskCategory
  reason?: string
}

const HIGH_STAKES_PATTERNS: Array<{ re: RegExp; category: RiskCategory; reason: string }> = [
  {
    re: /\b(how much|dose|dosage|rate|oz|fl oz|ounce|pint|quart|gallon|gal|lb|pound|per acre|mix ratio|dilut|tank mix ratio)\b.*\b(herbicide|fungicide|insecticide|pesticide|chemical|glyphosate|dicamba|atrazine|metolachlor|chlorpyrifos)\b/i,
    category: 'pesticide-rate',
    reason: 'Question asks for specific pesticide application rate or mixing ratio — requires certified applicator guidance.',
  },
  {
    re: /\b(crop insurance|policy|adjuster|prevent plant|prevented planting|ARC|PLC|coverage level|deductible|claim|indemnity|APH)\b/i,
    category: 'crop-insurance-specific',
    reason: 'Specific crop insurance policy questions require a licensed crop insurance agent.',
  },
  {
    re: /\b(ate|eaten|swallowed|ingested|poisoned|poison|sick after|ill after|chemical exposure)\b/i,
    category: 'human-health',
    reason: 'Possible human exposure or poisoning event — contact Poison Control 1-800-222-1222.',
  },
]

export function assessRisk(question: string): RiskAssessment {
  for (const { re, category, reason } of HIGH_STAKES_PATTERNS) {
    if (re.test(question)) {
      return { highStakes: true, category, reason }
    }
  }
  return { highStakes: false }
}
