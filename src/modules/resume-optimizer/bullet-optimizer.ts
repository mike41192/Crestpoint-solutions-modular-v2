import type {
  ResumeOptimizationInput,
  ResumeOptimizationSuggestion,
} from "./types"

export function generateBulletSuggestions(
  input: ResumeOptimizationInput
): ResumeOptimizationSuggestion[] {
  const suggestions: ResumeOptimizationSuggestion[] = []

  input.resume.experience.forEach((job, index) => {
    const quantifiedBullets = job.bullets.filter((bullet) =>
      /\d|%|\$|hours?|days?|weeks?|months?|years?|team|staff|employees?|projects?/i.test(
        bullet
      )
    )

    if (quantifiedBullets.length === 0) {
      suggestions.push({
        id: `experience-${index}`,
        priority: "experience",
        title: `Add measurable achievements to ${job.role || "experience"}`,
        suggestedText:
          "Include percentages, dollar savings, production increases, efficiency gains, reduced downtime, completed work orders, team sizes, or safety results.",
        reason:
          "Recruiters and ATS systems favor measurable accomplishments because they show impact instead of only responsibilities.",
        expectedImpact: "high",
      })
    }
  })

  return suggestions
}
