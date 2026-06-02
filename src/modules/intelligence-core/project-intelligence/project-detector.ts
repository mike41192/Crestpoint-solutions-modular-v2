// =====================================================
// BLOCK: Imports
// =====================================================

import { projectPatterns } from "./project-patterns"
import type {
  ProjectDetectionResult,
  ProjectSignalStrength,
} from "./types"

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

function getStrengthScore(strength: ProjectSignalStrength): number {
  if (strength === "strong") return 85
  if (strength === "medium") return 60
  return 35
}

function mergeStrength(
  current: ProjectSignalStrength,
  incoming: ProjectSignalStrength,
): ProjectSignalStrength {
  const currentScore = getStrengthScore(current)
  const incomingScore = getStrengthScore(incoming)

  return incomingScore > currentScore ? incoming : current
}

// =====================================================
// BLOCK: Public Project Detector
// =====================================================

export function detectProjectIntelligence(
  resumeText: string,
): ProjectDetectionResult[] {
  const normalizedResumeText = normalizeText(resumeText)

  const results = new Map<string, ProjectDetectionResult>()

  for (const patternGroup of projectPatterns) {
    const matchedPatterns = patternGroup.patterns.filter((pattern) => {
      return normalizedResumeText.includes(normalizeText(pattern))
    })

    if (matchedPatterns.length === 0) {
      continue
    }

    const existing = results.get(patternGroup.skill)

    if (!existing) {
      results.set(patternGroup.skill, {
        skill: patternGroup.skill,
        matchedPatterns,
        strength: patternGroup.strength,
        confidence: Math.min(
          getStrengthScore(patternGroup.strength) + matchedPatterns.length * 5,
          100,
        ),
      })

      continue
    }

    const mergedStrength = mergeStrength(existing.strength, patternGroup.strength)

    const mergedPatterns = Array.from(
      new Set([...existing.matchedPatterns, ...matchedPatterns]),
    )

    results.set(patternGroup.skill, {
      skill: patternGroup.skill,
      matchedPatterns: mergedPatterns,
      strength: mergedStrength,
      confidence: Math.min(
        getStrengthScore(mergedStrength) + mergedPatterns.length * 5,
        100,
      ),
    })
  }

  return Array.from(results.values())
}

export function getProjectCoveredSkills(resumeText: string): string[] {
  return detectProjectIntelligence(resumeText)
    .filter((result) => result.confidence >= 60)
    .map((result) => result.skill)
}
