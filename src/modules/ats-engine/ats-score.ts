import type { ResumeBuilderFormData } from "@/modules/resume-builder"
import type { ATSResult, ATSSectionScore } from "./types"
import { getATSGrade } from "./ats-grade"
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

export function calculateATSScore(data: ResumeBuilderFormData): ATSResult {
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

  const overallScore = average(sectionScores.map((section) => section.score))
  const grade = getATSGrade(overallScore)
  const recommendations = generateATSRecommendations(data, sectionScores)

  const strengths = sectionScores
    .filter((section) => section.score >= 75)
    .map((section) => `${section.name} is strong.`)

  const weaknesses = sectionScores
    .filter((section) => section.score < 75)
    .map((section) => `${section.name} needs improvement.`)

  return {
    overallScore,
    grade,
    sectionScores,
    recommendations,
    strengths,
    weaknesses,
    missingKeywords: [],
    keywordMatchPercent: 0,
    matchedKeywords: [],
  }
}
