"use client"

// =====================================================
// BLOCK: Imports
// Crestpoint Solutions V2
// Version: 1.8.2
// =====================================================

import { CalendarDays, ExternalLink, FileText, MapPin, Pencil, Trash2 } from "lucide-react"
import type { JobDescriptionRecord } from "@/modules/job-description-library"

// =====================================================
// BLOCK: Component Types
// =====================================================

type JobDescriptionCardProps = {
  jobDescription: JobDescriptionRecord
  onEdit: (jobDescription: JobDescriptionRecord) => void
  onDelete: (jobDescription: JobDescriptionRecord) => void
  onLoadToATS?: (jobDescription: JobDescriptionRecord) => void
}

// =====================================================
// BLOCK: Helpers
// =====================================================

function formatDate(value: string) {
  if (!value) return "Unknown"

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value))
}

// =====================================================
// BLOCK: Job Description Card Component
// =====================================================

export function JobDescriptionCard({
  jobDescription,
  onEdit,
  onDelete,
  onLoadToATS,
}: JobDescriptionCardProps) {
  return (
    <article className="grid gap-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-black uppercase tracking-[0.16em] text-blue-600">
            {jobDescription.company || "Saved Job"}
          </p>

          <h3 className="mt-2 break-words text-xl font-black text-slate-950">
            {jobDescription.title}
          </h3>

          <p className="mt-1 text-sm font-bold text-slate-500">
            {jobDescription.role || "Role not listed"}
          </p>
        </div>

        <span className="rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1 text-xs font-black uppercase text-emerald-700">
          {jobDescription.status}
        </span>
      </div>

      <div className="grid gap-2 text-sm text-slate-500">
        {jobDescription.location && (
          <div className="flex items-center gap-2">
            <MapPin size={15} />
            <span>{jobDescription.location}</span>
          </div>
        )}

        <div className="flex items-center gap-2">
          <CalendarDays size={15} />
          <span>Updated {formatDate(jobDescription.updatedAt)}</span>
        </div>
      </div>

      <p className="line-clamp-4 text-sm leading-6 text-slate-600">
        {jobDescription.description}
      </p>

      {jobDescription.sourceUrl && (
        <a
          href={jobDescription.sourceUrl}
          target="_blank"
          rel="noreferrer"
          className="flex w-fit items-center gap-2 text-sm font-black text-blue-700 hover:text-blue-900"
        >
          <ExternalLink size={15} />
          View Source
        </a>
      )}

      <div className="flex flex-col gap-2 border-t border-slate-100 pt-4 sm:flex-row">
        {onLoadToATS && (
          <button
            type="button"
            onClick={() => onLoadToATS(jobDescription)}
            className="flex items-center justify-center gap-2 rounded-2xl bg-blue-600 px-4 py-3 text-sm font-black text-white transition hover:bg-blue-700"
          >
            <FileText size={16} />
            Load to ATS
          </button>
        )}

        <button
          type="button"
          onClick={() => onEdit(jobDescription)}
          className="flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-black text-slate-700 transition hover:border-blue-300 hover:text-blue-700"
        >
          <Pencil size={16} />
          Edit
        </button>

        <button
          type="button"
          onClick={() => onDelete(jobDescription)}
          className="flex items-center justify-center gap-2 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-black text-red-700 transition hover:border-red-200 hover:bg-red-100"
        >
          <Trash2 size={16} />
          Delete
        </button>
      </div>
    </article>
  )
}