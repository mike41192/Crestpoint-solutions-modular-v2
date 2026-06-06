// =====================================================
// BLOCK: Job Tracker Service
// Crestpoint Solutions V2
// Version: 1.9.0
//
// NOTE:
// This service is intentionally API-route based instead of importing
// the Supabase browser client directly. This keeps ownership validation,
// RLS behavior, and future enforcement centralized on the server.
// =====================================================

import type {
  JobApplicationPayload,
  JobApplicationRecord,
  JobApplicationStatus,
  JobTrackerColumnConfig,
  JobTrackerResponse,
} from "./types"

// =====================================================
// BLOCK: Column Registry
// =====================================================

export const JOB_TRACKER_COLUMNS: JobTrackerColumnConfig[] = [
  {
    status: "saved",
    title: "Saved",
    description: "Jobs worth reviewing before applying.",
  },
  {
    status: "applied",
    title: "Applied",
    description: "Applications already submitted.",
  },
  {
    status: "follow_up",
    title: "Follow Up",
    description: "Applications needing a next action.",
  },
  {
    status: "interviewing",
    title: "Interviewing",
    description: "Active interview conversations.",
  },
  {
    status: "offer",
    title: "Offer",
    description: "Offers, negotiations, or final decisions.",
  },
  {
    status: "rejected",
    title: "Rejected",
    description: "Closed opportunities for learning.",
  },
  {
    status: "archived",
    title: "Archived",
    description: "No longer active but kept for history.",
  },
]

// =====================================================
// BLOCK: Fetch Helper
// =====================================================

async function parseResponse(response: Response): Promise<JobTrackerResponse> {
  const payload = (await response.json().catch(() => null)) as
    | JobTrackerResponse
    | null

  if (!payload) {
    return {
      status: "error",
      message: "Job tracker request failed.",
      applications: [],
    }
  }

  return payload
}

// =====================================================
// BLOCK: Public Service Functions
// =====================================================

export async function listJobApplications(): Promise<JobApplicationRecord[]> {
  const response = await fetch("/api/job-applications/list", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })

  const payload = await parseResponse(response)

  return payload.applications || []
}

export async function createJobApplication(
  application: JobApplicationPayload,
): Promise<JobTrackerResponse> {
  const response = await fetch("/api/job-applications/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(application),
  })

  return parseResponse(response)
}

export async function updateJobApplication(
  application: JobApplicationPayload,
): Promise<JobTrackerResponse> {
  const response = await fetch("/api/job-applications/update", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(application),
  })

  return parseResponse(response)
}

export async function updateJobApplicationStatus({
  id,
  status,
}: {
  id: string
  status: JobApplicationStatus
}): Promise<JobTrackerResponse> {
  const response = await fetch("/api/job-applications/status", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id,
      status,
    }),
  })

  return parseResponse(response)
}

export async function deleteJobApplication(
  id: string,
): Promise<JobTrackerResponse> {
  const response = await fetch("/api/job-applications/delete", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id,
    }),
  })

  return parseResponse(response)
}