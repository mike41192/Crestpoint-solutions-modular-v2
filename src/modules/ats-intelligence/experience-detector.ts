// =====================================================
// BLOCK: Imports
// =====================================================

import { phraseTaxonomy } from "./phrase-taxonomy"
import type { ExperienceMatch } from "./types"

// =====================================================
// BLOCK: Experience Action Verbs
// =====================================================

const EXPERIENCE_ACTION_VERBS = [
  "managed",
  "led",
  "supervised",
  "trained",
  "coached",
  "mentored",
  "implemented",
  "improved",
  "reduced",
  "increased",
  "coordinated",
  "oversaw",
  "directed",
  "developed",
  "created",
  "executed",
  "delivered",
  "maintained",
  "diagnosed",
  "resolved",
  "streamlined",
  "optimized",
]

// =====================================================
// BLOCK: Helpers
// =====================================================

function normalizeText(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^\w\s.%+-]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
}

function hasExperienceVerb(text: string): boolean {
  return EXPERIENCE_ACTION_VERBS.some((verb) => {
    return text.includes(verb)
  })
}

function hasQuantifiedEvidence(text: string): boolean {
  return /\b\d+(\.\d+)?(%| percent| employees| team members| projects| customers| tickets| orders| reports| hours| days| weeks| months| years)?\b/i.test(
    text,
  )
}

function calculateExperienceConfidence(text: string): number {
  let confidence = 0.55

  if (hasExperienceVerb(text)) {
    confidence += 0.15
  }

  if (hasQuantifiedEvidence(text)) {
    confidence += 0.2
  }

  if (text.length > 80) {
    confidence += 0.1
  }

  return Math.min(confidence, 0.95)
}

// =====================================================
// BLOCK: Public Detector
// =====================================================

export function detectExperienceMatches(text: string): ExperienceMatch[] {
  const normalizedText = normalizeText(text)
  const matches: ExperienceMatch[] = []

  for (const mapping of phraseTaxonomy) {
    for (const phrase of mapping.phrases) {
      const normalizedPhrase = normalizeText(phrase)

      if (!normalizedText.includes(normalizedPhrase)) {
        continue
      }

      matches.push({
        skill: mapping.skill,
        evidence: phrase,
        confidence: calculateExperienceConfidence(normalizedText),
      })
    }
  }

  return matches
}
