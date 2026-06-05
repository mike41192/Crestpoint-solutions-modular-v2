// =====================================================
// BLOCK: Resume Builder Imports
// Crestpoint Solutions V2
// Version: 1.7.14
// =====================================================

import type { ResumeBuilderFormData } from "@/modules/resume-builder"

// =====================================================
// BLOCK: Evidence Imports
// =====================================================

import {
  calculateEvidenceScore,
  getEvidenceCategoryScore,
  getEvidenceStrengthFromScore,
} from "./evidence-scoring"

import type {
  SkillEvidenceItem,
  SkillEvidenceReport,
} from "./evidence-types"

// =====================================================
// BLOCK: Related Evidence Map
// Purpose:
// Gives fair evidence credit when a resume uses related wording instead of
// the exact target skill phrase.
// =====================================================

const RELATED_EVIDENCE_TERMS: Record<string, string[]> = {
  "mechanical systems": [
    "mechanical",
    "equipment maintenance",
    "preventive maintenance",
    "production equipment",
    "maintenance operations",
    "equipment repair",
  ],

  "hydraulic systems": [
    "hydraulic",
    "hydraulics",
    "equipment maintenance",
    "production equipment",
  ],

  "pneumatic systems": [
    "pneumatic",
    "pneumatics",
    "equipment maintenance",
    "production equipment",
  ],

  "staff training": [
    "training",
    "employee training",
    "trained",
    "coached",
    "team training",
  ],

  supervision: [
    "supervisor",
    "supervision",
    "supervisory",
    "managed a team",
    "led a team",
  ],

  scheduling: [
    "schedule",
    "scheduling",
    "planned work",
    "coordinated work",
  ],

  "continuous improvement": [
    "process improvement",
    "workflow efficiency",
    "improving efficiency",
    "operational improvement",
    "production improvement",
  ],

  plc: [
    "plc",
    "programmable logic controller",
  ],

  "predictive maintenance": [
    "predictive maintenance",
    "condition monitoring",
    "maintenance planning",
    "equipment reliability",
  ],
}

// =====================================================
// BLOCK: Text Normalization Helpers
// =====================================================

function normalizeText(value: string) {
  return value
    .toLowerCase()
    .replace(/[^\w\s.%+-]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
}

function getEvidenceTerms(skill: string): string[] {
  const normalizedSkill = normalizeText(skill)

  return Array.from(
    new Set([
      normalizedSkill,
      ...(RELATED_EVIDENCE_TERMS[normalizedSkill] || []),
    ].map(normalizeText)),
  )
}

function textContainsTerm(text: string, term: string) {
  const normalizedText = normalizeText(text)
  const normalizedTerm = normalizeText(term)

  if (!normalizedTerm) return false

  return normalizedText.includes(normalizedTerm)
}

// =====================================================
// BLOCK: Resume Text Builder
// =====================================================

function getResumeText(data: ResumeBuilderFormData) {
  return [
    data.summary,
    ...data.skills,
    ...data.certifications,
    ...data.experience.flatMap((job) => [
      job.role,
      job.company,
      job.location,
      ...job.bullets,
    ]),
  ]
    .filter(Boolean)
    .join(" ")
}

// =====================================================
// BLOCK: Experience Bullet Collection
// =====================================================

function getExperienceBullets(data: ResumeBuilderFormData): string[] {
  return data.experience
    .flatMap((job) => job.bullets || [])
    .filter(Boolean)
}

// =====================================================
// BLOCK: Skill Evidence Detection
// =====================================================

export function analyzeSkillEvidence({
  skill,
  data,
}: {
  skill: string
  data: ResumeBuilderFormData
}): SkillEvidenceReport {
  const evidenceTerms = getEvidenceTerms(skill)
  const resumeText = getResumeText(data)
  const bullets = getExperienceBullets(data)
  const evidence: SkillEvidenceItem[] = []

  // =====================================================
  // BLOCK: Skills Section Evidence
  // =====================================================

  const skillsMatch = data.skills.some((item) =>
    evidenceTerms.some((term) => textContainsTerm(item, term)),
  )

  if (skillsMatch) {
    evidence.push({
      skill,
      category: "direct_keyword",
      strength: "weak",
      evidenceText: "Found related evidence in skills section",
      score: getEvidenceCategoryScore("direct_keyword"),
    })
  }

  // =====================================================
  // BLOCK: Certification Evidence
  // =====================================================

  const certificationMatch = data.certifications.some((certification) =>
    evidenceTerms.some((term) => textContainsTerm(certification, term)),
  )

  if (certificationMatch) {
    evidence.push({
      skill,
      category: "certification",
      strength: "strong",
      evidenceText: "Referenced in certification",
      score: getEvidenceCategoryScore("certification"),
    })
  }

  // =====================================================
  // BLOCK: Experience Evidence
  // =====================================================

  bullets.forEach((bullet) => {
    const containsEvidence = evidenceTerms.some((term) =>
      textContainsTerm(bullet, term),
    )

    if (containsEvidence) {
      evidence.push({
        skill,
        category: "experience_bullet",
        strength: "moderate",
        evidenceText: bullet,
        score: getEvidenceCategoryScore("experience_bullet"),
      })
    }
  })

  // =====================================================
  // BLOCK: Achievement Evidence
  // =====================================================

  bullets.forEach((bullet) => {
    const containsEvidence = evidenceTerms.some((term) =>
      textContainsTerm(bullet, term),
    )

    const containsMetric =
      /\d|%|\$|hours?|days?|weeks?|months?|years?|team|staff|employees?|customers?|units?|projects?/i.test(
        bullet,
      )

    if (containsEvidence && containsMetric) {
      evidence.push({
        skill,
        category: "achievement",
        strength: "strong",
        evidenceText: bullet,
        score: getEvidenceCategoryScore("achievement"),
      })
    }
  })

  // =====================================================
  // BLOCK: Industry Context Evidence
  // =====================================================

  const hasIndustryContext = evidenceTerms.some((term) =>
    textContainsTerm(resumeText, term),
  )

  if (hasIndustryContext) {
    evidence.push({
      skill,
      category: "industry_context",
      strength: "weak",
      evidenceText: "Referenced elsewhere in resume",
      score: getEvidenceCategoryScore("industry_context"),
    })
  }

  // =====================================================
  // BLOCK: Final Report
  // =====================================================

  const score = calculateEvidenceScore(evidence)
  const strength = getEvidenceStrengthFromScore(score)

  return {
    skill,
    score,
    confidence: score,
    strength,
    evidence,

    evidenceFound: evidence.map((item) => ({
      phrase: item.evidenceText,
      source: item.category,
      confidence: item.score,
    })),

    evidenceMissing:
      evidence.length > 0
        ? []
        : [`No direct or related resume evidence found for ${skill}.`],

    recommendation:
      evidence.length > 0
        ? `Strengthen this skill by adding clearer measurable resume evidence for ${skill}.`
        : `Add truthful resume evidence showing how you used ${skill}.`,
  }
}