"use client"

// =====================================================
// BLOCK: Imports
// =====================================================

import { ATSResult } from "@/modules/ats-engine"

// =====================================================
// BLOCK: Component Types
// =====================================================

type ATSValidationPanelProps = {
  result: ATSResult
}

// =====================================================
// BLOCK: ATS Validation Panel
// =====================================================

export function ATSValidationPanel({
  result,
}: ATSValidationPanelProps) {
  return (
    <div className="grid gap-4">

      {/* Industry */}

      <div className="rounded-3xl border border-slate-200 bg-white p-5">
        <h3 className="text-lg font-black">
          Industry Detection
        </h3>

        <p className="mt-2">
          {result.detectedIndustry}
        </p>

        <p className="text-sm text-slate-500">
          Target Role: {result.detectedTargetRole}
        </p>
      </div>

      {/* Score Breakdown */}

      <div className="rounded-3xl border border-slate-200 bg-white p-5">
        <h3 className="text-lg font-black">
          Score Breakdown
        </h3>

        <div className="mt-4 grid gap-2">
          {result.sectionScores.map(section => (
            <div
              key={section.name}
              className="flex justify-between"
            >
              <span>{section.name}</span>
              <span>{section.score}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Missing Skills */}

      <div className="rounded-3xl border border-slate-200 bg-white p-5">
        <h3 className="text-lg font-black">
          Missing Skills
        </h3>

        <div className="mt-3 flex flex-wrap gap-2">
          {result.missingKeywords.map(skill => (
            <span
              key={skill}
              className="
              rounded-full
              bg-red-50
              border
              border-red-200
              px-3
              py-1
              text-xs
              font-black
              text-red-700
              "
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Risk Flags */}

      <div className="rounded-3xl border border-slate-200 bg-white p-5">
        <h3 className="text-lg font-black">
          Risk Flags
        </h3>

        <div className="mt-3 grid gap-3">
          {result.riskFlags.map(flag => (
            <div
              key={flag.title}
              className="
              rounded-2xl
              border
              border-amber-200
              bg-amber-50
              p-3
              "
            >
              <p className="font-black">
                {flag.title}
              </p>

              <p className="text-sm">
                {flag.description}
              </p>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}
