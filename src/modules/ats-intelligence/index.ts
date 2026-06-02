// =====================================================
// BLOCK: Public Type Exports
// =====================================================

export type {
  DetectedSkill,
  DetectionSource,
  ExperienceMatch,
  PhraseMapping,
  SkillConfidenceResult,
} from "./types"

// =====================================================
// BLOCK: Public Taxonomy Exports
// =====================================================

export { phraseTaxonomy } from "./phrase-taxonomy"

// =====================================================
// BLOCK: Public Engine Exports
// =====================================================

export { detectExperienceMatches } from "./experience-detector"
export {
  analyzeSkillConfidence,
  detectSkillsFromExperience,
} from "./confidence-engine"

// =====================================================
// BLOCK: Dev Test Export
// =====================================================

export { runAtsIntelligenceDevTest } from "./dev-test"


// =====================================================
// BLOCK: Gap Analysis Adapter
// =====================================================

export {
  analyzeIntelligentSkillCoverage,
} from "./gap-analysis-adapter"
