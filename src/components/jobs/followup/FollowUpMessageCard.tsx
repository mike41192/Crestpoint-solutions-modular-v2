"use client"

// =====================================================
// BLOCK: Imports
// Crestpoint Solutions V2
// Version: 1.9.9
// =====================================================

import { Clipboard } from "lucide-react"
import type { FollowUpGenerationResponse } from "@/modules/job-followup-ai"

// =====================================================
// BLOCK: Component Types
// =====================================================

type FollowUpMessageCardProps = {
  result: FollowUpGenerationResponse
}

// =====================================================
// BLOCK: Follow-Up Message Card
// =====================================================

export function FollowUpMessageCard({ result }: FollowUpMessageCardProps) {
  async function copyMessage() {
    await navigator.clipboard.writeText(
      `Subject: ${result.subject}\n\n${result.message}`,
    )
  }

  return (
    <div className="rounded-2xl border border-blue-100 bg-blue-50 p-4">
      <p className="text-xs font-black uppercase tracking-[0.16em] text-blue-700">
        Generated Message
      </p>

      <p className="mt-3 text-sm font-black text-slate-950">
        Subject: {result.subject}
      </p>

      <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-slate-700">
        {result.message}
      </p>

      <button
        type="button"
        onClick={copyMessage}
        className="mt-4 inline-flex items-center gap-2 rounded-full bg-blue-600 px-4 py-2 text-xs font-black text-white transition hover:bg-blue-700"
      >
        <Clipboard size={14} />
        Copy Message
      </button>
    </div>
  )
}
