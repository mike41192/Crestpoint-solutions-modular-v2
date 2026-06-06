"use client"

// =====================================================
// BLOCK: Imports
// Crestpoint Solutions V2
// Version: 1.9.2
// =====================================================

import { useState } from "react"
import type {
  JobApplicationPayload,
  JobApplicationPriority,
  JobApplicationStatus,
} from "@/modules/job-tracker"

// =====================================================
// BLOCK: Component Types
// =====================================================

type JobApplicationFormProps = {
  onCancel: () => void
  onSubmit: (payload: JobApplicationPayload) => Promise<void>
}

// =====================================================
// BLOCK: Job Application Form Component
// =====================================================

export function JobApplicationForm({
  onCancel,
  onSubmit,
}: JobApplicationFormProps) {
  const [title, setTitle] = useState("")
  const [company, setCompany] = useState("")
  const [location, setLocation] = useState("")
  const [sourceUrl, setSourceUrl] = useState("")
  const [salaryRange, setSalaryRange] = useState("")
  const [nextAction, setNextAction] = useState("")
  const [notes, setNotes] = useState("")
  const [status, setStatus] = useState<JobApplicationStatus>("saved")
  const [priority, setPriority] = useState<JobApplicationPriority>("medium")
  const [saving, setSaving] = useState(false)

  async function handleSubmit() {
    if (!title.trim()) return

    setSaving(true)

    await onSubmit({
      title,
      company,
      location,
      sourceUrl,
      salaryRange,
      status,
      priority,
      nextAction,
      notes,
    })

    setSaving(false)
  }

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div>
        <h2 className="text-lg font-black text-slate-950">
          Quick Add Application
        </h2>

        <p className="mt-1 text-sm leading-6 text-slate-500">
          Add a job to your Kaizen tracker so you can move it through your
          application workflow.
        </p>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <label className="text-sm font-black text-slate-700">
          Job Title

          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Maintenance Supervisor"
            className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-800 outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
          />
        </label>

        <label className="text-sm font-black text-slate-700">
          Company

          <input
            value={company}
            onChange={(event) => setCompany(event.target.value)}
            placeholder="Midwest Industrial Manufacturing"
            className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-800 outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
          />
        </label>

        <label className="text-sm font-black text-slate-700">
          Location

          <input
            value={location}
            onChange={(event) => setLocation(event.target.value)}
            placeholder="Decatur, IL"
            className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-800 outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
          />
        </label>

        <label className="text-sm font-black text-slate-700">
          Salary Range

          <input
            value={salaryRange}
            onChange={(event) => setSalaryRange(event.target.value)}
            placeholder="$60,000 - $75,000"
            className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-800 outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
          />
        </label>

        <label className="text-sm font-black text-slate-700">
          Status

          <select
            value={status}
            onChange={(event) =>
              setStatus(event.target.value as JobApplicationStatus)
            }
            className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-800 outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
          >
            <option value="saved">Saved</option>
            <option value="applied">Applied</option>
            <option value="follow_up">Follow Up</option>
            <option value="interviewing">Interviewing</option>
            <option value="offer">Offer</option>
            <option value="rejected">Rejected</option>
            <option value="archived">Archived</option>
          </select>
        </label>

        <label className="text-sm font-black text-slate-700">
          Priority

          <select
            value={priority}
            onChange={(event) =>
              setPriority(event.target.value as JobApplicationPriority)
            }
            className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-800 outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </label>

        <label className="md:col-span-2 text-sm font-black text-slate-700">
          Source URL

          <input
            value={sourceUrl}
            onChange={(event) => setSourceUrl(event.target.value)}
            placeholder="https://..."
            className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-800 outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
          />
        </label>

        <label className="md:col-span-2 text-sm font-black text-slate-700">
          Next Action

          <input
            value={nextAction}
            onChange={(event) => setNextAction(event.target.value)}
            placeholder="Follow up Friday, tailor resume, prepare interview notes..."
            className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-800 outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
          />
        </label>

        <label className="md:col-span-2 text-sm font-black text-slate-700">
          Notes

          <textarea
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            placeholder="Job details, recruiter notes, resume version used, interview details..."
            className="mt-2 min-h-[120px] w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-800 outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
          />
        </label>
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={saving || !title.trim()}
          className="rounded-full bg-blue-600 px-5 py-3 text-sm font-black text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-400"
        >
          {saving ? "Saving..." : "Save Application"}
        </button>

        <button
          type="button"
          onClick={onCancel}
          className="rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-black text-slate-700 transition hover:bg-slate-50"
        >
          Cancel
        </button>
      </div>
    </div>
  )
}
