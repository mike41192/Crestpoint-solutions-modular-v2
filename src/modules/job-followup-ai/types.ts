// =====================================================
// BLOCK: Job Follow-Up AI Types
// Crestpoint Solutions V2
// Version: 1.9.9
// =====================================================

import type { JobApplicationRecord } from "@/modules/job-tracker"

// =====================================================
// BLOCK: Follow-Up Types
// =====================================================

export type FollowUpMessageType =
  | "follow_up"
  | "thank_you"
  | "networking"
  | "recruiter"
  | "rejection_recovery"

// =====================================================
// BLOCK: Generator Request
// =====================================================

export type FollowUpGenerationRequest = {
  application: JobApplicationRecord
  type: FollowUpMessageType
}

// =====================================================
// BLOCK: Generator Response
// =====================================================

export type FollowUpGenerationResponse = {
  subject: string
  message: string
}