// =====================================================
// BLOCK: ATS Explainability Types
// Crestpoint Solutions V2
// Version: 1.8.0
// =====================================================

// =====================================================
// BLOCK: Shared Explainability Types
// =====================================================

export type ATSExplanationTone =
  | "strength"
  | "warning"
  | "weakness"
  | "neutral"

export type ATSEvidenceStrength =
  | "none"
  | "weak"
  | "moderate"
  | "strong"

// =====================================================
// BLOCK: Score Reason Type
// =====================================================

export type ATSScoreReason = {
  category: string
  impact: number
  explanation: string
  tone?: ATSExplanationTone
}

// =====================================================
// BLOCK: Section Breakdown Type
// =====================================================

export type ATSSectionBreakdown = {
  name: string
  score: number
  maxScore?: number
  tone: ATSExplanationTone
  explanation: string
}

// =====================================================
// BLOCK: Skill Coverage Type
// =====================================================

export type ATSSkillCoverageItem = {
  skill: string
  score: number
  strength: ATSEvidenceStrength
  matchedEvidence: string[]
  missingEvidence: string[]
  recommendation: string
}

// =====================================================
// BLOCK: Gap Explanation Type
// =====================================================

export type ATSGapExplanation = {
  title: string
  category: string
  priority: string
  explanation: string
  suggestedAction: string
}

// =====================================================
// BLOCK: Audit Trail Type
// =====================================================

export type ATSAuditTrailItem = {
  label: string
  impact: number
  explanation: string
  tone: ATSExplanationTone
}

// =====================================================
// BLOCK: Explainability Report Type
// =====================================================

export type ATSExplainabilityReport = {
  overallReasons: ATSScoreReason[]
  strengths: ATSScoreReason[]
  weaknesses: ATSScoreReason[]

  sectionBreakdown: ATSSectionBreakdown[]
  skillCoverage: ATSSkillCoverageItem[]
  gapExplanations: ATSGapExplanation[]
  auditTrail: ATSAuditTrailItem[]

  summary: {
    overallScore: number
    keywordMatchPercent: number
    readinessScore?: number
    strongestArea: string
    weakestArea: string
    confidenceSummary: string
  }
}
