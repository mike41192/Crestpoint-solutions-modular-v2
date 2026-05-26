export type ResumeSection =
  | "contact"
  | "summary"
  | "experience"
  | "education"
  | "skills"
  | "certifications"

export type ResumeBuilderStatus = "draft" | "reviewing" | "optimized" | "exported"

export type ResumeBuilderData = {
  id: string
  title: string
  status: ResumeBuilderStatus
  updatedAt: string
}