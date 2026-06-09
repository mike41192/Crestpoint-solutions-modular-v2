"use client"

// =====================================================
// BLOCK: Imports
// Crestpoint Solutions V2
// Version: 1.9.6
// =====================================================

import {
  BriefcaseBusiness,
  CalendarClock,
  GripVertical,
  MapPin,
  WalletCards,
} from "lucide-react"

import { JobReminderBadge } from "@/components/jobs/reminders/JobReminderBadge"
import type { JobApplicationRecord } from "@/modules/job-tracker"

// =====================================================
// BLOCK: Component Types
// =====================================================

type JobApplicationCardProps = {
  application: JobApplicationRecord
  onOpen: (application: JobApplicationRecord) => void
  onDragStart: (application: JobApplicationRecord) => void
  onDragEnd: () => void
}

// =====================================================
// BLOCK: Job Application Card
// =====================================================

export function JobApplicationCard({
  application,
  onOpen,
  onDragStart,
  onDragEnd,
}: JobApplicationCardProps) {
  const updatedAt = new Date(application.updated_at).toLocaleDateString()
  const priorityClass =
    application.priority === "high"
      ? "border-red-200 bg-red-50 text-red-700"
      : application.priority === "medium"
        ? "border-amber-200 bg-amber-50 text-amber-700"
        : "border-emerald-200 bg-emerald-50 text-emerald-700"

  return (
    <button
      type="button"
      draggable
      onDragStart={() => onDragStart(application)}
      onDragEnd={onDragEnd}
      onClick={() => onOpen(application)}
      className="group w-full cursor-grab rounded-[22px] border border-slate-200 bg-white p-4 text-left shadow-sm shadow-slate-200/60 transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-lg hover:shadow-blue-100/70 active:cursor-grabbing"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="line-clamp-2 text-sm font-black leading-5 text-slate-950">
            {application.title}
          </p>

          <div className="mt-2 flex items-center gap-1.5 text-xs font-bold text-slate-500">
            <BriefcaseBusiness size={13} className="shrink-0" />
            <span className="truncate">
              {application.company || "Company not listed"}
            </span>
          </div>
        </div>

        <GripVertical
          size={17}
          className="mt-0.5 shrink-0 text-slate-300 transition group-hover:text-slate-500"
        />
      </div>

      {(application.location || application.salary_range) && (
        <div className="mt-3 grid gap-2 text-xs font-semibold text-slate-500">
          {application.location && (
            <div className="flex items-center gap-1.5">
              <MapPin size={13} className="shrink-0 text-slate-400" />
              <span className="truncate">{application.location}</span>
            </div>
          )}

          {application.salary_range && (
            <div className="flex items-center gap-1.5">
              <WalletCards size={13} className="shrink-0 text-slate-400" />
              <span className="truncate">{application.salary_range}</span>
            </div>
          )}
        </div>
      )}

      <JobReminderBadge application={application} />

      {application.next_action && (
        <div className="mt-3 rounded-2xl border border-blue-100 bg-blue-50/80 p-3">
          <p className="text-[11px] font-black uppercase tracking-[0.12em] text-blue-700">
            Next Action
          </p>

          <p className="mt-1 line-clamp-3 text-xs font-semibold leading-5 text-blue-950">
            {application.next_action}
          </p>
        </div>
      )}

      <div className="mt-4 flex items-center justify-between gap-3 border-t border-slate-100 pt-3">
        <span className={`rounded-full border px-2.5 py-1 text-[10px] font-black uppercase ${priorityClass}`}>
          {application.priority}
        </span>

        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-slate-400">
          <CalendarClock size={12} />
          {updatedAt}
        </span>
      </div>
    </button>
  )
}
