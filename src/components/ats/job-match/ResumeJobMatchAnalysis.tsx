"use client"

// =====================================================
// BLOCK: Imports
// Crestpoint Solutions V2
// Version: 1.8.5
// =====================================================

import { ATSExplainabilityPanel, ATSValidationPanel } from "@/components/admin"
import type { ATSDashboardTab } from "@/components/ats/ATSDashboardTabs"
import { ResumeATSPanel } from "@/components/ats/ResumeATSPanel"
import { ResumeGapAnalysisPanel } from "@/components/ats/ResumeGapAnalysisPanel"
import { ResumeOptimizationPanel } from "@/components/ats/ResumeOptimizationPanel"
import { IndustryGapPanel } from "@/components/ats/job-match/IndustryGapPanel"
import { IndustryReadinessCard } from "@/components/ats/job-match/IndustryReadinessCard"
import { KeywordCard } from "@/components/ats/job-match/KeywordCard"
import type { ATSExplainabilityReport } from "@/modules/ats-explainability"
import type { ATSResult } from "@/modules/ats-engine"
import type { ResumeGapAnalysisResult } from "@/modules/gap-analyzer"
import type { ResumeOptimizationSuggestion } from "@/modules/resume-optimizer"

// =====================================================
// BLOCK: Component Types
// =====================================================

type ResumeJobMatchAnalysisProps = {
  activeTab: ATSDashboardTab
  atsResult: ATSResult
  gapAnalysisResult: ResumeGapAnalysisResult
  optimizationResult: ReturnType<
    typeof import("@/modules/resume-optimizer").generateResumeOptimizationReport
  >
  explainabilityReport: ATSExplainabilityReport
  onApplySuggestion: (suggestion: ResumeOptimizationSuggestion) => void
}

// =====================================================
// BLOCK: Resume Job Match Analysis Component
// =====================================================

export function ResumeJobMatchAnalysis({
  activeTab,
  atsResult,
  gapAnalysisResult,
  optimizationResult,
  explainabilityReport,
  onApplySuggestion,
}: ResumeJobMatchAnalysisProps) {
  if (activeTab === "overview") {
    return (
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
    )
  }

  if (activeTab === "keywords") {
    return (
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
    )
  }

  if (activeTab === "gaps") {
    return (
      <div className="grid min-w-0 gap-4">
        <IndustryGapPanel gaps={atsResult.industryGaps} />

        <div className="min-w-0 max-w-full overflow-hidden">
          <ResumeGapAnalysisPanel result={gapAnalysisResult} />
        </div>
      </div>
    )
  }

  if (activeTab === "risks") {
    return (
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
    )
  }

  if (activeTab === "recommendations") {
    return (
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
    )
  }

  if (activeTab === "apply") {
    return (
      <div className="min-w-0 max-w-full overflow-hidden">
        <ResumeOptimizationPanel
          result={optimizationResult}
          onApplySuggestion={onApplySuggestion}
        />
      </div>
    )
  }

  if (activeTab === "validation") {
    return (
      <div className="min-w-0 max-w-full overflow-hidden">
        <ATSValidationPanel result={atsResult} />
      </div>
    )
  }

  if (activeTab === "explainability") {
    return (
      <div className="min-w-0 max-w-full overflow-hidden">
        <ATSExplainabilityPanel report={explainabilityReport} />
      </div>
    )
  }

  return null
}
