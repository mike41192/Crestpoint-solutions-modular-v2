// =====================================================
// BLOCK: Type Imports
// =====================================================

import type {
  ResumeBuilderData,
  ResumeBuilderFormData,
  ResumeTemplateType,
} from "./types"
import { getSelectedResumeTemplate } from "./template-store"

// =====================================================
// BLOCK: Local Storage Keys
// =====================================================

export const RESUME_BUILDER_LOCAL_STORAGE_KEY =
  "crestpoint_resume_builder_draft"

export const ACTIVE_RESUME_ID_STORAGE_KEY = "crestpoint_active_resume_id"

// =====================================================
// BLOCK: API Response Types
// =====================================================

type SavedResumeRecord = {
  id?: string
  title?: string
  resume_data?: ResumeBuilderFormData
  selected_template?: ResumeTemplateType
}

type SaveResumeResponse = {
  status?: string
  message?: string
  resume?: SavedResumeRecord
}

type LoadResumesResponse = {
  status?: string
  message?: string
  resumes?: SavedResumeRecord[]
}

// =====================================================
// BLOCK: Starter Resume Data
// =====================================================

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

// =====================================================
// BLOCK: Preview Data
// =====================================================

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

// =====================================================
// BLOCK: Browser Storage Helpers
// =====================================================

function canUseLocalStorage() {
  return typeof window !== "undefined" && Boolean(window.localStorage)
}

export function saveResumeDraftLocally(data: ResumeBuilderFormData) {
  if (!canUseLocalStorage()) {
    return
  }

  window.localStorage.setItem(
    RESUME_BUILDER_LOCAL_STORAGE_KEY,
    JSON.stringify(data),
  )
}

export function loadResumeDraftLocally() {
  if (!canUseLocalStorage()) {
    return null
  }

  const savedDraft = window.localStorage.getItem(
    RESUME_BUILDER_LOCAL_STORAGE_KEY,
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

// =====================================================
// BLOCK: API Response Helpers
// =====================================================

async function parseApiResponse<T>(response: Response): Promise<T> {
  const responseText = await response.text()

  let parsedResponse: unknown = null

  try {
    parsedResponse = responseText ? JSON.parse(responseText) : null
  } catch {
    throw new Error(
      responseText ||
        "Resume request failed because the server returned invalid JSON.",
    )
  }

  if (!response.ok) {
    const errorMessage =
      typeof parsedResponse === "object" &&
      parsedResponse !== null &&
      "message" in parsedResponse &&
      typeof parsedResponse.message === "string"
        ? parsedResponse.message
        : "Resume request failed."

    throw new Error(errorMessage)
  }

  return parsedResponse as T
}

// =====================================================
// BLOCK: Server Save / Load Services
// =====================================================

export async function saveResumeDraftToServer(
  data: ResumeBuilderFormData,
  selectedTemplate?: ResumeTemplateType,
  resumeId?: string | null,
): Promise<SaveResumeResponse> {
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

  return parseApiResponse<SaveResumeResponse>(response)
}

export async function loadResumeDraftsFromServer(): Promise<LoadResumesResponse> {
  const response = await fetch("/api/resume/load")

  return parseApiResponse<LoadResumesResponse>(response)
}

export async function loadResumeByIdFromServer(
  resumeId: string,
): Promise<SaveResumeResponse> {
  const response = await fetch("/api/resume/load-one", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      resumeId,
    }),
  })

  return parseApiResponse<SaveResumeResponse>(response)
}

// =====================================================
// BLOCK: Loaded Resume Extraction Helpers
// =====================================================

export function getFirstLoadedResumeData(
  serverResponse: unknown,
): ResumeBuilderFormData | null {
  if (
    typeof serverResponse !== "object" ||
    serverResponse === null ||
    !("resumes" in serverResponse)
  ) {
    return null
  }

  const response = serverResponse as LoadResumesResponse

  const firstResume = response.resumes?.[0]

  return firstResume?.resume_data || null
}

export function getFirstLoadedResumeTemplate(
  serverResponse: unknown,
): ResumeTemplateType | null {
  if (
    typeof serverResponse !== "object" ||
    serverResponse === null ||
    !("resumes" in serverResponse)
  ) {
    return null
  }

  const response = serverResponse as LoadResumesResponse

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

  const response = serverResponse as SaveResumeResponse

  return response.resume || null
}
