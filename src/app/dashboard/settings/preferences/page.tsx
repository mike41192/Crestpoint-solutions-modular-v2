"use client"

// =====================================================
// BLOCK: React Imports
// =====================================================

import { useEffect, useState } from "react"

// =====================================================
// BLOCK: Icon Imports
// =====================================================

import {
  Bell,
  BriefcaseBusiness,
  Mail,
  Megaphone,
  MessageSquare,
} from "lucide-react"

// =====================================================
// BLOCK: Layout Imports
// =====================================================

import { ModulePageLayout } from "@/components/layout/ModulePageLayout"
import { SettingsBackLink } from "@/components/settings/SettingsBackLink"
import { SettingsPageShell } from "@/components/settings/SettingsPageShell"

// =====================================================
// BLOCK: Preferences Imports
// =====================================================

import {
  createDefaultPreferences,
  loadCurrentPreferences,
  saveCurrentPreferences,
} from "@/modules/preferences-management/preferences-service"
import type { UserPreferences } from "@/modules/preferences-management/types"

// =====================================================
// BLOCK: Notification Options
// =====================================================

const preferenceOptions: {
  key: keyof UserPreferences
  title: string
  description: string
  icon: React.ComponentType<{ size?: number; className?: string }>
}[] = [
  {
    key: "jobAlerts",
    title: "Job Alerts",
    description:
      "Receive updates about job opportunities, saved searches, and career matches.",
    icon: BriefcaseBusiness,
  },
  {
    key: "resumeReminders",
    title: "Resume Reminders",
    description:
      "Get reminders to update resumes, improve ATS scores, and review saved drafts.",
    icon: Mail,
  },
  {
    key: "interviewReminders",
    title: "Interview Reminders",
    description:
      "Receive preparation reminders for upcoming interviews and practice sessions.",
    icon: MessageSquare,
  },
  {
    key: "productUpdates",
    title: "Product Updates",
    description:
      "Get notified when new Crestpoint features, modules, and tools are released.",
    icon: Bell,
  },
  {
    key: "marketingEmails",
    title: "Marketing Emails",
    description:
      "Receive promotional content, offers, and career growth campaigns.",
    icon: Megaphone,
  },
]

// =====================================================
// BLOCK: Preferences Settings Page
// =====================================================

export default function PreferencesSettingsPage() {
  const [preferences, setPreferences] =
    useState<UserPreferences>(createDefaultPreferences())

  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  // =====================================================
  // BLOCK: Load Preferences
  // =====================================================

  useEffect(() => {
    async function loadPreferences() {
      try {
        const result = await loadCurrentPreferences()

        setPreferences(result)
      } catch {
        setMessage("Unable to load preferences. Defaults are being shown.")
      }

      setLoading(false)
    }

    loadPreferences()
  }, [])

  // =====================================================
  // BLOCK: Toggle Preference
  // =====================================================

  function togglePreference(key: keyof UserPreferences) {
    setPreferences((current) => ({
      ...current,
      [key]: !current[key],
    }))

    setMessage("")
  }

  // =====================================================
  // BLOCK: Save Preferences
  // =====================================================

  async function savePreferences() {
    setSaving(true)
    setMessage("")

    try {
      await saveCurrentPreferences(preferences)
      setMessage("Notification preferences saved.")
    } catch {
      setMessage("Unable to save preferences.")
    }

    setSaving(false)
  }

  // =====================================================
  // BLOCK: Render
  // =====================================================

  return (
    <ModulePageLayout
      title="Preferences"
      description="Manage notifications, reminders, and platform preferences."
    >
      <SettingsPageShell
        eyebrow="Account Settings"
        title="Notification Preferences"
        description="Control email updates, job alerts, interview reminders, product updates, and marketing preferences."
      >
        <SettingsBackLink />

        <div className="grid gap-5">
          <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <div>
              <h3 className="text-lg font-black text-slate-950">
                Communication Preferences
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                These settings are saved to your Crestpoint account and can be
                used for future alerts, reminders, and platform notifications.
              </p>
            </div>

            {loading ? (
              <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm font-semibold text-slate-500">
                Loading preferences...
              </div>
            ) : (
              <div className="mt-5 grid gap-3">
                {preferenceOptions.map((option) => {
                  const Icon = option.icon
                  const enabled = preferences[option.key]

                  return (
                    <button
                      key={option.key}
                      type="button"
                      onClick={() => togglePreference(option.key)}
                      className="flex items-start justify-between gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-left transition hover:border-blue-200 hover:bg-white"
                    >
                      <div className="flex items-start gap-3">
                        <div className="rounded-2xl bg-blue-50 p-3 text-blue-700">
                          <Icon size={18} />
                        </div>

                        <div>
                          <p className="text-sm font-black text-slate-950">
                            {option.title}
                          </p>

                          <p className="mt-1 text-sm leading-6 text-slate-500">
                            {option.description}
                          </p>
                        </div>
                      </div>

                      <span
                        className={`shrink-0 rounded-full px-3 py-1 text-xs font-black ${
                          enabled
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-slate-200 text-slate-500"
                        }`}
                      >
                        {enabled ? "On" : "Off"}
                      </span>
                    </button>
                  )
                })}
              </div>
            )}
          </section>

          {message && (
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700">
              {message}
            </div>
          )}

          <button
            type="button"
            onClick={savePreferences}
            disabled={saving || loading}
            className="w-fit rounded-full bg-blue-600 px-5 py-3 text-sm font-black text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-400"
          >
            {saving ? "Saving..." : "Save Preferences"}
          </button>
        </div>
      </SettingsPageShell>
    </ModulePageLayout>
  )
}