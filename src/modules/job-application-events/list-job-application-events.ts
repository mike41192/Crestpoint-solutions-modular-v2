// =====================================================
// BLOCK: List Job Application Events Service
// Crestpoint Solutions V2
// Version: 1.9.8
// =====================================================

import type {
  JobApplicationEventRecord,
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
      message: "Unable to load job application events.",
      events: [],
    }
  }

  return payload
}

// =====================================================
// BLOCK: Public Service Function
// =====================================================

export async function listJobApplicationEvents(
  jobApplicationId: string,
): Promise<JobApplicationEventRecord[]> {
  if (!jobApplicationId) {
    return []
  }

  const response = await fetch(
    `/api/job-application-events/list?jobApplicationId=${encodeURIComponent(
      jobApplicationId,
    )}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    },
  )

  const payload = await parseResponse(response)

  return payload.events || []
}