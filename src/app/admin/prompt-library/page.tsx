"use client"

import { useEffect, useMemo, useState } from "react"
import type { ComponentType, ReactNode } from "react"
import {
  CheckCircle2,
  ClipboardCheck,
  FilePlus2,
  Filter,
  Gauge,
  Library,
  Loader2,
  RefreshCw,
  Save,
  Search,
  ShieldCheck,
  Sparkles,
  Trash2,
  XCircle,
} from "lucide-react"

type PromptStatus = "pending" | "approved" | "rejected" | "applied"
type StrengthSignal = "strong" | "healthy" | "watch" | "weak" | "unproven"

type PromptGuidance = {
  id: string
  module_key: string
  feature_key: string
  source_event_id: string | null
  status: PromptStatus
  priority: number
  suggestion_type: string
  title: string
  rationale: string
  prompt_guidance: string
  evidence: Record<string, unknown>
  reviewer_note: string | null
  reviewed_at: string | null
  applied_at: string | null
  created_at: string
  quality_score: number
  strength_signal: StrengthSignal
  positive_signal_count: number
  negative_signal_count: number
  total_signal_count: number
  last_scored_at: string | null
}

type PromptSummary = {
  total: number
  pending: number
  approved: number
  applied: number
  rejected: number
  strong: number
  weak: number
  averageScore: number | null
  modules: string[]
  features: string[]
}

type PromptPayload = {
  status: string
  message?: string
  prompts: PromptGuidance[]
  summary: PromptSummary
  statuses: PromptStatus[]
  strengthSignals: StrengthSignal[]
}

type PromptForm = {
  id: string
  moduleKey: string
  featureKey: string
  title: string
  rationale: string
  promptGuidance: string
  suggestionType: string
  promptStatus: PromptStatus
  priority: number
  qualityScore: number
  strengthSignal: StrengthSignal
  reviewerNote: string
}

const emptySummary: PromptSummary = {
  total: 0,
  pending: 0,
  approved: 0,
  applied: 0,
  rejected: 0,
  strong: 0,
  weak: 0,
  averageScore: null,
  modules: [],
  features: [],
}

const emptyForm: PromptForm = {
  id: "",
  moduleKey: "career_coach",
  featureKey: "general_coaching",
  title: "",
  rationale: "",
  promptGuidance: "",
  suggestionType: "manual_prompt_guidance",
  promptStatus: "pending",
  priority: 2,
  qualityScore: 70,
  strengthSignal: "unproven",
  reviewerNote: "",
}

const statusStyles: Record<PromptStatus, string> = {
  pending: "border-amber-200 bg-amber-50 text-amber-700",
  approved: "border-blue-200 bg-blue-50 text-blue-700",
  applied: "border-emerald-200 bg-emerald-50 text-emerald-700",
  rejected: "border-rose-200 bg-rose-50 text-rose-700",
}

const signalStyles: Record<StrengthSignal, string> = {
  strong: "border-emerald-200 bg-emerald-50 text-emerald-700",
  healthy: "border-blue-200 bg-blue-50 text-blue-700",
  watch: "border-amber-200 bg-amber-50 text-amber-700",
  weak: "border-rose-200 bg-rose-50 text-rose-700",
  unproven: "border-slate-200 bg-slate-100 text-slate-600",
}

function titleCase(value: string) {
  return value
    .replaceAll("_", " ")
    .replace(/\b\w/g, (character) => character.toUpperCase())
}

function toForm(prompt: PromptGuidance): PromptForm {
  return {
    id: prompt.id,
    moduleKey: prompt.module_key,
    featureKey: prompt.feature_key,
    title: prompt.title,
    rationale: prompt.rationale,
    promptGuidance: prompt.prompt_guidance,
    suggestionType: prompt.suggestion_type,
    promptStatus: prompt.status,
    priority: prompt.priority,
    qualityScore: prompt.quality_score,
    strengthSignal: prompt.strength_signal,
    reviewerNote: prompt.reviewer_note || "",
  }
}

export default function AdminPromptLibraryPage() {
  const [prompts, setPrompts] = useState<PromptGuidance[]>([])
  const [summary, setSummary] = useState<PromptSummary>(emptySummary)
  const [statuses, setStatuses] = useState<PromptStatus[]>([
    "pending",
    "approved",
    "rejected",
    "applied",
  ])
  const [strengthSignals, setStrengthSignals] = useState<StrengthSignal[]>([
    "strong",
    "healthy",
    "watch",
    "weak",
    "unproven",
  ])
  const [form, setForm] = useState<PromptForm>(emptyForm)
  const [query, setQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<PromptStatus | "all">("all")
  const [moduleFilter, setModuleFilter] = useState("all")
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState("")

  const filteredPrompts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()

    return prompts.filter((prompt) => {
      if (statusFilter !== "all" && prompt.status !== statusFilter) {
        return false
      }

      if (moduleFilter !== "all" && prompt.module_key !== moduleFilter) {
        return false
      }

      if (!normalizedQuery) {
        return true
      }

      return [
        prompt.title,
        prompt.module_key,
        prompt.feature_key,
        prompt.suggestion_type,
        prompt.rationale,
        prompt.prompt_guidance,
      ]
        .join(" ")
        .toLowerCase()
        .includes(normalizedQuery)
    })
  }, [moduleFilter, prompts, query, statusFilter])

  async function loadPromptLibrary() {
    setLoading(true)
    setMessage("")

    try {
      const response = await fetch("/api/admin/prompt-library", {
        cache: "no-store",
      })
      const payload = (await response.json()) as PromptPayload

      if (!response.ok) {
        throw new Error(payload.message || "Prompt library could not be loaded.")
      }

      setPrompts(payload.prompts)
      setSummary(payload.summary)
      setStatuses(payload.statuses)
      setStrengthSignals(payload.strengthSignals)

      if (!form.id && payload.prompts[0]) {
        setForm(toForm(payload.prompts[0]))
      }
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Prompt library could not be loaded.",
      )
    } finally {
      setLoading(false)
    }
  }

  async function runAction(body: Record<string, unknown>, successMessage: string) {
    setSaving(true)
    setMessage("")

    try {
      const response = await fetch("/api/admin/prompt-library", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      })
      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || "Prompt library action failed.")
      }

      setMessage(result.message || successMessage)
      await loadPromptLibrary()
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Prompt library action failed.")
    } finally {
      setSaving(false)
    }
  }

  useEffect(() => {
    loadPromptLibrary()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <main className="min-h-screen bg-slate-100 px-5 py-6 lg:px-8">
      <div className="mx-auto grid max-w-[1500px] gap-6">
        <section className="rounded-[28px] border border-slate-200 bg-slate-950 p-6 text-white shadow-sm">
          <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-end">
            <div>
              <div className="mb-4 flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-blue-100">
                <Library size={14} />
                Prompt Operations
              </div>
              <h1 className="text-3xl font-black tracking-tight">
                Prompt Library
              </h1>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-300">
                Create, review, score, and activate prompt guidance used by
                Crestpoint AI modules.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <Metric label="Total" value={summary.total} />
              <Metric label="Applied" value={summary.applied} />
              <Metric label="Avg Score" value={summary.averageScore ?? "n/a"} />
            </div>
          </div>
        </section>

        {message ? (
          <div className="rounded-2xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm font-bold text-blue-800">
            {message}
          </div>
        ) : null}

        <section className="grid gap-5 xl:grid-cols-[390px_minmax(0,1fr)]">
          <aside className="grid gap-5">
            <div className="rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.16em] text-blue-600">
                    Library
                  </p>
                  <h2 className="text-lg font-black text-slate-950">
                    Prompt guidance
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={loadPromptLibrary}
                  className="rounded-2xl border border-slate-200 p-2 text-slate-600 hover:bg-slate-50"
                  aria-label="Refresh prompt library"
                >
                  {loading ? <Loader2 size={17} className="animate-spin" /> : <RefreshCw size={17} />}
                </button>
              </div>

              <div className="grid gap-3">
                <label className="relative block">
                  <Search
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Search prompts"
                    className="w-full rounded-2xl border border-slate-200 py-2 pl-9 pr-3 text-sm font-bold text-slate-900 outline-none focus:border-blue-400"
                  />
                </label>

                <div className="grid grid-cols-2 gap-2">
                  <label className="grid gap-1">
                    <span className="flex items-center gap-1 text-xs font-black uppercase tracking-[0.12em] text-slate-500">
                      <Filter size={13} />
                      Status
                    </span>
                    <select
                      value={statusFilter}
                      onChange={(event) =>
                        setStatusFilter(event.target.value as PromptStatus | "all")
                      }
                      className="rounded-2xl border border-slate-200 px-3 py-2 text-sm font-bold text-slate-900 outline-none focus:border-blue-400"
                    >
                      <option value="all">All</option>
                      {statuses.map((status) => (
                        <option key={status} value={status}>
                          {titleCase(status)}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="grid gap-1">
                    <span className="text-xs font-black uppercase tracking-[0.12em] text-slate-500">
                      Module
                    </span>
                    <select
                      value={moduleFilter}
                      onChange={(event) => setModuleFilter(event.target.value)}
                      className="rounded-2xl border border-slate-200 px-3 py-2 text-sm font-bold text-slate-900 outline-none focus:border-blue-400"
                    >
                      <option value="all">All</option>
                      {summary.modules.map((module) => (
                        <option key={module} value={module}>
                          {titleCase(module)}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
              </div>

              <div className="mt-4 grid max-h-[680px] gap-2 overflow-y-auto pr-1">
                {filteredPrompts.map((prompt) => (
                  <button
                    key={prompt.id}
                    type="button"
                    onClick={() => setForm(toForm(prompt))}
                    className={`rounded-2xl border p-3 text-left transition ${
                      form.id === prompt.id
                        ? "border-blue-300 bg-blue-50"
                        : "border-slate-200 bg-white hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-black text-slate-950">
                          {prompt.title}
                        </p>
                        <p className="mt-1 truncate text-xs font-bold text-slate-500">
                          {prompt.module_key} / {prompt.feature_key}
                        </p>
                      </div>
                      <span
                        className={`shrink-0 rounded-full border px-2 py-1 text-[11px] font-black ${statusStyles[prompt.status]}`}
                      >
                        {titleCase(prompt.status)}
                      </span>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <span
                        className={`rounded-full border px-2 py-1 text-[11px] font-black ${signalStyles[prompt.strength_signal]}`}
                      >
                        {prompt.quality_score}/100
                      </span>
                      <span className="rounded-full border border-slate-200 bg-slate-50 px-2 py-1 text-[11px] font-black text-slate-600">
                        P{prompt.priority}
                      </span>
                    </div>
                  </button>
                ))}

                {!loading && filteredPrompts.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-slate-300 p-4 text-sm font-bold text-slate-500">
                    No prompts match this view.
                  </div>
                ) : null}
              </div>
            </div>

            <div className="rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm">
              <div className="mb-4 flex items-center gap-3">
                <div className="rounded-2xl bg-blue-50 p-3 text-blue-700">
                  <Gauge size={18} />
                </div>
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.16em] text-blue-600">
                    Signals
                  </p>
                  <h2 className="text-lg font-black text-slate-950">
                    Quality summary
                  </h2>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <MiniMetric label="Pending" value={summary.pending} />
                <MiniMetric label="Approved" value={summary.approved} />
                <MiniMetric label="Strong" value={summary.strong} />
                <MiniMetric label="Watch / Weak" value={summary.weak} />
              </div>
            </div>
          </aside>

          <section className="grid gap-5">
            <form
              className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm"
              onSubmit={(event) => {
                event.preventDefault()
                runAction(
                  {
                    action: form.id ? "update" : "create",
                    ...form,
                  },
                  form.id ? "Prompt guidance updated." : "Prompt guidance created.",
                )
              }}
            >
              <div className="mb-5 flex flex-col gap-3 border-b border-slate-100 pb-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.16em] text-blue-600">
                    {form.id ? "Edit Prompt" : "New Prompt"}
                  </p>
                  <h2 className="text-2xl font-black text-slate-950">
                    {form.title || "Prompt guidance editor"}
                  </h2>
                  <p className="mt-2 text-sm font-semibold leading-6 text-slate-500">
                    Guidance marked approved or applied is available to live AI
                    modules through the prompt-learning service.
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => setForm(emptyForm)}
                    className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-black text-slate-700 hover:bg-slate-50"
                  >
                    <FilePlus2 size={16} />
                    New
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="inline-flex items-center gap-2 rounded-2xl bg-slate-950 px-4 py-2 text-sm font-black text-white hover:bg-slate-800 disabled:opacity-60"
                  >
                    {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                    Save
                  </button>
                </div>
              </div>

              <div className="grid gap-4 lg:grid-cols-2">
                <Field label="Module Key">
                  <input
                    value={form.moduleKey}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        moduleKey: event.target.value,
                      }))
                    }
                    className="rounded-2xl border border-slate-200 px-3 py-2 text-sm font-bold text-slate-900 outline-none focus:border-blue-400"
                    placeholder="networking_outreach"
                  />
                </Field>

                <Field label="Feature Key">
                  <input
                    value={form.featureKey}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        featureKey: event.target.value,
                      }))
                    }
                    className="rounded-2xl border border-slate-200 px-3 py-2 text-sm font-bold text-slate-900 outline-none focus:border-blue-400"
                    placeholder="recruiter_outreach"
                  />
                </Field>

                <Field label="Title">
                  <input
                    value={form.title}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        title: event.target.value,
                      }))
                    }
                    className="rounded-2xl border border-slate-200 px-3 py-2 text-sm font-bold text-slate-900 outline-none focus:border-blue-400"
                    placeholder="Baseline: recruiter outreach"
                    required
                  />
                </Field>

                <Field label="Suggestion Type">
                  <input
                    value={form.suggestionType}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        suggestionType: event.target.value,
                      }))
                    }
                    className="rounded-2xl border border-slate-200 px-3 py-2 text-sm font-bold text-slate-900 outline-none focus:border-blue-400"
                  />
                </Field>

                <div className="grid gap-4 sm:grid-cols-4 lg:col-span-2">
                  <Field label="Status">
                    <select
                      value={form.promptStatus}
                      onChange={(event) =>
                        setForm((current) => ({
                          ...current,
                          promptStatus: event.target.value as PromptStatus,
                        }))
                      }
                      className="rounded-2xl border border-slate-200 px-3 py-2 text-sm font-bold text-slate-900 outline-none focus:border-blue-400"
                    >
                      {statuses.map((status) => (
                        <option key={status} value={status}>
                          {titleCase(status)}
                        </option>
                      ))}
                    </select>
                  </Field>

                  <Field label="Priority">
                    <input
                      type="number"
                      min={1}
                      max={5}
                      value={form.priority}
                      onChange={(event) =>
                        setForm((current) => ({
                          ...current,
                          priority: Number(event.target.value),
                        }))
                      }
                      className="rounded-2xl border border-slate-200 px-3 py-2 text-sm font-bold text-slate-900 outline-none focus:border-blue-400"
                    />
                  </Field>

                  <Field label="Score">
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={form.qualityScore}
                      onChange={(event) =>
                        setForm((current) => ({
                          ...current,
                          qualityScore: Number(event.target.value),
                        }))
                      }
                      className="rounded-2xl border border-slate-200 px-3 py-2 text-sm font-bold text-slate-900 outline-none focus:border-blue-400"
                    />
                  </Field>

                  <Field label="Signal">
                    <select
                      value={form.strengthSignal}
                      onChange={(event) =>
                        setForm((current) => ({
                          ...current,
                          strengthSignal: event.target.value as StrengthSignal,
                        }))
                      }
                      className="rounded-2xl border border-slate-200 px-3 py-2 text-sm font-bold text-slate-900 outline-none focus:border-blue-400"
                    >
                      {strengthSignals.map((signal) => (
                        <option key={signal} value={signal}>
                          {titleCase(signal)}
                        </option>
                      ))}
                    </select>
                  </Field>
                </div>

                <Field label="Rationale">
                  <textarea
                    value={form.rationale}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        rationale: event.target.value,
                      }))
                    }
                    className="min-h-[170px] rounded-2xl border border-slate-200 px-3 py-2 text-sm font-semibold leading-6 text-slate-900 outline-none focus:border-blue-400"
                    placeholder="Why this guidance exists and what quality problem it solves."
                    required
                  />
                </Field>

                <Field label="Prompt Guidance">
                  <textarea
                    value={form.promptGuidance}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        promptGuidance: event.target.value,
                      }))
                    }
                    className="min-h-[220px] rounded-2xl border border-slate-200 px-3 py-2 text-sm font-semibold leading-6 text-slate-900 outline-none focus:border-blue-400"
                    placeholder="The reusable instruction that should improve future model responses."
                    required
                  />
                </Field>

                <Field label="Reviewer Note">
                  <textarea
                    value={form.reviewerNote}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        reviewerNote: event.target.value,
                      }))
                    }
                    className="rounded-2xl border border-slate-200 px-3 py-2 text-sm font-semibold leading-6 text-slate-900 outline-none focus:border-blue-400 lg:col-span-2"
                    placeholder="Internal note for approvals, tests, or changes."
                  />
                </Field>
              </div>
            </form>

            {form.id ? (
              <section className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
                <div className="mb-4 flex items-center gap-3">
                  <div className="rounded-2xl bg-blue-50 p-3 text-blue-700">
                    <ClipboardCheck size={18} />
                  </div>
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.16em] text-blue-600">
                      Review Actions
                    </p>
                    <h2 className="text-lg font-black text-slate-950">
                      Activate, score, or remove guidance
                    </h2>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <ReviewButton
                    label="Approve"
                    icon={CheckCircle2}
                    disabled={saving}
                    onClick={() =>
                      runAction(
                        {
                          action: "set_status",
                          id: form.id,
                          promptStatus: "approved",
                          reviewerNote: form.reviewerNote,
                        },
                        "Prompt approved.",
                      )
                    }
                  />
                  <ReviewButton
                    label="Apply"
                    icon={ShieldCheck}
                    disabled={saving}
                    onClick={() =>
                      runAction(
                        {
                          action: "set_status",
                          id: form.id,
                          promptStatus: "applied",
                          reviewerNote: form.reviewerNote,
                        },
                        "Prompt applied.",
                      )
                    }
                  />
                  <ReviewButton
                    label="Reject"
                    icon={XCircle}
                    disabled={saving}
                    onClick={() =>
                      runAction(
                        {
                          action: "set_status",
                          id: form.id,
                          promptStatus: "rejected",
                          reviewerNote: form.reviewerNote,
                        },
                        "Prompt rejected.",
                      )
                    }
                  />
                  <ReviewButton
                    label="Recalculate Score"
                    icon={Sparkles}
                    disabled={saving}
                    onClick={() =>
                      runAction(
                        {
                          action: "recalculate",
                          moduleKey: form.moduleKey,
                          featureKey: form.featureKey,
                        },
                        "Prompt score recalculated.",
                      )
                    }
                  />
                  <ReviewButton
                    label="Delete"
                    icon={Trash2}
                    danger
                    disabled={saving}
                    onClick={() => {
                      if (window.confirm("Delete this prompt guidance?")) {
                        runAction(
                          {
                            action: "delete",
                            id: form.id,
                          },
                          "Prompt deleted.",
                        )
                        setForm(emptyForm)
                      }
                    }}
                  />
                </div>
              </section>
            ) : null}
          </section>
        </section>
      </div>
    </main>
  )
}

function Metric({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl border border-white/15 bg-white/10 p-4">
      <p className="text-xs font-black uppercase tracking-[0.14em] text-blue-100">
        {label}
      </p>
      <p className="mt-2 text-2xl font-black text-white">{value}</p>
    </div>
  )
}

function MiniMetric({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
      <p className="text-xs font-black uppercase tracking-[0.12em] text-slate-500">
        {label}
      </p>
      <p className="mt-1 text-xl font-black text-slate-950">{value}</p>
    </div>
  )
}

function Field({
  label,
  children,
}: {
  label: string
  children: ReactNode
}) {
  return (
    <label className="grid gap-2">
      <span className="text-xs font-black uppercase tracking-[0.12em] text-slate-500">
        {label}
      </span>
      {children}
    </label>
  )
}

function ReviewButton({
  label,
  icon: Icon,
  disabled,
  danger = false,
  onClick,
}: {
  label: string
  icon: ComponentType<{ size?: number }>
  disabled?: boolean
  danger?: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`inline-flex items-center gap-2 rounded-2xl border px-4 py-2 text-sm font-black transition disabled:opacity-60 ${
        danger
          ? "border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100"
          : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
      }`}
    >
      <Icon size={16} />
      {label}
    </button>
  )
}
