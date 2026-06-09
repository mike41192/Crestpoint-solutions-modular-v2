"use client"

// =====================================================
// BLOCK: Imports
// Crestpoint Solutions V2
// Version: 1.9.9
// =====================================================

import { useEffect, useState } from "react"
import {
  BriefcaseBusiness,
  CalendarClock,
  ExternalLink,
  MapPin,
  Trash2,
  WalletCards,
  X,
} from "lucide-react"
import { FollowUpGeneratorPanel } from "@/components/jobs/followup/FollowUpGeneratorPanel"
import { JobTimelinePanel } from "@/components/jobs/timeline/JobTimelinePanel"
import {
  listJobApplicationEvents,
  type JobApplicationEventRecord,
} from "@/modules/job-application-events"
import type {
  JobApplicationPayload,
  JobApplicationPriority,
  JobApplicationRecord,
  JobApplicationStatus,
} from "@/modules/job-tracker"

// =====================================================
// BLOCK: Component Types
// =====================================================

type JobApplicationDetailDrawerProps = {
  application: JobApplicationRecord | null
  onClose: () => void
  onUpdate: (payload: JobApplicationPayload) => Promise<void>
  onDelete: (id: string) => Promise<void>
}

// =====================================================
// BLOCK: Job Application Detail Drawer
// =====================================================

export function JobApplicationDetailDrawer({
  application,
  onClose,
  onUpdate,
  onDelete,
}: JobApplicationDetailDrawerProps) {
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [loadingEvents, setLoadingEvents] = useState(false)
  const [events, setEvents] = useState<JobApplicationEventRecord[]>([])

  const [title, setTitle] = useState("")
  const [company, setCompany] = useState("")
  const [location, setLocation] = useState("")
  const [sourceUrl, setSourceUrl] = useState("")
  const [salaryRange, setSalaryRange] = useState("")
  const [nextAction, setNextAction] = useState("")
  const [notes, setNotes] = useState("")
  const [status, setStatus] = useState<JobApplicationStatus>("saved")
  const [priority, setPriority] = useState<JobApplicationPriority>("medium")

  // =====================================================
  // BLOCK: Sync Selected Application Into Form Fields
  // =====================================================

  useEffect(() => {
    if (!application) {
      setEvents([])
      return
    }

    setTitle(application.title || "")
    setCompany(application.company || "")
    setLocation(application.location || "")
    setSourceUrl(application.source_url || "")
    setSalaryRange(application.salary_range || "")
    setNextAction(application.next_action || "")
    setNotes(application.notes || "")
    setStatus(application.status || "saved")
    setPriority(application.priority || "medium")
  }, [application])

  // =====================================================
  // BLOCK: Load Timeline Events
  // =====================================================

  async function loadTimelineEvents(applicationId: string) {
    setLoadingEvents(true)

    try {
      const timelineEvents = await listJobApplicationEvents(applicationId)
      setEvents(timelineEvents)
    } finally {
      setLoadingEvents(false)
    }
  }

  useEffect(() => {
    if (!application?.id) return

    loadTimelineEvents(application.id)
  }, [application?.id])

  if (!application) {
    return null
  }

  const statusLabel = status
    .replace("_", " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase())
  const priorityClass =
    priority === "high"
      ? "border-red-200 bg-red-50 text-red-700"
      : priority === "medium"
        ? "border-amber-200 bg-amber-50 text-amber-700"
        : "border-emerald-200 bg-emerald-50 text-emerald-700"

  async function handleSave() {
    if (!application || !title.trim()) return

    setSaving(true)

    await onUpdate({
      id: application.id,
      title,
      company,
      location,
      sourceUrl,
      salaryRange,
      status,
      priority,
      nextAction,
      notes,
      jobDescriptionId: application.job_description_id,
      appliedAt: application.applied_at,
      followUpAt: application.follow_up_at,
      interviewAt: application.interview_at,
    })

    await loadTimelineEvents(application.id)

    setSaving(false)
  }

  async function handleDelete() {
    if (!application) return

    const confirmed = window.confirm(
      "Delete this job application from your tracker?",
    )

    if (!confirmed) return

    setDeleting(true)
    await onDelete(application.id)
    setDeleting(false)
  }

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-sm">
      <div className="ml-auto flex h-full w-full max-w-3xl flex-col overflow-hidden bg-white shadow-2xl">
        <div className="border-b border-slate-200 bg-slate-950 p-5 text-white">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-blue-200">
                Job Application Record
              </p>

              <h2 className="mt-2 line-clamp-2 text-2xl font-black tracking-tight">
                {application.title}
              </h2>

              <div className="mt-3 flex flex-wrap items-center gap-2 text-sm font-semibold text-slate-300">
                <span className="inline-flex items-center gap-1.5">
                  <BriefcaseBusiness size={15} />
                  {application.company || "Company not listed"}
                </span>

                {application.location && (
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin size={15} />
                    {application.location}
                  </span>
                )}
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-white/15 bg-white/10 p-2 text-slate-200 transition hover:bg-white/15 hover:text-white"
            >
              <X size={18} />
            </button>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <DrawerMetric
              icon={CalendarClock}
              label="Status"
              value={statusLabel}
            />

            <DrawerMetric
              icon={WalletCards}
              label="Compensation"
              value={salaryRange || "Not listed"}
            />

            <div className="rounded-2xl border border-white/10 bg-white/10 p-3">
              <p className="text-[10px] font-black uppercase tracking-[0.14em] text-blue-100">
                Priority
              </p>

              <span
                className={`mt-2 inline-flex rounded-full border px-2.5 py-1 text-xs font-black uppercase ${priorityClass}`}
              >
                {priority}
              </span>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          <div className="grid gap-4 md:grid-cols-2">
            <label className="text-sm font-black text-slate-700">
              Job Title

              <input
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-800 outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
              />
            </label>

            <label className="text-sm font-black text-slate-700">
              Company

              <input
                value={company}
                onChange={(event) => setCompany(event.target.value)}
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-800 outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
              />
            </label>

            <label className="text-sm font-black text-slate-700">
              Location

              <input
                value={location}
                onChange={(event) => setLocation(event.target.value)}
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-800 outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
              />
            </label>

            <label className="text-sm font-black text-slate-700">
              Salary Range

              <input
                value={salaryRange}
                onChange={(event) => setSalaryRange(event.target.value)}
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

            <label className="text-sm font-black text-slate-700 md:col-span-2">
              Source URL

              <input
                value={sourceUrl}
                onChange={(event) => setSourceUrl(event.target.value)}
                placeholder="https://..."
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-800 outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
              />
            </label>

            <label className="text-sm font-black text-slate-700 md:col-span-2">
              Next Action

              <input
                value={nextAction}
                onChange={(event) => setNextAction(event.target.value)}
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-800 outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
              />
            </label>

            <label className="text-sm font-black text-slate-700 md:col-span-2">
              Notes

              <textarea
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                className="mt-2 min-h-[140px] w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-800 outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
              />
            </label>
          </div>

          <div className="mt-5 grid gap-3 rounded-[24px] border border-slate-200 bg-slate-50 p-4 text-xs text-slate-500 sm:grid-cols-2">
            <p>
              <span className="font-black text-slate-700">Created:</span>{" "}
              {new Date(application.created_at).toLocaleString()}
            </p>

            <p>
              <span className="font-black text-slate-700">Updated:</span>{" "}
              {new Date(application.updated_at).toLocaleString()}
            </p>

            {application.source_url && (
              <a
                href={application.source_url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex w-fit items-center gap-2 font-black text-blue-700 hover:text-blue-900 sm:col-span-2"
              >
                <ExternalLink size={14} />
                Open source listing
              </a>
            )}
          </div>

          <div className="mt-5">
            <FollowUpGeneratorPanel application={application} />
          </div>

          <div className="mt-5">
            {loadingEvents ? (
              <div className="rounded-3xl border border-slate-200 bg-white p-5 text-sm font-bold text-slate-500 shadow-sm">
                Loading timeline...
              </div>
            ) : (
              <JobTimelinePanel events={events} />
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 p-5">
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting}
            className="inline-flex items-center gap-2 rounded-full border border-red-200 bg-red-50 px-5 py-3 text-sm font-black text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Trash2 size={16} />
            {deleting ? "Deleting..." : "Delete"}
          </button>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-black text-slate-700 transition hover:bg-slate-50"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleSave}
              disabled={saving || !title.trim()}
              className="rounded-full bg-blue-600 px-5 py-3 text-sm font-black text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-400"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function DrawerMetric({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ size?: number; className?: string }>
  label: string
  value: string
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/10 p-3">
      <div className="flex items-center gap-2 text-blue-100">
        <Icon size={15} />

        <p className="text-[10px] font-black uppercase tracking-[0.14em]">
          {label}
        </p>
      </div>

      <p className="mt-2 truncate text-sm font-black text-white">{value}</p>
    </div>
  )
}
