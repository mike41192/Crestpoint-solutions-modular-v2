"use client"

// =====================================================
// BLOCK: Imports
// Crestpoint Solutions V2
// Version: 1.8.5
// =====================================================

import { Factory } from "lucide-react"
import type { IndustryGapItem } from "@/modules/ats-intelligence"

// =====================================================
// BLOCK: Component Types
// =====================================================

type IndustryReadinessCardProps = {
  industry: string
  score: number
  gaps: IndustryGapItem[]
}

// =====================================================
// BLOCK: Industry Readiness Card Component
// =====================================================

export function IndustryReadinessCard({
  industry,
  score,
  gaps,
}: IndustryReadinessCardProps) {
  const highPriorityGaps = gaps.filter((gap) => gap.priority === "high")

  return (
    <div className="grid gap-4 rounded-3xl border border-blue-100 bg-white p-4 shadow-sm sm:p-5 lg:grid-cols-[260px_minmax(0,1fr)]">
      <div className="rounded-3xl border border-blue-100 bg-blue-50 p-4">
        <div className="mb-3 flex items-center gap-2 text-blue-700">
          <Factory size={18} />
          <p className="text-sm font-black">Industry Readiness</p>
        </div>

        <p className="text-5xl font-black text-slate-950">{score}</p>
        <p className="mt-1 text-sm font-bold text-slate-500">/ 100</p>

        <p className="mt-4 text-sm font-black text-slate-800">{industry}</p>
        <p className="mt-1 text-xs font-semibold leading-5 text-slate-500">
          Scored using industry-specific ATS weights and evidence checks.
        </p>
      </div>

      <div className="grid gap-3">
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-sm font-black text-slate-900">
            Priority Industry Gaps
          </p>

          <p className="mt-1 text-sm leading-6 text-slate-500">
            {highPriorityGaps.length > 0
              ? `${highPriorityGaps.length} high-priority industry gaps need stronger resume evidence.`
              : "No high-priority industry gaps detected."}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {gaps.slice(0, 8).map((gap) => (
            <span
              key={`${gap.skill}-${gap.requirementType}`}
              className="rounded-full border border-amber-100 bg-amber-50 px-3 py-1 text-xs font-black text-amber-700"
            >
              {gap.skill}
            </span>
          ))}

          {gaps.length === 0 && (
            <span className="rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-700">
              Strong industry alignment
            </span>
          )}
        </div>
      </div>
    </div>
  )
}