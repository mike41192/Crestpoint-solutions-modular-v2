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
