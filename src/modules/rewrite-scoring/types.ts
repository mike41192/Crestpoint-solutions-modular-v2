// =====================================================
// BLOCK: Rewrite Scoring Types
// =====================================================

export type RewriteScoreGrade = "A+" | "A" | "B" | "C" | "D" | "F"

export type RewriteScoreResult = {
  score: number
  grade: RewriteScoreGrade
  improvementDelta: number
  hasActionVerb: boolean
  hasQuantification: boolean
  readabilityScore: number
  weakPhraseCount: number
  strengths: string[]
  warnings: string[]
}
