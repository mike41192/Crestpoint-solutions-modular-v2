"use client"

// =====================================================
// BLOCK: Imports
// =====================================================

import { useMemo, useState } from "react"
import {
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
  // =====================================================
  // BLOCK: Local State
  // =====================================================

  const firstExperienceId = data.experience[0]?.id || ""

  const [selectedExperienceId, setSelectedExperienceId] =
    useState(firstExperienceId)

  const [selectedBulletIndex, setSelectedBulletIndex] = useState(0)

  const [activeRewrite, setActiveRewrite] = useState<ActiveRewrite | null>(null)

  // =====================================================
  // BLOCK: Derived Data
  // =====================================================

  const selectedExperience = useMemo(
    () =>
      data.experience.find((experience) => experience.id === selectedExperienceId) ||
      data.experience[0],
    [data.experience, selectedExperienceId]
  )

  const availableBullets = useMemo(
    () => selectedExperience?.bullets || [],
    [selectedExperience]
  )

  const selectedBullet = availableBullets[selectedBulletIndex] || ""

  const rewriteScore = activeRewrite
    ? scoreRewriteQuality(
        activeRewrite.result.originalText,
        activeRewrite.result.rewrittenText
      )
    : null

  // =====================================================
  // BLOCK: Selector Handlers
  // =====================================================

  function handleExperienceChange(nextExperienceId: string) {
    setSelectedExperienceId(nextExperienceId)
    setSelectedBulletIndex(0)
    setActiveRewrite(null)
  }

  function handleBulletChange(nextBulletIndex: number) {
    setSelectedBulletIndex(nextBulletIndex)
    setActiveRewrite(null)
  }

  // =====================================================
  // BLOCK: Rewrite Actions
  // =====================================================

  function rewriteSummary() {
    const result = AIRewriteEngine.rewriteSummary(data.summary)

    setActiveRewrite({
      type: "summary",
      result,
    })
  }

  function rewriteSelectedBullet() {
    const result = AIRewriteEngine.rewriteBullet(selectedBullet)

    setActiveRewrite({
      type: "bullet",
      result,
      experienceId: selectedExperience?.id,
      bulletIndex: selectedBulletIndex,
    })
  }

  // =====================================================
  // BLOCK: Apply Rewrite + Save Rewrite History
  // =====================================================

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
        })
      )

      onResumeUpdate(updatedResume)
      onHistoryUpdated?.()
      setActiveRewrite(null)
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
                    : bullet
                ),
              }
            : job
        ),
      }

      addRewriteHistoryItem(
        createRewriteHistoryItem({
          rewriteType: "bullet",
          result: activeRewrite.result,
          resumeBefore: data,
          resumeAfter: updatedResume,
        })
      )

      onResumeUpdate(updatedResume)
      onHistoryUpdated?.()
      setActiveRewrite(null)
    }
  }

  // =====================================================
  // BLOCK: Render
  // =====================================================

  return (
    <section className="grid gap-4 rounded-3xl border border-indigo-200 bg-indigo-50 p-4 shadow-sm sm:p-5">
      <div className="flex items-start gap-3">
        <div className="rounded-2xl bg-white p-2 text-indigo-700 shadow-sm">
          <FilePenLine size={18} />
        </div>

        <div>
          <h3 className="text-lg font-black text-slate-950">
            AI Rewrite Assistant
          </h3>

          <p className="mt-1 text-sm leading-6 text-slate-600">
            Select a job and bullet, generate stronger wording, compare the
            rewrite quality, then apply it directly into that exact resume
            section.
          </p>
        </div>
      </div>

      <div className="grid gap-3 rounded-3xl border border-indigo-100 bg-white p-4 shadow-sm">
        <div className="grid gap-3 lg:grid-cols-2">
          <label className="grid gap-2 text-sm font-black text-slate-700">
            Experience Entry
            <select
              value={selectedExperience?.id || ""}
              onChange={(event) => handleExperienceChange(event.target.value)}
              className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
            >
              {data.experience.map((experience, index) => (
                <option key={experience.id} value={experience.id}>
                  {experience.role || `Experience ${index + 1}`}
                  {experience.company ? ` — ${experience.company}` : ""}
                </option>
              ))}
            </select>
          </label>

          <label className="grid gap-2 text-sm font-black text-slate-700">
            Bullet To Rewrite
            <select
              value={selectedBulletIndex}
              onChange={(event) =>
                handleBulletChange(Number(event.target.value))
              }
              className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
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

        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
          <p className="text-xs font-black uppercase tracking-[0.14em] text-slate-500">
            Selected Bullet
          </p>

          <p className="mt-2 text-sm leading-6 text-slate-600">
            {selectedBullet || "No bullet selected."}
          </p>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <button
          type="button"
          onClick={rewriteSummary}
          className="rounded-2xl border border-indigo-200 bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-400"
        >
          <div className="flex items-center gap-2 text-sm font-black text-indigo-700">
            <Sparkles size={16} />
            Rewrite Summary
          </div>

          <p className="mt-2 text-sm leading-6 text-slate-600">
            Improve the professional summary with stronger ATS-friendly value
            language.
          </p>
        </button>

        <button
          type="button"
          onClick={rewriteSelectedBullet}
          disabled={!selectedBullet}
          className="rounded-2xl border border-indigo-200 bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-400 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <div className="flex items-center gap-2 text-sm font-black text-indigo-700">
            <RefreshCw size={16} />
            Rewrite Selected Bullet
          </div>

          <p className="mt-2 text-sm leading-6 text-slate-600">
            Rewrite the selected bullet and apply it back to the exact same job
            entry.
          </p>
        </button>
      </div>

      {activeRewrite && (
        <div className="grid gap-4 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.16em] text-slate-500">
              Before
            </p>

            <p className="mt-2 rounded-2xl border border-slate-200 bg-slate-50 p-3 text-sm leading-6 text-slate-600">
              {activeRewrite.result.originalText || "No original text found."}
            </p>
          </div>

          <div>
            <p className="flex items-center gap-2 text-sm font-black uppercase tracking-[0.16em] text-emerald-700">
              <CheckCircle2 size={15} />
              After
            </p>

            <p className="mt-2 rounded-2xl border border-emerald-200 bg-emerald-50 p-3 text-sm leading-6 text-emerald-800">
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
