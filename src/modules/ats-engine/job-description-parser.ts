// =====================================================
// BLOCK: Taxonomy Imports
// =====================================================

import {
  extractTaxonomyKeywords,
  filterValidAtsKeywords,
  normalizeAtsKeyword,
} from "@/modules/keyword-engine"

// =====================================================
// BLOCK: Text Normalization
// Kept for backward compatibility with older ATS imports.
// =====================================================

export function normalizeKeywordText(value: string) {
  return normalizeAtsKeyword(value)
}

// =====================================================
// BLOCK: Job Description Tokenization
// Kept for compatibility, but now returns ATS-safe taxonomy
// terms instead of generic single-word tokens.
// =====================================================

export function tokenizeJobDescription(jobDescription: string): string[] {
  return extractJobKeywords(jobDescription)
}

// =====================================================
// BLOCK: Job Keyword Extraction
// Taxonomy-backed extraction prevents generic words like
// "years", "position", "full-time", "job", "type", etc.
// from becoming ATS keywords.
// =====================================================

export function extractJobKeywords(jobDescription: string): string[] {
  const taxonomyKeywords = extractTaxonomyKeywords(jobDescription).map(
    (match) => match.keyword,
  )

  return filterValidAtsKeywords(taxonomyKeywords).slice(0, 40)
}