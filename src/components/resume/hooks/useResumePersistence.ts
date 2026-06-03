// =====================================================
// BLOCK: React Type Imports
// =====================================================

import type { Dispatch, MutableRefObject, SetStateAction } from "react"

// =====================================================
// BLOCK: Resume Builder Imports
// =====================================================

import {
  clearResumeDraftLocally,
  getFirstLoadedResumeData,
  getFirstLoadedResumeTemplate,
  getLoadedResumeData,
  loadResumeByIdFromServer,
  loadResumeDraftLocally,
  loadResumeDraftsFromServer,
  saveResumeDraftLocally,
  saveResumeDraftToServer,
  setActiveResumeId,
  setSelectedResumeTemplate,
} from "@/modules/resume-builder"

// =====================================================
// BLOCK: Resume Builder Type Imports
// =====================================================

import type { ResumeBuilderFormData } from "@/modules/resume-builder"

// =====================================================
// BLOCK: Persistence Types
// =====================================================

type AutosaveStatus = "idle" | "unsaved" | "saving" | "saved" | "error"

type PersistenceProps = {
  data: ResumeBuilderFormData
  formData: ResumeBuilderFormData
  formDataRef: MutableRefObject<ResumeBuilderFormData>
  activeResumeId: string | null
  activeResumeIdRef: MutableRefObject<string | null>
  initialLoadCompleteRef: MutableRefObject<boolean>

  setFormData: Dispatch<SetStateAction<ResumeBuilderFormData>>
  setResumeTitle: Dispatch<SetStateAction<string>>
  setActiveResumeIdState: Dispatch<SetStateAction<string | null>>
  setSaveMessage: Dispatch<SetStateAction<string>>
  setServerMessage: Dispatch<SetStateAction<string>>
  setHasUnsavedChanges: Dispatch<SetStateAction<boolean>>
  setAutosaveStatus: Dispatch<SetStateAction<AutosaveStatus>>
  setAutosaveMessage: Dispatch<SetStateAction<string>>
  setLastSavedAt: Dispatch<SetStateAction<Date | null>>
}

// =====================================================
// BLOCK: Resume Persistence Hook
// =====================================================

export function useResumePersistence({
  data,
  formData,
  formDataRef,
  activeResumeId,
  activeResumeIdRef,
  initialLoadCompleteRef,
  setFormData,
  setResumeTitle,
  setActiveResumeIdState,
  setSaveMessage,
  setServerMessage,
  setHasUnsavedChanges,
  setAutosaveStatus,
  setAutosaveMessage,
  setLastSavedAt,
}: PersistenceProps) {
  // =====================================================
  // BLOCK: Initial Resume Load
  // =====================================================

  async function loadInitialResume() {
    try {
      const params = new URLSearchParams(window.location.search)
      const resumeId = params.get("resumeId")

      if (resumeId) {
        setServerMessage("Loading selected resume...")

        const result = await loadResumeByIdFromServer(resumeId)
        const loadedResume = getLoadedResumeData(result)

        if (loadedResume?.id && loadedResume.resume_data) {
          const loadedData = loadedResume.resume_data

          setFormData((current) => ({
            ...current,
            ...loadedData,
          }))

          formDataRef.current = {
            ...formDataRef.current,
            ...loadedData,
          }

          saveResumeDraftLocally(formDataRef.current)

          setActiveResumeId(loadedResume.id)
          setActiveResumeIdState(loadedResume.id)
          activeResumeIdRef.current = loadedResume.id

          if (loadedResume.title) {
            setResumeTitle(loadedResume.title)
          }

          if (loadedResume.selected_template) {
            setSelectedResumeTemplate(loadedResume.selected_template)
          }

          setHasUnsavedChanges(false)
          setAutosaveStatus("saved")
          setLastSavedAt(new Date())
          setAutosaveMessage("Selected resume loaded.")
          setServerMessage("Selected resume loaded.")
          initialLoadCompleteRef.current = true
          return
        }

        setServerMessage(result.message || "Selected resume could not be loaded.")
      }

      const savedDraft = loadResumeDraftLocally()

      if (!savedDraft) {
        initialLoadCompleteRef.current = true
        return
      }

      setFormData((current) => ({
        ...current,
        ...savedDraft,
      }))

      formDataRef.current = {
        ...formDataRef.current,
        ...savedDraft,
      }

      setSaveMessage("Loaded saved local draft.")
      setHasUnsavedChanges(false)
      setAutosaveStatus("idle")
      setAutosaveMessage(
        "Local draft loaded. Save to Supabase to enable cloud autosave.",
      )
      initialLoadCompleteRef.current = true
    } catch {
      setSaveMessage("Saved local draft could not be loaded.")
      initialLoadCompleteRef.current = true
    }
  }

  // =====================================================
  // BLOCK: Local Draft Save
  // =====================================================

  function saveDraft() {
    saveResumeDraftLocally(formData)
    setSaveMessage("Draft saved locally in this browser.")
    setAutosaveMessage("Draft saved locally. Supabase autosave still requires cloud save.")
    setHasUnsavedChanges(false)
  }

  // =====================================================
  // BLOCK: Local Draft Clear
  // =====================================================

  function clearDraft() {
    clearResumeDraftLocally()
    setFormData(data)
    formDataRef.current = data
    setSaveMessage("Local draft cleared.")
    setAutosaveStatus("idle")
    setAutosaveMessage("Local draft cleared.")
    setHasUnsavedChanges(false)
  }

  // =====================================================
  // BLOCK: Server Draft Save
  // =====================================================

  async function saveDraftToServer() {
    setServerMessage("Saving draft to Supabase...")
    setAutosaveStatus("saving")
    setAutosaveMessage("Saving resume to Supabase...")

    try {
      saveResumeDraftLocally(formData)

      const result = await saveResumeDraftToServer(
        formData,
        undefined,
        activeResumeId,
      )

      if (result.resume?.id) {
        setActiveResumeId(result.resume.id)
        setActiveResumeIdState(result.resume.id)
        activeResumeIdRef.current = result.resume.id

        if (result.resume.title) {
          setResumeTitle(result.resume.title)
        }
      }

      setServerMessage(result.message || "Server save completed.")

      if (result.status === "success") {
        setHasUnsavedChanges(false)
        setAutosaveStatus("saved")
        setLastSavedAt(new Date())
        setAutosaveMessage("Saved to Supabase.")
      } else {
        setAutosaveStatus("error")
        setAutosaveMessage(result.message || "Server save failed.")
      }
    } catch {
      setServerMessage("Server save request failed.")
      setAutosaveStatus("error")
      setAutosaveMessage("Server save request failed.")
    }
  }

  // =====================================================
  // BLOCK: Server Draft Load
  // =====================================================

  async function loadDraftsFromServer() {
    setServerMessage("Loading drafts from Supabase...")

    try {
      const result = await loadResumeDraftsFromServer()
      const loadedResume = getFirstLoadedResumeData(result)
      const loadedTemplate = getFirstLoadedResumeTemplate(result)
      const firstResume = result?.resumes?.[0]

      if (loadedTemplate) {
        setSelectedResumeTemplate(loadedTemplate)
      }

      if (firstResume?.id) {
        setActiveResumeId(firstResume.id)
        setActiveResumeIdState(firstResume.id)
        activeResumeIdRef.current = firstResume.id
      }

      if (firstResume?.title) {
        setResumeTitle(firstResume.title)
      }

      if (loadedResume) {
        setFormData((current) => ({
          ...current,
          ...loadedResume,
        }))

        formDataRef.current = {
          ...formDataRef.current,
          ...loadedResume,
        }

        saveResumeDraftLocally(formDataRef.current)
        setHasUnsavedChanges(false)
        setAutosaveStatus("saved")
        setLastSavedAt(new Date())
        setAutosaveMessage("Resume loaded from Supabase.")
        setServerMessage("Resume loaded from Supabase.")
        return
      }

      setServerMessage(result.message || "No server resume found.")
    } catch {
      setServerMessage("Server load request failed.")
    }
  }

  // =====================================================
  // BLOCK: Public Hook API
  // =====================================================

  return {
    loadInitialResume,
    saveDraft,
    clearDraft,
    saveDraftToServer,
    loadDraftsFromServer,
  }
}
