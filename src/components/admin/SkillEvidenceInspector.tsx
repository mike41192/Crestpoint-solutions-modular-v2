"use client"

// =====================================================
// BLOCK: Imports
// Crestpoint Solutions V2
// Version: 1.6.9
// =====================================================

import type {
  SkillEvidenceReport,
} from "@/modules/ats-intelligence"

// =====================================================
// BLOCK: Component Types
// =====================================================

type SkillEvidenceInspectorProps = {
  report: SkillEvidenceReport
}

// =====================================================
// BLOCK: Skill Evidence Inspector
// =====================================================

export function SkillEvidenceInspector({
  report,
}: SkillEvidenceInspectorProps) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="text-lg font-black text-slate-950">
        {report.skill}
      </h3>

      <div className="mt-3 flex flex-wrap gap-2">
        <span className="rounded-full border border-violet-100 bg-violet-50 px-3 py-1 text-xs font-black text-violet-700">
          {report.strength}
        </span>

        <span className="rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-black text-blue-700">
          Confidence {report.confidence}%
        </span>
      </div>

      <div className="mt-5">
        <p className="font-black text-slate-900">
          Evidence Found
        </p>

        <div className="mt-3 grid gap-2">
          {report.evidenceFound.length > 0 ? (
            report.evidenceFound.map((item) => (
              <div
                key={`${item.phrase}-${item.source}`}
                className="rounded-2xl border border-slate-200 bg-slate-50 p-3"
              >
                <p className="text-sm font-bold">
                  {item.phrase}
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  Source: {item.source}
                </p>
              </div>
            ))
          ) : (
            <p className="text-sm text-slate-500">
              No evidence detected.
            </p>
          )}
        </div>
      </div>

      <div className="mt-5">
        <p className="font-black text-slate-900">
          Recommendation
        </p>

        <p className="mt-2 text-sm leading-6 text-slate-600">
          {report.recommendation}
        </p>
      </div>
    </div>
  )
}