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

import { Laptop, MonitorSmartphone, ShieldCheck, Smartphone } from "lucide-react"

// =====================================================
// BLOCK: Layout Imports
// =====================================================

import { ModulePageLayout } from "@/components/layout/ModulePageLayout"
import { SettingsPageShell } from "@/components/settings/SettingsPageShell"

// =====================================================
// BLOCK: Account Security Imports
// =====================================================

import {
  listAuthenticatedSessions,
  revokeAuthenticatedSession,
  type AuthenticatedSessionRecord,
} from "@/modules/account-security"

// =====================================================
// BLOCK: Device Management Page
// =====================================================

export default function DeviceManagementSettingsPage() {
  const [sessions, setSessions] = useState<AuthenticatedSessionRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState("")

  async function loadSessions() {
    setLoading(true)
    setMessage("")

    const records = await listAuthenticatedSessions()

    setSessions(records)
    setLoading(false)
  }

  useEffect(() => {
    loadSessions()
  }, [])

  async function handleRevoke(session: AuthenticatedSessionRecord) {
    const confirmed = window.confirm(
      `Revoke "${session.device_label || "this device"}"?`,
    )

    if (!confirmed) {
      return
    }

    const result = await revokeAuthenticatedSession(session.id)

    if (result.status !== "success") {
      setMessage(result.message || "Unable to revoke device session.")
      return
    }

    setMessage("Device session revoked.")
    await loadSessions()
  }

  return (
    <ModulePageLayout
      title="Device Management"
      description="Review known account sessions and revoke device access records."
    >
      <SettingsPageShell
        eyebrow="Security Settings"
        title="Device Management"
        description="Track sign-ins recorded by Crestpoint and mark stale or unrecognized device sessions as revoked."
      >
        <div className="grid gap-5">
          <section className="rounded-3xl border border-blue-100 bg-blue-50 p-5 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="rounded-2xl bg-white p-3 text-blue-700 shadow-sm">
                <MonitorSmartphone size={22} />
              </div>

              <div>
                <h3 className="text-lg font-black text-blue-950">
                  Known Device Sessions
                </h3>

                <p className="mt-2 text-sm leading-6 text-blue-800">
                  New sign-ins are recorded in `authenticated_sessions`. Revoked
                  rows are retained as an account security audit trail.
                </p>
              </div>
            </div>
          </section>

          {message && (
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700">
              {message}
            </div>
          )}

          {loading ? (
            <div className="rounded-3xl border border-slate-200 bg-white p-6 text-sm font-bold text-slate-500 shadow-sm">
              Loading device sessions...
            </div>
          ) : sessions.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-8 text-center shadow-sm">
              <h3 className="text-xl font-black text-slate-950">
                No device sessions recorded yet
              </h3>

              <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-slate-500">
                Sign out and sign back in to register this device in the new
                session ledger.
              </p>
            </div>
          ) : (
            <section className="grid gap-4">
              {sessions.map((session) => (
                <DeviceSessionCard
                  key={session.id}
                  session={session}
                  onRevoke={handleRevoke}
                />
              ))}
            </section>
          )}
        </div>
      </SettingsPageShell>
    </ModulePageLayout>
  )
}

function DeviceSessionCard({
  session,
  onRevoke,
}: {
  session: AuthenticatedSessionRecord
  onRevoke: (session: AuthenticatedSessionRecord) => void
}) {
  const Icon = session.device_type === "mobile" ? Smartphone : Laptop
  const revoked = Boolean(session.revoked_at)

  return (
    <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex items-start gap-3">
        <div className="rounded-2xl bg-blue-50 p-3 text-blue-700">
          <Icon size={20} />
        </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-black text-slate-950">
                {session.device_label || "Unknown Device"}
              </h3>

              <span
                className={`rounded-full px-2.5 py-1 text-xs font-black ${
                  revoked
                    ? "bg-red-50 text-red-700"
                    : "bg-emerald-50 text-emerald-700"
                }`}
              >
                {revoked ? "Revoked" : "Active"}
              </span>
            </div>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              {session.browser || "Unknown Browser"} ·{" "}
              {session.operating_system || "Unknown OS"} ·{" "}
              {session.device_type || "unknown"}
            </p>

            <p className="mt-1 text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">
              Last seen {formatDate(session.last_seen_at)}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onRevoke(session)}
          disabled={revoked}
          className="inline-flex w-fit items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-black text-slate-700 transition hover:border-red-200 hover:bg-red-50 hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <ShieldCheck size={15} />
          {revoked ? "Revoked" : "Revoke"}
        </button>
      </div>
    </article>
  )
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value))
}
