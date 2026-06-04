// =====================================================
// BLOCK: ATS Skill Evidence Types
// Crestpoint Solutions V2
// Version: 1.6.5
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

// =====================================================
// BLOCK: Engine Evidence Item
// Used by ATS intelligence scoring logic.
// =====================================================

export type SkillEvidenceItem = {
  skill: string
  strength: SkillEvidenceStrength
  category: SkillEvidenceCategory
  evidenceText: string
  score: number
}

// =====================================================
// BLOCK: UI Evidence Match
// Used by validation/debug UI components.
// =====================================================

export type SkillEvidenceMatch = {
  phrase: string
  source: string
  confidence: number
}

// =====================================================
// BLOCK: Skill Evidence Report
// Shared by engine and UI inspector.
// =====================================================

export type SkillEvidenceReport = {
  skill: string
  strength: SkillEvidenceStrength
  score: number
  confidence: number
  evidence: SkillEvidenceItem[]
  evidenceFound: SkillEvidenceMatch[]
  evidenceMissing: string[]
  recommendation: string
}

// =====================================================
// BLOCK: Skill Evidence Inspector Report Alias
// Keeps future UI-specific naming available.
// =====================================================

export type SkillEvidenceInspectorReport = SkillEvidenceReport