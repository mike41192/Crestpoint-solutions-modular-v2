import type { ATSGrade } from "./ats-grade"
import type { ATSRiskFlag } from "./risk-flags"

export interface ATSSectionScore {
  name: string
  score: number
  maxScore: number
}

export interface ATSRecommendation {
  severity: "high" | "medium" | "low"
  title: string
  description: string
}

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
}
