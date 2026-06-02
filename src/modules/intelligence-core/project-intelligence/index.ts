// =====================================================
// BLOCK: Public Type Exports
// =====================================================

export type {
  ProjectDetectionResult,
  ProjectPattern,
  ProjectSignalStrength,
} from "./types"

// =====================================================
// BLOCK: Public Pattern Exports
// =====================================================

export { projectPatterns } from "./project-patterns"

// =====================================================
// BLOCK: Public Detector Exports
// =====================================================

export {
  detectProjectIntelligence,
  getProjectCoveredSkills,
} from "./project-detector"
