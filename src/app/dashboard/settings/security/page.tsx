"use client"

// =====================================================
// BLOCK: Icon Imports
// =====================================================

import {
  KeyRound,
  Lock,
  MonitorSmartphone,
  ShieldCheck,
} from "lucide-react"

// =====================================================
// BLOCK: Layout Imports
// =====================================================

import { ModulePageLayout } from "@/components/layout/ModulePageLayout"
import { SettingsBackLink } from "@/components/settings/SettingsBackLink"
import { SettingsPageShell } from "@/components/settings/SettingsPageShell"

// =====================================================
// BLOCK: Security Settings Page
// =====================================================

export default function SecuritySettingsPage() {
  return (
    <ModulePageLayout
      title="Security Settings"
      description="Manage password recovery, authentication, and account protection."
    >
      <SettingsPageShell
        eyebrow="Account Settings"
        title="Security Center"
        description="Review account security status and future authentication controls."
      >
        <SettingsBackLink />

        <div className="grid gap-5">

          {/* =====================================================
              BLOCK: Security Status
          ===================================================== */}

          <section className="rounded-3xl border border-emerald-200 bg-emerald-50 p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <ShieldCheck
                size={22}
                className="text-emerald-700"
              />

              <div>
                <h3 className="font-black text-emerald-900">
                  Account Protected
                </h3>

                <p className="text-sm text-emerald-700">
                  Authentication is currently managed through Supabase.
                </p>
              </div>
            </div>
          </section>

          {/* =====================================================
              BLOCK: Security Actions
          ===================================================== */}

          <section className="grid gap-4 md:grid-cols-2">

            <SecurityCard
              icon={KeyRound}
              title="Reset Password"
              description="Request a password reset email through Supabase authentication."
              status="Available"
            />

            <SecurityCard
              icon={Lock}
              title="Email Verification"
              description="Verify and maintain a trusted login email address."
              status="Connected"
            />

            <SecurityCard
              icon={ShieldCheck}
              title="Two-Factor Authentication"
              description="Additional login protection planned for future release."
              status="Planned"
            />

            <SecurityCard
              icon={MonitorSmartphone}
              title="Device Management"
              description="Review and manage active login sessions."
              status="Planned"
            />

          </section>

        </div>
      </SettingsPageShell>
    </ModulePageLayout>
  )
}

// =====================================================
// BLOCK: Security Card Component
// =====================================================

function SecurityCard({
  icon: Icon,
  title,
  description,
  status,
}: {
  icon: React.ComponentType<{
    size?: number
    className?: string
  }>
  title: string
  description: string
  status: string
}) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start gap-4">
        <div className="rounded-2xl bg-blue-50 p-3 text-blue-700">
          <Icon size={20} />
        </div>

        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-black text-slate-950">
              {title}
            </h3>

            <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-black text-slate-600">
              {status}
            </span>
          </div>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            {description}
          </p>
        </div>
      </div>
    </div>
  )
}