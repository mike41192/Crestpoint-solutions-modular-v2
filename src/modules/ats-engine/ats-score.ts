import type { ResumeBuilderFormData } from "@/modules/resume-builder"
import type { ATSResult, ATSSectionScore } from "./types"
import { getATSGrade } from "./ats-grade"
import { matchResumeKeywords } from "./keyword-matcher"
import {
  scoreContactSection,
  scoreEducationSection,
  scoreExperienceSection,
  scoreSkillsSection,
  scoreSummarySection,
} from "./section-scoring"
import { generateATSRecommendations } from "./recommendations"

function average(scores: number[]) {
  if (scores.length === 0) return 0

  const total = scores.reduce((sum, score) => sum + score, 0)

  return Math.round(total / scores.length)
}

function weightedScore(sectionScore: number, keywordScore: number) {
  if (keywordScore === 0) {
    return sectionScore
  }

  return Math.round(sectionScore * 0.7 + keywordScore * 0.3)
}

export function calculateATSScore(
  data: ResumeBuilderFormData,
  jobDescription = ""
): ATSResult {
  const keywordResult = matchResumeKeywords(data, jobDescription)

  const sectionScores: ATSSectionScore[] = [
    {
      name: "Contact Information",
      score: scoreContactSection(data),
      maxScore: 100,
    },
    {
      name: "Professional Summary",
      score: scoreSummarySection(data),
      maxScore: 100,
    },
    {
      name: "Skills",
      score: scoreSkillsSection(data),
      maxScore: 100,
    },
    {
      name: "Work Experience",
      score: scoreExperienceSection(data),
      maxScore: 100,
    },
    {
      name: "Education",
      score: scoreEducationSection(data),
      maxScore: 100,
    },
  ]

  const sectionAverage = average(sectionScores.map((section) => section.score))
  const overallScore = weightedScore(
    sectionAverage,
    keywordResult.keywordMatchPercent
  )

  const grade = getATSGrade(overallScore)

  const recommendations = generateATSRecommendations(
    data,
    sectionScores,
    keywordResult.missingKeywords
  )

  const strengths = sectionScores
    .filter((section) => section.score >= 75)
    .map((section) => `${section.name} is strong.`)

  if (keywordResult.keywordMatchPercent >= 75) {
    strengths.push("Keyword alignment is strong.")
  }

  const weaknesses = sectionScores
    .filter((section) => section.score < 75)
    .map((section) => `${section.name} needs improvement.`)

  if (keywordResult.totalKeywords > 0 && keywordResult.keywordMatchPercent < 75) {
    weaknesses.push("Keyword alignment needs improvement.")
  }

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
  }
}
