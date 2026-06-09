"use client"

// =====================================================
// BLOCK: React Imports
// Crestpoint Solutions V2
// Version: 1.10.0
// =====================================================

import { useEffect, useState } from "react"

// =====================================================
// BLOCK: Icon Imports
// =====================================================

import { Bell, Mail, Save, ShieldCheck } from "lucide-react"

// =====================================================
// BLOCK: Layout Imports
// =====================================================

import { ModulePageLayout } from "@/components/layout/ModulePageLayout"
import { SettingsPageShell } from "@/components/settings/SettingsPageShell"

// =====================================================
// BLOCK: Supabase Imports
// =====================================================

import { createSupabaseBrowserClient } from "@/lib/supabase/client"

// =====================================================
// BLOCK: Types
// =====================================================

type AlternateEmailUsage = {
  jobAlerts: boolean
  networking: boolean
  accountNotices: boolean
}

// =====================================================
// BLOCK: Email Settings Page
// =====================================================

export default function EmailSecuritySettingsPage() {
  const [primaryEmail, setPrimaryEmail] = useState("")
  const [nextPrimaryEmail, setNextPrimaryEmail] = useState("")
  const [alternateEmail, setAlternateEmail] = useState("")
  const [usage, setUsage] = useState<AlternateEmailUsage>({
    jobAlerts: false,
    networking: false,
    accountNotices: false,
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState("")

  useEffect(() => {
    async function loadEmailSettings() {
      const supabase = createSupabaseBrowserClient()

      const {
        data: { user },
        error,
      } = await supabase.auth.getUser()

      if (error || !user) {
        setMessage("Unable to load email settings.")
        setLoading(false)
        return
      }

      const metadata = user.user_metadata || {}
      const storedAlternateEmail =
        typeof metadata.alternate_email === "string"
          ? metadata.alternate_email
          : ""
      const storedUsage =
        typeof metadata.alternate_email_usage === "object" &&
        metadata.alternate_email_usage
          ? metadata.alternate_email_usage
          : {}

      setPrimaryEmail(user.email || "")
      setNextPrimaryEmail(user.email || "")
      setAlternateEmail(storedAlternateEmail)
      setUsage({
        jobAlerts: Boolean((storedUsage as AlternateEmailUsage).jobAlerts),
        networking: Boolean((storedUsage as AlternateEmailUsage).networking),
        accountNotices: Boolean(
          (storedUsage as AlternateEmailUsage).accountNotices,
        ),
      })
      setLoading(false)
    }

    loadEmailSettings()
  }, [])

  function toggleUsage(key: keyof AlternateEmailUsage) {
    setUsage((current) => ({
      ...current,
      [key]: !current[key],
    }))
    setMessage("")
  }

  async function saveEmailSettings() {
    setSaving(true)
    setMessage("")

    const supabase = createSupabaseBrowserClient()

    if (nextPrimaryEmail.trim() && nextPrimaryEmail.trim() !== primaryEmail) {
      const { error } = await supabase.auth.updateUser({
        email: nextPrimaryEmail.trim(),
      })

      if (error) {
        setMessage(error.message)
        setSaving(false)
        return
      }
    }

    const { error } = await supabase.auth.updateUser({
      data: {
        alternate_email: alternateEmail.trim(),
        alternate_email_usage: usage,
      },
    })

    if (error) {
      setMessage(error.message)
    } else if (nextPrimaryEmail.trim() !== primaryEmail) {
      setMessage(
        "Email settings saved. Check the new primary email inbox to confirm the change.",
      )
    } else {
      setMessage("Email settings saved.")
    }

    setSaving(false)
  }

  return (
    <ModulePageLayout
      title="Email Security"
      description="Manage your primary login email and alternate email usage."
    >
      <SettingsPageShell
        eyebrow="Security Settings"
        title="Email Verification"
        description="Review your login email, request a primary email change, and store alternate email preferences."
      >
        <div className="grid gap-5">
          <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-start gap-3 border-b border-slate-200 pb-5">
              <div className="rounded-2xl bg-blue-50 p-3 text-blue-700">
                <Mail size={20} />
              </div>

              <div>
                <h3 className="text-lg font-black text-slate-950">
                  Primary Login Email
                </h3>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                  Your primary email is controlled by Supabase Auth. Changing it
                  may require confirmation from the new address.
                </p>
              </div>
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-sm font-black text-slate-700">
                  Current Email
                </span>

                <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                  <ShieldCheck size={17} className="shrink-0 text-slate-400" />

                  <input
                    value={loading ? "Loading..." : primaryEmail}
                    readOnly
                    className="w-full min-w-0 bg-transparent text-sm font-semibold text-slate-700 outline-none"
                  />
                </div>
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-black text-slate-700">
                  New Primary Email
                </span>

                <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 transition focus-within:border-blue-500 focus-within:bg-white focus-within:ring-4 focus-within:ring-blue-100">
                  <Mail size={17} className="shrink-0 text-slate-400" />

                  <input
                    value={nextPrimaryEmail}
                    onChange={(event) => setNextPrimaryEmail(event.target.value)}
                    placeholder="name@example.com"
                    type="email"
                    className="w-full min-w-0 bg-transparent text-sm font-semibold text-slate-900 outline-none placeholder:text-slate-400"
                  />
                </div>
              </label>
            </div>
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-start gap-3 border-b border-slate-200 pb-5">
              <div className="rounded-2xl bg-blue-50 p-3 text-blue-700">
                <Bell size={20} />
              </div>

              <div>
                <h3 className="text-lg font-black text-slate-950">
                  Alternate Email Usage
                </h3>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                  Store an alternate email in Supabase user metadata for future
                  alerts and relationship workflows.
                </p>
              </div>
            </div>

            <label className="mt-5 block">
              <span className="mb-2 block text-sm font-black text-slate-700">
                Alternate Email
              </span>

              <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 transition focus-within:border-blue-500 focus-within:bg-white focus-within:ring-4 focus-within:ring-blue-100">
                <Mail size={17} className="shrink-0 text-slate-400" />

                <input
                  value={alternateEmail}
                  onChange={(event) => setAlternateEmail(event.target.value)}
                  placeholder="alternate@example.com"
                  type="email"
                  className="w-full min-w-0 bg-transparent text-sm font-semibold text-slate-900 outline-none placeholder:text-slate-400"
                />
              </div>
            </label>

            <div className="mt-5 grid gap-3 md:grid-cols-3">
              <UsageToggle
                label="Job Alerts"
                enabled={usage.jobAlerts}
                onToggle={() => toggleUsage("jobAlerts")}
              />
              <UsageToggle
                label="Networking"
                enabled={usage.networking}
                onToggle={() => toggleUsage("networking")}
              />
              <UsageToggle
                label="Account Notices"
                enabled={usage.accountNotices}
                onToggle={() => toggleUsage("accountNotices")}
              />
            </div>
          </section>

          {message && (
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700">
              {message}
            </div>
          )}

          <button
            type="button"
            onClick={saveEmailSettings}
            disabled={saving || loading}
            className="inline-flex w-fit items-center gap-2 rounded-full bg-blue-600 px-5 py-3 text-sm font-black text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-400"
          >
            <Save size={16} />
            {saving ? "Saving..." : "Save Email Settings"}
          </button>
        </div>
      </SettingsPageShell>
    </ModulePageLayout>
  )
}

function UsageToggle({
  label,
  enabled,
  onToggle,
}: {
  label: string
  enabled: boolean
  onToggle: () => void
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-left transition hover:border-blue-200 hover:bg-white"
    >
      <span className="text-sm font-black text-slate-800">{label}</span>

      <span
        className={`relative h-7 w-12 rounded-full transition ${
          enabled ? "bg-blue-600" : "bg-slate-300"
        }`}
      >
        <span
          className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow-sm transition ${
            enabled ? "left-6" : "left-1"
          }`}
        />
      </span>
    </button>
  )
}
