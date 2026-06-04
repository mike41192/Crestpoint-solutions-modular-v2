// =====================================================
// BLOCK: Evidence Type Imports
// Crestpoint Solutions V2
// Version: 1.6.1
// =====================================================

import type { SkillEvidenceItem, SkillEvidenceStrength } from "./evidence-types"

// =====================================================
// BLOCK: Score Constants
// =====================================================

const STRONG_EVIDENCE_SCORE = 85
const MODERATE_EVIDENCE_SCORE = 60
const WEAK_EVIDENCE_SCORE = 30
const NO_EVIDENCE_SCORE = 0

// =====================================================
// BLOCK: Evidence Strength Resolver
// =====================================================

export function getEvidenceStrengthFromScore(
  score: number,
): SkillEvidenceStrength {
  if (score >= STRONG_EVIDENCE_SCORE) return "strong"
  if (score >= MODERATE_EVIDENCE_SCORE) return "moderate"
  if (score >= WEAK_EVIDENCE_SCORE) return "weak"

  return "none"
}

// =====================================================
// BLOCK: Evidence Score Normalizer
// =====================================================

export function normalizeEvidenceScore(score: number) {
  return Math.min(Math.max(Math.round(score), 0), 100)
}

// =====================================================
// BLOCK: Evidence Category Weight
// Stronger evidence comes from bullets, achievements,
// certifications, and direct tool usage.
// =====================================================

export function getEvidenceCategoryScore(
  category: SkillEvidenceItem["category"],
) {
  if (category === "achievement") return 90
  if (category === "certification") return 85
  if (category === "experience_bullet") return 75
  if (category === "tool") return 70
  if (category === "leadership") return 70
  if (category === "industry_context") return 50
  if (category === "direct_keyword") return 35

  return 0
}

// =====================================================
// BLOCK: Final Evidence Score Calculator
// =====================================================

export function calculateEvidenceScore(evidence: SkillEvidenceItem[]) {
  if (evidence.length === 0) {
    return NO_EVIDENCE_SCORE
  }

  const highestEvidenceScore = Math.max(
    ...evidence.map((item) => item.score),
  )

  const diversityBonus = Math.min(evidence.length * 5, 15)

  return normalizeEvidenceScore(highestEvidenceScore + diversityBonus)
}