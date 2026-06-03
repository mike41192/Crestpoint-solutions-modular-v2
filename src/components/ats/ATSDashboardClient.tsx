"use client"

// =====================================================
// BLOCK: React Imports
// =====================================================

import { useEffect, useState } from "react"

// =====================================================
// BLOCK: ATS Component Imports
// =====================================================

import { ResumeJobMatchForm } from "@/components/ats/ResumeJobMatchForm"

// =====================================================
// BLOCK: Resume Builder Imports
// =====================================================

import {
  getFirstLoadedResumeData,
  loadResumeDraftLocally,
  loadResumeDraftsFromServer,
} from "@/modules/resume-builder"

// =====================================================
// BLOCK: Type Imports
// =====================================================

import type { ResumeBuilderFormData } from "@/modules/resume-builder"

// =====================================================
// BLOCK: Empty Resume Fallback
// =====================================================

const emptyResumeData: ResumeBuilderFormData = {
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

// =====================================================
// BLOCK: ATS Dashboard Client Component
// =====================================================

export function ATSDashboardClient() {
  const [resumeData, setResumeData] =
    useState<ResumeBuilderFormData>(emptyResumeData)

  const [loadMessage, setLoadMessage] = useState("Loading resume data...")

  // =====================================================
  // BLOCK: Load Resume Builder Data
  // =====================================================

  useEffect(() => {
    async function loadResumeData() {
      const localDraft = loadResumeDraftLocally()

      if (localDraft) {
        setResumeData({
          ...emptyResumeData,
          ...localDraft,
        })

        setLoadMessage("Using your latest local Resume Builder draft.")
      }

      try {
        const serverResult = await loadResumeDraftsFromServer()
        const serverResume = getFirstLoadedResumeData(serverResult)

        if (serverResume) {
          setResumeData({
            ...emptyResumeData,
            ...serverResume,
          })

          setLoadMessage("Using your saved Resume Builder resume.")
        }
      } catch {
        if (!localDraft) {
          setLoadMessage(
            "No saved resume found yet. Create or save a resume first.",
          )
        }
      }
    }

    loadResumeData()
  }, [])

  // =====================================================
  // BLOCK: Main Render
  // =====================================================

  return (
    <div className="grid gap-4">
      <div className="rounded-2xl border border-slate-200 bg-white p-4 text-sm font-semibold text-slate-600 shadow-sm">
        {loadMessage}
      </div>

      <ResumeJobMatchForm data={resumeData} />
    </div>
  )
}