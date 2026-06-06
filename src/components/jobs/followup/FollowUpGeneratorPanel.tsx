"use client"

// =====================================================
// BLOCK: Imports
// Crestpoint Solutions V2
// Version: 1.9.9
// =====================================================

import { useState } from "react"
import { Sparkles } from "lucide-react"
import { FollowUpMessageCard } from "./FollowUpMessageCard"
import {
  generateFollowUpMessage,
  type FollowUpGenerationResponse,
  type FollowUpMessageType,
} from "@/modules/job-followup-ai"
import type { JobApplicationRecord } from "@/modules/job-tracker"

// =====================================================
// BLOCK: Component Types
// =====================================================

type FollowUpGeneratorPanelProps = {
  application: JobApplicationRecord
}

// =====================================================
// BLOCK: Message Type Config
// =====================================================

const messageTypes: {
  label: string
  value: FollowUpMessageType
}[] = [
  { label: "Follow-Up Email", value: "follow_up" },
  { label: "Thank You Message", value: "thank_you" },
  { label: "Recruiter Outreach", value: "recruiter" },
  { label: "Networking Message", value: "networking" },
  { label: "Rejection Recovery", value: "rejection_recovery" },
]

// =====================================================
// BLOCK: Follow-Up Generator Panel
// =====================================================

export function FollowUpGeneratorPanel({
  application,
}: FollowUpGeneratorPanelProps) {
  const [messageType, setMessageType] =
    useState<FollowUpMessageType>("follow_up")

  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<FollowUpGenerationResponse | null>(null)

  async function handleGenerate() {
    setLoading(true)

    const generatedMessage = await generateFollowUpMessage({
      application,
      type: messageType,
    })

    setResult(generatedMessage)
    setLoading(false)
  }

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="rounded-2xl bg-violet-50 p-3 text-violet-700">
          <Sparkles size={20} />
        </div>

        <div>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-violet-600">
            AI Follow-Up Assistant
          </p>

          <h3 className="mt-2 text-lg font-black text-slate-950">
            Generate Career Messages
          </h3>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            Create professional follow-up, thank-you, recruiter, networking, or
            rejection recovery messages.
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-4">
        <label className="text-sm font-black text-slate-700">
          Message Type

          <select
            value={messageType}
            onChange={(event) =>
              setMessageType(event.target.value as FollowUpMessageType)
            }
            className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-800 outline-none focus:border-violet-400 focus:ring-4 focus:ring-violet-100"
          >
            {messageTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </label>

        <button
          type="button"
          onClick={handleGenerate}
          disabled={loading}
          className="w-fit rounded-full bg-violet-600 px-5 py-3 text-sm font-black text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:bg-slate-400"
        >
          {loading ? "Generating..." : "Generate Message"}
        </button>

        {result && <FollowUpMessageCard result={result} />}
      </div>
    </section>
  )
}
