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
import { ResumeOptimizeActions } from "@/components/resume/ResumeOptimizeActions"
import { ResumeRewriteHistoryPanel } from "@/components/resume/ResumeRewriteHistoryPanel"
import { ResumeRewritePanel } from "@/components/resume/ResumeRewritePanel"
import { ResumeValidationPanel } from "@/components/resume/ResumeValidationPanel"
import { ContactSection } from "@/components/resume/form-sections/ContactSection"
import { EducationSection } from "@/components/resume/form-sections/EducationSection"
import { ExperienceSection } from "@/components/resume/form-sections/ExperienceSection"
import { SkillsCertificationsSection } from "@/components/resume/form-sections/SkillsCertificationsSection"
import { SummarySection } from "@/components/resume/form-sections/SummarySection"
import { useResumeEditorActions } from "@/components/resume/hooks/useResumeEditorActions"
import { useResumePersistence } from "@/components/resume/hooks/useResumePersistence"
import { ResumeVersionHistory } from "@/components/resume/versions/ResumeVersionHistory"
import { WorkspaceCard } from "@/components/resume/workspace/WorkspaceCard"
import {
  WorkspacePanelTabs,
  type WorkspacePanelId,
} from "@/components/resume/workspace/WorkspacePanelTabs"

// =====================================================
// BLOCK: Resume Builder Service Imports
// =====================================================

import {
  analyzeResumeCompletion,
  saveResumeDraftLocally,
  saveResumeDraftToServer,
  setActiveResumeId,
  validateResumeData,
} from "@/modules/resume-builder"

import {
  clearRewriteHistory,
  loadRewriteHistory,
} from "@/modules/rewrite-history"

import { analyzeResumeAchievementStrength } from "@/modules/intelligence-core/achievement-intelligence"

// =====================================================
// BLOCK: Resume Builder Type Imports
// =====================================================

import type {
  ResumeBuilderFormData,
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

type WorkspacePanel = WorkspacePanelId

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
    "Autosave will run after 30 seconds of inactivity.",
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
    [formData],
  )

  const achievementReport = useMemo(
    () => analyzeResumeAchievementStrength(formData),
    [formData],
  )

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
  ] as const

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
  // =====================================================

  useEffect(() => {
    setRewriteHistoryItems(loadRewriteHistory().items)
  }, [])

  // =====================================================
  // BLOCK: Central Resume Update Helper
  // =====================================================

  function updateFormData(
    updater: (current: ResumeBuilderFormData) => ResumeBuilderFormData,
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
  // BLOCK: Resume Persistence Hook
  // =====================================================

  const {
    loadInitialResume,
    saveDraft,
    clearDraft,
    saveDraftToServer,
    loadDraftsFromServer,
  } = useResumePersistence({
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
  })

  // =====================================================
  // BLOCK: Resume Editor Action Hook
  // =====================================================

  const {
    updateContactField,
    updateSummary,
    updateListField,
    updateExperienceField,
    updateExperienceBullet,
    addExperienceBullet,
    removeExperienceBullet,
    addExperienceItem,
    removeExperienceItem,
    updateEducationField,
    addEducationItem,
    removeEducationItem,
  } = useResumeEditorActions({
    updateFormData,
  })

  // =====================================================
  // BLOCK: Initial Resume Load
  // =====================================================

  useEffect(() => {
    loadInitialResume()

    return () => {
      if (autosaveTimerRef.current) {
        clearTimeout(autosaveTimerRef.current)
      }
    }
  }, [])

  // =====================================================
  // BLOCK: Autosave Scheduler
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
        activeResumeIdRef.current,
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
  // BLOCK: Import / Optimization / Rewrite Apply Actions
  // =====================================================

  function applyImportedResume(importedData: ResumeBuilderFormData) {
    setFormData((current) => {
      const updated = {
        ...current,
        ...importedData,
      }

      formDataRef.current = updated
      saveResumeDraftLocally(updated)
      return updated
    })

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
              : item,
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
  // BLOCK: Main Render
  // =====================================================

  return (
    <div className="grid gap-5">
      {/* =====================================================
          BLOCK: Resume Action Bar
      ===================================================== */}

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

      {/* =====================================================
          BLOCK: Resume Workspace Layout
      ===================================================== */}

      <WorkspacePanelTabs
        panels={panels}
        activePanel={activePanel}
        onPanelChange={setActivePanel}
      />

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_430px]">
        <main className="min-w-0 space-y-5">
          {/* =====================================================
              BLOCK: Save / Server Message Panel
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
            </WorkspaceCard>
          )}

          {/* =====================================================
              BLOCK: Mobile / Tablet Preview Panel
          ===================================================== */}

          {activePanel === "preview" && (
            <div className="lg:hidden">
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

                <ResumeCompletionCard
                  analysis={completionAnalysis}
                  achievementReport={achievementReport}
                />

                <ResumeValidationPanel issues={validation.issues} />
              </div>
            </WorkspaceCard>
          )}

          {/* =====================================================
              BLOCK: Versions Panel
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
              BLOCK: Import Panel
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
              BLOCK: AI Optimization Panel
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
        </main>

        {/* =====================================================
            BLOCK: Desktop Sticky Preview
        ===================================================== */}

        <aside className="hidden min-w-0 lg:sticky lg:top-6 lg:block lg:h-fit">
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
