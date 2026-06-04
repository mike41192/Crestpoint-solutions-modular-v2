"use client"

// =====================================================
// BLOCK: ATS Explainability Imports
// Crestpoint Solutions V2
// Version: 1.6.8
// =====================================================

import type {
  ATSExplainabilityReport,
} from "@/modules/ats-explainability"

// =====================================================
// BLOCK: Component Types
// =====================================================

type ATSExplainabilityPanelProps = {
  report: ATSExplainabilityReport
}

// =====================================================
// BLOCK: ATS Explainability Panel
// =====================================================

export function ATSExplainabilityPanel({
  report,
}: ATSExplainabilityPanelProps) {
  return (
    <div className="grid gap-4">

      {/* =====================================================
          BLOCK: Positive Contributors
      ===================================================== */}

      <div className="rounded-3xl border border-emerald-200 bg-white p-5 shadow-sm">
        <h3 className="text-lg font-black text-slate-950">
          Positive Contributors
        </h3>

        <div className="mt-4 grid gap-3">
          {report.strengths.length > 0 ? (
            report.strengths.map((item) => (
              <div
                key={`${item.category}-${item.explanation}`}
                className="rounded-2xl border border-emerald-100 bg-emerald-50 p-4"
              >
                <p className="font-black text-emerald-800">
                  +{item.impact}
                </p>

                <p className="mt-1 text-sm font-bold text-slate-800">
                  {item.category}
                </p>

                <p className="mt-1 text-sm text-slate-600">
                  {item.explanation}
                </p>
              </div>
            ))
          ) : (
            <p className="text-sm text-slate-500">
              No positive contributors detected.
            </p>
          )}
        </div>
      </div>

      {/* =====================================================
          BLOCK: Negative Contributors
      ===================================================== */}

      <div className="rounded-3xl border border-red-200 bg-white p-5 shadow-sm">
        <h3 className="text-lg font-black text-slate-950">
          Negative Contributors
        </h3>

        <div className="mt-4 grid gap-3">
          {report.weaknesses.length > 0 ? (
            report.weaknesses.map((item) => (
              <div
                key={`${item.category}-${item.explanation}`}
                className="rounded-2xl border border-red-100 bg-red-50 p-4"
              >
                <p className="font-black text-red-800">
                  {item.impact}
                </p>

                <p className="mt-1 text-sm font-bold text-slate-800">
                  {item.category}
                </p>

                <p className="mt-1 text-sm text-slate-600">
                  {item.explanation}
                </p>
              </div>
            ))
          ) : (
            <p className="text-sm text-slate-500">
              No negative contributors detected.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}