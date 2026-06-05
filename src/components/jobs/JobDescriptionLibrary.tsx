"use client"

// =====================================================
// BLOCK: Imports
// Crestpoint Solutions V2
// Version: 1.8.2
// =====================================================

import { useEffect, useMemo, useState } from "react"
import { BriefcaseBusiness, Plus, Search } from "lucide-react"
import { JobDescriptionCard } from "@/components/jobs/JobDescriptionCard"
import { JobDescriptionForm } from "@/components/jobs/JobDescriptionForm"
import {
  createJobDescription,
  deleteJobDescription,
  loadJobDescriptions,
  updateJobDescription,
  type CreateJobDescriptionInput,
  type JobDescriptionRecord,
} from "@/modules/job-description-library"

// =====================================================
// BLOCK: Component Types
// =====================================================

type JobDescriptionLibraryProps = {
  onLoadToATS?: (jobDescription: JobDescriptionRecord) => void
}

// =====================================================
// BLOCK: Job Description Library Component
// =====================================================

export function JobDescriptionLibrary({
  onLoadToATS,
}: JobDescriptionLibraryProps) {
  const [jobDescriptions, setJobDescriptions] = useState<
    JobDescriptionRecord[]
  >([])

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState("")
  const [search, setSearch] = useState("")
  const [formOpen, setFormOpen] = useState(false)
  const [editingJobDescription, setEditingJobDescription] =
    useState<JobDescriptionRecord | null>(null)

  // =====================================================
  // BLOCK: Load Records
  // =====================================================

  async function loadRecords() {
    setLoading(true)
    setMessage("")

    const records = await loadJobDescriptions()

    setJobDescriptions(records)
    setLoading(false)
  }

  useEffect(() => {
    loadRecords()
  }, [])

  // =====================================================
  // BLOCK: Derived Records
  // =====================================================

  const filteredJobDescriptions = useMemo(() => {
    const searchValue = search.trim().toLowerCase()

    if (!searchValue) {
      return jobDescriptions
    }

    return jobDescriptions.filter((item) => {
      return [
        item.title,
        item.company,
        item.role,
        item.location,
        item.description,
      ]
        .join(" ")
        .toLowerCase()
        .includes(searchValue)
    })
  }, [jobDescriptions, search])

  // =====================================================
  // BLOCK: Form Handlers
  // =====================================================

  function openCreateForm() {
    setEditingJobDescription(null)
    setFormOpen(true)
    setMessage("")
  }

  function openEditForm(jobDescription: JobDescriptionRecord) {
    setEditingJobDescription(jobDescription)
    setFormOpen(true)
    setMessage("")
  }

  function closeForm() {
    setEditingJobDescription(null)
    setFormOpen(false)
    setSaving(false)
  }

  async function handleSubmit(payload: CreateJobDescriptionInput) {
    setSaving(true)
    setMessage("")

    const result = editingJobDescription
      ? await updateJobDescription(editingJobDescription.id, payload)
      : await createJobDescription(payload)

    if (!result) {
      setMessage("Unable to save job description.")
      setSaving(false)
      return
    }

    setMessage(
      editingJobDescription
        ? "Job description updated."
        : "Job description saved.",
    )

    closeForm()
    await loadRecords()
  }

  async function handleDelete(jobDescription: JobDescriptionRecord) {
    const confirmed = window.confirm(
      `Delete "${jobDescription.title}"? This cannot be undone.`,
    )

    if (!confirmed) {
      return
    }

    const deleted = await deleteJobDescription(jobDescription.id)

    if (!deleted) {
      setMessage("Unable to delete job description.")
      return
    }

    setMessage("Job description deleted.")
    await loadRecords()
  }

  // =====================================================
  // BLOCK: Render
  // =====================================================

  return (
    <section className="grid gap-5">
      <div className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-start gap-3">
          <div className="rounded-2xl bg-blue-50 p-3 text-blue-700">
            <BriefcaseBusiness size={22} />
          </div>

          <div>
            <p className="text-xs font-black uppercase tracking-[0.16em] text-blue-600">
              Job Description Library
            </p>

            <h2 className="mt-2 text-2xl font-black text-slate-950">
              Saved Job Descriptions
            </h2>

            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
              Save, search, edit, and reuse job descriptions for ATS scoring,
              resume tailoring, gap analysis, and future job-tracker workflows.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={openCreateForm}
          className="flex items-center justify-center gap-2 rounded-2xl bg-blue-600 px-5 py-3 text-sm font-black text-white transition hover:bg-blue-700"
        >
          <Plus size={17} />
          Add Job Description
        </button>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
        <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
          <Search size={17} className="text-slate-400" />

          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by role, company, location, or keyword..."
            className="w-full bg-transparent text-sm font-semibold text-slate-700 outline-none placeholder:text-slate-400"
          />
        </label>
      </div>

      {message && (
        <div className="rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm font-bold text-blue-800">
          {message}
        </div>
      )}

      {formOpen && (
        <JobDescriptionForm
          initialJobDescription={editingJobDescription}
          saving={saving}
          onCancel={closeForm}
          onSubmit={handleSubmit}
        />
      )}

      {loading ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 text-sm font-bold text-slate-500 shadow-sm">
          Loading saved job descriptions...
        </div>
      ) : filteredJobDescriptions.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-8 text-center shadow-sm">
          <h3 className="text-xl font-black text-slate-950">
            No job descriptions found
          </h3>

          <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-slate-500">
            Save your first job description to reuse it in ATS scans, resume
            optimization, and future application tracking.
          </p>

          <button
            type="button"
            onClick={openCreateForm}
            className="mt-5 rounded-2xl bg-blue-600 px-5 py-3 text-sm font-black text-white transition hover:bg-blue-700"
          >
            Add Job Description
          </button>
        </div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {filteredJobDescriptions.map((jobDescription) => (
            <JobDescriptionCard
              key={jobDescription.id}
              jobDescription={jobDescription}
              onEdit={openEditForm}
              onDelete={handleDelete}
              onLoadToATS={onLoadToATS}
            />
          ))}
        </div>
      )}
    </section>
  )
}