import type { ResumeBuilderData, ResumeBuilderFormData } from "./types"

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
  experience: [],
  education: [],
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