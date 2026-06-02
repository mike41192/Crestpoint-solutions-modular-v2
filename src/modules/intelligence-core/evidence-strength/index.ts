// =====================================================
// BLOCK: Public Type Exports
// =====================================================

export type { EvidenceStrength, EvidenceStrengthResult } from "./types"

// =====================================================
// BLOCK: Public Engine Exports
// =====================================================

export { evaluateEvidenceStrength } from "./strength-engine"

// =====================================================
// BLOCK: Public Coverage Exports
// =====================================================

export {
  analyzeEvidenceCoverage,
  getStronglyCoveredSkills,
} from "./evidence-coverage"
