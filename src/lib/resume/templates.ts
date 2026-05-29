export type ResumeTemplateId = "classic" | "modern" | "executive"

export type ResumeTemplate = {
  id: ResumeTemplateId
  name: string
  description: string
}

export const RESUME_TEMPLATES: ResumeTemplate[] = [
  {
    id: "classic",
    name: "Classic",
    description: "Clean ATS-friendly layout for most industries.",
  },
  {
    id: "modern",
    name: "Modern",
    description: "Polished layout with stronger visual hierarchy.",
  },
  {
    id: "executive",
    name: "Executive",
    description: "Premium leadership-focused layout.",
  },
]

export function getResumeTemplate(id: string | null | undefined) {
  return RESUME_TEMPLATES.find((template) => template.id === id) ?? RESUME_TEMPLATES[0]
}
