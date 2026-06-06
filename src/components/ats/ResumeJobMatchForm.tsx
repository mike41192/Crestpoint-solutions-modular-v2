"use client"

// =====================================================
// BLOCK: Imports
// Crestpoint Solutions V2
// Version: 1.8.5
// =====================================================

import { useEffect, useMemo, useState } from "react"
import type { ATSDashboardTab } from "@/components/ats/ATSDashboardTabs"
import { ResumeATSAccessPanel } from "@/components/ats/job-match/ResumeATSAccessPanel"
import { ResumeATSMessages } from "@/components/ats/job-match/ResumeATSMessages"
import { ResumeJobDescriptionInput } from "@/components/ats/job-match/ResumeJobDescriptionInput"
import { ResumeJobMatchAnalysis } from "@/components/ats/job-match/ResumeJobMatchAnalysis"
import { ResumeJobMatchHeader } from "@/components/ats/job-match/ResumeJobMatchHeader"
import { ResumeJobMatchTabs } from "@/components/ats/job-match/ResumeJobMatchTabs"
import { JobDescriptionPicker } from "@/components/jobs/JobDescriptionPicker"
import { explainATSScore } from "@/modules/ats-explainability"
import { generateATSReport } from "@/modules/ats-engine"
import { analyzeResumeGaps } from "@/modules/gap-analyzer"
import type { JobDescriptionRecord } from "@/modules/job-description-library"
import {
  createEmptyMembership,
  loadCurrentMembership,
} from "@/modules/membership-management/membership-service"
import type { MembershipData } from "@/modules/membership-management/types"
import type { ResumeBuilderFormData } from "@/modules/resume-builder"
import {
  applyOptimizationSuggestion,
  generateResumeOptimizationReport,
} from "@/modules/resume-optimizer"
import type { ResumeOptimizationSuggestion } from "@/modules/resume-optimizer"
import { canRunATSScan } from "@/modules/subscription-enforcement"
import {
  createEmptyUsage,
  incrementATSScan,
  loadCurrentUsage,
} from "@/modules/usage-tracking"
import type { UserUsageData } from "@/modules/usage-tracking"

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
  const [analyzedJobDescription, setAnalyzedJobDescription] =
    useState(savedJobDescription)

  const [activeTab, setActiveTab] = useState<ATSDashboardTab>("overview")

  const [membership, setMembership] = useState<MembershipData>(
    createEmptyMembership(),
  )

  const [usage, setUsage] = useState<UserUsageData>(createEmptyUsage())

  const [scanMessage, setScanMessage] = useState("")
  const [scanLoading, setScanLoading] = useState(false)
  const [loadingAccess, setLoadingAccess] = useState(true)

  // =====================================================
  // BLOCK: Keep Saved Job Description Synced
  // =====================================================

  useEffect(() => {
    setJobDescription(savedJobDescription)
    setAnalyzedJobDescription(savedJobDescription)
  }, [savedJobDescription])

  // =====================================================
  // BLOCK: Load Membership And Usage
  // =====================================================

  async function refreshAccessData() {
    const [membershipResult, usageResult] = await Promise.all([
      loadCurrentMembership(),
      loadCurrentUsage(),
    ])

    setMembership(membershipResult)
    setUsage(usageResult)
    setLoadingAccess(false)
  }

  useEffect(() => {
    refreshAccessData()
  }, [])

  // =====================================================
  // BLOCK: Derived Access State
  // =====================================================

  const atsAccess = canRunATSScan(membership, usage)

  const atsLimitText =
    membership.atsLimit < 0
      ? `${usage.atsScansUsed} ATS scans used · Unlimited plan`
      : `${usage.atsScansUsed} of ${membership.atsLimit} ATS scans used`

  // =====================================================
  // BLOCK: Job Description Update Handler
  // =====================================================

  function updateJobDescription(value: string) {
    setJobDescription(value)
    onJobDescriptionChange?.(value)
    setScanMessage("")
  }

  // =====================================================
  // BLOCK: Saved Job Description Handler
  // =====================================================

  function handleLoadSavedJob(job: JobDescriptionRecord) {
    updateJobDescription(job.description)
    setAnalyzedJobDescription(job.description)
    setScanMessage(`Loaded saved job description: ${job.title}`)
    setActiveTab("overview")
  }

  // =====================================================
  // BLOCK: Run ATS Analysis Handler
  // Only this action increments usage.
  // =====================================================

  async function handleRunATSAnalysis() {
    setScanMessage("")

    if (loadingAccess) {
      setScanMessage("Membership access is still loading. Try again.")
      return
    }

    const access = canRunATSScan(membership, usage)

    if (!access.allowed) {
      setScanMessage(access.reason || "ATS scan limit reached.")
      return
    }

    setScanLoading(true)

    try {
      setAnalyzedJobDescription(jobDescription)

      const result = await incrementATSScan()

      if (result.status !== "success") {
        setScanMessage(
          result.message ||
            "ATS analysis completed, but usage tracking could not be updated.",
        )
        return
      }

      setUsage((currentUsage) => ({
        ...currentUsage,
        atsScansUsed: currentUsage.atsScansUsed + 1,
      }))

      setScanMessage("ATS analysis completed and usage updated.")
    } catch {
      setScanMessage("ATS analysis request failed.")
    } finally {
      setScanLoading(false)
    }
  }

  // =====================================================
  // BLOCK: ATS / Gap / Optimization Analysis
  // =====================================================

  const atsResult = useMemo(
    () => generateATSReport(data, analyzedJobDescription),
    [data, analyzedJobDescription],
  )

  const gapAnalysisResult = useMemo(
    () => analyzeResumeGaps(data, analyzedJobDescription),
    [data, analyzedJobDescription],
  )

  const optimizationResult = useMemo(
    () =>
      generateResumeOptimizationReport({
        resume: data,
        jobDescription: analyzedJobDescription,
        atsResult,
      }),
    [data, analyzedJobDescription, atsResult],
  )

  const explainabilityReport = useMemo(
    () => explainATSScore(atsResult),
    [atsResult],
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
      <ResumeJobMatchHeader />

      <JobDescriptionPicker onSelect={handleLoadSavedJob} />

      <ResumeJobDescriptionInput
        value={jobDescription}
        onChange={updateJobDescription}
      />

      <ResumeATSAccessPanel
        loadingAccess={loadingAccess}
        scanLoading={scanLoading}
        atsLimitText={atsLimitText}
        accessAllowed={atsAccess.allowed}
        onRunATSAnalysis={handleRunATSAnalysis}
      />

      <ResumeATSMessages
        message={scanMessage}
        accessAllowed={atsAccess.allowed}
      />

      {!atsAccess.allowed && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900">
          <p className="font-black">ATS scan limit reached</p>

          <p className="mt-1">
            Upgrade messaging and Stripe plan changes will be connected during
            the billing integration phase.
          </p>
        </div>
      )}

      <ResumeJobMatchTabs activeTab={activeTab} onTabChange={setActiveTab} />

      <ResumeJobMatchAnalysis
        activeTab={activeTab}
        atsResult={atsResult}
        gapAnalysisResult={gapAnalysisResult}
        optimizationResult={optimizationResult}
        explainabilityReport={explainabilityReport}
        onApplySuggestion={handleApplySuggestion}
      />
    </section>
  )
}
