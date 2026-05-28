export type ResumeSection =
  | "contact"
  | "summary"
  | "experience"
  | "education"
  | "skills"
  | "certifications"

export type ResumeBuilderStatus =
  | "draft"
  | "reviewing"
  | "optimized"
  | "exported"

export type ResumeTemplateType =
  | "classic"
  | "modern"
  | "executive"

export type ResumeContactInfo = {
  fullName: string
  email: string
  phone: string
  location: string
  linkedIn?: string
  website?: string
}

export type ResumeExperienceItem = {
  id: string
  company: string
  role: string
  location?: string
  startDate: string
  endDate: string
  bullets: string[]
}

export type ResumeEducationItem = {
  id: string
  school: string
  degree: string
  field?: string
  graduationDate?: string
}

export type ResumeBuilderFormData = {
  contact: ResumeContactInfo
  summary: string
  experience: ResumeExperienceItem[]
  education: ResumeEducationItem[]
  skills: string[]
  certifications: string[]
}

export type ResumeBuilderData = {
  id: string
  title: string
  status: ResumeBuilderStatus
  updatedAt: string
  data?: ResumeBuilderFormData
}