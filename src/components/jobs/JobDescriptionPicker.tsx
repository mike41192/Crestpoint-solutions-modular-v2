"use client"

// =====================================================
// BLOCK: Imports
// Crestpoint Solutions V2
// Version: 1.8.2
// =====================================================

import { useEffect, useMemo, useState } from "react"
import { BriefcaseBusiness, RefreshCw } from "lucide-react"
import {
  loadJobDescriptions,
  type JobDescriptionRecord,
} from "@/modules/job-description-library"

// =====================================================
// BLOCK: Component Types
// =====================================================

type JobDescriptionPickerProps = {
  onSelect: (jobDescription: JobDescriptionRecord) => void
}

// =====================================================
// BLOCK: Job Description Picker Component
// =====================================================

export function JobDescriptionPicker({ onSelect }: JobDescriptionPickerProps) {
  const [jobDescriptions, setJobDescriptions] = useState<
    JobDescriptionRecord[]
  >([])

  const [selectedId, setSelectedId] = useState("")
  const [loading, setLoading] = useState(true)

  async function loadSavedJobs() {
    setLoading(true)

    const records = await loadJobDescriptions()

    setJobDescriptions(records)
    setLoading(false)
  }

  useEffect(() => {
    loadSavedJobs()
  }, [])

  const selectedJob = useMemo(
    () => jobDescriptions.find((item) => item.id === selectedId) || null,
    [jobDescriptions, selectedId],
  )

  function handleLoad() {
    if (!selectedJob) return

    onSelect(selectedJob)
  }

  return (
    <section className="grid gap-3 rounded-3xl border border-blue-200 bg-blue-50 p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="rounded-2xl bg-white p-2 text-blue-700 shadow-sm">
          <BriefcaseBusiness size={18} />
        </div>

        <div>
          <h3 className="text-lg font-black text-slate-950">
            Saved Job Descriptions
          </h3>

          <p className="mt-1 text-sm leading-6 text-slate-600">
            Load a saved job description into the ATS analyzer.
          </p>
        </div>
      </div>

      <div className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_auto_auto]">
        <select
          value={selectedId}
          onChange={(event) => setSelectedId(event.target.value)}
          disabled={loading || jobDescriptions.length === 0}
          className="min-w-0 rounded-2xl border border-blue-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-100"
        >
          <option value="">
            {loading
              ? "Loading saved jobs..."
              : jobDescriptions.length === 0
                ? "No saved job descriptions yet"
                : "Select a saved job description"}
          </option>

          {jobDescriptions.map((jobDescription) => (
            <option key={jobDescription.id} value={jobDescription.id}>
              {jobDescription.title}
              {jobDescription.company
                ? ` — ${jobDescription.company}`
                : ""}
            </option>
          ))}
        </select>

        <button
          type="button"
          onClick={loadSavedJobs}
          disabled={loading}
          className="flex items-center justify-center gap-2 rounded-2xl border border-blue-200 bg-white px-4 py-3 text-sm font-black text-blue-700 transition hover:border-blue-300 hover:bg-blue-100 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <RefreshCw size={16} />
          Refresh
        </button>

        <button
          type="button"
          onClick={handleLoad}
          disabled={!selectedJob}
          className="rounded-2xl bg-blue-600 px-5 py-3 text-sm font-black text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-400"
        >
          Load to ATS
        </button>
      </div>
    </section>
  )
}