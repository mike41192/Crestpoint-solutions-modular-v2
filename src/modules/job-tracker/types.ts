// =====================================================
// BLOCK: Job Tracker Types
// Crestpoint Solutions V2
// Version: 1.9.0
// =====================================================

export type JobApplicationStatus =
  | "saved"
  | "applied"
  | "follow_up"
  | "interviewing"
  | "offer"
  | "rejected"
  | "archived"

export type JobApplicationPriority = "low" | "medium" | "high"

export type JobApplicationRecord = {
  id: string
  user_id: string
  job_description_id: string | null
  title: string
  company: string | null
  location: string | null
  source_url: string | null
  salary_range: string | null
  status: JobApplicationStatus
  priority: JobApplicationPriority
  next_action: string | null
  notes: string | null
  applied_at: string | null
  follow_up_at: string | null
  interview_at: string | null
  created_at: string
  updated_at: string
}

export type JobApplicationPayload = {
  id?: string
  jobDescriptionId?: string | null
  title: string
  company?: string
  location?: string
  sourceUrl?: string
  salaryRange?: string
  status?: JobApplicationStatus
  priority?: JobApplicationPriority
  nextAction?: string
  notes?: string
  appliedAt?: string | null
  followUpAt?: string | null
  interviewAt?: string | null
}

export type JobTrackerColumnConfig = {
  status: JobApplicationStatus
  title: string
  description: string
}

export type JobTrackerResponse = {
  status: "success" | "error" | "unauthorized" | "not_found"
  message: string
  application?: JobApplicationRecord | null
  applications?: JobApplicationRecord[]
}
