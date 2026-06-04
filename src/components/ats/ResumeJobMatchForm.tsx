"use client"

// =====================================================
// BLOCK: Imports
// =====================================================

import { useEffect, useMemo, useState } from "react"
import { Award, Factory, Target } from "lucide-react"
import { ATSExplainabilityPanel, ATSValidationPanel } from "@/components/admin"
import {
  ATSDashboardTabs,
  type ATSDashboardTab,
} from "@/components/ats/ATSDashboardTabs"
import { ResumeATSPanel } from "@/components/ats/ResumeATSPanel"
import { ResumeGapAnalysisPanel } from "@/components/ats/ResumeGapAnalysisPanel"
import { ResumeOptimizationPanel } from "@/components/ats/ResumeOptimizationPanel"
import { analyzeSkillEvidence } from "@/modules/ats-intelligence"
import { explainATSScore } from "@/modules/ats-explainability"
import { generateATSReport } from "@/modules/ats-engine"
import { analyzeResumeGaps } from "@/modules/gap-analyzer"
import type { IndustryGapItem } from "@/modules/ats-intelligence"
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
  const [jobDescription, setJobDescription] = useState(savedJobDescription)
  const [activeTab, setActiveTab] = useState<ATSDashboardTab>("overview")

  useEffect(() => {
    setJobDescription(savedJobDescription)
  }, [savedJobDescription])

  function updateJobDescription(value: string) {
    setJobDescription(value)
    onJobDescriptionChange?.(value)
  }

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

  const explainabilityReport = useMemo(
    () => explainATSScore(atsResult),
    [atsResult],
  )

  function handleApplySuggestion(suggestion: ResumeOptimizationSuggestion) {
    if (!onResumeUpdate) return

    const updatedResume = applyOptimizationSuggestion(data, suggestion)
    onResumeUpdate(updatedResume)
  }

  return (
    <section className="grid min-w-0 max-w-full gap-4 overflow-hidden rounded-3xl border border-violet-200 bg-violet-50 p-4 shadow-sm sm:p-5">
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

      <label className="block min-w-0 max-w-full text-sm font-black text-slate-700">
        Job Description

        <textarea
          value={jobDescription}
          onChange={(event) => updateJobDescription(event.target.value)}
          placeholder="Paste job description here..."
          className="mt-2 min-h-[190px] w-full min-w-0 max-w-full resize-y rounded-2xl border border-violet-200 bg-white p-4 text-sm leading-6 text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-violet-500 focus:ring-4 focus:ring-violet-100"
        />
      </label>

      <ATSDashboardTabs activeTab={activeTab} onTabChange={setActiveTab} />

      {activeTab === "overview" && (
        <div className="grid min-w-0 gap-4">
          <IndustryReadinessCard
            industry={atsResult.detectedIndustry}
            score={atsResult.industryReadinessScore}
            gaps={atsResult.industryGaps}
          />

          <div className="min-w-0 max-w-full overflow-hidden">
            <ResumeATSPanel result={atsResult} />
          </div>
        </div>
      )}

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

      {activeTab === "gaps" && (
        <div className="grid min-w-0 gap-4">
          <IndustryGapPanel gaps={atsResult.industryGaps} />

          <div className="min-w-0 max-w-full overflow-hidden">
            <ResumeGapAnalysisPanel result={gapAnalysisResult} />
          </div>
        </div>
      )}

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

      {activeTab === "apply" && (
        <div className="min-w-0 max-w-full overflow-hidden">
          <ResumeOptimizationPanel
            result={optimizationResult}
            onApplySuggestion={handleApplySuggestion}
          />
        </div>
      )}

      {activeTab === "validation" && (
        <div className="min-w-0 max-w-full overflow-hidden">
          <ATSValidationPanel result={atsResult} />
        </div>
      )}

      {activeTab === "explainability" && (
        <div className="min-w-0 max-w-full overflow-hidden">
          <ATSExplainabilityPanel report={explainabilityReport} />
        </div>
      )}
    </section>
  )
}

// =====================================================
// BLOCK: Industry Readiness Card
// =====================================================

function IndustryReadinessCard({
  industry,
  score,
  gaps,
}: {
  industry: string
  score: number
  gaps: IndustryGapItem[]
}) {
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

// =====================================================
// BLOCK: Industry Gap Panel
// =====================================================

function IndustryGapPanel({ gaps }: { gaps: IndustryGapItem[] }) {
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