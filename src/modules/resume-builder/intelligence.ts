import type { ResumeBuilderFormData } from "./types"
import { validateResumeData } from "./validation"

export type ResumeStrength =
  | "Weak"
  | "Developing"
  | "Strong"
  | "Excellent"

export type ResumeCompletionSection = {
  label: string
  completed: boolean
}

export type ResumeCompletionAnalysis = {
  completionPercentage: number
  strength: ResumeStrength
  completedSections: number
  totalSections: number
  sections: ResumeCompletionSection[]
  validationErrors: number
  validationWarnings: number
}

export function analyzeResumeCompletion(
  data: ResumeBuilderFormData
): ResumeCompletionAnalysis {
  const validation = validateResumeData(data)

  const sections: ResumeCompletionSection[] = [
    {
      label: "Contact Information",
      completed:
        Boolean(data.contact.fullName.trim()) &&
        Boolean(data.contact.email.trim()),
    },
    {
      label: "Professional Summary",
      completed: Boolean(data.summary.trim()),
    },
    {
      label: "Work Experience",
      completed:
        data.experience.length > 0 &&
        data.experience.some(
          (item) =>
            item.role.trim() &&
            item.company.trim() &&
            item.bullets.some((bullet) => bullet.trim())
        ),
    },
    {
      label: "Education",
      completed:
        data.education.length > 0 &&
        data.education.some(
          (item) => item.school.trim() && item.degree.trim()
        ),
    },
    {
      label: "Skills",
      completed: data.skills.length > 0,
    },
    {
      label: "Certifications",
      completed: data.certifications.length > 0,
    },
  ]

  const completedSections = sections.filter(
    (section) => section.completed
  ).length

  const totalSections = sections.length

  const completionPercentage = Math.round(
    (completedSections / totalSections) * 100
  )

  let strength: ResumeStrength = "Weak"

  if (completionPercentage >= 90) {
    strength = "Excellent"
  } else if (completionPercentage >= 70) {
    strength = "Strong"
  } else if (completionPercentage >= 40) {
    strength = "Developing"
  }

  return {
    completionPercentage,
    strength,
    completedSections,
    totalSections,
    sections,
    validationErrors: validation.issues.filter(
      (issue) => issue.severity === "error"
    ).length,
    validationWarnings: validation.issues.filter(
      (issue) => issue.severity === "warning"
    ).length,
  }
}