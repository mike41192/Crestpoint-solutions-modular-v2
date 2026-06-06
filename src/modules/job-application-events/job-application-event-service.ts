// =====================================================
// BLOCK: Job Application Event Service
// Crestpoint Solutions V2
// Version: 1.9.7
//
// NOTE:
// Event writes route through an API endpoint so user ownership,
// RLS behavior, and future audit validation stay server-centered.
// =====================================================

import type {
  JobApplicationEventPayload,
  JobApplicationEventResponse,
} from "./types"

// =====================================================
// BLOCK: Fetch Helpers
// =====================================================

async function parseResponse(
  response: Response,
): Promise<JobApplicationEventResponse> {
  const payload = (await response.json().catch(() => null)) as
    | JobApplicationEventResponse
    | null

  if (!payload) {
    return {
      status: "error",
      message: "Job application event request failed.",
    }
  }

  return payload
}

// =====================================================
// BLOCK: Public Service Functions
// =====================================================

export async function createJobApplicationEvent(
  payload: JobApplicationEventPayload,
): Promise<JobApplicationEventResponse> {
  const response = await fetch("/api/job-application-events/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  })

  return parseResponse(response)
}