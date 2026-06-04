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

// =====================================================
// BLOCK: Phase 1.6.1 Evidence Scoring Engine
// =====================================================

export {
  calculateEvidenceScore,
  getEvidenceCategoryScore,
  getEvidenceStrengthFromScore,
  normalizeEvidenceScore,
} from "./evidence-scoring"

// =====================================================
// BLOCK: Phase 1.6.1 Skill Evidence Analyzer
// =====================================================

export {
  analyzeSkillEvidence,
} from "./skill-evidence"

// =====================================================
// BLOCK: Phase 1.6.1 Industry Skill Requirements
// =====================================================

export {
  getIndustrySkillRequirements,
  INDUSTRY_SKILL_REQUIREMENTS,
  DEFAULT_INDUSTRY_REQUIREMENTS,
} from "./industry-skill-requirements"

// =====================================================
// BLOCK: Phase 1.6.1 Industry Gap Analysis
// =====================================================

export {
  analyzeIndustryGaps,
} from "./industry-gap-analysis"

// =====================================================
// BLOCK: Phase 1.6.1 Evidence Types
// =====================================================

export type {
  SkillEvidenceCategory,
  SkillEvidenceItem,
  SkillEvidenceReport,
  SkillEvidenceStrength,
} from "./evidence-types"

// =====================================================
// BLOCK: Phase 1.6.1 Industry Types
// =====================================================

export type {
  IndustrySkillRequirement,
} from "./industry-skill-requirements"

export type {
  IndustryGapAnalysisResult,
  IndustryGapItem,
  IndustryGapPriority,
} from "./industry-gap-analysis"