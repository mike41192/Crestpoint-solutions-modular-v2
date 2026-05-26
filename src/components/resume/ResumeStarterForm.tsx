"use client"

import { useEffect, useMemo, useState } from "react"
import { ResumeCompletionCard } from "@/components/resume/ResumeCompletionCard"
import { ResumeEditorPreview } from "@/components/resume/ResumeEditorPreview"
import { ResumeValidationPanel } from "@/components/resume/ResumeValidationPanel"
import { ContactSection } from "@/components/resume/form-sections/ContactSection"
import { EducationSection } from "@/components/resume/form-sections/EducationSection"
import { ExperienceSection } from "@/components/resume/form-sections/ExperienceSection"
import { SkillsCertificationsSection } from "@/components/resume/form-sections/SkillsCertificationsSection"
import { SummarySection } from "@/components/resume/form-sections/SummarySection"
import {
  analyzeResumeCompletion,
  clearResumeDraftLocally,
  loadResumeDraftLocally,
  saveResumeDraftLocally,
  validateResumeData,
} from "@/modules/resume-builder"
import type {
  ResumeBuilderFormData,
  ResumeEducationItem,
  ResumeExperienceItem,
} from "@/modules/resume-builder"

type ResumeStarterFormProps = {
  data: ResumeBuilderFormData
}

export function ResumeStarterForm({ data }: ResumeStarterFormProps) {
  const [formData, setFormData] = useState<ResumeBuilderFormData>(data)
  const [saveMessage, setSaveMessage] = useState("")
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

  const validation = useMemo(() => validateResumeData(formData), [formData])

  const completionAnalysis = useMemo(
    () => analyzeResumeCompletion(formData),
    [formData]
  )

  useEffect(() => {
    try {
      const savedDraft = loadResumeDraftLocally()

      if (!savedDraft) {
        return
      }

      setFormData(savedDraft)
      setSaveMessage("Loaded saved local draft.")
      setHasUnsavedChanges(false)
    } catch {
      setSaveMessage("Saved local draft could not be loaded.")
    }
  }, [])

  function updateFormData(
    updater: (current: ResumeBuilderFormData) => ResumeBuilderFormData
  ) {
    setFormData((current) => updater(current))
    setHasUnsavedChanges(true)
  }

  function saveDraft() {
    saveResumeDraftLocally(formData)
    setSaveMessage("Draft saved locally in this browser.")
    setHasUnsavedChanges(false)
  }

  function clearDraft() {
    clearResumeDraftLocally()
    setFormData(data)
    setSaveMessage("Local draft cleared.")
    setHasUnsavedChanges(false)
  }

  function updateContactField(
    field: keyof ResumeBuilderFormData["contact"],
    value: string
  ) {
    updateFormData((current) => ({
      ...current,
      contact: { ...current.contact, [field]: value },
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
        item.id === id ? { ...item, [field]: value } : item
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
        item.id === id ? { ...item, bullets: [...item.bullets, ""] } : item
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
        item.id === id ? { ...item, [field]: value } : item
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
    <div style={{ display: "grid", gap: "24px" }}>
      <form style={{ display: "grid", gap: "16px" }}>
        <div
          style={{
            border: "1px solid #e2e8f0",
            borderRadius: "12px",
            padding: "12px",
            background: hasUnsavedChanges ? "#fffbeb" : "#f8fafc",
            color: hasUnsavedChanges ? "#92400e" : "#334155",
          }}
        >
          <strong>
            {hasUnsavedChanges ? "Unsaved changes" : "Draft saved"}
          </strong>

          <p style={{ marginTop: "4px" }}>
            {hasUnsavedChanges
              ? "You have changes that are not saved locally yet."
              : "Your current draft state is saved or unchanged."}
          </p>
        </div>

        <ResumeCompletionCard analysis={completionAnalysis} />

        <ResumeValidationPanel issues={validation.issues} />

        <ContactSection
          contact={formData.contact}
          onChange={updateContactField}
        />

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

        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
          <button
            type="button"
            onClick={saveDraft}
            style={{
              border: "0",
              borderRadius: "12px",
              padding: "12px 16px",
              background: "#2563eb",
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
              border: "1px solid #fecaca",
              borderRadius: "12px",
              padding: "12px 16px",
              background: "#fff1f2",
              color: "#991b1b",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Clear Local Draft
          </button>
        </div>

        {saveMessage && (
          <p style={{ color: "#64748b", marginTop: "-4px" }}>
            {saveMessage}
          </p>
        )}
      </form>

      <div>
        <h3 style={{ fontSize: "18px", fontWeight: 700 }}>
          Live Preview
        </h3>

        <div style={{ marginTop: "12px" }}>
          <ResumeEditorPreview data={formData} />
        </div>
      </div>
    </div>
  )
}