// =====================================================
// BLOCK: Type Imports
// Crestpoint Solutions V2
// Version: 1.10.0
// =====================================================

import type { ProfileSaveResult, UserProfileData } from "./types"

// =====================================================
// BLOCK: Empty Profile Factory
// =====================================================

export function createEmptyUserProfile(): UserProfileData {
  return {
    fullName: "",
    email: "",
    phone: "",
    location: "",
    linkedIn: "",
    website: "",
  }
}

// =====================================================
// BLOCK: Response Mapping
// =====================================================

function mapProfileResponse(value: unknown): UserProfileData {
  const profile =
    value && typeof value === "object"
      ? (value as Partial<UserProfileData>)
      : {}

  return {
    fullName: profile.fullName || "",
    email: profile.email || "",
    phone: profile.phone || "",
    location: profile.location || "",
    linkedIn: profile.linkedIn || "",
    website: profile.website || "",
  }
}

// =====================================================
// BLOCK: Load Current User Profile
// =====================================================

export async function loadCurrentUserProfile(): Promise<UserProfileData> {
  try {
    const response = await fetch("/api/user/profile", {
      method: "GET",
      cache: "no-store",
    })

    const result = await response.json()

    if (!response.ok || result.status !== "success") {
      return createEmptyUserProfile()
    }

    return mapProfileResponse(result.profile)
  } catch {
    return createEmptyUserProfile()
  }
}

// =====================================================
// BLOCK: Save Current User Profile
// =====================================================

export async function saveCurrentUserProfile(
  profile: UserProfileData,
): Promise<ProfileSaveResult> {
  try {
    const response = await fetch("/api/user/profile", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ profile }),
    })

    const result = await response.json()

    if (!response.ok || result.status !== "success") {
      return {
        status: "error",
        message: result.message || "Profile could not be saved.",
      }
    }

    return {
      status: "success",
      message: result.message || "Profile saved successfully.",
    }
  } catch {
    return {
      status: "error",
      message: "Profile update request failed.",
    }
  }
}

// =====================================================
// BLOCK: Legacy Local Save Support
// Kept temporarily for fallback compatibility.
// =====================================================

export async function saveUserProfileLocally(
  profile: UserProfileData,
): Promise<ProfileSaveResult> {
  localStorage.setItem("crestpoint-user-profile", JSON.stringify(profile))

  return {
    status: "success",
    message: "Profile saved locally.",
  }
}

// =====================================================
// BLOCK: Legacy Local Load Support
// Kept temporarily for fallback compatibility.
// =====================================================

export function loadUserProfileLocally(): UserProfileData | null {
  const stored = localStorage.getItem("crestpoint-user-profile")

  if (!stored) return null

  try {
    return JSON.parse(stored) as UserProfileData
  } catch {
    return null
  }
}
