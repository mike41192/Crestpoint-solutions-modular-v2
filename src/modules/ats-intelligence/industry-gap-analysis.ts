// =====================================================
// BLOCK: Resume Builder Imports
// Crestpoint Solutions V2
// Version: 1.7.13
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
// BLOCK: Skill Alias Map
// Purpose:
// Gives the industry readiness engine fair credit for related resume wording.
// Example:
// "maintenance supervisor" should partially support "supervisory experience".
// =====================================================

const SKILL_ALIASES: Record<string, string[]> = {
  "mechanical maintenance": [
    "maintenance",
    "equipment maintenance",
    "preventive maintenance",
    "maintenance technician",
    "maintenance operations",
    "maintenance supervisor",
    "mechanical systems",
  ],

  "industrial maintenance": [
    "maintenance",
    "equipment maintenance",
    "preventive maintenance",
    "manufacturing maintenance",
    "maintenance operations",
    "maintenance technician",
    "maintenance supervisor",
  ],

  "facility maintenance": [
    "maintenance",
    "equipment maintenance",
    "preventive maintenance",
    "maintenance operations",
    "facility operations",
  ],

  "equipment troubleshooting": [
    "troubleshooting",
    "equipment repair",
    "equipment failures",
    "root cause analysis",
    "maintenance troubleshooting",
    "resolved operational issues",
  ],

  "electrical troubleshooting": [
    "electrical",
    "troubleshooting",
    "equipment troubleshooting",
    "equipment repair",
    "maintenance troubleshooting",
  ],

  "safety compliance": [
    "safety",
    "workplace safety",
    "osha",
    "osha 30",
    "compliance",
    "safety compliance",
  ],

  "continuous improvement": [
    "process improvement",
    "improving efficiency",
    "workflow efficiency",
    "operational improvement",
    "continuous improvement",
  ],

  "lean manufacturing": [
    "six sigma",
    "process improvement",
    "lean",
    "lean manufacturing",
    "production improvement",
  ],

  "inventory management": [
    "inventory",
    "parts inventory",
    "stock",
    "stocking",
    "supplies",
    "order supplies",
    "inventory management",
  ],

  "supervisory experience": [
    "supervisor",
    "supervisory",
    "supervision",
    "team leadership",
    "managed a team",
    "led a team",
    "training",
    "scheduling",
  ],

  "team leadership": [
    "team leadership",
    "supervisor",
    "supervision",
    "managed a team",
    "led a team",
    "training",
    "employee training",
    "scheduling",
  ],

  "employee training": [
    "training",
    "employee training",
    "trained",
    "coached",
    "onboarding",
    "team leadership",
  ],
}

// =====================================================
// BLOCK: Skill Search Term Resolver
// =====================================================

function getSkillSearchTerms(skill: string) {
  const normalizedSkill = skill.toLowerCase().trim()
  const aliases = SKILL_ALIASES[normalizedSkill] || []

  return Array.from(
    new Set([
      skill,
      normalizedSkill,
      ...aliases,
    ]),
  )
}

// =====================================================
// BLOCK: Best Evidence Resolver
// Purpose:
// Checks the direct skill plus aliases and keeps the best evidence score.
// =====================================================

function analyzeBestSkillEvidence({
  skill,
  data,
}: {
  skill: string
  data: ResumeBuilderFormData
}) {
  const evidenceReports = getSkillSearchTerms(skill).map((searchTerm) =>
    analyzeSkillEvidence({
      skill: searchTerm,
      data,
    }),
  )

  return evidenceReports.sort((a, b) => b.score - a.score)[0]
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
  if (requirementType === "required" && evidenceScore < 50) return "high"
  if (requirementType === "certification" && evidenceScore < 50) return "high"
  if (requirementType === "leadership" && evidenceScore < 50) return "medium"
  if (requirementType === "preferred" && evidenceScore < 35) return "medium"

  return "low"
}

// =====================================================
// BLOCK: Recommendation Builder
// =====================================================

function buildRecommendation({
  skill,
  requirementType,
  evidenceScore,
}: {
  skill: string
  requirementType: IndustryGapItem["requirementType"]
  evidenceScore: number
}) {
  if (requirementType === "certification") {
    return `Add ${skill} only if you hold this certification, license, or training. If not, consider earning it if this target role commonly requires it.`
  }

  if (requirementType === "leadership") {
    return `Strengthen leadership evidence for ${skill} with a truthful bullet showing team size, training, scheduling, supervision, or measurable team outcomes.`
  }

  if (requirementType === "required") {
    if (evidenceScore > 0) {
      return `Strengthen existing evidence for ${skill} with clearer wording in your summary, skills, or work experience bullets.`
    }

    return `Show clear resume evidence for ${skill} in your summary, skills, or work experience bullets if it accurately reflects your background.`
  }

  if (evidenceScore > 0) {
    return `You show some related evidence for ${skill}. Add clearer wording only if it truthfully supports the target role.`
  }

  return `Consider adding ${skill} only if it accurately reflects your background and supports the target role.`
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
  const evidenceReport = analyzeBestSkillEvidence({
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
      evidenceScore: evidenceReport.score,
    }),
  }
}

// =====================================================
// BLOCK: Readiness Penalty Weights
// Purpose:
// Prevents industry defaults from crushing readiness to 0 when the resume
// already has strong general ATS alignment.
// =====================================================

function getGapPenalty(gap: IndustryGapItem) {
  const missingEvidenceRatio =
    Math.max(100 - gap.evidenceScore, 0) / 100

  if (gap.requirementType === "required") {
    return missingEvidenceRatio * 8
  }

  if (gap.requirementType === "certification") {
    return missingEvidenceRatio * 7
  }

  if (gap.requirementType === "leadership") {
    return missingEvidenceRatio * 5
  }

  return missingEvidenceRatio * 3
}

// =====================================================
// BLOCK: Readiness Score
// =====================================================

function calculateReadinessScore(gaps: IndustryGapItem[]) {
  const totalPenalty = gaps.reduce(
    (total, gap) => total + getGapPenalty(gap),
    0,
  )

  return Math.max(
    Math.round(100 - totalPenalty),
    0,
  )
}

// =====================================================
// BLOCK: Gap Sorter
// =====================================================

function sortGapsByPriorityAndEvidence(
  gaps: IndustryGapItem[],
) {
  const priorityRank = {
    high: 3,
    medium: 2,
    low: 1,
  }

  const requirementRank = {
    required: 4,
    certification: 3,
    leadership: 2,
    preferred: 1,
  }

  return gaps.sort((a, b) => {
    const priorityDifference =
      priorityRank[b.priority] - priorityRank[a.priority]

    if (priorityDifference !== 0) {
      return priorityDifference
    }

    const requirementDifference =
      requirementRank[b.requirementType] -
      requirementRank[a.requirementType]

    if (requirementDifference !== 0) {
      return requirementDifference
    }

    return a.evidenceScore - b.evidenceScore
  })
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

  const sortedGaps = sortGapsByPriorityAndEvidence(gaps)

  return {
    industry,
    readinessScore: calculateReadinessScore(sortedGaps),
    gaps: sortedGaps,
  }
}
