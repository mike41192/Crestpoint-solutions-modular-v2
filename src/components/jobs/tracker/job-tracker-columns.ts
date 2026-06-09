// =====================================================
// BLOCK: Job Tracker Column Registry
// Crestpoint Solutions V2
// Version: 1.9.1
// =====================================================

import type { JobApplicationStatus } from "@/modules/job-tracker"

export const JOB_TRACKER_COLUMN_ORDER: JobApplicationStatus[] = [
  "saved",
  "applied",
  "follow_up",
  "interviewing",
  "offer",
  "rejected",
  "archived",
]

export const JOB_TRACKER_COLUMN_LABELS: Record<
  JobApplicationStatus,
  string
> = {
  saved: "Saved",
  applied: "Applied",
  follow_up: "Follow Up",
  interviewing: "Interviewing",
  offer: "Offer",
  rejected: "Rejected",
  archived: "Archived",
}

export const JOB_TRACKER_COLUMN_DESCRIPTIONS: Record<
  JobApplicationStatus,
  string
> = {
  saved: "Roles worth reviewing",
  applied: "Submissions sent",
  follow_up: "Needs outreach",
  interviewing: "Active conversations",
  offer: "Decision stage",
  rejected: "Closed as no",
  archived: "Stored history",
}

export const JOB_TRACKER_COLUMN_STYLES: Record<
  JobApplicationStatus,
  {
    accent: string
    header: string
    icon: string
    count: string
    surface: string
    drag: string
  }
> = {
  saved: {
    accent: "bg-slate-500",
    header: "text-slate-800",
    icon: "bg-slate-100 text-slate-700",
    count: "bg-slate-100 text-slate-700",
    surface: "border-slate-200 bg-slate-50/80",
    drag: "border-slate-400 bg-slate-100 shadow-md",
  },
  applied: {
    accent: "bg-blue-500",
    header: "text-blue-950",
    icon: "bg-blue-50 text-blue-700",
    count: "bg-blue-50 text-blue-700",
    surface: "border-blue-100 bg-blue-50/50",
    drag: "border-blue-300 bg-blue-50 shadow-md",
  },
  follow_up: {
    accent: "bg-amber-500",
    header: "text-amber-950",
    icon: "bg-amber-50 text-amber-700",
    count: "bg-amber-50 text-amber-700",
    surface: "border-amber-100 bg-amber-50/50",
    drag: "border-amber-300 bg-amber-50 shadow-md",
  },
  interviewing: {
    accent: "bg-cyan-600",
    header: "text-cyan-950",
    icon: "bg-cyan-50 text-cyan-700",
    count: "bg-cyan-50 text-cyan-700",
    surface: "border-cyan-100 bg-cyan-50/50",
    drag: "border-cyan-300 bg-cyan-50 shadow-md",
  },
  offer: {
    accent: "bg-emerald-600",
    header: "text-emerald-950",
    icon: "bg-emerald-50 text-emerald-700",
    count: "bg-emerald-50 text-emerald-700",
    surface: "border-emerald-100 bg-emerald-50/50",
    drag: "border-emerald-300 bg-emerald-50 shadow-md",
  },
  rejected: {
    accent: "bg-rose-500",
    header: "text-rose-950",
    icon: "bg-rose-50 text-rose-700",
    count: "bg-rose-50 text-rose-700",
    surface: "border-rose-100 bg-rose-50/40",
    drag: "border-rose-300 bg-rose-50 shadow-md",
  },
  archived: {
    accent: "bg-zinc-500",
    header: "text-zinc-950",
    icon: "bg-zinc-100 text-zinc-700",
    count: "bg-zinc-100 text-zinc-700",
    surface: "border-zinc-200 bg-zinc-50/80",
    drag: "border-zinc-400 bg-zinc-100 shadow-md",
  },
}
