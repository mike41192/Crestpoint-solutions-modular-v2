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
      <h3 className="text-lg font-black text-slate-950">
        Account Health
      </h3>

      <p className="mt-2 text-5xl font-black text-blue-700">
        {report.score}%
      </p>

      <div className="mt-5 grid gap-3">
        {report.checks.map(check => (
          <div
            key={check.label}
            className="flex items-center gap-3"
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