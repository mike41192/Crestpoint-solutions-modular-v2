"use client"

// =====================================================
// BLOCK: Imports
// Crestpoint Solutions V2
// Version: 1.9.3
// =====================================================

import { useEffect, useState } from "react"
import { Plus } from "lucide-react"

import {
  createJobApplication,
  deleteJobApplication,
  listJobApplications,
  updateJobApplication,
  type JobApplicationPayload,
  type JobApplicationRecord,
} from "@/modules/job-tracker"

import {
  JOB_TRACKER_COLUMN_LABELS,
  JOB_TRACKER_COLUMN_ORDER,
} from "./job-tracker-columns"

import { JobApplicationDetailDrawer } from "./JobApplicationDetailDrawer"
import { JobApplicationForm } from "./JobApplicationForm"
import { JobTrackerColumn } from "./JobTrackerColumn"

// =====================================================
// BLOCK: Job Tracker Board
// =====================================================

export function JobTrackerBoard() {
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [message, setMessage] = useState("")
  const [selectedApplication, setSelectedApplication] =
    useState<JobApplicationRecord | null>(null)

  const [applications, setApplications] = useState<JobApplicationRecord[]>([])

  // =====================================================
  // BLOCK: Load Jobs
  // =====================================================

  async function loadApplications() {
    try {
      const data = await listJobApplications()
      setApplications(data)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadApplications()
  }, [])

  // =====================================================
  // BLOCK: Create Job Application
  // =====================================================

  async function handleCreateApplication(payload: JobApplicationPayload) {
    setMessage("")

    const result = await createJobApplication(payload)

    if (result.status !== "success" || !result.application) {
      setMessage(result.message || "Unable to create job application.")
      return
    }

    setApplications((currentApplications) => [
      result.application as JobApplicationRecord,
      ...currentApplications,
    ])

    setShowForm(false)
    setMessage("Job application added to tracker.")
  }

  // =====================================================
  // BLOCK: Update Job Application
  // =====================================================

  async function handleUpdateApplication(payload: JobApplicationPayload) {
    setMessage("")

    const result = await updateJobApplication(payload)

    if (result.status !== "success" || !result.application) {
      setMessage(result.message || "Unable to update job application.")
      return
    }

    setApplications((currentApplications) =>
      currentApplications.map((application) =>
        application.id === result.application?.id
          ? (result.application as JobApplicationRecord)
          : application,
      ),
    )

    setSelectedApplication(result.application as JobApplicationRecord)
    setMessage("Job application updated.")
  }

  // =====================================================
  // BLOCK: Delete Job Application
  // =====================================================

  async function handleDeleteApplication(id: string) {
    setMessage("")

    const result = await deleteJobApplication(id)

    if (result.status !== "success") {
      setMessage(result.message || "Unable to delete job application.")
      return
    }

    setApplications((currentApplications) =>
      currentApplications.filter((application) => application.id !== id),
    )

    setSelectedApplication(null)
    setMessage("Job application deleted.")
  }

  // =====================================================
  // BLOCK: Loading
  // =====================================================

  if (loading) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-6">
        Loading job tracker...
      </div>
    )
  }

  // =====================================================
  // BLOCK: Board Render
  // =====================================================

  return (
    <div className="grid gap-5">
      <div className="flex flex-col gap-3 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-black text-slate-950">
            Kaizen Job Pipeline
          </h2>

          <p className="mt-1 text-sm leading-6 text-slate-500">
            Track small daily progress from saved jobs to interviews and offers.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowForm((current) => !current)}
          className="inline-flex w-fit items-center gap-2 rounded-full bg-blue-600 px-5 py-3 text-sm font-black text-white transition hover:bg-blue-700"
        >
          <Plus size={16} />
          Add Application
        </button>
      </div>

      {message && (
        <div className="rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm font-bold text-blue-800">
          {message}
        </div>
      )}

      {showForm && (
        <JobApplicationForm
          onCancel={() => setShowForm(false)}
          onSubmit={handleCreateApplication}
        />
      )}

      {applications.length === 0 ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center">
          <h2 className="text-lg font-black text-slate-950">
            No job applications yet
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Click Add Application to create your first tracker card.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <div className="grid min-w-[1800px] grid-cols-7 gap-4">
            {JOB_TRACKER_COLUMN_ORDER.map((status) => (
              <JobTrackerColumn
                key={status}
                title={JOB_TRACKER_COLUMN_LABELS[status]}
                applications={applications.filter(
                  (application) => application.status === status,
                )}
                onOpenApplication={setSelectedApplication}
              />
            ))}
          </div>
        </div>
      )}

      <JobApplicationDetailDrawer
        application={selectedApplication}
        onClose={() => setSelectedApplication(null)}
        onUpdate={handleUpdateApplication}
        onDelete={handleDeleteApplication}
      />
    </div>
  )
}
