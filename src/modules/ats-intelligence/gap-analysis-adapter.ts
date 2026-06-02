// =====================================================
// BLOCK: Imports
// =====================================================

import { analyzeSkillConfidence } from "./confidence-engine"

// =====================================================
// BLOCK: Types
// =====================================================

export type IntelligentGapResult = {
  missingSkills: string[]
  detectedSkills: string[]
}

// =====================================================
// BLOCK: Public Adapter
// =====================================================

export function analyzeIntelligentSkillCoverage({
  resumeText,
  targetSkills,
}: {
  resumeText: string
  targetSkills: string[]
}): IntelligentGapResult {
  const confidenceResults = analyzeSkillConfidence({
    text: resumeText,
    targetSkills,
  })

  const detectedSkills = confidenceResults
    .filter((result) => result.score >= 40)
    .map((result) => result.skill)

  const missingSkills = targetSkills.filter((skill) => {
    return !detectedSkills.includes(skill)
  })

  return {
    missingSkills,
    detectedSkills,
  }
}
