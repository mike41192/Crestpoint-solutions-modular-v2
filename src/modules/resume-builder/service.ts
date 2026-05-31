import type {
  ResumeBuilderData,
  ResumeBuilderFormData,
  ResumeTemplateType,
} from "./types"
import { getSelectedResumeTemplate } from "./template-store"

export const RESUME_BUILDER_LOCAL_STORAGE_KEY =
  "crestpoint_resume_builder_draft"

export const ACTIVE_RESUME_ID_STORAGE_KEY =
  "crestpoint_active_resume_id"

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

function canUseLocalStorage() {
  return typeof window !== "undefined" && Boolean(window.localStorage)
}

export function saveResumeDraftLocally(data: ResumeBuilderFormData) {
  if (!canUseLocalStorage()) {
    return
  }

  window.localStorage.setItem(
    RESUME_BUILDER_LOCAL_STORAGE_KEY,
    JSON.stringify(data)
  )
}

export function loadResumeDraftLocally() {
  if (!canUseLocalStorage()) {
    return null
  }

  const savedDraft = window.localStorage.getItem(
    RESUME_BUILDER_LOCAL_STORAGE_KEY
  )

  if (!savedDraft) {
    return null
  }

  return JSON.parse(savedDraft) as ResumeBuilderFormData
}

export function clearResumeDraftLocally() {
  if (!canUseLocalStorage()) {
    return
  }

  window.localStorage.removeItem(RESUME_BUILDER_LOCAL_STORAGE_KEY)
}

export function setActiveResumeId(resumeId: string) {
  if (!canUseLocalStorage()) {
    return
  }

  window.localStorage.setItem(ACTIVE_RESUME_ID_STORAGE_KEY, resumeId)
}

export function getActiveResumeId() {
  if (!canUseLocalStorage()) {
    return null
  }

  return window.localStorage.getItem(ACTIVE_RESUME_ID_STORAGE_KEY)
}

export function clearActiveResumeId() {
  if (!canUseLocalStorage()) {
    return
  }

  window.localStorage.removeItem(ACTIVE_RESUME_ID_STORAGE_KEY)
}

export async function saveResumeDraftToServer(
  data: ResumeBuilderFormData,
  selectedTemplate?: ResumeTemplateType,
  resumeId?: string | null
) {
  const response = await fetch("/api/resume/save", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      resumeId: resumeId || getActiveResumeId(),
      title: "Primary Resume",
      status: "draft",
      selectedTemplate: selectedTemplate || getSelectedResumeTemplate(),
      resumeData: data,
    }),
  })

  return response.json()
}

export async function loadResumeDraftsFromServer() {
  const response = await fetch("/api/resume/load")

  return response.json()
}

export async function loadResumeByIdFromServer(resumeId: string) {
  const response = await fetch("/api/resume/load-one", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      resumeId,
    }),
  })

  return response.json()
}

export function getFirstLoadedResumeData(
  serverResponse: unknown
): ResumeBuilderFormData | null {
  if (
    typeof serverResponse !== "object" ||
    serverResponse === null ||
    !("resumes" in serverResponse)
  ) {
    return null
  }

  const response = serverResponse as {
    resumes?: Array<{
      resume_data?: ResumeBuilderFormData
    }>
  }

  const firstResume = response.resumes?.[0]

  return firstResume?.resume_data || null
}

export function getFirstLoadedResumeTemplate(
  serverResponse: unknown
): ResumeTemplateType | null {
  if (
    typeof serverResponse !== "object" ||
    serverResponse === null ||
    !("resumes" in serverResponse)
  ) {
    return null
  }

  const response = serverResponse as {
    resumes?: Array<{
      selected_template?: ResumeTemplateType
    }>
  }

  const template = response.resumes?.[0]?.selected_template

  if (
    template === "classic" ||
    template === "modern" ||
    template === "executive" ||
    template === "ats"
  ) {
    return template
  }

  return null
}

export function getLoadedResumeData(serverResponse: unknown) {
  if (
    typeof serverResponse !== "object" ||
    serverResponse === null ||
    !("resume" in serverResponse)
  ) {
    return null
  }

  const response = serverResponse as {
    resume?: {
      id?: string
      resume_data?: ResumeBuilderFormData
      selected_template?: ResumeTemplateType
      title?: string
    }
  }

  return response.resume || null
}
