// =====================================================
// BLOCK: Evidence Strength Types
// =====================================================

export type EvidenceStrength = "strong" | "medium" | "weak" | "missing"

export type EvidenceStrengthResult = {
  skill: string
  strength: EvidenceStrength
  confidence: number
  matchedEvidence: string[]
}
