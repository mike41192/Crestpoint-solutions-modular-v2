// =====================================================
// BLOCK: ATS Engine Type Imports
// =====================================================

import type { ATSGrade } from "./ats-grade"
import type { ATSRiskFlag } from "./risk-flags"

// =====================================================
// BLOCK: ATS Intelligence Type Imports
// =====================================================

import type { IndustryGapItem } from "@/modules/ats-intelligence"

// =====================================================
// BLOCK: Section Score Type
// =====================================================

export interface ATSSectionScore {
  name: string
  score: number
  maxScore: number
}

// =====================================================
// BLOCK: Recommendation Type
// =====================================================

export interface ATSRecommendation {
  severity: "high" | "medium" | "low"
  title: string
  description: string
}

// =====================================================
// BLOCK: ATS Result Type
// =====================================================

export interface ATSResult {
  overallScore: number
  grade: ATSGrade
  sectionScores: ATSSectionScore[]
  recommendations: ATSRecommendation[]
  strengths: string[]
  weaknesses: string[]
  missingKeywords: string[]
  matchedKeywords: string[]
  keywordMatchPercent: number

  readabilityScore: number
  achievementScore: number
  riskFlags: ATSRiskFlag[]
  detectedIndustry: string
  detectedTargetRole: string

  // =====================================================
  // BLOCK: Phase 1.6.1 Industry Intelligence Results
  // =====================================================

  industryReadinessScore: number
  industryGaps: IndustryGapItem[]
}
