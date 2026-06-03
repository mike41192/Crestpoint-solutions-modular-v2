// =====================================================
// BLOCK: Type Imports
// =====================================================

import type { ResumeBuilderFormData } from "@/modules/resume-builder"

// =====================================================
// BLOCK: Keyword Engine Imports
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
// BLOCK: Keyword Normalization / Deduplication
// =====================================================

function uniqueValidKeywords(keywords: string[]) {
  return Array.from(new Set(keywords.map(normalizeAtsKeyword)))
    .filter(Boolean)
    .filter((keyword) => filterValidAtsKeywords([keyword]).length > 0)
}

// =====================================================
// BLOCK: Taxonomy Keyword Extraction
// =====================================================

function getTaxonomyKeywords(text: string) {
  return uniqueValidKeywords(
    extractTaxonomyKeywords(text).map((match) => match.keyword),
  )
}

// =====================================================
// BLOCK: Flexible Keyword Match Helper
// Handles exact matches and partial phrase overlap.
// =====================================================

function hasKeywordMatch(keyword: string, resumeKeywords: string[]) {
  const normalizedKeyword = normalizeAtsKeyword(keyword)

  return resumeKeywords.some((resumeKeyword) => {
    const normalizedResumeKeyword = normalizeAtsKeyword(resumeKeyword)

    if (normalizedResumeKeyword === normalizedKeyword) {
      return true
    }

    if (
      normalizedKeyword.includes(" ") &&
      normalizedResumeKeyword.includes(normalizedKeyword)
    ) {
      return true
    }

    if (
      normalizedResumeKeyword.includes(" ") &&
      normalizedKeyword.includes(normalizedResumeKeyword)
    ) {
      return true
    }

    return false
  })
}

// =====================================================
// BLOCK: Match Percentage Helper
// =====================================================

function calculateKeywordMatchPercent({
  matchedCount,
  totalCount,
}: {
  matchedCount: number
  totalCount: number
}) {
  if (totalCount === 0) return 0

  return Math.round((matchedCount / totalCount) * 100)
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

  if (!jobDescription.trim() || jobKeywords.length === 0) {
    return {
      matchedKeywords: [],
      missingKeywords: [],
      keywordMatchPercent: 0,
      totalKeywords: 0,
    }
  }

  const matchedKeywords = jobKeywords.filter((keyword) =>
    hasKeywordMatch(keyword, resumeKeywords),
  )

  const missingKeywords = jobKeywords.filter(
    (keyword) => !hasKeywordMatch(keyword, resumeKeywords),
  )

  return {
    matchedKeywords,
    missingKeywords,
    keywordMatchPercent: calculateKeywordMatchPercent({
      matchedCount: matchedKeywords.length,
      totalCount: jobKeywords.length,
    }),
    totalKeywords: jobKeywords.length,
  }
}