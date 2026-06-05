// =====================================================
// BLOCK: Supabase Imports
// =====================================================

import { createSupabaseBrowserClient } from "@/lib/supabase/client"

// =====================================================
// BLOCK: Type Imports
// =====================================================

import type { UserPreferences } from "./types"

// =====================================================
// BLOCK: Empty Preferences
// =====================================================

export function createDefaultPreferences(): UserPreferences {
  return {
    jobAlerts: true,
    resumeReminders: true,
    interviewReminders: true,
    productUpdates: true,
    marketingEmails: false,
  }
}

// =====================================================
// BLOCK: Load Preferences
// =====================================================

export async function loadCurrentPreferences(): Promise<UserPreferences> {
  const supabase = createSupabaseBrowserClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return createDefaultPreferences()
  }

  const { data } = await supabase
    .from("user_preferences")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle()

  if (!data) {
    return createDefaultPreferences()
  }

  return {
    jobAlerts: data.job_alerts,
    resumeReminders: data.resume_reminders,
    interviewReminders: data.interview_reminders,
    productUpdates: data.product_updates,
    marketingEmails: data.marketing_emails,
  }
}

// =====================================================
// BLOCK: Save Preferences
// =====================================================

export async function saveCurrentPreferences(
  preferences: UserPreferences,
) {
  const supabase = createSupabaseBrowserClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error("User not authenticated")
  }

  const { error } = await supabase
    .from("user_preferences")
    .upsert({
      user_id: user.id,

      job_alerts: preferences.jobAlerts,
      resume_reminders: preferences.resumeReminders,
      interview_reminders: preferences.interviewReminders,
      product_updates: preferences.productUpdates,
      marketing_emails: preferences.marketingEmails,
    })

  if (error) {
    throw error
  }
}