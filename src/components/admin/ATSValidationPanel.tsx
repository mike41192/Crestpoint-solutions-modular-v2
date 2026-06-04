"use client"

// =====================================================
// BLOCK: Type Imports
// =====================================================

import type { ATSResult } from "@/modules/ats-engine"

// =====================================================
// BLOCK: Component Types
// =====================================================

type ATSValidationPanelProps = {
  result: ATSResult
}

// =====================================================
// BLOCK: ATS Validation Panel
// =====================================================

export function ATSValidationPanel({ result }: ATSValidationPanelProps) {
  const highPriorityIndustryGaps = result.industryGaps.filter(
    (gap) => gap.priority === "high",
  )

  return (
    <div className="grid gap-4">
      {/* =====================================================
          BLOCK: Industry Detection
      ===================================================== */}

      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <p className="text-xs font-black uppercase tracking-[0.18em] text-violet-600">
          ATS Validation
        </p>

        <h3 className="mt-2 text-lg font-black text-slate-950">
          Industry Detection
        </h3>

        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <ValidationMetric
            label="Detected Industry"
            value={result.detectedIndustry}
          />

          <ValidationMetric
            label="Detected Target Role"
            value={result.detectedTargetRole}
          />

          <ValidationMetric
            label="Industry Readiness"
            value={`${result.industryReadinessScore}/100`}
          />
        </div>
      </div>

      {/* =====================================================
          BLOCK: Score Breakdown
      ===================================================== */}

      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="text-lg font-black text-slate-950">Score Breakdown</h3>

        <div className="mt-4 grid gap-3">
          {result.sectionScores.map((section) => (
            <div key={section.name}>
              <div className="mb-1 flex items-center justify-between text-sm font-bold text-slate-600">
                <span>{section.name}</span>
                <span>
                  {section.score}/{section.maxScore}
                </span>
              </div>

              <div className="h-2 overflow-hidden rounded-full bg-slate-200">
                <div
                  className="h-full rounded-full bg-violet-600"
                  style={{
                    width: `${Math.min(section.score, section.maxScore)}%`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* =====================================================
          BLOCK: Industry Evidence Gaps
      ===================================================== */}

      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="text-lg font-black text-slate-950">
          Industry Evidence Gaps
        </h3>

        <p className="mt-1 text-sm leading-6 text-slate-500">
          These are industry-specific skills that need stronger resume evidence.
        </p>

        <div className="mt-4 grid gap-3">
          {result.industryGaps.length > 0 ? (
            result.industryGaps.slice(0, 12).map((gap) => (
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

                  <span className="rounded-full border border-slate-200 bg-white px-2 py-1 text-[11px] font-black uppercase text-slate-600">
                    Score {gap.evidenceScore}
                  </span>
                </div>

                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {gap.recommendation}
                </p>
              </div>
            ))
          ) : (
            <p className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-semibold text-emerald-700">
              No major industry evidence gaps detected.
            </p>
          )}
        </div>

        {highPriorityIndustryGaps.length > 0 && (
          <p className="mt-4 rounded-2xl border border-red-100 bg-red-50 p-4 text-sm font-semibold text-red-700">
            {highPriorityIndustryGaps.length} high-priority industry gaps need
            stronger evidence before this resume is considered highly aligned.
          </p>
        )}
      </div>

      {/* =====================================================
          BLOCK: Missing Keywords
      ===================================================== */}

      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="text-lg font-black text-slate-950">Missing Keywords</h3>

        <div className="mt-3 flex flex-wrap gap-2">
          {result.missingKeywords.length > 0 ? (
            result.missingKeywords.map((skill) => (
              <span
                key={skill}
                className="rounded-full border border-red-200 bg-red-50 px-3 py-1 text-xs font-black text-red-700"
              >
                {skill}
              </span>
            ))
          ) : (
            <span className="rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-700">
              No missing keywords detected
            </span>
          )}
        </div>
      </div>

      {/* =====================================================
          BLOCK: Risk Flags
      ===================================================== */}

      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="text-lg font-black text-slate-950">Risk Flags</h3>

        <div className="mt-3 grid gap-3">
          {result.riskFlags.length > 0 ? (
            result.riskFlags.map((flag) => (
              <div
                key={`${flag.title}-${flag.description}`}
                className="rounded-2xl border border-amber-200 bg-amber-50 p-3"
              >
                <p className="font-black text-amber-900">{flag.title}</p>

                <p className="mt-1 text-sm leading-6 text-amber-800">
                  {flag.description}
                </p>
              </div>
            ))
          ) : (
            <p className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-semibold text-emerald-700">
              No major risk flags detected.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

// =====================================================
// BLOCK: Validation Metric Component
// =====================================================

function ValidationMetric({
  label,
  value,
}: {
  label: string
  value: string
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <p className="text-xs font-black uppercase tracking-[0.14em] text-slate-500">
        {label}
      </p>

      <p className="mt-2 break-words text-sm font-black text-slate-950">
        {value}
      </p>
    </div>
  )
}