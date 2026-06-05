// =====================================================
// BLOCK: ATS Explainability Imports
// Crestpoint Solutions V2
// Version: 1.8.0
// =====================================================

import type {
  ATSAuditTrailItem,
  ATSExplainabilityReport,
  ATSExplanationTone,
  ATSScoreReason,
  ATSSectionBreakdown,
} from "./types"

import type { ATSResult } from "@/modules/ats-engine"

// =====================================================
// BLOCK: Helper Functions
// =====================================================

function getToneFromScore(score: number): ATSExplanationTone {
  if (score >= 80) return "strength"
  if (score >= 60) return "neutral"
  if (score >= 40) return "warning"

  return "weakness"
}

function getOverallScore(result: ATSResult): number {
  const rawResult = result as ATSResult & {
    score?: number
    overallScore?: number
    atsScore?: number
  }

  return Number(
    rawResult.score ??
      rawResult.overallScore ??
      rawResult.atsScore ??
      result.sectionScores.reduce((total, section) => total + section.score, 0) /
        Math.max(result.sectionScores.length, 1),
  )
}

function getStrongestArea(sectionBreakdown: ATSSectionBreakdown[]): string {
  if (sectionBreakdown.length === 0) {
    return "Not enough scoring data"
  }

  return [...sectionBreakdown].sort((a, b) => b.score - a.score)[0].name
}

function getWeakestArea(sectionBreakdown: ATSSectionBreakdown[]): string {
  if (sectionBreakdown.length === 0) {
    return "Not enough scoring data"
  }

  return [...sectionBreakdown].sort((a, b) => a.score - b.score)[0].name
}

// =====================================================
// BLOCK: Section Breakdown Builder
// =====================================================

function buildSectionBreakdown(result: ATSResult): ATSSectionBreakdown[] {
  return result.sectionScores.map((section) => {
    const tone = getToneFromScore(section.score)

    return {
      name: section.name,
      score: section.score,
      maxScore: 100,
      tone,
      explanation:
        section.score >= 80
          ? `${section.name} is a strong ATS area.`
          : section.score >= 60
            ? `${section.name} is acceptable but could be improved.`
            : `${section.name} needs stronger ATS-friendly content.`,
    }
  })
}

// =====================================================
// BLOCK: Score Reason Builder
// =====================================================

function buildScoreReasons(result: ATSResult): {
  strengths: ATSScoreReason[]
  weaknesses: ATSScoreReason[]
} {
  const strengths: ATSScoreReason[] = []
  const weaknesses: ATSScoreReason[] = []

  result.sectionScores.forEach((section) => {
    if (section.score >= 80) {
      strengths.push({
        category: section.name,
        impact: 10,
        tone: "strength",
        explanation: `${section.name} scored strongly and positively influenced ATS performance.`,
      })
    }

    if (section.score < 60) {
      weaknesses.push({
        category: section.name,
        impact: -10,
        tone: "weakness",
        explanation: `${section.name} scored below recommended ATS thresholds.`,
      })
    }
  })

  if (result.keywordMatchPercent >= 75) {
    strengths.push({
      category: "Keyword Match",
      impact: 15,
      tone: "strength",
      explanation:
        "Strong alignment detected between resume content and target job requirements.",
    })
  } else {
    weaknesses.push({
      category: "Keyword Match",
      impact: -15,
      tone: "warning",
      explanation:
        "Resume is missing important target-job keywords and skill signals.",
    })
  }

  result.riskFlags.forEach((flag) => {
    weaknesses.push({
      category: "Risk Flag",
      impact: -5,
      tone: "warning",
      explanation: flag.title,
    })
  })

  return {
    strengths,
    weaknesses,
  }
}

// =====================================================
// BLOCK: Audit Trail Builder
// =====================================================

function buildAuditTrail({
  strengths,
  weaknesses,
}: {
  strengths: ATSScoreReason[]
  weaknesses: ATSScoreReason[]
}): ATSAuditTrailItem[] {
  return [...strengths, ...weaknesses]
    .map((reason) => ({
      label: reason.category,
      impact: reason.impact,
      explanation: reason.explanation,
      tone: reason.tone || (reason.impact >= 0 ? "strength" : "warning"),
    }))
    .sort((a, b) => Math.abs(b.impact) - Math.abs(a.impact))
}

// =====================================================
// BLOCK: ATS Score Explanation Builder
// =====================================================

export function explainATSScore(result: ATSResult): ATSExplainabilityReport {
  const sectionBreakdown = buildSectionBreakdown(result)

  const { strengths, weaknesses } = buildScoreReasons(result)

  const overallReasons = [...strengths, ...weaknesses].sort(
    (a, b) => Math.abs(b.impact) - Math.abs(a.impact),
  )

  const auditTrail = buildAuditTrail({
    strengths,
    weaknesses,
  })

  return {
    overallReasons,
    strengths,
    weaknesses,

    sectionBreakdown,
    skillCoverage: [],
    gapExplanations: [],
    auditTrail,

    summary: {
      overallScore: Math.round(getOverallScore(result)),
      keywordMatchPercent: result.keywordMatchPercent,
      strongestArea: getStrongestArea(sectionBreakdown),
      weakestArea: getWeakestArea(sectionBreakdown),
      confidenceSummary:
        weaknesses.length === 0
          ? "Strong ATS confidence with no major weaknesses detected."
          : "ATS confidence is improving, but some sections or keyword signals need more evidence.",
    },
  }
}
