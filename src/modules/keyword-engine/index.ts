// =====================================================
// BLOCK: Central Keyword Engine Re-Exports
// Crestpoint Solutions V2
// Version: 1.5.6
//
// This module centralizes ATS-safe keyword intelligence.
// ATS Engine, Gap Analyzer, Resume Optimizer, and future
// AI modules should import keyword logic from here.
// =====================================================

export {
  classifyKeyword,
  extractTaxonomyKeywords,
  filterValidAtsKeywords,
  isCertificationKeyword,
  isExperienceSignalKeyword,
  normalizeAtsKeyword,
} from "@/modules/gap-analyzer/keyword-taxonomy"

export type {
  KeywordCategory,
  TaxonomyMatch,
} from "@/modules/gap-analyzer/keyword-taxonomy"
