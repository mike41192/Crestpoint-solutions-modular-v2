// =====================================================
// BLOCK: Type Imports
// Crestpoint Solutions V2
// Version: 1.6.5
// =====================================================

import type {
  SkillEvidenceItem,
  SkillEvidenceReport,
  SkillEvidenceStrength,
} from "./evidence-types"

// =====================================================
// BLOCK: Strength Resolver
// =====================================================

function getStrengthFromConfidence(confidence: number): SkillEvidenceStrength {
  if (confidence >= 85) return "strong"
  if (confidence >= 60) return "moderate"
  if (confidence >= 30) return "weak"

  return "none"
}

// =====================================================
// BLOCK: Evidence Report Builder
// =====================================================

export function buildSkillEvidenceReport(skill: string): SkillEvidenceReport {
  const confidence = 0
  const evidence: SkillEvidenceItem[] = []

  return {
    skill,
    strength: getStrengthFromConfidence(confidence),
    score: confidence,
    confidence,
    evidence,
    evidenceFound: [],
    evidenceMissing: [],
    recommendation: "Add stronger evidence supporting this skill.",
  }
}
