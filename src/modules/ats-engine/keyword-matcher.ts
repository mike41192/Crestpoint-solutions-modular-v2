// =====================================================
// BLOCK: Type Imports
// =====================================================

import type { ResumeBuilderFormData } from "@/modules/resume-builder"

// =====================================================
// BLOCK: Taxonomy Imports
// =====================================================

import {
  extractTaxonomyKeywords,
  filterValidAtsKeywords,
  normalizeAtsKeyword,
} from "@/modules/keyword-engine"

// =====================================================
// BLOCK: Result Types
// =====================================================

export type KeywordMatchResult = {
  matchedKeywords: string[]
  missingKeywords: string[]
  keywordMatchPercent: number
  totalKeywords: number
}

// =====================================================
// BLOCK: Resume Text Builder
// =====================================================

function resumeToSearchableText(data: ResumeBuilderFormData) {
  return [
    data.contact.fullName,
    data.contact.location,
    data.summary,
    ...data.skills,
    ...data.certifications,
    ...data.education.flatMap((education) => [
      education.school,
      education.degree,
      education.field,
    ]),
    ...data.experience.flatMap((job) => [
      job.company,
      job.role,
      job.location,
      ...job.bullets,
    ]),
  ]
    .filter(Boolean)
    .join(" ")
}

// =====================================================
// BLOCK: Keyword Deduplication Helper
// =====================================================

function uniqueKeywords(keywords: string[]) {
  return Array.from(new Set(keywords.map(normalizeAtsKeyword)))
    .filter(Boolean)
    .filter((keyword) => filterValidAtsKeywords([keyword]).length > 0)
}

// =====================================================
// BLOCK: Taxonomy Keyword Extraction
// =====================================================

function getTaxonomyKeywords(text: string) {
  return uniqueKeywords(
    extractTaxonomyKeywords(text).map((match) => match.keyword),
  )
}

// =====================================================
// BLOCK: Public Keyword Matcher
// =====================================================

export function matchResumeKeywords(
  data: ResumeBuilderFormData,
  jobDescription: string,
): KeywordMatchResult {
  const jobKeywords = getTaxonomyKeywords(jobDescription)
  const resumeKeywords = getTaxonomyKeywords(resumeToSearchableText(data))
  const resumeKeywordSet = new Set(resumeKeywords.map(normalizeAtsKeyword))

  if (!jobDescription.trim() || jobKeywords.length === 0) {
    return {
      matchedKeywords: [],
      missingKeywords: [],
      keywordMatchPercent: 0,
      totalKeywords: 0,
    }
  }

  const matchedKeywords = jobKeywords.filter((keyword) =>
    resumeKeywordSet.has(normalizeAtsKeyword(keyword)),
  )

  const missingKeywords = jobKeywords.filter(
    (keyword) => !resumeKeywordSet.has(normalizeAtsKeyword(keyword)),
  )

  return {
    matchedKeywords,
    missingKeywords,
    keywordMatchPercent: Math.round(
      (matchedKeywords.length / jobKeywords.length) * 100,
    ),
    totalKeywords: jobKeywords.length,
  }
}