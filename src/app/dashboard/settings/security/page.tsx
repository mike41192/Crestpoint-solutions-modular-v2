"use client"

// =====================================================
// BLOCK: Next Imports
// =====================================================

import Link from "next/link"

// =====================================================
// BLOCK: Icon Imports
// =====================================================

import {
  ArrowRight,
  KeyRound,
  Lock,
  MonitorSmartphone,
  ShieldCheck,
} from "lucide-react"

// =====================================================
// BLOCK: Layout Imports
// =====================================================

import { ModulePageLayout } from "@/components/layout/ModulePageLayout"
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
        <div className="grid gap-5">

          {/* =====================================================
              BLOCK: Security Status
          ===================================================== */}

          <section className="rounded-3xl border border-emerald-200 bg-emerald-50 p-5 shadow-sm">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-white p-3 text-emerald-700 shadow-sm">
                  <ShieldCheck size={22} />
                </div>

                <div>
                  <h3 className="font-black text-emerald-900">
                    Account Protected
                  </h3>

                  <p className="mt-1 text-sm font-semibold text-emerald-700">
                    Authentication is currently managed through Supabase.
                  </p>
                </div>
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
              description="Update your password from the secure reset screen."
              href="/auth/reset-password"
            />

            <SecurityCard
              icon={Lock}
              title="Email Verification"
              description="Manage your primary login email and alternate email usage."
              href="/dashboard/settings/security/email"
            />

            <SecurityCard
              icon={ShieldCheck}
              title="Two-Factor Authentication"
              description="Enable or manage authenticator app protection for login."
              href="/dashboard/settings/security/two-factor"
            />

            <SecurityCard
              icon={MonitorSmartphone}
              title="Device Management"
              description="Review and manage active login sessions."
              href="/dashboard/settings/security/devices"
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
  href,
}: {
  icon: React.ComponentType<{
    size?: number
    className?: string
  }>
  title: string
  description: string
  href: string
}) {
  return (
    <Link
      href={href}
      className="group rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-md"
    >
      <div className="flex items-start gap-4">
        <div className="rounded-2xl bg-blue-50 p-3 text-blue-700 transition group-hover:bg-blue-600 group-hover:text-white">
          <Icon size={20} />
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="font-black text-slate-950">
            {title}
          </h3>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            {description}
          </p>
        </div>

        <div className="hidden rounded-full border border-slate-200 bg-slate-50 p-2 text-slate-400 transition group-hover:border-blue-200 group-hover:bg-blue-50 group-hover:text-blue-700 sm:block">
          <ArrowRight size={16} />
        </div>
      </div>
    </Link>
  )
}
