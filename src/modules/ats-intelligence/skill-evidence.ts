// =====================================================
// BLOCK: Resume Builder Imports
// Crestpoint Solutions V2
// Version: 1.6.1
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
    .toLowerCase()
}

// =====================================================
// BLOCK: Experience Bullet Collection
// =====================================================

function getExperienceBullets(
  data: ResumeBuilderFormData,
): string[] {
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
  const normalizedSkill =
    skill.toLowerCase()

  const resumeText =
    getResumeText(data)

  const bullets =
    getExperienceBullets(data)

  const evidence: SkillEvidenceItem[] =
    []

  // =====================================================
  // BLOCK: Skills Section Evidence
  // =====================================================

  const skillsMatch =
    data.skills.some(
      (item) =>
        item.toLowerCase() ===
        normalizedSkill,
    )

  if (skillsMatch) {
    evidence.push({
      skill,
      category: "direct_keyword",
      strength: "weak",
      evidenceText:
        "Found in skills section",
      score:
        getEvidenceCategoryScore(
          "direct_keyword",
        ),
    })
  }

  // =====================================================
  // BLOCK: Certification Evidence
  // =====================================================

  const certificationMatch =
    data.certifications.some(
      (certification) =>
        certification
          .toLowerCase()
          .includes(normalizedSkill),
    )

  if (certificationMatch) {
    evidence.push({
      skill,
      category: "certification",
      strength: "strong",
      evidenceText:
        "Referenced in certification",
      score:
        getEvidenceCategoryScore(
          "certification",
        ),
    })
  }

  // =====================================================
  // BLOCK: Experience Evidence
  // =====================================================

  bullets.forEach((bullet) => {
    if (
      bullet
        .toLowerCase()
        .includes(normalizedSkill)
    ) {
      evidence.push({
        skill,
        category:
          "experience_bullet",
        strength: "moderate",
        evidenceText: bullet,
        score:
          getEvidenceCategoryScore(
            "experience_bullet",
          ),
      })
    }
  })

  // =====================================================
  // BLOCK: Achievement Evidence
  // =====================================================

  bullets.forEach((bullet) => {
    const containsSkill =
      bullet
        .toLowerCase()
        .includes(normalizedSkill)

    const containsMetric =
      /\d|%|\$|hours?|days?|weeks?|months?|years?|team|staff|employees?|customers?|units?|projects?/i.test(
        bullet,
      )

    if (
      containsSkill &&
      containsMetric
    ) {
      evidence.push({
        skill,
        category: "achievement",
        strength: "strong",
        evidenceText: bullet,
        score:
          getEvidenceCategoryScore(
            "achievement",
          ),
      })
    }
  })

  // =====================================================
  // BLOCK: Industry Context Evidence
  // =====================================================

  if (
    resumeText.includes(
      normalizedSkill,
    )
  ) {
    evidence.push({
      skill,
      category:
        "industry_context",
      strength: "weak",
      evidenceText:
        "Referenced elsewhere in resume",
      score:
        getEvidenceCategoryScore(
          "industry_context",
        ),
    })
  }

  // =====================================================
  // BLOCK: Final Report
  // =====================================================

  const score =
    calculateEvidenceScore(
      evidence,
    )

  return {
    skill,
    score,
    strength:
      getEvidenceStrengthFromScore(
        score,
      ),
    evidence,
  }
}