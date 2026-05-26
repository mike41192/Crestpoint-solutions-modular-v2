import type { ResumeBuilderData, ResumeBuilderFormData } from "./types"

export const RESUME_BUILDER_LOCAL_STORAGE_KEY =
  "crestpoint_resume_builder_draft"

export const starterResumeData: ResumeBuilderFormData = {
  contact: {
    fullName: "",
    email: "",
    phone: "",
    location: "",
    linkedIn: "",
    website: "",
  },
  summary: "",
  experience: [
    {
      id: "experience-1",
      company: "",
      role: "",
      location: "",
      startDate: "",
      endDate: "",
      bullets: [""],
    },
  ],
  education: [
    {
      id: "education-1",
      school: "",
      degree: "",
      field: "",
      graduationDate: "",
    },
  ],
  skills: [],
  certifications: [],
}

export function getResumeBuilderPreviewData(): ResumeBuilderData[] {
  return [
    {
      id: "resume-1",
      title: "Primary Resume",
      status: "draft",
      updatedAt: "Not saved yet",
      data: starterResumeData,
    },
  ]
}

export function saveResumeDraftLocally(data: ResumeBuilderFormData) {
  window.localStorage.setItem(
    RESUME_BUILDER_LOCAL_STORAGE_KEY,
    JSON.stringify(data)
  )
}

export function loadResumeDraftLocally() {
  const savedDraft = window.localStorage.getItem(
    RESUME_BUILDER_LOCAL_STORAGE_KEY
  )

  if (!savedDraft) {
    return null
  }

  return JSON.parse(savedDraft) as ResumeBuilderFormData
}

export function clearResumeDraftLocally() {
  window.localStorage.removeItem(RESUME_BUILDER_LOCAL_STORAGE_KEY)
}