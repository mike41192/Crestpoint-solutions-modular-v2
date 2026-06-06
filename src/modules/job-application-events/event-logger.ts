// =====================================================
// BLOCK: Job Application Event Logger
// Crestpoint Solutions V2
// Version: 1.9.7
//
// PURPOSE:
// Centralized event logging entry point.
//
// ALL tracker modules should log events through here.
// Future Timeline, CRM, Analytics, and AI systems will
// consume the same event stream.
// =====================================================

import {
  createJobApplicationEvent,
} from "./job-application-event-service"

import type {
  JobApplicationEventPayload,
} from "./types"

// =====================================================
// BLOCK: Event Logger
// =====================================================

export async function logJobApplicationEvent(
  payload: JobApplicationEventPayload,
): Promise<void> {
  try {
    const result =
      await createJobApplicationEvent(payload)

    if (result.status !== "success") {
      console.error(
        "[JobEventLogger]",
        result.message,
      )
    }
  } catch (error) {
    console.error(
      "[JobEventLogger]",
      error,
    )
  }
}
