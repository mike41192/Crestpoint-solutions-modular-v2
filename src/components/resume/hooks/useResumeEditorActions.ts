// =====================================================
// BLOCK: Resume Builder Type Imports
// =====================================================

import type {
  ResumeBuilderFormData,
  ResumeEducationItem,
  ResumeExperienceItem,
} from "@/modules/resume-builder"

// =====================================================
// BLOCK: Hook Types
// =====================================================

type UpdateFormDataFunction = (
  updater: (current: ResumeBuilderFormData) => ResumeBuilderFormData,
) => void

type UseResumeEditorActionsProps = {
  updateFormData: UpdateFormDataFunction
}

// =====================================================
// BLOCK: Resume Editor Actions Hook
// =====================================================

export function useResumeEditorActions({
  updateFormData,
}: UseResumeEditorActionsProps) {
  // =====================================================
  // BLOCK: Contact / Summary / List Updates
  // =====================================================

  function updateContactField(
    field: keyof ResumeBuilderFormData["contact"],
    value: string,
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
  // BLOCK: Experience Updates
  // =====================================================

  function updateExperienceField(
    id: string,
    field: keyof Omit<ResumeExperienceItem, "id" | "bullets">,
    value: string,
  ) {
    updateFormData((current) => ({
      ...current,
      experience: current.experience.map((item) =>
        item.id === id ? { ...item, [field]: value } : item,
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
                bulletIndex === index ? value : bullet,
              ),
            }
          : item,
      ),
    }))
  }

  function addExperienceBullet(id: string) {
    updateFormData((current) => ({
      ...current,
      experience: current.experience.map((item) =>
        item.id === id ? { ...item, bullets: [...item.bullets, ""] } : item,
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
          : item,
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
  // BLOCK: Education Updates
  // =====================================================

  function updateEducationField(
    id: string,
    field: keyof Omit<ResumeEducationItem, "id">,
    value: string,
  ) {
    updateFormData((current) => ({
      ...current,
      education: current.education.map((item) =>
        item.id === id ? { ...item, [field]: value } : item,
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
  // BLOCK: Public Hook API
  // =====================================================

  return {
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
  }
}