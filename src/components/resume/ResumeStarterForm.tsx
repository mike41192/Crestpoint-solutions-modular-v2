"use client"

// =====================================================
// BLOCK: React / Animation / Icon Imports
// =====================================================

import { useEffect, useMemo, useRef, useState } from "react"
import { motion } from "framer-motion"
import {
  Activity,
  Brain,
  FileText,
  History,
  Import,
  LayoutTemplate,
  SearchCheck,
  Sparkles,
} from "lucide-react"

// =====================================================
// BLOCK: Resume Component Imports
// =====================================================

import { ResumeActionBar } from "@/components/resume/ResumeActionBar"
import { ResumeAutosaveStatus } from "@/components/resume/autosave/ResumeAutosaveStatus"
import { ResumeCompletionCard } from "@/components/resume/ResumeCompletionCard"
import { ResumeEditorPreview } from "@/components/resume/ResumeEditorPreview"
import { ResumeImportPanel } from "@/components/resume/ResumeImportPanel"
import { ResumeJobMatchForm } from "@/components/resume/ResumeJobMatchForm"
import { ResumeOptimizeActions } from "@/components/resume/ResumeOptimizeActions"
import { ResumeRewritePanel } from "@/components/resume/ResumeRewritePanel"
import { ResumeValidationPanel } from "@/components/resume/ResumeValidationPanel"
import { ContactSection } from "@/components/resume/form-sections/ContactSection"
import { EducationSection } from "@/components/resume/form-sections/EducationSection"
import { ExperienceSection } from "@/components/resume/form-sections/ExperienceSection"
import { SkillsCertificationsSection } from "@/components/resume/form-sections/SkillsCertificationsSection"
import { SummarySection } from "@/components/resume/form-sections/SummarySection"
import { ResumeVersionHistory } from "@/components/resume/versions/ResumeVersionHistory"
import { ResumeRewriteHistoryPanel } from "@/components/resume/ResumeRewriteHistoryPanel"

// =====================================================
// BLOCK: Resume Builder Service Imports
// =====================================================

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
import {
  clearRewriteHistory,
  loadRewriteHistory,
} from "@/modules/rewrite-history"

// =====================================================
// BLOCK: Resume Builder Type Imports
// =====================================================

import type {
  ResumeBuilderFormData,
  ResumeEducationItem,
  ResumeExperienceItem,
  ResumeOptimizationSuggestion,
} from "@/modules/resume-builder"

// =====================================================
// BLOCK: Rewrite History Type Imports
// =====================================================

import type { RewriteHistoryItem } from "@/modules/rewrite-history"

// =====================================================
// BLOCK: Local Types
// =====================================================

type ResumeStarterFormProps = {
  data: ResumeBuilderFormData
}

type AutosaveStatus = "idle" | "unsaved" | "saving" | "saved" | "error"

type WorkspacePanel =
  | "editor"
  | "preview"
  | "health"
  | "versions"
  | "import"
  | "optimize"
  | "match"

// =====================================================
// BLOCK: Constants
// =====================================================

const AUTOSAVE_DELAY_MS = 30000

// =====================================================
// BLOCK: Main Resume Starter Form Component
// =====================================================

export function ResumeStarterForm({ data }: ResumeStarterFormProps) {
  // =====================================================
  // BLOCK: Main Resume State
  // =====================================================

  const [formData, setFormData] = useState<ResumeBuilderFormData>(data)
  const [resumeTitle, setResumeTitle] = useState("Primary Resume")
  const [activeResumeId, setActiveResumeIdState] = useState<string | null>(null)
  const [saveMessage, setSaveMessage] = useState("")
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [serverMessage, setServerMessage] = useState("")
  const [autosaveStatus, setAutosaveStatus] = useState<AutosaveStatus>("idle")
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null)
  const [activePanel, setActivePanel] = useState<WorkspacePanel>("editor")
  const [autosaveMessage, setAutosaveMessage] = useState(
    "Autosave will run after 30 seconds of inactivity."
  )
  const [rewriteHistoryItems, setRewriteHistoryItems] = useState<
  RewriteHistoryItem[]
>([])


  // =====================================================
  // BLOCK: Refs For Autosave / Async Safety
  // =====================================================

  const activeResumeIdRef = useRef<string | null>(null)
  const formDataRef = useRef<ResumeBuilderFormData>(data)
  const autosaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const initialLoadCompleteRef = useRef(false)

  // =====================================================
  // BLOCK: Derived Resume Analysis
  // =====================================================

  const validation = useMemo(() => validateResumeData(formData), [formData])

  const completionAnalysis = useMemo(
    () => analyzeResumeCompletion(formData),
    [formData]
  )

  // =====================================================
  // BLOCK: Keep Refs Synced With State
  // =====================================================

  useEffect(() => {
    formDataRef.current = formData
  }, [formData])

  useEffect(() => {
    activeResumeIdRef.current = activeResumeId
  }, [activeResumeId])

// =====================================================
// BLOCK: Rewrite History Initial Load
// Loads rewrite history from local browser storage.
// =====================================================

useEffect(() => {
  setRewriteHistoryItems(loadRewriteHistory().items)
}, [])


  // =====================================================
  // BLOCK: Initial Resume Load
  // Loads selected resume from URL first, then local draft fallback.
  // =====================================================

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

          setServerMessage(result.message || "Selected resume could not be loaded.")
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
        setAutosaveMessage(
          "Local draft loaded. Save to Supabase to enable cloud autosave."
        )
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

  // =====================================================
  // BLOCK: Autosave Scheduler
  // Runs after 30 seconds of inactivity if a Supabase resume exists.
  // =====================================================

  useEffect(() => {
    if (!initialLoadCompleteRef.current || !hasUnsavedChanges) return

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

  // =====================================================
  // BLOCK: Autosave Handler
  // =====================================================

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

  // =====================================================
  // BLOCK: Central Resume Update Helper
  // All resume changes should pass through this to trigger autosave state.
  // =====================================================

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

  // =====================================================
  // BLOCK: Local Draft Actions
  // =====================================================

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

  // =====================================================
  // BLOCK: Supabase Save / Load Actions
  // =====================================================

  async function saveDraftToServer() {
    setServerMessage("Saving draft to Supabase...")
    setAutosaveStatus("saving")
    setAutosaveMessage("Saving resume to Supabase...")

    try {
      saveResumeDraftLocally(formData)

      const result = await saveResumeDraftToServer(formData, undefined, activeResumeId)

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

  // =====================================================
// BLOCK: Import / Optimization / Rewrite Apply Actions
// =====================================================

function applyImportedResume(importedData: ResumeBuilderFormData) {
  setFormData(importedData)
  formDataRef.current = importedData
  saveResumeDraftLocally(importedData)
  setHasUnsavedChanges(true)
  setAutosaveStatus("unsaved")
  setAutosaveMessage("Imported resume data has unsaved changes.")
  setSaveMessage("Imported resume data applied.")
}

function applyOptimizationSuggestion(suggestion: ResumeOptimizationSuggestion) {
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

// =====================================================
// BLOCK: Rewrite History Actions
// =====================================================

function refreshRewriteHistory() {
  setRewriteHistoryItems(loadRewriteHistory().items)
}

function restoreRewriteHistoryResume(restoredResume: ResumeBuilderFormData) {
  updateFormData(() => restoredResume)
  setSaveMessage("Rewrite history restored.")
}

function clearStoredRewriteHistory() {
  clearRewriteHistory()
  setRewriteHistoryItems([])
  setSaveMessage("Rewrite history cleared.")
}


  // =====================================================
  // BLOCK: Contact / Summary / Skills Update Handlers
  // =====================================================

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

  // =====================================================
  // BLOCK: Experience Update Handlers
  // =====================================================

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
                  ? item.bullets.filter((_, bulletIndex) => bulletIndex !== index)
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

  // =====================================================
  // BLOCK: Education Update Handlers
  // =====================================================

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

  // =====================================================
  // BLOCK: Workspace Panel Config
  // =====================================================

  const panels = [
    { id: "editor", label: "Editor", icon: FileText },
    { id: "preview", label: "Preview", icon: LayoutTemplate },
    { id: "health", label: "Health", icon: Activity },
    { id: "versions", label: "Versions", icon: History },
    { id: "import", label: "Import", icon: Import },
    { id: "optimize", label: "AI Tools", icon: Brain },
    { id: "match", label: "Job Match", icon: SearchCheck },
  ] as const

  // =====================================================
  // BLOCK: Main Render
  // =====================================================

  return (
    <div className="grid gap-5">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
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
      </motion.div>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_430px]">
        <main className="min-w-0 space-y-5">
          {/* =====================================================
              BLOCK: Workspace Navigation Tabs
              ===================================================== */}

          <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
            <div className="grid min-w-max grid-cols-7 gap-3 xl:min-w-0">
              {panels.map((panel) => {
                const Icon = panel.icon
                const active = activePanel === panel.id

                return (
                  <motion.button
                    key={panel.id}
                    type="button"
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setActivePanel(panel.id)}
                    className={`flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-extrabold transition ${
                      active
                        ? "border-blue-600 bg-blue-50 text-blue-700"
                        : "border-slate-200 bg-slate-50 text-slate-600 hover:bg-white"
                    }`}
                  >
                    <Icon size={16} />
                    {panel.label}
                  </motion.button>
                )
              })}
            </div>
          </div>

          {/* =====================================================
              BLOCK: Save / Server Messages
              ===================================================== */}

          {(saveMessage || serverMessage) && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl border border-slate-200 bg-white p-4 text-sm shadow-sm"
            >
              {saveMessage && <p className="text-slate-500">{saveMessage}</p>}
              {serverMessage && (
                <p className="mt-1 text-slate-700">{serverMessage}</p>
              )}
            </motion.div>
          )}

          {/* =====================================================
              BLOCK: Editor Panel
              ===================================================== */}

          {activePanel === "editor" && (
            <WorkspaceCard
              icon={FileText}
              title="Resume Editor"
              description="Edit your resume in clean, organized sections."
            >
              <div className="grid gap-5">
                <ContactSection contact={formData.contact} onChange={updateContactField} />

                <SummarySection summary={formData.summary} onChange={updateSummary} />

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
            </WorkspaceCard>
          )}

          {/* =====================================================
              BLOCK: Mobile / Tablet Preview Panel
              Hidden on XL because desktop has sticky preview aside.
              ===================================================== */}

          {activePanel === "preview" && (
            <div className="xl:hidden">
              <WorkspaceCard
                icon={LayoutTemplate}
                title="Live Preview"
                description="Preview your selected template on mobile and tablet."
              >
                <ResumeEditorPreview data={formData} />
              </WorkspaceCard>
            </div>
          )}

          {/* =====================================================
              BLOCK: Resume Health Panel
              ===================================================== */}

          {activePanel === "health" && (
            <WorkspaceCard
              icon={Activity}
              title="Resume Health"
              description="Track autosave, completion, validation, and readiness."
            >
              <div className="grid gap-4">
                <ResumeAutosaveStatus
                  status={autosaveStatus}
                  lastSavedAt={lastSavedAt}
                  message={autosaveMessage}
                />

                <ResumeCompletionCard analysis={completionAnalysis} />

                <ResumeValidationPanel issues={validation.issues} />
              </div>
            </WorkspaceCard>
          )}

          {/* =====================================================
              BLOCK: Resume Versions Panel
              ===================================================== */}

          {activePanel === "versions" && (
            <WorkspaceCard
              icon={History}
              title="Resume Versions"
              description="View and restore previous saved versions."
            >
              <ResumeVersionHistory
                resumeId={activeResumeId}
                onVersionRestored={loadDraftsFromServer}
              />
            </WorkspaceCard>
          )}

          {/* =====================================================
              BLOCK: Resume Import Panel
              ===================================================== */}

          {activePanel === "import" && (
            <WorkspaceCard
              icon={Import}
              title="Import Resume"
              description="Import TXT, DOCX, PDF, and supported scan formats into the builder."
            >
              <ResumeImportPanel onApplyImportedResume={applyImportedResume} />
            </WorkspaceCard>
          )}

          {/* =====================================================
              BLOCK: AI Optimization / Rewrite Panel
              Includes existing optimizer actions and new rewrite assistant.
              ===================================================== */}

          {activePanel === "optimize" && (
            <WorkspaceCard
              icon={Sparkles}
              title="AI Optimization"
              description="Generate structured optimization suggestions and rewrite resume content."
            >
              <div className="grid gap-4">
                <ResumeOptimizeActions
                  data={formData}
                  onApplySuggestion={applyOptimizationSuggestion}
                />

                <ResumeRewritePanel
                  data={formData}
                  onResumeUpdate={(updatedResume) => {
                     updateFormData(() => updatedResume)
                      setSaveMessage("AI rewrite applied.")
                  }}
                  onHistoryUpdated={refreshRewriteHistory}
                />

                <ResumeRewriteHistoryPanel
                  items={rewriteHistoryItems}
                  onRestore={restoreRewriteHistoryResume}
                  onClear={clearStoredRewriteHistory}
                />

              </div>
            </WorkspaceCard>
          )}

          {/* =====================================================
              BLOCK: ATS Job Match / Optimization Panel
              ===================================================== */}

          {activePanel === "match" && (
            <WorkspaceCard
              icon={SearchCheck}
              title="ATS Job Match"
              description="Compare your resume against a target job description."
            >
              <ResumeJobMatchForm
                data={formData}
                onResumeUpdate={(updatedResume) => {
                  updateFormData(() => updatedResume)
                  setSaveMessage("Optimization suggestion applied.")
                }}
              />
            </WorkspaceCard>
          )}
        </main>

        {/* =====================================================
            BLOCK: Desktop Sticky Preview Aside
            ===================================================== */}

        <aside className="hidden min-w-0 xl:sticky xl:top-6 xl:block xl:h-fit">
          <WorkspaceCard
            icon={LayoutTemplate}
            title="Live Preview"
            description="Template and preview stay visible while editing."
          >
            <ResumeEditorPreview data={formData} />
          </WorkspaceCard>
        </aside>
      </div>
    </div>
  )
}

// =====================================================
// BLOCK: Reusable Workspace Card Component
// =====================================================

type WorkspaceCardProps = {
  icon: React.ComponentType<{ size?: number }>
  title: string
  description?: string
  children: React.ReactNode
}

function WorkspaceCard({
  icon: Icon,
  title,
  description,
  children,
}: WorkspaceCardProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5"
    >
      <div className="mb-4 flex items-start gap-3 border-b border-slate-100 pb-4">
        <div className="rounded-2xl bg-blue-50 p-2 text-blue-700">
          <Icon size={18} />
        </div>

        <div>
          <h2 className="text-lg font-black text-slate-950">{title}</h2>

          {description && (
            <p className="mt-1 text-sm leading-6 text-slate-500">
              {description}
            </p>
          )}
        </div>
      </div>

      {children}
    </motion.section>
  )
}
