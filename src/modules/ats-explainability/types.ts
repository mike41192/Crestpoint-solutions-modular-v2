// =====================================================
// BLOCK: ATS Explainability Types
// Crestpoint Solutions V2
// Version: 1.6.6
// =====================================================

// =====================================================
// BLOCK: Score Reason Type
//
// Represents one explanation item for why an ATS score
// increased or decreased. Positive impact means the resume
// helped the score. Negative impact means the resume hurt
// the score.
// =====================================================

export type ATSScoreReason = {
  category: string
  impact: number
  explanation: string
}

// =====================================================
// BLOCK: Explainability Report Type
//
// Used by the ATS explainability engine to describe
// strengths, weaknesses, and overall score reasoning.
// This is designed for future dashboard display and
// validation debugging.
// =====================================================

export type ATSExplainabilityReport = {
  overallReasons: ATSScoreReason[]
  strengths: ATSScoreReason[]
  weaknesses: ATSScoreReason[]
}
