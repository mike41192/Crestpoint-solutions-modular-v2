"use client"

import { useState } from "react"
import { ResumeEditorPreview } from "@/components/resume/ResumeEditorPreview"
import { ContactSection } from "@/components/resume/form-sections/ContactSection"
import { EducationSection } from "@/components/resume/form-sections/EducationSection"
import { ExperienceSection } from "@/components/resume/form-sections/ExperienceSection"
import { SkillsCertificationsSection } from "@/components/resume/form-sections/SkillsCertificationsSection"
import { SummarySection } from "@/components/resume/form-sections/SummarySection"
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

  function updateContactField(
    field: keyof ResumeBuilderFormData["contact"],
    value: string
  ) {
    setFormData((current) => ({
      ...current,
      contact: { ...current.contact, [field]: value },
    }))
  }

  function updateSummary(value: string) {
    setFormData((current) => ({ ...current, summary: value }))
  }

  function updateListField(
    field: "skills" | "certifications",
    value: string
  ) {
    setFormData((current) => ({
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
    setFormData((current) => ({
      ...current,
      experience: current.experience.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      ),
    }))
  }

  function updateExperienceBullet(id: string, index: number, value: string) {
    setFormData((current) => ({
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
    setFormData((current) => ({
      ...current,
      experience: current.experience.map((item) =>
        item.id === id ? { ...item, bullets: [...item.bullets, ""] } : item
      ),
    }))
  }

  function removeExperienceBullet(id: string, index: number) {
    setFormData((current) => ({
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
    setFormData((current) => ({
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
    setFormData((current) => ({
      ...current,
      experience: current.experience.filter((item) => item.id !== id),
    }))
  }

  function updateEducationField(
    id: string,
    field: keyof Omit<ResumeEducationItem, "id">,
    value: string
  ) {
    setFormData((current) => ({
      ...current,
      education: current.education.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      ),
    }))
  }

  function addEducationItem() {
    setFormData((current) => ({
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
    setFormData((current) => ({
      ...current,
      education: current.education.filter((item) => item.id !== id),
    }))
  }

  return (
    <div style={{ display: "grid", gap: "24px" }}>
      <form style={{ display: "grid", gap: "16px" }}>
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

        <button
          type="button"
          style={{
            border: "0",
            borderRadius: "12px",
            padding: "12px 16px",
            background: "#2563eb",
            color: "#ffffff",
            fontWeight: 700,
            cursor: "not-allowed",
            opacity: 0.8,
          }}
        >
          Save Draft Coming Soon
        </button>
      </form>

      <div>
        <h3 style={{ fontSize: "18px", fontWeight: 700 }}>Live Preview</h3>

        <div style={{ marginTop: "12px" }}>
          <ResumeEditorPreview data={formData} />
        </div>
      </div>
    </div>
  )
}