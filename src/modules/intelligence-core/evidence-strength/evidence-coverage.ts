// =====================================================
// BLOCK: Imports
// =====================================================

import { evidenceMappings } from "@/modules/gap-analyzer/evidence"
import { evaluateEvidenceStrength } from "./strength-engine"
import type { EvidenceStrengthResult } from "./types"

// =====================================================
// BLOCK: Helpers
// =====================================================

function normalizeText(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^\w\s.%+-]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
}

function findEvidenceForSkill(skill: string): string[] {
  const normalizedSkill = normalizeText(skill)

  const mapping = evidenceMappings.find((item) => {
    return normalizeText(item.skill) === normalizedSkill
  })

  return mapping?.evidence || []
}

// =====================================================
// BLOCK: Public Coverage Engine
// =====================================================

export function analyzeEvidenceCoverage({
  resumeText,
  targetSkills,
}: {
  resumeText: string
  targetSkills: string[]
}): EvidenceStrengthResult[] {
  return targetSkills.map((skill) => {
    const evidence = findEvidenceForSkill(skill)

    return evaluateEvidenceStrength({
      skill,
      resumeText,
      evidence,
    })
  })
}

export function getStronglyCoveredSkills({
  resumeText,
  targetSkills,
}: {
  resumeText: string
  targetSkills: string[]
}): string[] {
  return analyzeEvidenceCoverage({
    resumeText,
    targetSkills,
  })
    .filter((result) => {
      return result.strength === "strong" || result.strength === "medium"
    })
    .map((result) => result.skill)
}
