"use client"

// =====================================================
// BLOCK: Imports
// =====================================================

import { useEffect, useMemo, useState } from "react"
import { Target } from "lucide-react"
import {
  ATSDashboardTabs,
  type ATSDashboardTab,
} from "@/components/ats/ATSDashboardTabs"
import { ResumeATSPanel } from "@/components/ats/ResumeATSPanel"
import { ResumeGapAnalysisPanel } from "@/components/ats/ResumeGapAnalysisPanel"
import { ResumeOptimizationPanel } from "@/components/ats/ResumeOptimizationPanel"
import { generateATSReport } from "@/modules/ats-engine"
import { analyzeResumeGaps } from "@/modules/gap-analyzer"
import type { ResumeBuilderFormData } from "@/modules/resume-builder"
import {
  applyOptimizationSuggestion,
  generateResumeOptimizationReport,
} from "@/modules/resume-optimizer"
import type { ResumeOptimizationSuggestion } from "@/modules/resume-optimizer"

// =====================================================
// BLOCK: Component Types
// =====================================================

type ResumeJobMatchFormProps = {
  data: ResumeBuilderFormData
  savedJobDescription?: string
  onJobDescriptionChange?: (value: string) => void
  onResumeUpdate?: (data: ResumeBuilderFormData) => void
}

// =====================================================
// BLOCK: Resume Job Match Form Component
// =====================================================

export function ResumeJobMatchForm({
  data,
  savedJobDescription = "",
  onJobDescriptionChange,
  onResumeUpdate,
}: ResumeJobMatchFormProps) {
  // =====================================================
  // BLOCK: Local State
  // =====================================================

  const [jobDescription, setJobDescription] = useState(savedJobDescription)
  const [activeTab, setActiveTab] = useState<ATSDashboardTab>("overview")

  // =====================================================
  // BLOCK: Keep Parent Job Description Synced
  // =====================================================

  useEffect(() => {
    setJobDescription(savedJobDescription)
  }, [savedJobDescription])

  // =====================================================
  // BLOCK: Job Description Update Handler
  // =====================================================

  function updateJobDescription(value: string) {
    setJobDescription(value)
    onJobDescriptionChange?.(value)
  }

  // =====================================================
  // BLOCK: ATS / Gap / Optimization Analysis
  // =====================================================

  const atsResult = useMemo(
    () => generateATSReport(data, jobDescription),
    [data, jobDescription],
  )

  const gapAnalysisResult = useMemo(
    () => analyzeResumeGaps(data, jobDescription),
    [data, jobDescription],
  )

  const optimizationResult = useMemo(
    () =>
      generateResumeOptimizationReport({
        resume: data,
        jobDescription,
        atsResult,
      }),
    [data, jobDescription, atsResult],
  )

  // =====================================================
  // BLOCK: Apply Optimization Suggestions
  // =====================================================

  function handleApplySuggestion(suggestion: ResumeOptimizationSuggestion) {
    if (!onResumeUpdate) return

    const updatedResume = applyOptimizationSuggestion(data, suggestion)
    onResumeUpdate(updatedResume)
  }

  // =====================================================
  // BLOCK: Main Render
  // =====================================================

  return (
    <section className="grid min-w-0 max-w-full gap-4 overflow-hidden rounded-3xl border border-violet-200 bg-violet-50 p-4 shadow-sm sm:p-5">
      {/* =====================================================
          BLOCK: Header
      ===================================================== */}

      <div className="flex min-w-0 items-start gap-3">
        <div className="shrink-0 rounded-2xl bg-white p-2 text-violet-700 shadow-sm">
          <Target size={18} />
        </div>

        <div className="min-w-0">
          <h3 className="break-words text-lg font-black text-slate-950">
            ATS Job Match
          </h3>

          <p className="mt-1 break-words text-sm leading-6 text-slate-600">
            Paste a job description to compare your resume against target role
            keywords, missing skills, section strength, gaps, and ATS
            compatibility.
          </p>
        </div>
      </div>

      {/* =====================================================
          BLOCK: Job Description Input
      ===================================================== */}

      <label className="block min-w-0 max-w-full text-sm font-black text-slate-700">
        Job Description

        <textarea
          value={jobDescription}
          onChange={(event) => updateJobDescription(event.target.value)}
          placeholder="Paste job description here..."
          className="mt-2 min-h-[190px] w-full min-w-0 max-w-full resize-y rounded-2xl border border-violet-200 bg-white p-4 text-sm leading-6 text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-violet-500 focus:ring-4 focus:ring-violet-100"
        />
      </label>

      {/* =====================================================
          BLOCK: Internal ATS Dashboard Tabs
      ===================================================== */}

      <ATSDashboardTabs activeTab={activeTab} onTabChange={setActiveTab} />

      {/* =====================================================
          BLOCK: Overview Tab
      ===================================================== */}

      {activeTab === "overview" && (
        <div className="min-w-0 max-w-full overflow-hidden">
          <ResumeATSPanel result={atsResult} />
        </div>
      )}

      {/* =====================================================
          BLOCK: Keywords Tab
      ===================================================== */}

      {activeTab === "keywords" && (
        <div className="grid min-w-0 gap-4 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <h4 className="text-lg font-black text-slate-950">
            Keyword Analysis
          </h4>

          <div className="grid gap-4 lg:grid-cols-2">
            <KeywordCard
              title="Matched Keywords"
              keywords={atsResult.matchedKeywords}
              empty="No matched keywords detected yet."
              tone="green"
            />

            <KeywordCard
              title="Missing Keywords"
              keywords={atsResult.missingKeywords}
              empty="No missing keywords detected."
              tone="red"
            />
          </div>
        </div>
      )}

      {/* =====================================================
          BLOCK: Gap Analysis Tab
      ===================================================== */}

      {activeTab === "gaps" && (
        <div className="min-w-0 max-w-full overflow-hidden">
          <ResumeGapAnalysisPanel result={gapAnalysisResult} />
        </div>
      )}

      {/* =====================================================
          BLOCK: Risk Flags Tab
      ===================================================== */}

      {activeTab === "risks" && (
        <div className="grid min-w-0 gap-4 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <h4 className="text-lg font-black text-slate-950">Risk Flags</h4>

          {atsResult.riskFlags.length > 0 ? (
            <div className="grid gap-3">
              {atsResult.riskFlags.map((flag) => (
                <div
                  key={`${flag.title}-${flag.description}`}
                  className="rounded-2xl border border-red-100 bg-red-50 p-4 text-sm text-red-800"
                >
                  <p className="font-black">{flag.title}</p>
                  <p className="mt-1 leading-6">{flag.description}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-semibold text-emerald-700">
              No major ATS risk flags detected.
            </p>
          )}
        </div>
      )}

      {/* =====================================================
          BLOCK: Recommendations Tab
      ===================================================== */}

      {activeTab === "recommendations" && (
        <div className="grid min-w-0 gap-4 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <h4 className="text-lg font-black text-slate-950">
            Recommendations
          </h4>

          {atsResult.recommendations.length > 0 ? (
            <div className="grid gap-3">
              {atsResult.recommendations.map((recommendation) => (
                <div
                  key={`${recommendation.title}-${recommendation.description}`}
                  className="rounded-2xl border border-amber-100 bg-amber-50 p-4 text-sm text-amber-800"
                >
                  <p className="font-black">{recommendation.title}</p>
                  <p className="mt-1 leading-6">{recommendation.description}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">
              No recommendations available yet.
            </p>
          )}
        </div>
      )}

      {/* =====================================================
          BLOCK: Apply Fixes Tab
      ===================================================== */}

      {activeTab === "apply" && (
        <div className="min-w-0 max-w-full overflow-hidden">
          <ResumeOptimizationPanel
            result={optimizationResult}
            onApplySuggestion={handleApplySuggestion}
          />
        </div>
      )}
    </section>
  )
}

// =====================================================
// BLOCK: Keyword Card Component
// =====================================================

function KeywordCard({
  title,
  keywords,
  empty,
  tone,
}: {
  title: string
  keywords: string[]
  empty: string
  tone: "green" | "red"
}) {
  const classes =
    tone === "green"
      ? "border-emerald-100 bg-emerald-50 text-emerald-700"
      : "border-red-100 bg-red-50 text-red-700"

  return (
    <div className="min-w-0 rounded-3xl border border-slate-200 bg-slate-50 p-4">
      <p className="text-sm font-black text-slate-800">{title}</p>

      <div className="mt-3 flex flex-wrap gap-2">
        {keywords.length > 0 ? (
          keywords.slice(0, 40).map((keyword) => (
            <span
              key={keyword}
              className={`rounded-full border px-3 py-1 text-xs font-black ${classes}`}
            >
              {keyword}
            </span>
          ))
        ) : (
          <p className="text-sm text-slate-500">{empty}</p>
        )}
      </div>
    </div>
  )
}
