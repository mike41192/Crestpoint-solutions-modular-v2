// =====================================================
// BLOCK: Job Application Event Builders
// Crestpoint Solutions V2
// Version: 1.9.7
// =====================================================

import type { JobApplicationStatus } from "@/modules/job-tracker"
import type { JobApplicationEventPayload } from "./types"

// =====================================================
// BLOCK: Status Change Event Builder
// =====================================================

export function buildStatusChangeEvent({
  jobApplicationId,
  fromStatus,
  toStatus,
}: {
  jobApplicationId: string
  fromStatus: JobApplicationStatus
  toStatus: JobApplicationStatus
}): JobApplicationEventPayload {
  return {
    jobApplicationId,
    eventType: "status_changed",
    fromStatus,
    toStatus,
    note: `Moved from ${fromStatus} to ${toStatus}.`,
  }
}

// =====================================================
// BLOCK: Updated Event Builder
// =====================================================

export function buildUpdatedEvent({
  jobApplicationId,
}: {
  jobApplicationId: string
}): JobApplicationEventPayload {
  return {
    jobApplicationId,
    eventType: "updated",
    note: "Job application details updated.",
  }
}

// =====================================================
// BLOCK: Created Event Builder
// =====================================================

export function buildCreatedEvent({
  jobApplicationId,
}: {
  jobApplicationId: string
}): JobApplicationEventPayload {
  return {
    jobApplicationId,
    eventType: "created",
    note: "Job application created.",
  }
}