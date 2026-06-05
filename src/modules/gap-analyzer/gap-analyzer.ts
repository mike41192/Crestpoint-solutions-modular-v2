// =====================================================
// BLOCK: Imports
// Crestpoint Solutions V2
// Version: 1.7.13
// =====================================================

import type { ResumeBuilderFormData } from "@/modules/resume-builder"
import { analyzeIntelligentSkillCoverage } from "@/modules/ats-intelligence"
import { getStronglyCoveredSkills } from "@/modules/intelligence-core/evidence-strength"
import { getProjectCoveredSkills } from "@/modules/intelligence-core/project-intelligence"
import type { ResumeGapAnalysisResult, ResumeGapItem } from "./types"

// =====================================================
// BLOCK: Keyword Taxonomy Imports
// =====================================================

import {
  classifyKeyword,
  extractTaxonomyKeywords,
  filterValidAtsKeywords,
  isCertificationKeyword,
  isExperienceSignalKeyword,
  normalizeAtsKeyword,
} from "@/modules/keyword-engine"

// =====================================================
// BLOCK: Local Constants
// =====================================================

const SKILL_CATEGORIES = new Set([
  "technical_skill",
  "soft_skill",
  "tool",
  "platform",
  "methodology",
])

const MAX_MISSING_SKILLS = 8
const MAX_MISSING_CERTIFICATIONS = 5
const MAX_EXPERIENCE_GAPS = 6
const MAX_KEYWORD_GAPS = 8

// =====================================================
// BLOCK: Equivalent Skill Groups
// Purpose:
// Prevents related real-world skills from being treated as separate gaps.
// Example:
// "mechanical maintenance", "industrial maintenance", and "facility maintenance"
// should not all show as separate missing skills when the resume already shows
// strong maintenance experience.
// =====================================================

const EQUIVALENT_SKILL_GROUPS: string[][] = [
  [
    "equipment maintenance",
    "preventive maintenance",
    "corrective maintenance",
    "mechanical maintenance",
    "industrial maintenance",
    "facility maintenance",
    "manufacturing maintenance",
    "maintenance operations",
    "maintenance technician",
    "maintenance supervisor",
    "maintenance experience",
  ],
  [
    "equipment troubleshooting",
    "electrical troubleshooting",
    "mechanical troubleshooting",
    "maintenance troubleshooting",
    "equipment repair",
    "equipment failures",
    "root cause analysis",
    "resolved operational issues",
  ],
  [
    "team leadership",
    "supervision",
    "supervisory experience",
    "staff training",
    "employee training",
    "scheduling",
    "managed a team",
    "led a team",
  ],
  [
    "safety compliance",
    "workplace safety",
    "osha",
    "osha 30",
    "lockout tagout",
    "loto",
  ],
  [
    "lean manufacturing",
    "six sigma",
    "lean six sigma",
    "continuous improvement",
    "process improvement",
    "workflow efficiency",
    "operational improvement",
    "production improvement",
  ],
  [
    "inventory management",
    "inventory control",
    "vendor management",
    "parts inventory",
    "inventory",
  ],
  [
    "work orders",
    "work order",
    "cmms",
    "maintenance documentation",
  ],
]

// =====================================================
// BLOCK: Resume Text Helpers
// =====================================================

function buildResumeText(data: ResumeBuilderFormData): string {
  return [
    data.summary,
    ...data.skills,
    ...data.certifications,
    ...data.experience.flatMap((job) => [
      job.company,
      job.role,
      job.location,
      ...job.bullets,
    ]),
    ...data.education.flatMap((education) => [
      education.school,
      education.degree,
      education.field,
    ]),
  ]
    .filter(Boolean)
    .join(" ")
}

// =====================================================
// BLOCK: Keyword Helpers
// =====================================================

function uniqueKeywords(keywords: string[]): string[] {
  return Array.from(new Set(keywords.map(normalizeAtsKeyword)))
    .filter(Boolean)
    .filter((keyword) => classifyKeyword(keyword) !== null)
}

function getCleanTaxonomyKeywords(text: string): string[] {
  return filterValidAtsKeywords(
    extractTaxonomyKeywords(text).map((match) => match.keyword),
  )
}

function getEquivalentGroup(keyword: string): string[] {
  const normalizedKeyword = normalizeAtsKeyword(keyword)

  const group = EQUIVALENT_SKILL_GROUPS.find((items) =>
    items.map(normalizeAtsKeyword).includes(normalizedKeyword),
  )

  if (!group) {
    return [normalizedKeyword]
  }

  return Array.from(new Set(group.map(normalizeAtsKeyword)))
}

function getCanonicalGapKeyword(keyword: string): string {
  return getEquivalentGroup(keyword)[0] || normalizeAtsKeyword(keyword)
}

function getExpandedKeywordSet(keywords: string[]): Set<string> {
  const expandedKeywords = keywords.flatMap((keyword) =>
    getEquivalentGroup(keyword),
  )

  return new Set(expandedKeywords.map(normalizeAtsKeyword))
}

function isKeywordCoveredByResume({
  keyword,
  resumeKeywords,
}: {
  keyword: string
  resumeKeywords: string[]
}) {
  const resumeKeywordSet = getExpandedKeywordSet(resumeKeywords)
  const equivalentKeywords = getEquivalentGroup(keyword)

  return equivalentKeywords.some((equivalentKeyword) =>
    resumeKeywordSet.has(normalizeAtsKeyword(equivalentKeyword)),
  )
}

function dedupeEquivalentKeywords(keywords: string[]): string[] {
  const seenCanonicalKeywords = new Set<string>()
  const dedupedKeywords: string[] = []

  keywords.forEach((keyword) => {
    const canonicalKeyword = getCanonicalGapKeyword(keyword)

    if (seenCanonicalKeywords.has(canonicalKeyword)) {
      return
    }

    seenCanonicalKeywords.add(canonicalKeyword)
    dedupedKeywords.push(canonicalKeyword)
  })

  return dedupedKeywords
}

function getMissingFromResume(jobKeywords: string[], resumeKeywords: string[]) {
  const cleanJobKeywords = dedupeEquivalentKeywords(
    uniqueKeywords(filterValidAtsKeywords(jobKeywords)),
  )

  const cleanResumeKeywords = uniqueKeywords(filterValidAtsKeywords(resumeKeywords))

  return cleanJobKeywords.filter((keyword) => {
    return !isKeywordCoveredByResume({
      keyword,
      resumeKeywords: cleanResumeKeywords,
    })
  })
}

function removeAlreadyCoveredKeywordGaps({
  keywordGaps,
  existingGaps,
}: {
  keywordGaps: string[]
  existingGaps: string[]
}) {
  return keywordGaps.filter((keywordGap) => {
    return !existingGaps.some((existingGap) => {
      const existingGroup = getEquivalentGroup(existingGap)
      const keywordGroup = getEquivalentGroup(keywordGap)

      return keywordGroup.some((keyword) =>
        existingGroup.includes(keyword),
      )
    })
  })
}

// =====================================================
// BLOCK: Intelligence Helper
// =====================================================

function removeIntelligentlyDetectedSkills({
  resumeText,
  missingSkills,
}: {
  resumeText: string
  missingSkills: string[]
}): string[] {
  const intelligentCoverage = analyzeIntelligentSkillCoverage({
    resumeText,
    targetSkills: missingSkills,
  })

  const detectedSkillSet = getExpandedKeywordSet(
    intelligentCoverage.detectedSkills,
  )

  return missingSkills.filter((skill) => {
    return !getEquivalentGroup(skill).some((equivalentSkill) =>
      detectedSkillSet.has(normalizeAtsKeyword(equivalentSkill)),
    )
  })
}

// =====================================================
// BLOCK: Evidence Strength Helper
// =====================================================

function removeEvidenceCoveredSkills({
  resumeText,
  missingSkills,
}: {
  resumeText: string
  missingSkills: string[]
}): string[] {
  const coveredSkills = getStronglyCoveredSkills({
    resumeText,
    targetSkills: missingSkills,
  })

  const coveredSkillSet = getExpandedKeywordSet(coveredSkills)

  return missingSkills.filter((skill) => {
    return !getEquivalentGroup(skill).some((equivalentSkill) =>
      coveredSkillSet.has(normalizeAtsKeyword(equivalentSkill)),
    )
  })
}

// =====================================================
// BLOCK: Project Intelligence Helper
// =====================================================

function removeProjectCoveredSkills({
  resumeText,
  missingSkills,
}: {
  resumeText: string
  missingSkills: string[]
}): string[] {
  const projectCoveredSkills = getProjectCoveredSkills(resumeText)
  const projectSkillSet = getExpandedKeywordSet(projectCoveredSkills)

  return missingSkills.filter((skill) => {
    return !getEquivalentGroup(skill).some((equivalentSkill) =>
      projectSkillSet.has(normalizeAtsKeyword(equivalentSkill)),
    )
  })
}

function refineMissingSkillsWithIntelligence({
  resumeText,
  missingSkills,
}: {
  resumeText: string
  missingSkills: string[]
}): string[] {
  const cleanMissingSkills = dedupeEquivalentKeywords(
    uniqueKeywords(filterValidAtsKeywords(missingSkills)),
  )

  const phraseFilteredSkills = removeIntelligentlyDetectedSkills({
    resumeText,
    missingSkills: cleanMissingSkills,
  })

  const evidenceFilteredSkills = removeEvidenceCoveredSkills({
    resumeText,
    missingSkills: phraseFilteredSkills,
  })

  const projectFilteredSkills = removeProjectCoveredSkills({
    resumeText,
    missingSkills: evidenceFilteredSkills,
  })

  return dedupeEquivalentKeywords(projectFilteredSkills)
}

// =====================================================
// BLOCK: Taxonomy-Based Gap Helpers
// =====================================================

function getMissingSkills(
  data: ResumeBuilderFormData,
  jobDescription: string,
): string[] {
  const resumeText = buildResumeText(data)

  const jobSkills = extractTaxonomyKeywords(jobDescription)
    .filter((match) => SKILL_CATEGORIES.has(match.category))
    .map((match) => match.keyword)

  const resumeSkills = getCleanTaxonomyKeywords(resumeText)

  const missingSkills = getMissingFromResume(jobSkills, resumeSkills).slice(
    0,
    MAX_MISSING_SKILLS,
  )

  return refineMissingSkillsWithIntelligence({
    resumeText,
    missingSkills,
  })
}

function getMissingCertifications(
  data: ResumeBuilderFormData,
  jobDescription: string,
): string[] {
  const resumeText = buildResumeText(data)

  const jobCertifications = getCleanTaxonomyKeywords(jobDescription).filter(
    isCertificationKeyword,
  )

  const resumeCertifications = getCleanTaxonomyKeywords(resumeText).filter(
    isCertificationKeyword,
  )

  return getMissingFromResume(jobCertifications, resumeCertifications).slice(
    0,
    MAX_MISSING_CERTIFICATIONS,
  )
}

function getExperienceGaps(
  data: ResumeBuilderFormData,
  jobDescription: string,
): string[] {
  const resumeText = buildResumeText(data)

  const jobExperienceSignals = getCleanTaxonomyKeywords(jobDescription).filter(
    isExperienceSignalKeyword,
  )

  const resumeExperienceSignals = getCleanTaxonomyKeywords(resumeText).filter(
    isExperienceSignalKeyword,
  )

  const experienceGaps = getMissingFromResume(
    jobExperienceSignals,
    resumeExperienceSignals,
  ).slice(0, MAX_EXPERIENCE_GAPS)

  return refineMissingSkillsWithIntelligence({
    resumeText,
    missingSkills: experienceGaps,
  })
}

function getKeywordGaps({
  data,
  jobDescription,
  existingGaps,
}: {
  data: ResumeBuilderFormData
  jobDescription: string
  existingGaps: string[]
}): string[] {
  const resumeText = buildResumeText(data)

  const jobKeywords = getCleanTaxonomyKeywords(jobDescription)
    .filter((keyword) => !isCertificationKeyword(keyword))
    .filter((keyword) => !isExperienceSignalKeyword(keyword))

  const resumeKeywords = getCleanTaxonomyKeywords(resumeText)

  const keywordGaps = getMissingFromResume(jobKeywords, resumeKeywords).slice(
    0,
    MAX_KEYWORD_GAPS,
  )

  const refinedKeywordGaps = refineMissingSkillsWithIntelligence({
    resumeText,
    missingSkills: keywordGaps,
  })

  return removeAlreadyCoveredKeywordGaps({
    keywordGaps: refinedKeywordGaps,
    existingGaps,
  })
}

// =====================================================
// BLOCK: Gap Item Factory
// =====================================================

function createGapItems({
  missingSkills,
  missingCertifications,
  experienceGaps,
  keywordGaps,
}: {
  missingSkills: string[]
  missingCertifications: string[]
  experienceGaps: string[]
  keywordGaps: string[]
}): ResumeGapItem[] {
  const gaps: ResumeGapItem[] = []

  missingSkills.forEach((skill, index) => {
    gaps.push({
      id: `skill-gap-${index}`,
      priority: index < 3 ? "high" : "medium",
      category: "skills",
      title: `Missing skill: ${skill}`,
      description:
        "This skill appears important for the job but is not clearly represented in the resume.",
      suggestedAction:
        "Add this skill only if it accurately reflects your experience, training, or ability.",
    })
  })

  missingCertifications.forEach((certification, index) => {
    gaps.push({
      id: `cert-gap-${index}`,
      priority: "high",
      category: "certifications",
      title: `Certification gap: ${certification}`,
      description:
        "The job description references this certification or credential, but it is missing from the resume.",
      suggestedAction:
        "Add the certification if you have it, or consider earning it if it is required for your target role.",
    })
  })

  experienceGaps.forEach((gap, index) => {
    gaps.push({
      id: `experience-gap-${index}`,
      priority: index < 2 ? "high" : "medium",
      category: "experience",
      title: `Experience gap: ${gap}`,
      description:
        "The job description emphasizes this experience area, but the resume does not strongly show it.",
      suggestedAction:
        "Add a truthful bullet point showing where you used this experience, process, or responsibility.",
    })
  })

  keywordGaps.forEach((keyword, index) => {
    gaps.push({
      id: `keyword-gap-${index}`,
      priority: index < 4 ? "medium" : "low",
      category: "keywords",
      title: `Keyword gap: ${keyword}`,
      description:
        "This ATS-safe keyword appears in the job posting but is missing from the resume.",
      suggestedAction:
        "Use this wording naturally in the summary, skills, or experience section only if accurate.",
    })
  })

  return gaps
}

// =====================================================
// BLOCK: Readiness Scoring
// =====================================================

function calculateReadinessScore(gapCount: number): number {
  if (gapCount === 0) return 100
  if (gapCount <= 3) return 85
  if (gapCount <= 7) return 70
  if (gapCount <= 12) return 55

  return 40
}

// =====================================================
// BLOCK: Public Analyzer
// =====================================================

export function analyzeResumeGaps(
  data: ResumeBuilderFormData,
  jobDescription: string,
): ResumeGapAnalysisResult {
  const missingSkills = getMissingSkills(data, jobDescription)
  const missingCertifications = getMissingCertifications(data, jobDescription)
  const experienceGaps = getExperienceGaps(data, jobDescription)

  const keywordGaps = getKeywordGaps({
    data,
    jobDescription,
    existingGaps: [
      ...missingSkills,
      ...missingCertifications,
      ...experienceGaps,
    ],
  })

  const gaps = createGapItems({
    missingSkills,
    missingCertifications,
    experienceGaps,
    keywordGaps,
  })

  return {
    readinessScore: calculateReadinessScore(gaps.length),
    missingSkills,
    missingCertifications,
    experienceGaps,
    keywordGaps,
    gaps,
  }
}