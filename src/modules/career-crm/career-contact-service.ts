// =====================================================
// BLOCK: Career Contact Service
// Crestpoint Solutions V2
// Version: 1.10.0
//
// NOTE:
// This service is intentionally API-route based so auth, ownership checks,
// RLS behavior, and future enforcement stay centralized on the server.
// =====================================================

import type {
  CareerContactPayload,
  CareerContactRecord,
  CareerContactsResponse,
} from "./types"

// =====================================================
// BLOCK: Fetch Helper
// =====================================================

async function parseResponse(
  response: Response,
): Promise<CareerContactsResponse> {
  const payload = (await response.json().catch(() => null)) as
    | CareerContactsResponse
    | null

  if (!payload) {
    return {
      status: "error",
      message: "Career contacts request failed.",
      contacts: [],
    }
  }

  return payload
}

// =====================================================
// BLOCK: Public Service Functions
// =====================================================

export async function listCareerContacts(): Promise<CareerContactRecord[]> {
  const response = await fetch("/api/career-contacts/list", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })

  const payload = await parseResponse(response)

  return payload.contacts || []
}

export async function createCareerContact(
  contact: CareerContactPayload,
): Promise<CareerContactsResponse> {
  const response = await fetch("/api/career-contacts/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(contact),
  })

  return parseResponse(response)
}

export async function updateCareerContact(
  contact: CareerContactPayload,
): Promise<CareerContactsResponse> {
  const response = await fetch("/api/career-contacts/update", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(contact),
  })

  return parseResponse(response)
}

export async function deleteCareerContact(
  id: string,
): Promise<CareerContactsResponse> {
  const response = await fetch("/api/career-contacts/delete", {
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
