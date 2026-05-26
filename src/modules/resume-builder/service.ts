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