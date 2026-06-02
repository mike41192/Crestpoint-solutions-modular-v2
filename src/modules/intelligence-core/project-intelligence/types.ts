// =====================================================
// BLOCK: Project Intelligence Types
// =====================================================

export type ProjectSignalStrength = "strong" | "medium" | "weak"

export type ProjectPattern = {
  skill: string
  patterns: string[]
  strength: ProjectSignalStrength
}

export type ProjectDetectionResult = {
  skill: string
  matchedPatterns: string[]
  confidence: number
  strength: ProjectSignalStrength
}
