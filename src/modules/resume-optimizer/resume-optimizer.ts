import type {
  ResumeOptimizationInput,
  ResumeOptimizationResult,
  ResumeOptimizationSuggestion,
} from "./types"
import { generateBulletSuggestions } from "./bullet-optimizer"
import { generateKeywordSuggestions } from "./keyword-optimizer"
import { estimateOptimizedScore, estimateScoreLift } from "./score-predictor"
import { generateSummarySuggestions } from "./summary-optimizer"

function dedupeSuggestions(
  suggestions: ResumeOptimizationSuggestion[]
): ResumeOptimizationSuggestion[] {
  const seen = new Set<string>()

  return suggestions.filter((suggestion) => {
    const key = `${suggestion.priority}-${suggestion.title}`

    if (seen.has(key)) {
      return false
    }

    seen.add(key)
    return true
  })
}

function sortSuggestions(
  suggestions: ResumeOptimizationSuggestion[]
): ResumeOptimizationSuggestion[] {
  const impactOrder = {
    high: 1,
    medium: 2,
    low: 3,
  }

  return [...suggestions].sort(
    (a, b) => impactOrder[a.expectedImpact] - impactOrder[b.expectedImpact]
  )
}

export function generateResumeOptimizationReport(
  input: ResumeOptimizationInput
): ResumeOptimizationResult {
  const suggestions = dedupeSuggestions(
    sortSuggestions([
      ...generateSummarySuggestions(input),
      ...generateBulletSuggestions(input),
      ...generateKeywordSuggestions(input),
    ])
  )

  return {
    suggestions,
    estimatedScoreLift: estimateScoreLift(input.atsResult),
    optimizedScoreEstimate: estimateOptimizedScore(input.atsResult),
  }
}
