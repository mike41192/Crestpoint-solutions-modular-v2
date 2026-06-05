"use client"

// =====================================================
// BLOCK: React Imports
// =====================================================

import { useEffect, useState } from "react"

// =====================================================
// BLOCK: Icon Imports
// =====================================================

import {
  BarChart3,
  CheckCircle2,
  CreditCard,
  FileText,
  Sparkles,
  Target,
} from "lucide-react"

// =====================================================
// BLOCK: Layout Imports
// =====================================================

import { ModulePageLayout } from "@/components/layout/ModulePageLayout"
import { SettingsBackLink } from "@/components/settings/SettingsBackLink"
import { SettingsPageShell } from "@/components/settings/SettingsPageShell"

// =====================================================
// BLOCK: Membership Imports
// =====================================================

import {
  createEmptyMembership,
  loadCurrentMembership,
} from "@/modules/membership-management/membership-service"
import type { MembershipData } from "@/modules/membership-management/types"

// =====================================================
// BLOCK: Usage Tracking Imports
// =====================================================

import {
  createEmptyUsage,
  loadCurrentUsage,
} from "@/modules/usage-tracking"
import type { UserUsageData } from "@/modules/usage-tracking"

// =====================================================
// BLOCK: Billing Settings Page
// =====================================================

export default function BillingSettingsPage() {
  const [membership, setMembership] = useState<MembershipData>(
    createEmptyMembership(),
  )

  const [usage, setUsage] = useState<UserUsageData>(createEmptyUsage())

  const [loading, setLoading] = useState(true)

  // =====================================================
  // BLOCK: Load Current Membership + Usage
  // =====================================================

  useEffect(() => {
    async function loadMembershipData() {
      const [membershipResult, usageResult] = await Promise.all([
        loadCurrentMembership(),
        loadCurrentUsage(),
      ])

      setMembership(membershipResult)
      setUsage(usageResult)
      setLoading(false)
    }

    loadMembershipData()
  }, [])

  // =====================================================
  // BLOCK: Render
  // =====================================================

  return (
    <ModulePageLayout
      title="Membership Access"
      description="Manage your Crestpoint subscription and membership access."
    >
      <SettingsPageShell
        eyebrow="Account Settings"
        title="Membership Access"
        description="View your current plan, module access, and future billing controls."
      >
        <SettingsBackLink />

        <div className="grid gap-5">
          {/* =====================================================
              BLOCK: Membership Overview
          ===================================================== */}

          <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <div className="mb-3 flex w-fit items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-black uppercase tracking-[0.16em] text-blue-700">
                  <CreditCard size={14} />
                  Current Plan
                </div>

                <h3 className="text-2xl font-black capitalize text-slate-950">
                  {loading ? "Loading..." : membership.planName}
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Your membership controls access to Crestpoint resume, ATS,
                  interview, and career optimization modules.
                </p>
              </div>

              <div className="rounded-3xl border border-emerald-100 bg-emerald-50 p-4">
                <p className="text-xs font-black uppercase tracking-[0.16em] text-emerald-700">
                  Status
                </p>

                <p className="mt-2 text-lg font-black capitalize text-emerald-900">
                  {membership.status}
                </p>

                <p className="mt-1 text-sm font-semibold text-emerald-700">
                  Billing portal coming soon
                </p>
              </div>
            </div>
          </section>

          {/* =====================================================
              BLOCK: Usage Summary
          ===================================================== */}

          <section className="grid gap-5 lg:grid-cols-3">
            <UsageCard
              title="Saved Resumes"
              icon={FileText}
              used={usage.resumesCreated}
              limit={membership.resumeLimit}
            />

            <UsageCard
              title="ATS Scans"
              icon={Target}
              used={usage.atsScansUsed}
              limit={membership.atsLimit}
            />

            <UsageCard
              title="AI Rewrites"
              icon={Sparkles}
              used={usage.aiRewritesUsed}
              limit={membership.rewriteLimit}
            />
          </section>

          {/* =====================================================
              BLOCK: Module Access
          ===================================================== */}

          <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-2">
              <BarChart3 size={18} className="text-blue-700" />
              <h3 className="text-lg font-black text-slate-950">
                Module Access
              </h3>
            </div>

            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {[
                "Resume Builder",
                "ATS Scoring",
                "AI Resume Optimization",
                "Interview Prep",
                "Resume Library",
                "Version History",
              ].map((module) => (
                <div
                  key={module}
                  className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4"
                >
                  <CheckCircle2 size={17} className="text-emerald-600" />

                  <p className="text-sm font-black text-slate-800">
                    {module}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* =====================================================
              BLOCK: Stripe Placeholder
          ===================================================== */}

          <section className="rounded-3xl border border-amber-200 bg-amber-50 p-5 shadow-sm">
            <h3 className="text-lg font-black text-amber-950">
              Billing Portal Coming Soon
            </h3>

            <p className="mt-2 text-sm leading-6 text-amber-800">
              Stripe checkout, subscription management, plan upgrades, and
              invoice access will be connected during the billing integration
              phase.
            </p>
          </section>
        </div>
      </SettingsPageShell>
    </ModulePageLayout>
  )
}

// =====================================================
// BLOCK: Usage Card Component
// =====================================================

function UsageCard({
  title,
  icon: Icon,
  used,
  limit,
}: {
  title: string
  icon: React.ComponentType<{ size?: number; className?: string }>
  used: number
  limit: number
}) {
  const safeLimit = Math.max(limit, 1)
  const percent = Math.min(Math.round((used / safeLimit) * 100), 100)

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div className="rounded-2xl bg-blue-50 p-3 text-blue-700">
          <Icon size={20} />
        </div>

        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-600">
          {percent}%
        </span>
      </div>

      <h3 className="mt-4 text-lg font-black text-slate-950">{title}</h3>

      <p className="mt-1 text-sm font-semibold text-slate-500">
        {used} of {limit} used
      </p>

      <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-200">
        <div
          className="h-full rounded-full bg-blue-600"
          style={{
            width: `${percent}%`,
          }}
        />
      </div>
    </div>
  )
}