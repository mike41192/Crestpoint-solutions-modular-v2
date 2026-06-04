// =====================================================
// BLOCK: Resume Builder Imports
// Crestpoint Solutions V2
// Version: 1.6.1
// =====================================================

import type { ResumeBuilderFormData } from "@/modules/resume-builder"

// =====================================================
// BLOCK: ATS Intelligence Imports
// =====================================================

import { analyzeSkillEvidence } from "./skill-evidence"
import { getIndustrySkillRequirements } from "./industry-skill-requirements"

// =====================================================
// BLOCK: Types
// =====================================================

export type IndustryGapPriority = "high" | "medium" | "low"

export type IndustryGapItem = {
  skill: string
  priority: IndustryGapPriority
  requirementType:
    | "required"
    | "preferred"
    | "leadership"
    | "certification"
  evidenceStrength:
    | "none"
    | "weak"
    | "moderate"
    | "strong"
  evidenceScore: number
  recommendation: string
}

export type IndustryGapAnalysisResult = {
  industry: string
  readinessScore: number
  gaps: IndustryGapItem[]
}

// =====================================================
// BLOCK: Priority Resolver
// =====================================================

function getPriority({
  requirementType,
  evidenceScore,
}: {
  requirementType: IndustryGapItem["requirementType"]
  evidenceScore: number
}): IndustryGapPriority {
  if (requirementType === "required" && evidenceScore < 60) return "high"
  if (requirementType === "certification" && evidenceScore < 60) return "high"
  if (requirementType === "leadership" && evidenceScore < 60) return "medium"
  if (requirementType === "preferred" && evidenceScore < 40) return "medium"

  return "low"
}

// =====================================================
// BLOCK: Recommendation Builder
// =====================================================

function buildRecommendation({
  skill,
  requirementType,
}: {
  skill: string
  requirementType: IndustryGapItem["requirementType"]
}) {
  if (requirementType === "certification") {
    return `Add ${skill} if you hold this certification or training. If not, consider earning it for this target industry.`
  }

  if (requirementType === "leadership") {
    return `Add a truthful leadership bullet showing how you used ${skill}, such as training, supervising, scheduling, or leading a team.`
  }

  if (requirementType === "required") {
    return `Show clear resume evidence for ${skill} in your summary, skills, or work experience bullets.`
  }

  return `Consider adding ${skill} if it accurately reflects your background and supports the target role.`
}

// =====================================================
// BLOCK: Gap Item Factory
// =====================================================

function createGapItem({
  data,
  skill,
  requirementType,
}: {
  data: ResumeBuilderFormData
  skill: string
  requirementType: IndustryGapItem["requirementType"]
}): IndustryGapItem | null {
  const evidenceReport = analyzeSkillEvidence({
    skill,
    data,
  })

  if (
    evidenceReport.strength === "strong" ||
    evidenceReport.score >= 75
  ) {
    return null
  }

  return {
    skill,
    requirementType,
    evidenceStrength: evidenceReport.strength,
    evidenceScore: evidenceReport.score,
    priority: getPriority({
      requirementType,
      evidenceScore: evidenceReport.score,
    }),
    recommendation: buildRecommendation({
      skill,
      requirementType,
    }),
  }
}

// =====================================================
// BLOCK: Readiness Score
// =====================================================

function calculateReadinessScore(gaps: IndustryGapItem[]) {
  let score = 100

  gaps.forEach((gap) => {
    if (gap.priority === "high") score -= 12
    if (gap.priority === "medium") score -= 7
    if (gap.priority === "low") score -= 3
  })

  return Math.max(score, 0)
}

// =====================================================
// BLOCK: Public Industry Gap Analyzer
// =====================================================

export function analyzeIndustryGaps({
  data,
  industry,
}: {
  data: ResumeBuilderFormData
  industry: string
}): IndustryGapAnalysisResult {
  const requirements = getIndustrySkillRequirements(industry)

  const gaps = [
    ...requirements.requiredSkills.map((skill) =>
      createGapItem({
        data,
        skill,
        requirementType: "required",
      }),
    ),
    ...requirements.preferredSkills.map((skill) =>
      createGapItem({
        data,
        skill,
        requirementType: "preferred",
      }),
    ),
    ...requirements.leadershipSkills.map((skill) =>
      createGapItem({
        data,
        skill,
        requirementType: "leadership",
      }),
    ),
    ...requirements.certificationSkills.map((skill) =>
      createGapItem({
        data,
        skill,
        requirementType: "certification",
      }),
    ),
  ].filter(Boolean) as IndustryGapItem[]

  const sortedGaps = gaps.sort((a, b) => {
    const priorityRank = {
      high: 3,
      medium: 2,
      low: 1,
    }

    return priorityRank[b.priority] - priorityRank[a.priority]
  })

  return {
    industry,
    readinessScore: calculateReadinessScore(sortedGaps),
    gaps: sortedGaps,
  }
}