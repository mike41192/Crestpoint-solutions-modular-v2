// =====================================================
// BLOCK: ATS Skill Evidence Types
// Crestpoint Solutions V2
// Version: 1.6.1
// =====================================================

export type SkillEvidenceStrength = "none" | "weak" | "moderate" | "strong"

export type SkillEvidenceCategory =
  | "direct_keyword"
  | "experience_bullet"
  | "achievement"
  | "certification"
  | "tool"
  | "leadership"
  | "industry_context"

export type SkillEvidenceItem = {
  skill: string
  strength: SkillEvidenceStrength
  category: SkillEvidenceCategory
  evidenceText: string
  score: number
}

export type SkillEvidenceReport = {
  skill: string
  strength: SkillEvidenceStrength
  score: number
  evidence: SkillEvidenceItem[]
}
