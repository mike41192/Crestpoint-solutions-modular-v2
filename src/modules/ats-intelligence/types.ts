// =====================================================
// BLOCK: Detection Sources
// =====================================================

export type DetectionSource = "keyword" | "phrase" | "experience"

// =====================================================
// BLOCK: Detected Skill
// =====================================================

export type DetectedSkill = {
  skill: string
  source: DetectionSource
  confidence: number
  evidence: string
}

// =====================================================
// BLOCK: Phrase Mapping
// =====================================================

export type PhraseMapping = {
  skill: string
  phrases: string[]
}

// =====================================================
// BLOCK: Experience Match
// =====================================================

export type ExperienceMatch = {
  skill: string
  evidence: string
  confidence: number
}

// =====================================================
// BLOCK: Skill Confidence Result
// =====================================================

export type SkillConfidenceResult = {
  skill: string
  score: number
  keywordMatches: number
  phraseMatches: number
  experienceMatches: number
}
