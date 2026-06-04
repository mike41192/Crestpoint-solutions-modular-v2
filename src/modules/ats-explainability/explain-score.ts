// =====================================================
// BLOCK: ATS Explainability Imports
// Crestpoint Solutions V2
// Version: 1.6.6
// =====================================================

import type {
  ATSExplainabilityReport,
  ATSScoreReason,
} from "./types"

import type { ATSResult } from "@/modules/ats-engine"

// =====================================================
// BLOCK: ATS Score Explanation Builder
//
// Converts ATS scoring results into human-readable
// explanations for validation dashboards and future
// user-facing transparency features.
// =====================================================

export function explainATSScore(
  result: ATSResult,
): ATSExplainabilityReport {
  const strengths: ATSScoreReason[] = []

  const weaknesses: ATSScoreReason[] = []

  // =====================================================
  // BLOCK: Section Analysis
  // =====================================================

  result.sectionScores.forEach((section) => {
    if (section.score >= 80) {
      strengths.push({
        category: section.name,
        impact: 10,
        explanation: `${section.name} scored strongly and positively influenced ATS performance.`,
      })
    }

    if (section.score < 60) {
      weaknesses.push({
        category: section.name,
        impact: -10,
        explanation: `${section.name} scored below recommended ATS thresholds.`,
      })
    }
  })

  // =====================================================
  // BLOCK: Keyword Analysis
  // =====================================================

  if (result.keywordMatchPercent >= 75) {
    strengths.push({
      category: "Keyword Match",
      impact: 15,
      explanation:
        "Strong alignment detected between resume content and target job requirements.",
    })
  } else {
    weaknesses.push({
      category: "Keyword Match",
      impact: -15,
      explanation:
        "Resume is missing important target-job keywords and skill signals.",
    })
  }

  // =====================================================
  // BLOCK: Risk Flag Analysis
  // =====================================================

  result.riskFlags.forEach((flag) => {
    weaknesses.push({
      category: "Risk Flag",
      impact: -5,
      explanation: flag.title,
    })
  })

  // =====================================================
  // BLOCK: Overall Reasons
  // =====================================================

  const overallReasons = [
    ...strengths,
    ...weaknesses,
  ].sort(
    (a, b) =>
      Math.abs(b.impact) -
      Math.abs(a.impact),
  )

  // =====================================================
  // BLOCK: Final Report
  // =====================================================

  return {
    overallReasons,
    strengths,
    weaknesses,
  }
}