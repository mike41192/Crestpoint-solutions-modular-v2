"use client"

import { useEffect, useMemo, useState } from "react"
import {
  AlertTriangle,
  CheckCircle2,
  RotateCcw,
  Save,
  SlidersHorizontal,
} from "lucide-react"
import { usageLimits, type TierUsageLimits } from "@/lib/config/limits.config"

type LimitField = {
  key: keyof Omit<TierUsageLimits, "tier">
  label: string
  description: string
}

const limitFields: LimitField[] = [
  {
    key: "aiCreditsPerMonth",
    label: "AI Credits",
    description: "Used by rewrites and AI-assisted generation.",
  },
  {
    key: "resumeUploadsPerMonth",
    label: "Resume Limit",
    description: "Controls saved resume creation and duplication.",
  },
  {
    key: "resumeExportsPerMonth",
    label: "Resume Exports",
    description: "Reserved for export enforcement.",
  },
  {
    key: "atsScansPerMonth",
    label: "ATS Scans",
    description: "Controls ATS analysis usage.",
  },
  {
    key: "mockInterviewsPerMonth",
    label: "Mock Interviews",
    description: "Controls AI interview practice limits.",
  },
  {
    key: "trackedJobs",
    label: "Tracked Jobs",
    description: "Controls total active job tracker records.",
  },
]

function formatLimit(value: number) {
  return value === -1 ? "Unlimited" : value.toLocaleString()
}

function cleanInputValue(value: string) {
  if (value.trim() === "") {
    return 0
  }

  const parsed = Number(value)

  if (!Number.isFinite(parsed)) {
    return 0
  }

  return Math.max(-1, Math.trunc(parsed))
}

export default function AdminUsageSettingsPage() {
  const [limits, setLimits] = useState<TierUsageLimits[]>(usageLimits)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState("")
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle")

  const hasUnlimitedAdmin = useMemo(() => {
    const adminLimits = limits.find((item) => item.tier === "admin")

    if (!adminLimits) {
      return false
    }

    return limitFields.every((field) => adminLimits[field.key] === -1)
  }, [limits])

  async function loadLimits() {
    setLoading(true)
    setMessage("")
    setStatus("idle")

    try {
      const response = await fetch("/api/admin/usage-limits", {
        method: "GET",
        cache: "no-store",
      })

      const result = await response.json()

      if (!response.ok || result.status !== "success") {
        throw new Error(result.message || "Usage limits could not be loaded.")
      }

      setLimits(result.limits || usageLimits)
      setMessage("Usage limits loaded.")
      setStatus("success")
    } catch (error) {
      setLimits(usageLimits)
      setMessage(
        error instanceof Error
          ? error.message
          : "Usage limits could not be loaded.",
      )
      setStatus("error")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadLimits()
  }, [])

  function updateLimit(
    tier: TierUsageLimits["tier"],
    key: keyof Omit<TierUsageLimits, "tier">,
    value: string,
  ) {
    const nextValue = cleanInputValue(value)

    setLimits((currentLimits) =>
      currentLimits.map((item) =>
        item.tier === tier
          ? {
              ...item,
              [key]: nextValue,
            }
          : item,
      ),
    )
  }

  function resetToDefaults() {
    setLimits(usageLimits)
    setMessage("Defaults restored locally. Save to apply them.")
    setStatus("idle")
  }

  async function saveLimits() {
    setSaving(true)
    setMessage("")
    setStatus("idle")

    try {
      const response = await fetch("/api/admin/usage-limits", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ limits }),
      })

      const result = await response.json()

      if (!response.ok || result.status !== "success") {
        throw new Error(result.message || "Usage limits could not be saved.")
      }

      setLimits(result.limits || limits)
      setMessage("Usage limits saved and will apply to module gates.")
      setStatus("success")
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Usage limits could not be saved.",
      )
      setStatus("error")
    } finally {
      setSaving(false)
    }
  }

  return (
    <main className="min-h-screen bg-slate-100 px-5 py-6 lg:px-8">
      <div className="mx-auto grid max-w-[1500px] gap-6">
        <section className="rounded-[32px] border border-slate-200 bg-slate-950 p-6 text-white shadow-sm">
          <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-center">
            <div>
              <div className="mb-4 flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-blue-100">
                <SlidersHorizontal size={14} />
                Usage Limits
              </div>

              <h1 className="text-3xl font-black tracking-tight">
                Edit tier limits from the admin panel
              </h1>

              <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-300">
                These limits power membership display, module gates, ATS usage,
                AI rewrite usage, resume creation, and tracked job caps.
              </p>
            </div>

            <div className="rounded-[24px] border border-white/15 bg-white/10 p-5">
              <p className="text-xs font-black uppercase tracking-[0.16em] text-blue-100">
                Admin Tier
              </p>

              <p className="mt-2 text-xl font-black">
                {hasUnlimitedAdmin ? "Unlimited access enabled" : "Review admin limits"}
              </p>

              <p className="mt-2 text-sm leading-6 text-slate-300">
                Use -1 for unlimited. Use 0 to block a metered action.
              </p>
            </div>
          </div>
        </section>

        {message && (
          <div
            className={`flex items-start gap-3 rounded-[24px] border p-4 text-sm font-bold leading-6 ${
              status === "error"
                ? "border-rose-200 bg-rose-50 text-rose-800"
                : "border-blue-100 bg-blue-50 text-blue-800"
            }`}
          >
            {status === "error" ? (
              <AlertTriangle size={18} className="mt-0.5 shrink-0" />
            ) : (
              <CheckCircle2 size={18} className="mt-0.5 shrink-0" />
            )}
            {message}
          </div>
        )}

        <section className="rounded-[32px] border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-3 border-b border-slate-200 p-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-xl font-black text-slate-950">
                Tier Limit Matrix
              </h2>
              <p className="mt-1 text-sm leading-6 text-slate-500">
                Changes are saved to Supabase and become the source of truth for
                the live app.
              </p>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">
              <button
                type="button"
                onClick={resetToDefaults}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-2.5 text-sm font-black text-slate-700 transition hover:border-blue-300 hover:text-blue-700"
              >
                <RotateCcw size={16} />
                Defaults
              </button>

              <button
                type="button"
                onClick={saveLimits}
                disabled={loading || saving}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-blue-600 px-4 py-2.5 text-sm font-black text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-400"
              >
                <Save size={16} />
                {saving ? "Saving..." : "Save Limits"}
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[1100px] border-collapse text-left">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="px-5 py-4 text-xs font-black uppercase tracking-[0.14em] text-slate-500">
                    Tier
                  </th>
                  {limitFields.map((field) => (
                    <th
                      key={field.key}
                      className="px-3 py-4 text-xs font-black uppercase tracking-[0.14em] text-slate-500"
                    >
                      {field.label}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {limits.map((tierLimits) => (
                  <tr
                    key={tierLimits.tier}
                    className="border-b border-slate-100 last:border-b-0"
                  >
                    <td className="px-5 py-4">
                      <p className="text-sm font-black capitalize text-slate-950">
                        {tierLimits.tier}
                      </p>
                      <p className="mt-1 text-xs font-semibold text-slate-500">
                        {limitFields
                          .map((field) => formatLimit(tierLimits[field.key]))
                          .join(" / ")}
                      </p>
                    </td>

                    {limitFields.map((field) => (
                      <td key={field.key} className="px-3 py-4 align-top">
                        <label className="grid gap-1">
                          <input
                            type="number"
                            min={-1}
                            value={tierLimits[field.key]}
                            onChange={(event) =>
                              updateLimit(
                                tierLimits.tier,
                                field.key,
                                event.target.value,
                              )
                            }
                            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-black text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                          />
                          <span className="text-xs leading-5 text-slate-500">
                            {field.description}
                          </span>
                        </label>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  )
}
