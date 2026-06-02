// =====================================================
// BLOCK: Type Imports
// =====================================================

import type { EvidenceStrengthResult } from "./types"

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

function hasQuantifiedEvidence(text: string): boolean {
  return /\b\d+(\.\d+)?(%| percent| employees| team members| projects| customers| tickets| orders| reports| hours| days| weeks| months| years)?\b/i.test(
    text,
  )
}

function scoreEvidence({
  resumeText,
  matchedEvidence,
}: {
  resumeText: string
  matchedEvidence: string[]
}): number {
  let score = 0

  score += matchedEvidence.length * 25

  if (hasQuantifiedEvidence(resumeText)) {
    score += 20
  }

  if (resumeText.length > 500) {
    score += 10
  }

  return Math.min(score, 100)
}

function getStrengthFromScore(score: number) {
  if (score >= 75) return "strong"
  if (score >= 45) return "medium"
  if (score >= 20) return "weak"

  return "missing"
}

// =====================================================
// BLOCK: Public Evidence Strength Engine
// =====================================================

export function evaluateEvidenceStrength({
  skill,
  resumeText,
  evidence,
}: {
  skill: string
  resumeText: string
  evidence: string[]
}): EvidenceStrengthResult {
  const normalizedResumeText = normalizeText(resumeText)

  const matchedEvidence = evidence.filter((item) => {
    return normalizedResumeText.includes(normalizeText(item))
  })

  const confidence = scoreEvidence({
    resumeText: normalizedResumeText,
    matchedEvidence,
  })

  return {
    skill,
    strength: getStrengthFromScore(confidence),
    confidence,
    matchedEvidence,
  }
}
