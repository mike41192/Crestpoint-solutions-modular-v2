"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { ResumeActionBar } from "@/components/resume/ResumeActionBar"
import { ResumeAutosaveStatus } from "@/components/resume/autosave/ResumeAutosaveStatus"
import { ResumeCompletionCard } from "@/components/resume/ResumeCompletionCard"
import { ResumeEditorPreview } from "@/components/resume/ResumeEditorPreview"
import { ResumeImportPanel } from "@/components/resume/ResumeImportPanel"
import { ResumeJobMatchForm } from "@/components/resume/ResumeJobMatchForm"
import { ResumeOptimizeActions } from "@/components/resume/ResumeOptimizeActions"
import { ResumeToolPanel } from "@/components/resume/ResumeToolPanel"
import { ResumeValidationPanel } from "@/components/resume/ResumeValidationPanel"
import { ResumeWorkspaceShell } from "@/components/resume/ResumeWorkspaceShell"
import { ContactSection } from "@/components/resume/form-sections/ContactSection"
import { EducationSection } from "@/components/resume/form-sections/EducationSection"
import { ExperienceSection } from "@/components/resume/form-sections/ExperienceSection"
import { SkillsCertificationsSection } from "@/components/resume/form-sections/SkillsCertificationsSection"
import { SummarySection } from "@/components/resume/form-sections/SummarySection"
import { ResumeVersionHistory } from "@/components/resume/versions/ResumeVersionHistory"
import {
  analyzeResumeCompletion,
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
  validateResumeData,
} from "@/modules/resume-builder"
import type {
  ResumeBuilderFormData,
  ResumeEducationItem,
  ResumeExperienceItem,
  ResumeOptimizationSuggestion,
} from "@/modules/resume-builder"

type ResumeStarterFormProps = {
  data: ResumeBuilderFormData
}

type AutosaveStatus = "idle" | "unsaved" | "saving" | "saved" | "error"

const AUTOSAVE_DELAY_MS = 30000

export function ResumeStarterForm({ data }: ResumeStarterFormProps) {
  const [formData, setFormData] = useState<ResumeBuilderFormData>(data)
  const [resumeTitle, setResumeTitle] = useState("Primary Resume")
  const [activeResumeId, setActiveResumeIdState] = useState<string | null>(null)
  const [saveMessage, setSaveMessage] = useState("")
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [serverMessage, setServerMessage] = useState("")
  const [autosaveStatus, setAutosaveStatus] = useState<AutosaveStatus>("idle")
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null)
  const [autosaveMessage, setAutosaveMessage] = useState(
    "Autosave will run after 30 seconds of inactivity."
  )

  const activeResumeIdRef = useRef<string | null>(null)
  const formDataRef = useRef<ResumeBuilderFormData>(data)
  const autosaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const initialLoadCompleteRef = useRef(false)

  const validation = useMemo(() => validateResumeData(formData), [formData])

  const completionAnalysis = useMemo(
    () => analyzeResumeCompletion(formData),
    [formData]
  )

  useEffect(() => {
    formDataRef.current = formData
  }, [formData])

  useEffect(() => {
    activeResumeIdRef.current = activeResumeId
  }, [activeResumeId])

  useEffect(() => {
    async function loadInitialResume() {
      try {
        const params = new URLSearchParams(window.location.search)
        const resumeId = params.get("resumeId")

        if (resumeId) {
          setServerMessage("Loading selected resume...")

          const result = await loadResumeByIdFromServer(resumeId)
          const loadedResume = getLoadedResumeData(result)

          if (loadedResume?.id && loadedResume.resume_data) {
            setFormData(loadedResume.resume_data)
            formDataRef.current = loadedResume.resume_data
            saveResumeDraftLocally(loadedResume.resume_data)
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

          setServerMessage(
            result.message || "Selected resume could not be loaded."
          )
        }

        const savedDraft = loadResumeDraftLocally()

        if (!savedDraft) {
          initialLoadCompleteRef.current = true
          return
        }

        setFormData(savedDraft)
        formDataRef.current = savedDraft
        setSaveMessage("Loaded saved local draft.")
        setHasUnsavedChanges(false)
        setAutosaveStatus("idle")
        setAutosaveMessage("Local draft loaded. Save to Supabase to enable cloud autosave.")
        initialLoadCompleteRef.current = true
      } catch {
        setSaveMessage("Saved local draft could not be loaded.")
        initialLoadCompleteRef.current = true
      }
    }

    loadInitialResume()

    return () => {
      if (autosaveTimerRef.current) {
        clearTimeout(autosaveTimerRef.current)
      }
    }
  }, [])

  useEffect(() => {
    if (!initialLoadCompleteRef.current) {
      return
    }

    if (!hasUnsavedChanges) {
      return
    }

    if (!activeResumeId) {
      setAutosaveStatus("unsaved")
      setAutosaveMessage("Save this resume to Supabase once to enable autosave.")
      return
    }

    setAutosaveStatus("unsaved")
    setAutosaveMessage("Autosave scheduled after 30 seconds of inactivity.")

    if (autosaveTimerRef.current) {
      clearTimeout(autosaveTimerRef.current)
    }

    autosaveTimerRef.current = setTimeout(() => {
      autosaveDraft()
    }, AUTOSAVE_DELAY_MS)

    return () => {
      if (autosaveTimerRef.current) {
        clearTimeout(autosaveTimerRef.current)
      }
    }
  }, [formData, hasUnsavedChanges, activeResumeId])

  async function autosaveDraft() {
    if (!activeResumeIdRef.current) {
      setAutosaveStatus("unsaved")
      setAutosaveMessage("Save this resume manually once before autosave can run.")
      return
    }

    setAutosaveStatus("saving")
    setAutosaveMessage("Autosaving resume to Supabase...")

    try {
      saveResumeDraftLocally(formDataRef.current)

      const result = await saveResumeDraftToServer(
        formDataRef.current,
        undefined,
        activeResumeIdRef.current
      )

      if (result.status === "success") {
        if (result.resume?.id) {
          setActiveResumeId(result.resume.id)
          setActiveResumeIdState(result.resume.id)
          activeResumeIdRef.current = result.resume.id

          if (result.resume.title) {
            setResumeTitle(result.resume.title)
          }
        }

        setHasUnsavedChanges(false)
        setAutosaveStatus("saved")
        setLastSavedAt(new Date())
        setAutosaveMessage("Autosaved to Supabase.")
        return
      }

      setAutosaveStatus("error")
      setAutosaveMessage(result.message || "Autosave failed.")
    } catch {
      setAutosaveStatus("error")
      setAutosaveMessage("Autosave request failed.")
    }
  }

  function updateFormData(
    updater: (current: ResumeBuilderFormData) => ResumeBuilderFormData
  ) {
    setFormData((current) => {
      const updated = updater(current)
      formDataRef.current = updated
      return updated
    })

    setHasUnsavedChanges(true)
    setAutosaveStatus("unsaved")
    setAutosaveMessage("Unsaved changes detected.")
  }

  function saveDraft() {
    saveResumeDraftLocally(formData)
    setSaveMessage("Draft saved locally in this browser.")
    setAutosaveMessage("Draft saved locally. Supabase autosave still requires cloud save.")
    setHasUnsavedChanges(false)
  }

  function clearDraft() {
    clearResumeDraftLocally()
    setFormData(data)
    formDataRef.current = data
    setSaveMessage("Local draft cleared.")
    setAutosaveStatus("idle")
    setAutosaveMessage("Local draft cleared.")
    setHasUnsavedChanges(false)
  }

  async function saveDraftToServer() {
    setServerMessage("Saving draft to Supabase...")
    setAutosaveStatus("saving")
    setAutosaveMessage("Saving resume to Supabase...")

    try {
      saveResumeDraftLocally(formData)

      const result = await saveResumeDraftToServer(
        formData,
        undefined,
        activeResumeId
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
        setFormData(loadedResume)
        formDataRef.current = loadedResume
        saveResumeDraftLocally(loadedResume)
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

  function applyImportedResume(importedData: ResumeBuilderFormData) {
    setFormData(importedData)
    formDataRef.current = importedData
    saveResumeDraftLocally(importedData)
    setHasUnsavedChanges(true)
    setAutosaveStatus("unsaved")
    setAutosaveMessage("Imported resume data has unsaved changes.")
    setSaveMessage("Imported resume data applied.")
  }

  function applyOptimizationSuggestion(
    suggestion: ResumeOptimizationSuggestion
  ) {
    if (!suggestion.suggestedText) {
      setSaveMessage("Suggestion reviewed. No direct text was provided.")
      return
    }

    if (suggestion.category === "summary") {
      updateFormData((current) => ({
        ...current,
        summary: suggestion.suggestedText || current.summary,
      }))

      setSaveMessage("AI summary suggestion applied.")
      return
    }

    if (suggestion.category === "skills") {
      updateFormData((current) => ({
        ...current,
        skills: suggestion.suggestedText
          ? suggestion.suggestedText
              .split(",")
              .map((skill) => skill.trim())
              .filter(Boolean)
          : current.skills,
      }))

      setSaveMessage("AI skills suggestion applied.")
      return
    }

    if (suggestion.category === "experience") {
      updateFormData((current) => {
        const firstExperience = current.experience[0]

        if (!firstExperience) {
          return current
        }

        return {
          ...current,
          experience: current.experience.map((item, index) =>
            index === 0
              ? {
                  ...item,
                  bullets: [
                    suggestion.suggestedText || "",
                    ...item.bullets.filter(Boolean),
                  ],
                }
              : item
          ),
        }
      })

      setSaveMessage("AI experience suggestion added to first role.")
      return
    }

    setSaveMessage("Suggestion reviewed for future formatting or ATS logic.")
  }

  function updateContactField(
    field: keyof ResumeBuilderFormData["contact"],
    value: string
  ) {
    updateFormData((current) => ({
      ...current,
      contact: {
        ...current.contact,
        [field]: value,
      },
    }))
  }

  function updateSummary(value: string) {
    updateFormData((current) => ({
      ...current,
      summary: value,
    }))
  }

  function updateListField(field: "skills" | "certifications", value: string) {
    updateFormData((current) => ({
      ...current,
      [field]: value
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
    }))
  }

  function updateExperienceField(
    id: string,
    field: keyof Omit<ResumeExperienceItem, "id" | "bullets">,
    value: string
  ) {
    updateFormData((current) => ({
      ...current,
      experience: current.experience.map((item) =>
        item.id === id
          ? {
              ...item,
              [field]: value,
            }
          : item
      ),
    }))
  }

  function updateExperienceBullet(id: string, index: number, value: string) {
    updateFormData((current) => ({
      ...current,
      experience: current.experience.map((item) =>
        item.id === id
          ? {
              ...item,
              bullets: item.bullets.map((bullet, bulletIndex) =>
                bulletIndex === index ? value : bullet
              ),
            }
          : item
      ),
    }))
  }

  function addExperienceBullet(id: string) {
    updateFormData((current) => ({
      ...current,
      experience: current.experience.map((item) =>
        item.id === id
          ? {
              ...item,
              bullets: [...item.bullets, ""],
            }
          : item
      ),
    }))
  }

  function removeExperienceBullet(id: string, index: number) {
    updateFormData((current) => ({
      ...current,
      experience: current.experience.map((item) =>
        item.id === id
          ? {
              ...item,
              bullets:
                item.bullets.length > 1
                  ? item.bullets.filter(
                      (_, bulletIndex) => bulletIndex !== index
                    )
                  : [""],
            }
          : item
      ),
    }))
  }

  function addExperienceItem() {
    updateFormData((current) => ({
      ...current,
      experience: [
        ...current.experience,
        {
          id: `experience-${current.experience.length + 1}`,
          company: "",
          role: "",
          location: "",
          startDate: "",
          endDate: "",
          bullets: [""],
        },
      ],
    }))
  }

  function removeExperienceItem(id: string) {
    updateFormData((current) => ({
      ...current,
      experience: current.experience.filter((item) => item.id !== id),
    }))
  }

  function updateEducationField(
    id: string,
    field: keyof Omit<ResumeEducationItem, "id">,
    value: string
  ) {
    updateFormData((current) => ({
      ...current,
      education: current.education.map((item) =>
        item.id === id
          ? {
              ...item,
              [field]: value,
            }
          : item
      ),
    }))
  }

  function addEducationItem() {
    updateFormData((current) => ({
      ...current,
      education: [
        ...current.education,
        {
          id: `education-${current.education.length + 1}`,
          school: "",
          degree: "",
          field: "",
          graduationDate: "",
        },
      ],
    }))
  }

  function removeEducationItem(id: string) {
    updateFormData((current) => ({
      ...current,
      education: current.education.filter((item) => item.id !== id),
    }))
  }

  return (
    <ResumeWorkspaceShell
      header={
        <ResumeActionBar
          title={resumeTitle}
          status={hasUnsavedChanges ? "Editing" : "Draft"}
          hasUnsavedChanges={hasUnsavedChanges}
          onSaveLocal={saveDraft}
          onClearLocal={clearDraft}
          onSaveServer={saveDraftToServer}
          onLoadServer={loadDraftsFromServer}
          onExport={() => {
            window.location.href = "/dashboard/resume/export"
          }}
        />
      }
      editor={
        <>
          <ResumeToolPanel
            title="Autosave"
            description="Your resume saves automatically after 30 seconds of inactivity once it has a Supabase record."
          >
            <ResumeAutosaveStatus
              status={autosaveStatus}
              lastSavedAt={lastSavedAt}
              message={autosaveMessage}
            />
          </ResumeToolPanel>

          {(saveMessage || serverMessage) && (
            <ResumeToolPanel title="System Messages">
              <div style={{ display: "grid", gap: "8px" }}>
                {saveMessage && (
                  <p style={{ color: "#64748b" }}>{saveMessage}</p>
                )}

                {serverMessage && (
                  <p style={{ color: "#334155" }}>{serverMessage}</p>
                )}
              </div>
            </ResumeToolPanel>
          )}

          <ResumeToolPanel
            title="Resume Health"
            description="Track completion, validation, and readiness before exporting."
          >
            <div style={{ display: "grid", gap: "14px" }}>
              <ResumeCompletionCard analysis={completionAnalysis} />
              <ResumeValidationPanel issues={validation.issues} />
            </div>
          </ResumeToolPanel>

          <ResumeToolPanel
            title="Resume Versions"
            description="View and restore previous saved versions of this resume."
          >
            <ResumeVersionHistory
              resumeId={activeResumeId}
              onVersionRestored={loadDraftsFromServer}
            />
          </ResumeToolPanel>

          <ResumeToolPanel
            title="Import Resume"
            description="Import TXT or DOCX resumes into the builder. PDFs safely fall back when text extraction is unsupported."
          >
            <ResumeImportPanel onApplyImportedResume={applyImportedResume} />
          </ResumeToolPanel>

          <ResumeToolPanel
            title="AI Optimization"
            description="Generate structured optimization suggestions and apply them to your resume."
          >
            <ResumeOptimizeActions
              data={formData}
              onApplySuggestion={applyOptimizationSuggestion}
            />
          </ResumeToolPanel>

          <ResumeToolPanel
            title="ATS Job Match"
            description="Paste a job description and compare your resume against target keywords."
          >
            <ResumeJobMatchForm data={formData} />
          </ResumeToolPanel>

          <ResumeToolPanel
            title="Resume Editor"
            description="Edit your resume in clean, organized sections."
          >
            <div style={{ display: "grid", gap: "20px" }}>
              <ContactSection
                contact={formData.contact}
                onChange={updateContactField}
              />

              <SummarySection
                summary={formData.summary}
                onChange={updateSummary}
              />

              <ExperienceSection
                experience={formData.experience}
                onFieldChange={updateExperienceField}
                onBulletChange={updateExperienceBullet}
                onAddBullet={addExperienceBullet}
                onRemoveBullet={removeExperienceBullet}
                onAddExperience={addExperienceItem}
                onRemoveExperience={removeExperienceItem}
              />

              <EducationSection
                education={formData.education}
                onFieldChange={updateEducationField}
                onAddEducation={addEducationItem}
                onRemoveEducation={removeEducationItem}
              />

              <SkillsCertificationsSection
                skills={formData.skills}
                certifications={formData.certifications}
                onSkillsChange={(value) => updateListField("skills", value)}
                onCertificationsChange={(value) =>
                  updateListField("certifications", value)
                }
              />
            </div>
          </ResumeToolPanel>
        </>
      }
      preview={
        <div style={{ display: "grid", gap: "16px" }}>
          <ResumeToolPanel
            title="Resume Designer"
            description="Choose a professional template and preview the final resume."
          >
            <ResumeEditorPreview data={formData} />
          </ResumeToolPanel>
        </div>
      }
    />
  )
}