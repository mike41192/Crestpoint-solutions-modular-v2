// =====================================================
// BLOCK: Authenticated Session Service
// Crestpoint Solutions V2
// Version: 1.10.0
// =====================================================

import type {
  AuthenticatedSessionRecord,
  AuthenticatedSessionsResponse,
} from "./types"

// =====================================================
// BLOCK: Fetch Helper
// =====================================================

async function parseResponse(
  response: Response,
): Promise<AuthenticatedSessionsResponse> {
  const payload = (await response.json().catch(() => null)) as
    | AuthenticatedSessionsResponse
    | null

  if (!payload) {
    return {
      status: "error",
      message: "Device management request failed.",
      sessions: [],
    }
  }

  return payload
}

// =====================================================
// BLOCK: Public Service Functions
// =====================================================

export async function listAuthenticatedSessions(): Promise<
  AuthenticatedSessionRecord[]
> {
  const response = await fetch("/api/authenticated-sessions/list", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })

  const payload = await parseResponse(response)

  return payload.sessions || []
}

export async function revokeAuthenticatedSession(
  id: string,
): Promise<AuthenticatedSessionsResponse> {
  const response = await fetch("/api/authenticated-sessions/revoke", {
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
