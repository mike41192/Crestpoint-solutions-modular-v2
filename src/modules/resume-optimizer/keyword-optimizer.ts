import type {
  ResumeOptimizationInput,
  ResumeOptimizationSuggestion,
} from "./types"

export function generateKeywordSuggestions(
  input: ResumeOptimizationInput
): ResumeOptimizationSuggestion[] {
  const suggestions: ResumeOptimizationSuggestion[] = []

  input.atsResult.missingKeywords.slice(0, 10).forEach((keyword, index) => {
    suggestions.push({
      id: `keyword-${index}`,
      priority: "keywords",
      title: `Add keyword: ${keyword}`,
      suggestedText: `Incorporate "${keyword}" naturally into relevant experience, skills, or summary sections.`,
      reason:
        "This keyword appears important in the job description but is missing from the resume.",
      expectedImpact: "medium",
    })
  })

  return suggestions
}
