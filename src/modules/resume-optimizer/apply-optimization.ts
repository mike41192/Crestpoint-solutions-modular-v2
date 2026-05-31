import type { ResumeBuilderFormData } from "@/modules/resume-builder"
import type { ResumeOptimizationSuggestion } from "./types"

function appendUniqueItems(currentItems: string[], newItems: string[]) {
  const normalized = new Set(currentItems.map((item) => item.toLowerCase()))

  return [
    ...currentItems,
    ...newItems.filter((item) => !normalized.has(item.toLowerCase())),
  ]
}

export function applyOptimizationSuggestion(
  resume: ResumeBuilderFormData,
  suggestion: ResumeOptimizationSuggestion
): ResumeBuilderFormData {
  if (suggestion.priority === "summary") {
    return {
      ...resume,
      summary: suggestion.suggestedText,
    }
  }

  if (suggestion.priority === "keywords") {
    const keyword = suggestion.title.replace("Add keyword:", "").trim()

    return {
      ...resume,
      skills: appendUniqueItems(resume.skills, [keyword]),
    }
  }

  if (suggestion.priority === "experience") {
    const firstExperience = resume.experience[0]

    if (!firstExperience) return resume

    return {
      ...resume,
      experience: resume.experience.map((item, index) =>
        index === 0
          ? {
              ...item,
              bullets: [
                ...item.bullets,
                suggestion.suggestedText,
              ],
            }
          : item
      ),
    }
  }

  return resume
}
