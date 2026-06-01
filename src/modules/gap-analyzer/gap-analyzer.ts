// =====================================================
// BLOCK: Imports
// =====================================================

import type { ResumeBuilderFormData } from "@/modules/resume-builder"
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
} from "./keyword-taxonomy"

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
// BLOCK: Deduplication Helpers
// =====================================================

function uniqueKeywords(keywords: string[]): string[] {
  return Array.from(new Set(keywords.map(normalizeAtsKeyword))).filter(Boolean)
}

function getMissingFromResume(jobKeywords: string[], resumeKeywords: string[]) {
  const resumeKeywordSet = new Set(resumeKeywords.map(normalizeAtsKeyword))

  return uniqueKeywords(jobKeywords).filter(
    (keyword) => !resumeKeywordSet.has(normalizeAtsKeyword(keyword)),
  )
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
    .filter((match) => {
      return (
        match.category === "technical_skill" ||
        match.category === "soft_skill" ||
        match.category === "tool" ||
        match.category === "platform" ||
        match.category === "methodology"
      )
    })
    .map((match) => match.keyword)

  const resumeSkills = extractTaxonomyKeywords(resumeText).map(
    (match) => match.keyword,
  )

  return getMissingFromResume(jobSkills, resumeSkills).slice(0, 8)
}

function getMissingCertifications(
  data: ResumeBuilderFormData,
  jobDescription: string,
): string[] {
  const resumeText = buildResumeText(data)

  const jobCertifications = extractTaxonomyKeywords(jobDescription)
    .filter((match) => isCertificationKeyword(match.keyword))
    .map((match) => match.keyword)

  const resumeCertifications = extractTaxonomyKeywords(resumeText)
    .filter((match) => isCertificationKeyword(match.keyword))
    .map((match) => match.keyword)

  return getMissingFromResume(jobCertifications, resumeCertifications).slice(0, 5)
}

function getExperienceGaps(
  data: ResumeBuilderFormData,
  jobDescription: string,
): string[] {
  const resumeText = buildResumeText(data)

  const jobExperienceSignals = extractTaxonomyKeywords(jobDescription)
    .filter((match) => isExperienceSignalKeyword(match.keyword))
    .map((match) => match.keyword)

  const resumeExperienceSignals = extractTaxonomyKeywords(resumeText)
    .filter((match) => isExperienceSignalKeyword(match.keyword))
    .map((match) => match.keyword)

  return getMissingFromResume(jobExperienceSignals, resumeExperienceSignals).slice(
    0,
    6,
  )
}

function getKeywordGaps(
  data: ResumeBuilderFormData,
  jobDescription: string,
): string[] {
  const resumeText = buildResumeText(data)

  const jobKeywords = extractTaxonomyKeywords(jobDescription)
    .filter((match) => {
      return !isCertificationKeyword(match.keyword)
    })
    .filter((match) => {
      return !isExperienceSignalKeyword(match.keyword)
    })
    .map((match) => match.keyword)

  const resumeKeywords = extractTaxonomyKeywords(resumeText).map(
    (match) => match.keyword,
  )

  return getMissingFromResume(
    filterValidAtsKeywords(jobKeywords),
    filterValidAtsKeywords(resumeKeywords),
  )
    .filter((keyword) => classifyKeyword(keyword) !== null)
    .slice(0, 8)
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
  const keywordGaps = getKeywordGaps(data, jobDescription)

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
