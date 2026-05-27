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

export async function saveResumeDraftToServer(data: ResumeBuilderFormData) {
  const response = await fetch("/api/resume/save", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title: "Primary Resume",
      status: "draft",
      resumeData: data,
    }),
  })

  return response.json()
}

export async function loadResumeDraftsFromServer() {
  const response = await fetch("/api/resume/load")

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