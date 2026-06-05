"use client"

// =====================================================
// BLOCK: Imports
// =====================================================

import { useEffect, useMemo, useState } from "react"
import {
  AlertTriangle,
  CheckCircle2,
  FilePenLine,
  RefreshCw,
  Sparkles,
} from "lucide-react"
import type { ResumeBuilderFormData } from "@/modules/resume-builder"
import type { RewriteResult } from "@/modules/ai-rewriter"
import { AIRewriteEngine } from "@/modules/ai-rewriter"
import { ResumeRewriteScoreCard } from "@/components/resume/ResumeRewriteScoreCard"
import { scoreRewriteQuality } from "@/modules/rewrite-scoring"
import {
  addRewriteHistoryItem,
  createRewriteHistoryItem,
} from "@/modules/rewrite-history"
import {
  createEmptyMembership,
  loadCurrentMembership,
} from "@/modules/membership-management/membership-service"
import type { MembershipData } from "@/modules/membership-management/types"
import {
  createEmptyUsage,
  loadCurrentUsage,
} from "@/modules/usage-tracking"
import type { UserUsageData } from "@/modules/usage-tracking"
import { incrementAIRewrite } from "@/modules/usage-tracking/usage-actions"
import { canRunRewrite } from "@/modules/subscription-enforcement/enforcement-engine"

// =====================================================
// BLOCK: Component Types
// =====================================================

type ResumeRewritePanelProps = {
  data: ResumeBuilderFormData
  onResumeUpdate: (data: ResumeBuilderFormData) => void
  onHistoryUpdated?: () => void
}

type ActiveRewrite = {
  type: "summary" | "bullet"
  result: RewriteResult
  experienceId?: string
  bulletIndex?: number
}

// =====================================================
// BLOCK: Component
// =====================================================

export function ResumeRewritePanel({
  data,
  onResumeUpdate,
  onHistoryUpdated,
}: ResumeRewritePanelProps) {
  const firstExperienceId = data.experience[0]?.id || ""

  const [selectedExperienceId, setSelectedExperienceId] =
    useState(firstExperienceId)

  const [selectedBulletIndex, setSelectedBulletIndex] = useState(0)
  const [activeRewrite, setActiveRewrite] = useState<ActiveRewrite | null>(null)

  const [membership, setMembership] = useState<MembershipData>(
    createEmptyMembership(),
  )

  const [usage, setUsage] = useState<UserUsageData>(createEmptyUsage())

  const [loadingAccess, setLoadingAccess] = useState(true)
  const [rewriteMessage, setRewriteMessage] = useState("")
  const [runningRewrite, setRunningRewrite] = useState(false)

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

  useEffect(() => {
    const selectedExperienceStillExists = data.experience.some(
      (experience) => experience.id === selectedExperienceId,
    )

    if (!selectedExperienceStillExists) {
      setSelectedExperienceId(data.experience[0]?.id || "")
      setSelectedBulletIndex(0)
      setActiveRewrite(null)
    }
  }, [data.experience, selectedExperienceId])

  const selectedExperience = useMemo(
    () =>
      data.experience.find(
        (experience) => experience.id === selectedExperienceId,
      ) || data.experience[0],
    [data.experience, selectedExperienceId],
  )

  const availableBullets = useMemo(
    () => selectedExperience?.bullets || [],
    [selectedExperience],
  )

  const selectedBullet = availableBullets[selectedBulletIndex] || ""

  const rewriteScore = activeRewrite
    ? scoreRewriteQuality(
        activeRewrite.result.originalText,
        activeRewrite.result.rewrittenText,
      )
    : null

  const rewriteAccess = canRunRewrite(membership, usage)

  const rewriteLimitText =
    membership.rewriteLimit < 0
      ? `${usage.aiRewritesUsed} rewrites used · Unlimited plan`
      : `${usage.aiRewritesUsed} of ${membership.rewriteLimit} rewrites used`

  function handleExperienceChange(nextExperienceId: string) {
    setSelectedExperienceId(nextExperienceId)
    setSelectedBulletIndex(0)
    setActiveRewrite(null)
    setRewriteMessage("")
  }

  function handleBulletChange(nextBulletIndex: number) {
    setSelectedBulletIndex(nextBulletIndex)
    setActiveRewrite(null)
    setRewriteMessage("")
  }

  async function runRewriteWithAccessCheck(
    rewriteType: "summary" | "bullet",
  ) {
    setRewriteMessage("")

    if (loadingAccess) {
      setRewriteMessage("Membership access is still loading. Try again.")
      return
    }

    const access = canRunRewrite(membership, usage)

    if (!access.allowed) {
      setRewriteMessage(
        access.reason ||
          "AI rewrite limit reached. Upgrade your membership to continue using AI rewrites.",
      )
      return
    }

    if (rewriteType === "bullet" && !selectedBullet.trim()) {
      setRewriteMessage("Select a bullet with text before rewriting.")
      return
    }

    setRunningRewrite(true)

    try {
      const result =
        rewriteType === "summary"
          ? AIRewriteEngine.rewriteSummary(data.summary)
          : AIRewriteEngine.rewriteBullet(selectedBullet)

      const usageResult = await incrementAIRewrite()

      if (usageResult.status !== "success") {
        setRewriteMessage(
          usageResult.message ||
            "Rewrite generated, but usage tracking could not be updated.",
        )
        return
      }

      setUsage((currentUsage) => ({
        ...currentUsage,
        aiRewritesUsed: currentUsage.aiRewritesUsed + 1,
      }))

      setActiveRewrite({
        type: rewriteType,
        result,
        experienceId:
          rewriteType === "bullet" ? selectedExperience?.id : undefined,
        bulletIndex:
          rewriteType === "bullet" ? selectedBulletIndex : undefined,
      })

      setRewriteMessage("Rewrite generated successfully.")
    } catch {
      setRewriteMessage("Rewrite request failed.")
    } finally {
      setRunningRewrite(false)
    }
  }

  function rewriteSummary() {
    runRewriteWithAccessCheck("summary")
  }

  function rewriteSelectedBullet() {
    runRewriteWithAccessCheck("bullet")
  }

  function applyRewrite() {
    if (!activeRewrite) return

    if (activeRewrite.type === "summary") {
      const updatedResume: ResumeBuilderFormData = {
        ...data,
        summary: activeRewrite.result.rewrittenText,
      }

      addRewriteHistoryItem(
        createRewriteHistoryItem({
          rewriteType: "summary",
          result: activeRewrite.result,
          resumeBefore: data,
          resumeAfter: updatedResume,
        }),
      )

      onResumeUpdate(updatedResume)
      onHistoryUpdated?.()
      setActiveRewrite(null)
      setRewriteMessage("Rewrite applied to summary.")
      return
    }

    if (
      activeRewrite.type === "bullet" &&
      activeRewrite.experienceId &&
      typeof activeRewrite.bulletIndex === "number"
    ) {
      const updatedResume: ResumeBuilderFormData = {
        ...data,
        experience: data.experience.map((job) =>
          job.id === activeRewrite.experienceId
            ? {
                ...job,
                bullets: job.bullets.map((bullet, index) =>
                  index === activeRewrite.bulletIndex
                    ? activeRewrite.result.rewrittenText
                    : bullet,
                ),
              }
            : job,
        ),
      }

      addRewriteHistoryItem(
        createRewriteHistoryItem({
          rewriteType: "bullet",
          result: activeRewrite.result,
          resumeBefore: data,
          resumeAfter: updatedResume,
        }),
      )

      onResumeUpdate(updatedResume)
      onHistoryUpdated?.()
      setActiveRewrite(null)
      setRewriteMessage("Rewrite applied to selected bullet.")
    }
  }

  return (
    <section className="grid min-w-0 gap-4 rounded-3xl border border-indigo-200 bg-indigo-50 p-4 shadow-sm sm:p-5">
      <div className="flex min-w-0 items-start gap-3">
        <div className="shrink-0 rounded-2xl bg-white p-2 text-indigo-700 shadow-sm">
          <FilePenLine size={18} />
        </div>

        <div className="min-w-0">
          <h3 className="text-lg font-black text-slate-950">
            AI Rewrite Assistant
          </h3>

          <p className="mt-1 text-sm leading-6 text-slate-600">
            Select a job and bullet, generate stronger wording, compare the
            rewrite quality, then apply it directly into that exact resume
            section.
          </p>

          <p className="mt-2 text-xs font-black uppercase tracking-[0.14em] text-indigo-700">
            {loadingAccess ? "Loading rewrite access..." : rewriteLimitText}
          </p>
        </div>
      </div>

      {rewriteMessage && (
        <div
          className={`flex items-start gap-2 rounded-2xl border p-3 text-sm font-bold leading-6 ${
            rewriteAccess.allowed
              ? "border-blue-100 bg-blue-50 text-blue-800"
              : "border-amber-200 bg-amber-50 text-amber-900"
          }`}
        >
          {rewriteAccess.allowed ? (
            <CheckCircle2 size={16} className="mt-0.5 shrink-0" />
          ) : (
            <AlertTriangle size={16} className="mt-0.5 shrink-0" />
          )}

          <span>{rewriteMessage}</span>
        </div>
      )}

      <div className="grid min-w-0 gap-3 rounded-3xl border border-indigo-100 bg-white p-4 shadow-sm">
        <div className="grid min-w-0 grid-cols-1 gap-3 xl:grid-cols-2">
          <label className="grid min-w-0 gap-2 text-sm font-black text-slate-700">
            Experience Entry
            <select
              value={selectedExperience?.id || ""}
              onChange={(event) => handleExperienceChange(event.target.value)}
              className="block w-full min-w-0 max-w-full truncate rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
            >
              {data.experience.map((experience, index) => (
                <option key={experience.id} value={experience.id}>
                  {experience.role || `Experience ${index + 1}`}
                  {experience.company ? ` — ${experience.company}` : ""}
                </option>
              ))}
            </select>
          </label>

          <label className="grid min-w-0 gap-2 text-sm font-black text-slate-700">
            Bullet To Rewrite
            <select
              value={selectedBulletIndex}
              onChange={(event) =>
                handleBulletChange(Number(event.target.value))
              }
              className="block w-full min-w-0 max-w-full truncate rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
            >
              {availableBullets.map((bullet, index) => (
                <option key={`${selectedExperience?.id}-${index}`} value={index}>
                  Bullet {index + 1}:{" "}
                  {bullet ? bullet.slice(0, 70) : "Empty bullet"}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="min-w-0 rounded-2xl border border-slate-200 bg-slate-50 p-3">
          <p className="text-xs font-black uppercase tracking-[0.14em] text-slate-500">
            Selected Bullet
          </p>

          <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-6 text-slate-600">
            {selectedBullet || "No bullet selected."}
          </p>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <button
          type="button"
          onClick={rewriteSummary}
          disabled={runningRewrite || loadingAccess || !rewriteAccess.allowed}
          className="rounded-2xl border border-indigo-200 bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-400 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <div className="flex items-center gap-2 text-sm font-black text-indigo-700">
            <Sparkles size={16} />
            {runningRewrite ? "Generating..." : "Rewrite Summary"}
          </div>

          <p className="mt-2 text-sm leading-6 text-slate-600">
            Improve the professional summary with stronger ATS-friendly value
            language.
          </p>
        </button>

        <button
          type="button"
          onClick={rewriteSelectedBullet}
          disabled={
            runningRewrite ||
            loadingAccess ||
            !rewriteAccess.allowed ||
            !selectedBullet.trim()
          }
          className="rounded-2xl border border-indigo-200 bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-400 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <div className="flex items-center gap-2 text-sm font-black text-indigo-700">
            <RefreshCw size={16} />
            {runningRewrite ? "Generating..." : "Rewrite Selected Bullet"}
          </div>

          <p className="mt-2 text-sm leading-6 text-slate-600">
            Rewrite the selected bullet and apply it back to the exact same job
            entry.
          </p>
        </button>
      </div>

      {!rewriteAccess.allowed && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900">
          <p className="font-black">AI rewrite limit reached</p>
          <p className="mt-1">
            Upgrade messaging and Stripe plan changes will be connected during
            the billing integration phase.
          </p>
        </div>
      )}

      {activeRewrite && (
        <div className="grid min-w-0 gap-4 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="min-w-0">
            <p className="text-sm font-black uppercase tracking-[0.16em] text-slate-500">
              Before
            </p>

            <p className="mt-2 whitespace-pre-wrap break-words rounded-2xl border border-slate-200 bg-slate-50 p-3 text-sm leading-6 text-slate-600">
              {activeRewrite.result.originalText || "No original text found."}
            </p>
          </div>

          <div className="min-w-0">
            <p className="flex items-center gap-2 text-sm font-black uppercase tracking-[0.16em] text-emerald-700">
              <CheckCircle2 size={15} />
              After
            </p>

            <p className="mt-2 whitespace-pre-wrap break-words rounded-2xl border border-emerald-200 bg-emerald-50 p-3 text-sm leading-6 text-emerald-800">
              {activeRewrite.result.rewrittenText}
            </p>
          </div>

          {rewriteScore && <ResumeRewriteScoreCard result={rewriteScore} />}

          <div className="rounded-2xl border border-blue-100 bg-blue-50 p-3 text-sm leading-6 text-blue-800">
            {activeRewrite.result.explanation}
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <button
              type="button"
              onClick={applyRewrite}
              className="rounded-2xl bg-indigo-600 px-4 py-3 text-sm font-black text-white transition hover:bg-indigo-700"
            >
              Apply Rewrite
            </button>

            <button
              type="button"
              onClick={() => setActiveRewrite(null)}
              className="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm font-black text-slate-700 transition hover:border-indigo-300 hover:text-indigo-700"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </section>
  )
}
