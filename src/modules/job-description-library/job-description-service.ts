// =====================================================
// BLOCK: Imports
// Crestpoint Solutions V2
// Version: 1.8.1
// =====================================================

import { createSupabaseBrowserClient } from "@/lib/supabase/client"

import type {
  CreateJobDescriptionInput,
  JobDescriptionRecord,
  UpdateJobDescriptionInput,
} from "./types"

// =====================================================
// BLOCK: Constants
// =====================================================

const TABLE_NAME = "job_descriptions"

// =====================================================
// BLOCK: Mapper
// =====================================================

function mapJobDescriptionRecord(item: any): JobDescriptionRecord {
  return {
    id: item.id,
    userId: item.user_id,
    title: item.title || "Untitled Job Description",
    company: item.company || "",
    role: item.role || "",
    location: item.location || "",
    description: item.description || "",
    sourceUrl: item.source_url || "",
    status: item.status || "active",
    createdAt: item.created_at,
    updatedAt: item.updated_at,
  }
}

// =====================================================
// BLOCK: Current User Helper
// =====================================================

async function getCurrentUserId(): Promise<string | null> {
  const supabase = createSupabaseBrowserClient()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    return null
  }

  return user.id
}

// =====================================================
// BLOCK: Create Job Description
// =====================================================

export async function createJobDescription(
  payload: CreateJobDescriptionInput,
): Promise<JobDescriptionRecord | null> {
  const supabase = createSupabaseBrowserClient()
  const userId = await getCurrentUserId()

  if (!userId) {
    return null
  }

  const { data, error } = await supabase
    .from(TABLE_NAME)
    .insert({
      user_id: userId,
      title: payload.title || "Untitled Job Description",
      company: payload.company || "",
      role: payload.role || "",
      location: payload.location || "",
      description: payload.description,
      source_url: payload.sourceUrl || "",
      status: payload.status || "active",
    })
    .select("*")
    .maybeSingle()

  if (error || !data) {
    return null
  }

  return mapJobDescriptionRecord(data)
}

// =====================================================
// BLOCK: Load Job Descriptions
// =====================================================

export async function loadJobDescriptions(): Promise<JobDescriptionRecord[]> {
  const supabase = createSupabaseBrowserClient()

  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select("*")
    .order("updated_at", { ascending: false })

  if (error || !data) {
    return []
  }

  return data.map(mapJobDescriptionRecord)
}

// =====================================================
// BLOCK: Load One Job Description
// =====================================================

export async function loadJobDescriptionById(
  id: string,
): Promise<JobDescriptionRecord | null> {
  const supabase = createSupabaseBrowserClient()

  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select("*")
    .eq("id", id)
    .maybeSingle()

  if (error || !data) {
    return null
  }

  return mapJobDescriptionRecord(data)
}

// =====================================================
// BLOCK: Update Job Description
// =====================================================

export async function updateJobDescription(
  id: string,
  payload: UpdateJobDescriptionInput,
): Promise<JobDescriptionRecord | null> {
  const supabase = createSupabaseBrowserClient()

  const { data, error } = await supabase
    .from(TABLE_NAME)
    .update({
      title: payload.title || "Untitled Job Description",
      company: payload.company || "",
      role: payload.role || "",
      location: payload.location || "",
      description: payload.description,
      source_url: payload.sourceUrl || "",
      status: payload.status || "active",
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select("*")
    .maybeSingle()

  if (error || !data) {
    return null
  }

  return mapJobDescriptionRecord(data)
}

// =====================================================
// BLOCK: Delete Job Description
// =====================================================

export async function deleteJobDescription(id: string): Promise<boolean> {
  const supabase = createSupabaseBrowserClient()

  const { error } = await supabase.from(TABLE_NAME).delete().eq("id", id)

  return !error
}
