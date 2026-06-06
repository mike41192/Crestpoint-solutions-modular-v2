// =====================================================
// BLOCK: Job Application Event Types
// Crestpoint Solutions V2
// Version: 1.9.7
// =====================================================

import type { JobApplicationStatus } from "@/modules/job-tracker"

// =====================================================
// BLOCK: Event Types
// =====================================================

export type JobApplicationEventType =
  | "created"
  | "updated"
  | "deleted"
  | "status_changed"
  | "note_added"
  | "follow_up_set"

// =====================================================
// BLOCK: Database Record
// =====================================================

export type JobApplicationEventRecord = {
  id: string
  user_id: string
  job_application_id: string
  event_type: JobApplicationEventType
  from_status: JobApplicationStatus | null
  to_status: JobApplicationStatus | null
  note: string | null
  created_at: string
}

// =====================================================
// BLOCK: Create Payload
// =====================================================

export type JobApplicationEventPayload = {
  jobApplicationId: string
  eventType: JobApplicationEventType
  fromStatus?: JobApplicationStatus | null
  toStatus?: JobApplicationStatus | null
  note?: string | null
}

// =====================================================
// BLOCK: Response
// =====================================================

export type JobApplicationEventResponse = {
  status: "success" | "error" | "unauthorized" | "not_found"
  message: string
  event?: JobApplicationEventRecord | null
  events?: JobApplicationEventRecord[]
}