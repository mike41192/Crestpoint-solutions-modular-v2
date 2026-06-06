"use client"

// =====================================================
// BLOCK: Imports
// Crestpoint Solutions V2
// Version: 1.9.6
// =====================================================

import { useEffect, useState } from "react"
import { Plus } from "lucide-react"

import {
  createJobApplication,
  deleteJobApplication,
  listJobApplications,
  updateJobApplication,
  updateJobApplicationStatus,
  type JobApplicationPayload,
  type JobApplicationRecord,
  type JobApplicationStatus,
} from "@/modules/job-tracker"

import {
  JOB_TRACKER_COLUMN_LABELS,
  JOB_TRACKER_COLUMN_ORDER,
} from "./job-tracker-columns"

import { JobApplicationDetailDrawer } from "./JobApplicationDetailDrawer"
import { JobApplicationForm } from "./JobApplicationForm"
import { JobTrackerColumn } from "./JobTrackerColumn"
import { useJobDragDrop } from "./hooks/useJobDragDrop"

// =====================================================
// BLOCK: Component Types
// =====================================================

type JobTrackerBoardProps = {
  initialApplications?: JobApplicationRecord[]
  onApplicationsChange?: (applications: JobApplicationRecord[]) => void
  onOpenApplication?: (application: JobApplicationRecord) => void
}

// =====================================================
// BLOCK: Job Tracker Board
// =====================================================

export function JobTrackerBoard({
  initialApplications,
  onApplicationsChange,
  onOpenApplication,
}: JobTrackerBoardProps) {
  const [loading, setLoading] = useState(!initialApplications)
  const [showForm, setShowForm] = useState(false)
  const [message, setMessage] = useState("")
  const [selectedApplication, setSelectedApplication] =
    useState<JobApplicationRecord | null>(null)

  const [applications, setApplications] = useState<JobApplicationRecord[]>(
    initialApplications || [],
  )

  // =====================================================
  // BLOCK: State Sync Helper
  // =====================================================

  function syncApplications(nextApplications: JobApplicationRecord[]) {
    setApplications(nextApplications)
    onApplicationsChange?.(nextApplications)
  }

  function openApplication(application: JobApplicationRecord) {
    setSelectedApplication(application)
    onOpenApplication?.(application)
  }

  // =====================================================
  // BLOCK: Sync Parent Applications
  // =====================================================

  useEffect(() => {
    if (!initialApplications) return

    setApplications(initialApplications)
  }, [initialApplications])

  // =====================================================
  // BLOCK: Load Jobs
  // =====================================================

  async function loadApplications() {
    try {
      const data = await listJobApplications()
      syncApplications(data)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (initialApplications) return

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

    const nextApplications = [
      result.application as JobApplicationRecord,
      ...applications,
    ]

    syncApplications(nextApplications)

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

    const nextApplications = applications.map((application) =>
      application.id === result.application?.id
        ? (result.application as JobApplicationRecord)
        : application,
    )

    syncApplications(nextApplications)

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

    const nextApplications = applications.filter(
      (application) => application.id !== id,
    )

    syncApplications(nextApplications)

    setSelectedApplication(null)
    setMessage("Job application deleted.")
  }

  // =====================================================
  // BLOCK: Drag And Drop Status Update
  // =====================================================

  async function handleDragStatusChange({
    applicationId,
    nextStatus,
  }: {
    applicationId: string
    nextStatus: JobApplicationStatus
  }) {
    setMessage("")

    const previousApplications = applications

    const optimisticApplications = applications.map((application) =>
      application.id === applicationId
        ? {
            ...application,
            status: nextStatus,
            updated_at: new Date().toISOString(),
          }
        : application,
    )

    syncApplications(optimisticApplications)

    const result = await updateJobApplicationStatus({
      id: applicationId,
      status: nextStatus,
    })

    if (result.status !== "success" || !result.application) {
      syncApplications(previousApplications)
      setMessage(result.message || "Unable to move job application.")
      return
    }

    const confirmedApplications = optimisticApplications.map((application) =>
      application.id === result.application?.id
        ? (result.application as JobApplicationRecord)
        : application,
    )

    syncApplications(confirmedApplications)

    setMessage(`Moved job to ${JOB_TRACKER_COLUMN_LABELS[nextStatus]}.`)
  }

  const {
    dragOverStatus,
    handleDragStart,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleDragEnd,
  } = useJobDragDrop({
    onStatusChange: handleDragStatusChange,
  })

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
                status={status}
                title={JOB_TRACKER_COLUMN_LABELS[status]}
                applications={applications.filter(
                  (application) => application.status === status,
                )}
                isDragOver={dragOverStatus === status}
                onOpenApplication={openApplication}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
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