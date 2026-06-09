"use client"

// =====================================================
// BLOCK: Imports
// Crestpoint Solutions V2
// Version: 1.9.7
// =====================================================

import { useEffect, useState } from "react"
import {
  ArrowRight,
  BriefcaseBusiness,
  CheckCircle2,
  Clock3,
  Plus,
  Sparkles,
} from "lucide-react"

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
  buildCreatedEvent,
  buildStatusChangeEvent,
  buildUpdatedEvent,
  logJobApplicationEvent,
} from "@/modules/job-application-events"

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

    const createdApplication = result.application as JobApplicationRecord

    const nextApplications = [createdApplication, ...applications]

    syncApplications(nextApplications)

    await logJobApplicationEvent(
      buildCreatedEvent({
        jobApplicationId: createdApplication.id,
      }),
    )

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

    const updatedApplication = result.application as JobApplicationRecord

    const nextApplications = applications.map((application) =>
      application.id === updatedApplication.id ? updatedApplication : application,
    )

    syncApplications(nextApplications)

    await logJobApplicationEvent(
      buildUpdatedEvent({
        jobApplicationId: updatedApplication.id,
      }),
    )

    setSelectedApplication(updatedApplication)
    setMessage("Job application updated.")
  }

  // =====================================================
  // BLOCK: Delete Job Application
  // NOTE:
  // Delete events are intentionally not logged yet because the
  // application record is removed. Future soft-delete/archive flow
  // should log deletion before archival or use an archive event.
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

    const movedApplication = applications.find(
      (application) => application.id === applicationId,
    )

    if (!movedApplication) {
      setMessage("Unable to find job application.")
      return
    }

    const previousStatus = movedApplication.status

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

    const confirmedApplication = result.application as JobApplicationRecord

    const confirmedApplications = optimisticApplications.map((application) =>
      application.id === confirmedApplication.id
        ? confirmedApplication
        : application,
    )

    syncApplications(confirmedApplications)

    await logJobApplicationEvent(
      buildStatusChangeEvent({
        jobApplicationId: applicationId,
        fromStatus: previousStatus,
        toStatus: nextStatus,
      }),
    )

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

  const activeApplications = applications.filter((application) => {
    return !["rejected", "archived"].includes(application.status)
  })
  const interviewCount = applications.filter((application) => {
    return application.status === "interviewing"
  }).length
  const followUpCount = applications.filter((application) => {
    return application.status === "follow_up"
  }).length
  const offerCount = applications.filter((application) => {
    return application.status === "offer"
  }).length

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
      <section className="overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-sm">
        <div className="grid gap-5 border-b border-slate-100 bg-slate-950 p-5 text-white lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
          <div>
            <div className="mb-3 flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-black uppercase tracking-[0.16em] text-blue-100">
              <Sparkles size={14} />
              Live Pipeline
            </div>

            <h2 className="text-2xl font-black tracking-tight">
              Kaizen Job Pipeline
            </h2>

            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-300">
              Move applications through a clean hiring workflow while preserving
              status history, reminders, and follow-up context.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowForm((current) => !current)}
            className="inline-flex w-fit items-center gap-2 rounded-full bg-blue-500 px-5 py-3 text-sm font-black text-white shadow-lg shadow-blue-950/30 transition hover:-translate-y-0.5 hover:bg-blue-400"
          >
            <Plus size={16} />
            Add Application
          </button>
        </div>

        <div className="grid gap-3 p-4 sm:grid-cols-2 xl:grid-cols-4">
          <BoardMetric
            icon={BriefcaseBusiness}
            label="Active"
            value={activeApplications.length}
            helper="Open opportunities"
          />

          <BoardMetric
            icon={Clock3}
            label="Follow Ups"
            value={followUpCount}
            helper="Needs action"
          />

          <BoardMetric
            icon={ArrowRight}
            label="Interviews"
            value={interviewCount}
            helper="In conversation"
          />

          <BoardMetric
            icon={CheckCircle2}
            label="Offers"
            value={offerCount}
            helper="Decision stage"
          />
        </div>
      </section>

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
        <div className="rounded-[32px] border border-dashed border-slate-300 bg-white p-10 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
            <BriefcaseBusiness size={24} />
          </div>

          <h2 className="mt-4 text-xl font-black text-slate-950">
            Start your pipeline
          </h2>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
            Add your first opportunity to begin tracking status, follow-ups,
            and application history.
          </p>
        </div>
      ) : (
        <section className="rounded-[32px] border border-slate-200 bg-white p-3 shadow-sm">
          <div className="mb-3 flex flex-col gap-2 px-2 pt-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.16em] text-blue-600">
                Drag and Drop Workflow
              </p>

              <h3 className="mt-1 text-lg font-black text-slate-950">
                Pipeline Board
              </h3>
            </div>

            <p className="text-xs font-bold text-slate-500">
              {JOB_TRACKER_COLUMN_ORDER.length} stages from saved to archive
            </p>
          </div>

          <div className="overflow-x-auto pb-2">
            <div className="grid min-w-[1820px] grid-cols-7 gap-4">
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
        </section>
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

function BoardMetric({
  icon: Icon,
  label,
  value,
  helper,
}: {
  icon: React.ComponentType<{ size?: number; className?: string }>
  label: string
  value: number
  helper: string
}) {
  return (
    <div className="rounded-[22px] border border-slate-200 bg-slate-50 p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.14em] text-slate-500">
            {label}
          </p>

          <p className="mt-2 text-2xl font-black text-slate-950">{value}</p>

          <p className="mt-1 text-xs font-semibold text-slate-500">
            {helper}
          </p>
        </div>

        <div className="rounded-2xl bg-white p-3 text-blue-700 shadow-sm">
          <Icon size={18} />
        </div>
      </div>
    </div>
  )
}
