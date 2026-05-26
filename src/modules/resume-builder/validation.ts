import type { ResumeBuilderFormData } from "./types"

export type ResumeValidationIssue = {
  field: string
  message: string
  severity: "warning" | "error"
}

export function validateResumeData(data: ResumeBuilderFormData) {
  const issues: ResumeValidationIssue[] = []

  if (!data.contact.fullName.trim()) {
    issues.push({
      field: "fullName",
      message: "Full name is required.",
      severity: "error",
    })
  }

  if (!data.contact.email.trim()) {
    issues.push({
      field: "email",
      message: "Email is required.",
      severity: "error",
    })
  }

  if (!data.summary.trim()) {
    issues.push({
      field: "summary",
      message: "Professional summary is recommended.",
      severity: "warning",
    })
  }

  if (data.experience.length === 0) {
    issues.push({
      field: "experience",
      message: "At least one work experience entry is recommended.",
      severity: "warning",
    })
  }

  if (data.skills.length === 0) {
    issues.push({
      field: "skills",
      message: "Add relevant skills to improve resume strength.",
      severity: "warning",
    })
  }

  return {
    valid: !issues.some((issue) => issue.severity === "error"),
    issues,
  }
}