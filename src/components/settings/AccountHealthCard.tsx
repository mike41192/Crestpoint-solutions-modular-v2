"use client"

// =====================================================
// BLOCK: Type Imports
// =====================================================

import type {
  AccountHealthReport,
} from "@/modules/account-health/types"

// =====================================================
// BLOCK: Icon Imports
// =====================================================

import {
  CheckCircle2,
  XCircle,
} from "lucide-react"

// =====================================================
// BLOCK: Account Health Card
// =====================================================

export function AccountHealthCard({
  report,
}: {
  report: AccountHealthReport
}) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.16em] text-blue-600">
            Account Readiness
          </p>

          <h3 className="mt-2 text-xl font-black text-slate-950">
            Account Health
          </h3>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            Keep your profile, membership, preferences, and security settings
            ready for the full Career OS workflow.
          </p>
        </div>

        <div className="rounded-3xl border border-blue-100 bg-blue-50 px-6 py-5 text-center">
          <p className="text-5xl font-black text-blue-700">
            {report.score}%
          </p>

          <p className="mt-1 text-xs font-black uppercase tracking-[0.14em] text-blue-700">
            Complete
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-2">
        {report.checks.map(check => (
          <div
            key={check.label}
            className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4"
          >
            {check.completed ? (
              <CheckCircle2
                size={18}
                className="text-emerald-600"
              />
            ) : (
              <XCircle
                size={18}
                className="text-red-500"
              />
            )}

            <span className="text-sm font-semibold">
              {check.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
