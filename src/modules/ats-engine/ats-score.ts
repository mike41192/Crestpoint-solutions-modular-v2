// =====================================================
// BLOCK: Resume Builder Imports
// =====================================================

import type { ResumeBuilderFormData } from "@/modules/resume-builder"

// =====================================================
// BLOCK: ATS Type Imports
// =====================================================

import type { ATSResult, ATSSectionScore } from "./types"

// =====================================================
// BLOCK: ATS Engine Imports
// =====================================================

import { calculateAchievementScore } from "./achievement-score"
import { getATSGrade } from "./ats-grade"
import { ATS_SECTION_NAMES } from "./constants"
import { detectIndustry } from "./industry-detector"
import { getATSIndustryProfile } from "./industry-profiles"
import { detectTargetJobTitle } from "./job-title-detector"
import { matchResumeKeywords } from "./keyword-matcher"
import { calculateReadabilityScore } from "./readability-score"
import { generateATSRecommendations } from "./recommendations"
import { detectATSRiskFlags } from "./risk-flags"
import {
  scoreContactSection,
  scoreEducationSection,
  scoreExperienceSection,
  scoreSkillsSection,
  scoreSummarySection,
} from "./section-scoring"

// =====================================================
// BLOCK: Keyword Weighting
// =====================================================

function weightedScore(sectionScore: number, keywordScore: number): number {
  if (keywordScore === 0) {
    return sectionScore
  }

  return Math.round(sectionScore * 0.7 + keywordScore * 0.3)
}

// =====================================================
// BLOCK: Weighted Section Score Calculator
// Uses industry profile weights instead of one fixed score map.
// =====================================================

function calculateWeightedSectionScore({
  sectionScores,
  industry,
}: {
  sectionScores: ATSSectionScore[]
  industry: string
}): number {
  const profile = getATSIndustryProfile(industry)

  const getScore = (name: string) =>
    sectionScores.find((section) => section.name === name)?.score ?? 0

  const weightedScoreValue =
    getScore(ATS_SECTION_NAMES.contact) * profile.weights.contact +
    getScore(ATS_SECTION_NAMES.summary) * profile.weights.summary +
    getScore(ATS_SECTION_NAMES.skills) * profile.weights.skills +
    getScore(ATS_SECTION_NAMES.experience) * profile.weights.experience +
    getScore(ATS_SECTION_NAMES.education) * profile.weights.education +
    getScore(ATS_SECTION_NAMES.readability) * profile.weights.readability +
    getScore(ATS_SECTION_NAMES.achievements) * profile.weights.achievements

  return Math.round(weightedScoreValue)
}

// =====================================================
// BLOCK: ATS Score Calculator
// =====================================================

export function calculateATSScore(
  data: ResumeBuilderFormData,
  jobDescription = "",
): ATSResult {
  // =====================================================
  // BLOCK: Keyword Analysis
  // =====================================================

  const keywordResult = matchResumeKeywords(data, jobDescription)

  // =====================================================
  // BLOCK: Industry / Role Detection
  // Detect industry before scoring so section weights can adapt.
  // =====================================================

  const detectedIndustry = detectIndustry(data)
  const detectedTargetRole = detectTargetJobTitle(data, jobDescription)

  // =====================================================
  // BLOCK: Supporting Scores
  // =====================================================

  const readabilityScore = calculateReadabilityScore(data)
  const achievementScore = calculateAchievementScore(data)
  const riskFlags = detectATSRiskFlags(data)

  // =====================================================
  // BLOCK: Section Scores
  // =====================================================

  const sectionScores: ATSSectionScore[] = [
    {
      name: ATS_SECTION_NAMES.contact,
      score: scoreContactSection(data),
      maxScore: 100,
    },
    {
      name: ATS_SECTION_NAMES.summary,
      score: scoreSummarySection(data),
      maxScore: 100,
    },
    {
      name: ATS_SECTION_NAMES.skills,
      score: scoreSkillsSection(data),
      maxScore: 100,
    },
    {
      name: ATS_SECTION_NAMES.experience,
      score: scoreExperienceSection(data),
      maxScore: 100,
    },
    {
      name: ATS_SECTION_NAMES.education,
      score: scoreEducationSection(data),
      maxScore: 100,
    },
    {
      name: ATS_SECTION_NAMES.readability,
      score: readabilityScore,
      maxScore: 100,
    },
    {
      name: ATS_SECTION_NAMES.achievements,
      score: achievementScore,
      maxScore: 100,
    },
  ]

  // =====================================================
  // BLOCK: Industry-Aware ATS Score Calculation
  // =====================================================

  const sectionScore = calculateWeightedSectionScore({
    sectionScores,
    industry: detectedIndustry,
  })

  const overallScore = weightedScore(
    sectionScore,
    keywordResult.keywordMatchPercent,
  )

  const grade = getATSGrade(overallScore)

  // =====================================================
  // BLOCK: ATS Recommendations
  // =====================================================

  const recommendations = generateATSRecommendations(
    data,
    sectionScores,
    keywordResult.missingKeywords,
  )

  // =====================================================
  // BLOCK: Strength Analysis
  // =====================================================

  const strengths = sectionScores
    .filter((section) => section.score >= 75)
    .map((section) => `${section.name} is strong.`)

  if (keywordResult.keywordMatchPercent >= 75) {
    strengths.push("Keyword alignment is strong.")
  }

  // =====================================================
  // BLOCK: Weakness Analysis
  // =====================================================

  const weaknesses = sectionScores
    .filter((section) => section.score < 75)
    .map((section) => `${section.name} needs improvement.`)

  if (keywordResult.totalKeywords > 0 && keywordResult.keywordMatchPercent < 75) {
    weaknesses.push("Keyword alignment needs improvement.")
  }

  riskFlags
    .filter((flag) => flag.severity === "high")
    .forEach((flag) => {
      weaknesses.push(flag.title)
    })

  // =====================================================
  // BLOCK: Final ATS Result
  // =====================================================

  return {
    overallScore,
    grade,
    sectionScores,
    recommendations,
    strengths,
    weaknesses,
    missingKeywords: keywordResult.missingKeywords,
    keywordMatchPercent: keywordResult.keywordMatchPercent,
    matchedKeywords: keywordResult.matchedKeywords,
    readabilityScore,
    achievementScore,
    riskFlags,
    detectedIndustry,
    detectedTargetRole,
  }
}
