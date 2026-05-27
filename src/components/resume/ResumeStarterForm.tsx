"use client"

import { useEffect, useMemo, useState } from "react"
import { ResumeCompletionCard } from "@/components/resume/ResumeCompletionCard"
import { ResumeEditorPreview } from "@/components/resume/ResumeEditorPreview"
import { ResumeImportPanel } from "@/components/resume/ResumeImportPanel"
import { ResumeOptimizeActions } from "@/components/resume/ResumeOptimizeActions"
import { ResumeValidationPanel } from "@/components/resume/ResumeValidationPanel"
import { ContactSection } from "@/components/resume/form-sections/ContactSection"
import { EducationSection } from "@/components/resume/form-sections/EducationSection"
import { ExperienceSection } from "@/components/resume/form-sections/ExperienceSection"
import { SkillsCertificationsSection } from "@/components/resume/form-sections/SkillsCertificationsSection"
import { SummarySection } from "@/components/resume/form-sections/SummarySection"
import {
  analyzeResumeCompletion,
  clearResumeDraftLocally,
  getFirstLoadedResumeData,
  loadResumeDraftLocally,
  loadResumeDraftsFromServer,
  saveResumeDraftLocally,
  saveResumeDraftToServer,
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

export function ResumeStarterForm({
  data,
}: ResumeStarterFormProps) {
  const [formData, setFormData] =
    useState<ResumeBuilderFormData>(data)

  const [saveMessage, setSaveMessage] =
    useState("")

  const [hasUnsavedChanges, setHasUnsavedChanges] =
    useState(false)

  const [serverMessage, setServerMessage] =
    useState("")

  const validation =
    useMemo(
      () => validateResumeData(formData),
      [formData]
    )

  const completionAnalysis =
    useMemo(
      () => analyzeResumeCompletion(formData),
      [formData]
    )

  useEffect(() => {
    try {
      const savedDraft =
        loadResumeDraftLocally()

      if (!savedDraft) {
        return
      }

      setFormData(savedDraft)

      setSaveMessage(
        "Loaded saved local draft."
      )

      setHasUnsavedChanges(false)
    } catch {
      setSaveMessage(
        "Saved local draft could not be loaded."
      )
    }
  }, [])

  function updateFormData(
    updater: (
      current: ResumeBuilderFormData
    ) => ResumeBuilderFormData
  ) {
    setFormData((current) =>
      updater(current)
    )

    setHasUnsavedChanges(true)
  }

  function saveDraft() {
    saveResumeDraftLocally(formData)

    setSaveMessage(
      "Draft saved locally in this browser."
    )

    setHasUnsavedChanges(false)
  }

  function clearDraft() {
    clearResumeDraftLocally()

    setFormData(data)

    setSaveMessage(
      "Local draft cleared."
    )

    setHasUnsavedChanges(false)
  }

  async function saveDraftToServer() {
    setServerMessage(
      "Saving draft to Supabase..."
    )

    try {
      const result =
        await saveResumeDraftToServer(
          formData
        )

      setServerMessage(
        result.message ||
          "Server save completed."
      )

      if (result.status === "success") {
        setHasUnsavedChanges(false)
      }
    } catch {
      setServerMessage(
        "Server save request failed."
      )
    }
  }

  async function loadDraftsFromServer() {
    setServerMessage(
      "Loading drafts from Supabase..."
    )

    try {
      const result =
        await loadResumeDraftsFromServer()

      const loadedResume =
        getFirstLoadedResumeData(result)

      if (loadedResume) {
        setFormData(loadedResume)

        saveResumeDraftLocally(
          loadedResume
        )

        setHasUnsavedChanges(false)

        setServerMessage(
          "Resume loaded from Supabase."
        )

        return
      }

      setServerMessage(
        result.message ||
          "No server resume found."
      )
    } catch {
      setServerMessage(
        "Server load request failed."
      )
    }
  }

  function applyOptimizationSuggestion(
    suggestion: ResumeOptimizationSuggestion
  ) {
    if (!suggestion.suggestedText) {
      setSaveMessage(
        "Suggestion reviewed. No direct text was provided."
      )

      return
    }

    if (suggestion.category === "summary") {
      updateFormData((current) => ({
        ...current,
        summary:
          suggestion.suggestedText ||
          current.summary,
      }))

      setSaveMessage(
        "AI summary suggestion applied."
      )

      return
    }

    if (suggestion.category === "skills") {
      updateFormData((current) => ({
        ...current,
        skills:
          suggestion.suggestedText
            ? suggestion.suggestedText
                .split(",")
                .map((skill) =>
                  skill.trim()
                )
                .filter(Boolean)
            : current.skills,
      }))

      setSaveMessage(
        "AI skills suggestion applied."
      )

      return
    }

    if (
      suggestion.category === "experience"
    ) {
      updateFormData((current) => {
        const firstExperience =
          current.experience[0]

        if (!firstExperience) {
          return current
        }

        return {
          ...current,
          experience:
            current.experience.map(
              (item, index) =>
                index === 0
                  ? {
                      ...item,
                      bullets: [
                        suggestion.suggestedText ||
                          "",
                        ...item.bullets.filter(
                          Boolean
                        ),
                      ],
                    }
                  : item
            ),
        }
      })

      setSaveMessage(
        "AI experience suggestion added to first role."
      )

      return
    }

    setSaveMessage(
      "Suggestion reviewed for future formatting or ATS logic."
    )
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

  function updateSummary(
    value: string
  ) {
    updateFormData((current) => ({
      ...current,
      summary: value,
    }))
  }

  function updateListField(
    field: "skills" | "certifications",
    value: string
  ) {
    updateFormData((current) => ({
      ...current,
      [field]: value
        .split(",")
        .map((item) =>
          item.trim()
        )
        .filter(Boolean),
    }))
  }

  function updateExperienceField(
    id: string,
    field: keyof Omit<
      ResumeExperienceItem,
      "id" | "bullets"
    >,
    value: string
  ) {
    updateFormData((current) => ({
      ...current,
      experience:
        current.experience.map((item) =>
          item.id === id
            ? {
                ...item,
                [field]: value,
              }
            : item
        ),
    }))
  }

  function updateExperienceBullet(
    id: string,
    index: number,
    value: string
  ) {
    updateFormData((current) => ({
      ...current,
      experience:
        current.experience.map((item) =>
          item.id === id
            ? {
                ...item,
                bullets:
                  item.bullets.map(
                    (
                      bullet,
                      bulletIndex
                    ) =>
                      bulletIndex === index
                        ? value
                        : bullet
                  ),
              }
            : item
        ),
    }))
  }

  function addExperienceBullet(
    id: string
  ) {
    updateFormData((current) => ({
      ...current,
      experience:
        current.experience.map((item) =>
          item.id === id
            ? {
                ...item,
                bullets: [
                  ...item.bullets,
                  "",
                ],
              }
            : item
        ),
    }))
  }

  function removeExperienceBullet(
    id: string,
    index: number
  ) {
    updateFormData((current) => ({
      ...current,
      experience:
        current.experience.map((item) =>
          item.id === id
            ? {
                ...item,
                bullets:
                  item.bullets.length > 1
                    ? item.bullets.filter(
                        (
                          _,
                          bulletIndex
                        ) =>
                          bulletIndex !==
                          index
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
          id: `experience-${
            current.experience.length +
            1
          }`,
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

  function removeExperienceItem(
    id: string
  ) {
    updateFormData((current) => ({
      ...current,
      experience:
        current.experience.filter(
          (item) => item.id !== id
        ),
    }))
  }

  function updateEducationField(
    id: string,
    field: keyof Omit<
      ResumeEducationItem,
      "id"
    >,
    value: string
  ) {
    updateFormData((current) => ({
      ...current,
      education:
        current.education.map((item) =>
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
          id: `education-${
            current.education.length +
            1
          }`,
          school: "",
          degree: "",
          field: "",
          graduationDate: "",
        },
      ],
    }))
  }

  function removeEducationItem(
    id: string
  ) {
    updateFormData((current) => ({
      ...current,
      education:
        current.education.filter(
          (item) => item.id !== id
        ),
    }))
  }

  return (
    <div
      style={{
        display: "grid",
        gap: "24px",
      }}
    >
      <div
        style={{
          display: "grid",
          gap: "16px",
        }}
      >
        <div
          style={{
            border:
              "1px solid #e2e8f0",
            borderRadius: "12px",
            padding: "12px",
            background:
              hasUnsavedChanges
                ? "#fffbeb"
                : "#f8fafc",
            color:
              hasUnsavedChanges
                ? "#92400e"
                : "#334155",
          }}
        >
          <strong>
            {hasUnsavedChanges
              ? "Unsaved changes"
              : "Draft saved"}
          </strong>

          <p
            style={{
              marginTop: "4px",
            }}
          >
            {hasUnsavedChanges
              ? "You have changes that are not saved locally or to Supabase yet."
              : "Your current draft state is saved or unchanged."}
          </p>
        </div>

        <ResumeCompletionCard
          analysis={
            completionAnalysis
          }
        />

        <ResumeValidationPanel
          issues={validation.issues}
        />

        <ResumeImportPanel />

        <ResumeOptimizeActions
          data={formData}
          onApplySuggestion={
            applyOptimizationSuggestion
          }
        />

        <ContactSection
          contact={formData.contact}
          onChange={
            updateContactField
          }
        />

        <SummarySection
          summary={formData.summary}
          onChange={updateSummary}
        />

        <ExperienceSection
          experience={
            formData.experience
          }
          onFieldChange={
            updateExperienceField
          }
          onBulletChange={
            updateExperienceBullet
          }
          onAddBullet={
            addExperienceBullet
          }
          onRemoveBullet={
            removeExperienceBullet
          }
          onAddExperience={
            addExperienceItem
          }
          onRemoveExperience={
            removeExperienceItem
          }
        />

        <EducationSection
          education={
            formData.education
          }
          onFieldChange={
            updateEducationField
          }
          onAddEducation={
            addEducationItem
          }
          onRemoveEducation={
            removeEducationItem
          }
        />

        <SkillsCertificationsSection
          skills={formData.skills}
          certifications={
            formData.certifications
          }
          onSkillsChange={(value) =>
            updateListField(
              "skills",
              value
            )
          }
          onCertificationsChange={(
            value
          ) =>
            updateListField(
              "certifications",
              value
            )
          }
        />

        <div
          style={{
            display: "flex",
            gap: "12px",
            flexWrap: "wrap",
          }}
        >
          <button
            type="button"
            onClick={saveDraft}
            style={{
              border: "0",
              borderRadius: "12px",
              padding:
                "12px 16px",
              background:
                "#2563eb",
              color: "#ffffff",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Save Local Draft
          </button>

          <button
            type="button"
            onClick={clearDraft}
            style={{
              border:
                "1px solid #fecaca",
              borderRadius: "12px",
              padding:
                "12px 16px",
              background:
                "#fff1f2",
              color: "#991b1b",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Clear Local Draft
          </button>

          <button
            type="button"
            onClick={
              saveDraftToServer
            }
            style={{
              border:
                "1px solid #bfdbfe",
              borderRadius: "12px",
              padding:
                "12px 16px",
              background:
                "#eff6ff",
              color: "#1d4ed8",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Save to Supabase
          </button>

          <button
            type="button"
            onClick={
              loadDraftsFromServer
            }
            style={{
              border:
                "1px solid #d9f99d",
              borderRadius: "12px",
              padding:
                "12px 16px",
              background:
                "#f7fee7",
              color: "#3f6212",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Load from Supabase
          </button>
        </div>

        {saveMessage && (
          <p
            style={{
              color: "#64748b",
              marginTop: "-4px",
            }}
          >
            {saveMessage}
          </p>
        )}

        {serverMessage && (
          <p
            style={{
              color: "#334155",
              marginTop: "-4px",
            }}
          >
            {serverMessage}
          </p>
        )}
      </div>

      <div>
        <h3
          style={{
            fontSize: "18px",
            fontWeight: 700,
          }}
        >
          Live Preview
        </h3>

        <div
          style={{
            marginTop: "12px",
          }}
        >
          <ResumeEditorPreview
            data={formData}
          />
        </div>
      </div>
    </div>
  )
}
