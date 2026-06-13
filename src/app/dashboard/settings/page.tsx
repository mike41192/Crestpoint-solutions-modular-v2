"use client"

// =====================================================
// BLOCK: React / Next Imports
// =====================================================

import { useEffect, useState } from "react"
import Link from "next/link"

// =====================================================
// BLOCK: Icon Imports
// =====================================================

import {
  ArrowRight,
  Bell,
  CreditCard,
  Lock,
  ShieldCheck,
  UserRound,
} from "lucide-react"

// =====================================================
// BLOCK: Layout Imports
// =====================================================

import { ModulePageLayout } from "@/components/layout/ModulePageLayout"
import { AccountHealthCard } from "@/components/settings/AccountHealthCard"

// =====================================================
// BLOCK: Account Health Imports
// =====================================================

import {
  calculateAccountHealth,
} from "@/modules/account-health/account-health-engine"
import type {
  AccountHealthReport,
} from "@/modules/account-health/types"

// =====================================================
// BLOCK: Settings Data Imports
// =====================================================

import {
  createEmptyUserProfile,
  loadCurrentUserProfile,
} from "@/modules/profile-management/profile-service"
import {
  createEmptyMembership,
  loadCurrentMembership,
} from "@/modules/membership-management/membership-service"
import {
  createDefaultPreferences,
  loadCurrentPreferences,
} from "@/modules/preferences-management/preferences-service"

// =====================================================
// BLOCK: Account Section Config
// =====================================================

const accountSections = [
  {
    title: "Profile Information",
    description:
      "Manage personal details, career goals, contact information, and profile preferences.",
    icon: UserRound,
    href: "/dashboard/settings/profile",
  },
  {
    title: "Membership Access",
    description:
      "Review your current tier and which Crestpoint modules are available to your account.",
    icon: CreditCard,
    href: "/dashboard/settings/billing",
  },
  {
    title: "Notification Preferences",
    description:
      "Control email updates, reminders, job alerts, and interview prep notifications.",
    icon: Bell,
    href: "/dashboard/settings/preferences",
  },
  {
    title: "Security",
    description:
      "Manage password reset, authentication, sessions, and account protection.",
    icon: Lock,
    href: "/dashboard/settings/security",
  },
]

// =====================================================
// BLOCK: Default Account Health
// =====================================================

const defaultAccountHealth: AccountHealthReport = calculateAccountHealth({
  profile: createEmptyUserProfile(),
  membership: createEmptyMembership(),
  preferences: createDefaultPreferences(),
})

// =====================================================
// BLOCK: Account Settings Page
// =====================================================

export default function AccountSettingsPage() {
  const [healthReport, setHealthReport] =
    useState<AccountHealthReport>(defaultAccountHealth)

  // =====================================================
  // BLOCK: Load Account Health Data
  // =====================================================

  useEffect(() => {
    async function loadAccountHealth() {
      try {
        const [profile, membership, preferences] = await Promise.all([
          loadCurrentUserProfile(),
          loadCurrentMembership(),
          loadCurrentPreferences(),
        ])

        const nextHealthReport = calculateAccountHealth({
          profile,
          membership,
          preferences,
        })

        setHealthReport(nextHealthReport)
      } catch {
        setHealthReport(defaultAccountHealth)
      }

    }

    loadAccountHealth()
  }, [])

  // =====================================================
  // BLOCK: Render
  // =====================================================

  return (
    <ModulePageLayout
      title="Account Settings"
      description="Manage your profile, membership access, notifications, and account security."
    >
      <div className="grid gap-6">
        {/* =====================================================
            BLOCK: Account Hero
        ===================================================== */}

        <section className="rounded-[28px] border border-slate-200 bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 p-6 text-white shadow-sm">
          <div>
            <div>
              <div className="mb-3 flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-blue-100">
                <ShieldCheck size={14} />
                Account Control Center
              </div>

              <h2 className="text-2xl font-black tracking-tight">
                Your Crestpoint account
              </h2>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">
                Keep your profile, access level, preferences, and security
                controls organized in one place.
              </p>
            </div>
          </div>
        </section>

        {/* =====================================================
            BLOCK: Account Health
        ===================================================== */}

        <AccountHealthCard report={healthReport} />

        {/* =====================================================
            BLOCK: Account Section Cards
        ===================================================== */}

        <section className="grid gap-5 md:grid-cols-2">
          {accountSections.map((section) => {
            const Icon = section.icon

            return (
              <Link
                key={section.title}
                href={section.href}
                className="group rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-md"
              >
                <article>
                  <div className="flex items-start gap-4">
                    <div className="rounded-2xl bg-blue-50 p-3 text-blue-700 transition group-hover:bg-blue-600 group-hover:text-white">
                      <Icon size={20} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <h2 className="text-lg font-black text-slate-950">
                        {section.title}
                      </h2>

                      <p className="mt-2 text-sm leading-6 text-slate-500">
                        {section.description}
                      </p>
                    </div>

                    <div className="mt-1 hidden rounded-full border border-slate-200 bg-slate-50 p-2 text-slate-400 transition group-hover:border-blue-200 group-hover:bg-blue-50 group-hover:text-blue-700 sm:block">
                      <ArrowRight size={16} />
                    </div>
                  </div>
                </article>
              </Link>
            )
          })}
        </section>
      </div>
    </ModulePageLayout>
  )
}
