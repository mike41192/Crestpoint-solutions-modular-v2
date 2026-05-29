import type { ResumeTemplateType } from "./types"

export const RESUME_TEMPLATE_STORAGE_KEY =
  "crestpoint_resume_selected_template"

export const defaultResumeTemplate: ResumeTemplateType = "classic"

export function isValidResumeTemplate(
  value: unknown
): value is ResumeTemplateType {
  return (
    value === "classic" ||
    value === "modern" ||
    value === "executive"
  )
}

export function getSelectedResumeTemplate(): ResumeTemplateType {
  if (typeof window === "undefined") {
    return defaultResumeTemplate
  }

  const savedTemplate = window.localStorage.getItem(
    RESUME_TEMPLATE_STORAGE_KEY
  )

  if (isValidResumeTemplate(savedTemplate)) {
    return savedTemplate
  }

  return defaultResumeTemplate
}

export function setSelectedResumeTemplate(template: ResumeTemplateType) {
  if (typeof window === "undefined") {
    return
  }

  window.localStorage.setItem(RESUME_TEMPLATE_STORAGE_KEY, template)
}

export function clearSelectedResumeTemplate() {
  if (typeof window === "undefined") {
    return
  }

  window.localStorage.removeItem(RESUME_TEMPLATE_STORAGE_KEY)
}
