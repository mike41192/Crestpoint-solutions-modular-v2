// =====================================================
// BLOCK: Supabase Imports
// Crestpoint Solutions V2
// Version: 1.7.5
// =====================================================

import { createSupabaseBrowserClient } from "@/lib/supabase/client"

// =====================================================
// BLOCK: Type Imports
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
// BLOCK: Database Row Type
// =====================================================

type ProfileRow = {
  id: string
  full_name: string | null
  phone: string | null
  location: string | null
  linkedin_url: string | null
  website_url: string | null
}

// =====================================================
// BLOCK: Database Mapper
// =====================================================

function mapProfileRowToUserProfile({
  row,
  email,
}: {
  row: ProfileRow | null
  email: string
}): UserProfileData {
  return {
    fullName: row?.full_name || "",
    email,
    phone: row?.phone || "",
    location: row?.location || "",
    linkedIn: row?.linkedin_url || "",
    website: row?.website_url || "",
  }
}

// =====================================================
// BLOCK: Load Current User Profile
// =====================================================

export async function loadCurrentUserProfile(): Promise<UserProfileData> {
  const supabase = createSupabaseBrowserClient()

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    return createEmptyUserProfile()
  }

  const { data, error } = await supabase
    .from("profiles")
    .select("id, full_name, phone, location, linkedin_url, website_url")
    .eq("id", user.id)
    .maybeSingle()

  if (error) {
    return {
      ...createEmptyUserProfile(),
      email: user.email || "",
    }
  }

  return mapProfileRowToUserProfile({
    row: data,
    email: user.email || "",
  })
}

// =====================================================
// BLOCK: Save Current User Profile
// =====================================================

export async function saveCurrentUserProfile(
  profile: UserProfileData,
): Promise<ProfileSaveResult> {
  const supabase = createSupabaseBrowserClient()

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    return {
      status: "error",
      message: "You must be signed in to update your profile.",
    }
  }

  const { error } = await supabase.from("profiles").upsert({
    id: user.id,
    full_name: profile.fullName,
    phone: profile.phone,
    location: profile.location,
    linkedin_url: profile.linkedIn,
    website_url: profile.website,
  })

  if (error) {
    return {
      status: "error",
      message: error.message,
    }
  }

  return {
    status: "success",
    message: "Profile saved successfully.",
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