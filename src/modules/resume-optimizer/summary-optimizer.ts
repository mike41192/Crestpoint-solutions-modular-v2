import type {
  ResumeOptimizationInput,
  ResumeOptimizationSuggestion,
} from "./types"

export function generateSummarySuggestions(
  input: ResumeOptimizationInput
): ResumeOptimizationSuggestion[] {
  const suggestions: ResumeOptimizationSuggestion[] = []
  const summary = input.resume.summary || ""

  if (summary.trim().length < 100) {
    suggestions.push({
      id: "summary-expand",
      priority: "summary",
      title: "Expand Professional Summary",
      currentText: summary,
      suggestedText:
        "Create a 3-5 sentence summary highlighting years of experience, key strengths, measurable achievements, and target role alignment.",
      reason:
        "Short summaries often reduce ATS relevance and recruiter engagement.",
      expectedImpact: "high",
    })
  }

  if (input.atsResult.missingKeywords.length > 0) {
    suggestions.push({
      id: "summary-keywords",
      priority: "summary",
      title: "Add Missing Keywords to Summary",
      currentText: summary,
      suggestedText:
        "Naturally incorporate important job-description keywords into the summary.",
      reason:
        "ATS systems heavily evaluate keyword placement in summary sections.",
      expectedImpact: "high",
    })
  }

  return suggestions
}
