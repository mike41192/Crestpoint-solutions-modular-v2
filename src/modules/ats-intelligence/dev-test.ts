// =====================================================
// BLOCK: Imports
// =====================================================

import {
  analyzeSkillConfidence,
  detectSkillsFromExperience,
} from "./confidence-engine"

// =====================================================
// BLOCK: Test Resume Text
// =====================================================

const testResumeText = `
Managed a team of 15 technicians across daily maintenance operations.
Trained 8 new hires on safety procedures and equipment standards.
Improved production efficiency by 12% through workflow optimization.
Reduced recurring equipment issues by identifying root causes.
Performed preventive maintenance on production equipment.
Coordinated vendors for facility repair projects.
`

// =====================================================
// BLOCK: Target Skills
// =====================================================

const targetSkills = [
  "team leadership",
  "employee training",
  "process improvement",
  "root cause analysis",
  "preventive maintenance",
  "vendor management",
  "project management",
]

// =====================================================
// BLOCK: Dev Validation Runner
// =====================================================

export function runAtsIntelligenceDevTest() {
  const detectedSkills = detectSkillsFromExperience(testResumeText)

  const confidenceResults = analyzeSkillConfidence({
    text: testResumeText,
    targetSkills,
  })

  return {
    detectedSkills,
    confidenceResults,
  }
}
