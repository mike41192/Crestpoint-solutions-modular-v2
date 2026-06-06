"use client"

// =====================================================
// BLOCK: Imports
// Crestpoint Solutions V2
// Version: 1.8.5
// =====================================================

import { Award } from "lucide-react"
import type { IndustryGapItem } from "@/modules/ats-intelligence"

// =====================================================
// BLOCK: Component Types
// =====================================================

type IndustryGapPanelProps = {
  gaps: IndustryGapItem[]
}

// =====================================================
// BLOCK: Industry Gap Panel Component
// =====================================================

export function IndustryGapPanel({ gaps }: IndustryGapPanelProps) {
  return (
    <div className="grid min-w-0 gap-4 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <div className="flex items-center gap-2">
        <Award size={18} className="text-violet-700" />
        <h4 className="text-lg font-black text-slate-950">
          Industry Evidence Gaps
        </h4>
      </div>

      {gaps.length > 0 ? (
        <div className="grid gap-3">
          {gaps.slice(0, 12).map((gap) => (
            <div
              key={`${gap.skill}-${gap.requirementType}`}
              className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
            >
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-sm font-black text-slate-950">
                  {gap.skill}
                </p>

                <span className="rounded-full border border-violet-100 bg-violet-50 px-2 py-1 text-[11px] font-black uppercase text-violet-700">
                  {gap.requirementType}
                </span>

                <span className="rounded-full border border-amber-100 bg-amber-50 px-2 py-1 text-[11px] font-black uppercase text-amber-700">
                  {gap.evidenceStrength} evidence
                </span>
              </div>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                {gap.recommendation}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-semibold text-emerald-700">
          No major industry evidence gaps detected.
        </p>
      )}
    </div>
  )
}