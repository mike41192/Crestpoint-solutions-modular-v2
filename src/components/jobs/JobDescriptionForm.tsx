"use client"

// =====================================================
// BLOCK: Imports
// Crestpoint Solutions V2
// Version: 1.8.2
// =====================================================

import { useEffect, useState } from "react"
import { Save, X } from "lucide-react"
import type {
  CreateJobDescriptionInput,
  JobDescriptionRecord,
} from "@/modules/job-description-library"

// =====================================================
// BLOCK: Component Types
// =====================================================

type JobDescriptionFormProps = {
  initialJobDescription?: JobDescriptionRecord | null
  saving?: boolean
  onCancel: () => void
  onSubmit: (payload: CreateJobDescriptionInput) => void
}

// =====================================================
// BLOCK: Empty Form State
// =====================================================

function createEmptyFormState(): CreateJobDescriptionInput {
  return {
    title: "",
    company: "",
    role: "",
    location: "",
    description: "",
    sourceUrl: "",
    status: "active",
  }
}

// =====================================================
// BLOCK: Job Description Form Component
// =====================================================

export function JobDescriptionForm({
  initialJobDescription,
  saving = false,
  onCancel,
  onSubmit,
}: JobDescriptionFormProps) {
  const [formData, setFormData] = useState<CreateJobDescriptionInput>(
    createEmptyFormState(),
  )

  useEffect(() => {
    if (!initialJobDescription) {
      setFormData(createEmptyFormState())
      return
    }

    setFormData({
      title: initialJobDescription.title,
      company: initialJobDescription.company,
      role: initialJobDescription.role,
      location: initialJobDescription.location,
      description: initialJobDescription.description,
      sourceUrl: initialJobDescription.sourceUrl,
      status: initialJobDescription.status,
    })
  }, [initialJobDescription])

  function updateField(
    field: keyof CreateJobDescriptionInput,
    value: string,
  ) {
    setFormData((current) => ({
      ...current,
      [field]: value,
    }))
  }

  function handleSubmit() {
    if (!formData.description.trim()) return

    onSubmit({
      ...formData,
      title: formData.title.trim() || "Untitled Job Description",
      company: formData.company?.trim() || "",
      role: formData.role?.trim() || "",
      location: formData.location?.trim() || "",
      sourceUrl: formData.sourceUrl?.trim() || "",
      description: formData.description.trim(),
      status: formData.status || "active",
    })
  }

  return (
    <section className="grid gap-4 rounded-3xl border border-blue-200 bg-blue-50 p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-xl font-black text-slate-950">
            {initialJobDescription ? "Edit Job Description" : "Save Job Description"}
          </h3>

          <p className="mt-1 text-sm leading-6 text-slate-600">
            Store reusable job descriptions for ATS scoring, resume tailoring,
            and future job-tracker workflows.
          </p>
        </div>

        <button
          type="button"
          onClick={onCancel}
          className="rounded-2xl border border-slate-200 bg-white p-2 text-slate-500 transition hover:text-slate-950"
        >
          <X size={18} />
        </button>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <label className="grid gap-2 text-sm font-black text-slate-700">
          Title
          <input
            value={formData.title}
            onChange={(event) => updateField("title", event.target.value)}
            placeholder="Maintenance Supervisor JD"
            className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
          />
        </label>

        <label className="grid gap-2 text-sm font-black text-slate-700">
          Company
          <input
            value={formData.company}
            onChange={(event) => updateField("company", event.target.value)}
            placeholder="Company name"
            className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
          />
        </label>

        <label className="grid gap-2 text-sm font-black text-slate-700">
          Role
          <input
            value={formData.role}
            onChange={(event) => updateField("role", event.target.value)}
            placeholder="Maintenance Technician"
            className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
          />
        </label>

        <label className="grid gap-2 text-sm font-black text-slate-700">
          Location
          <input
            value={formData.location}
            onChange={(event) => updateField("location", event.target.value)}
            placeholder="Decatur, IL"
            className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
          />
        </label>
      </div>

      <label className="grid gap-2 text-sm font-black text-slate-700">
        Source URL
        <input
          value={formData.sourceUrl}
          onChange={(event) => updateField("sourceUrl", event.target.value)}
          placeholder="https://..."
          className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
        />
      </label>

      <label className="grid gap-2 text-sm font-black text-slate-700">
        Job Description
        <textarea
          value={formData.description}
          onChange={(event) => updateField("description", event.target.value)}
          placeholder="Paste full job description here..."
          className="min-h-[240px] resize-y rounded-2xl border border-slate-200 bg-white p-4 text-sm leading-6 text-slate-700 outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
        />
      </label>

      <div className="flex flex-col gap-2 sm:flex-row">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={saving || !formData.description.trim()}
          className="flex items-center justify-center gap-2 rounded-2xl bg-blue-600 px-5 py-3 text-sm font-black text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-400"
        >
          <Save size={16} />
          {saving ? "Saving..." : "Save Job Description"}
        </button>

        <button
          type="button"
          onClick={onCancel}
          className="rounded-2xl border border-slate-300 bg-white px-5 py-3 text-sm font-black text-slate-700 transition hover:border-blue-300 hover:text-blue-700"
        >
          Cancel
        </button>
      </div>
    </section>
  )
}