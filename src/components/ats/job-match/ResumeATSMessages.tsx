"use client"

// =====================================================
// BLOCK: Imports
// Crestpoint Solutions V2
// Version: 1.8.5
// =====================================================

import { AlertTriangle, CheckCircle2 } from "lucide-react"

// =====================================================
// BLOCK: Component Types
// =====================================================

type ResumeATSMessagesProps = {
  message: string
  accessAllowed: boolean
}

// =====================================================
// BLOCK: Resume ATS Messages Component
// =====================================================

export function ResumeATSMessages({
  message,
  accessAllowed,
}: ResumeATSMessagesProps) {
  if (!message) {
    return null
  }

  return (
    <div
      className={`flex items-start gap-2 rounded-2xl border px-4 py-3 text-sm font-semibold ${
        accessAllowed
          ? "border-blue-100 bg-white text-slate-700"
          : "border-amber-200 bg-amber-50 text-amber-900"
      }`}
    >
      {accessAllowed ? (
        <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-blue-700" />
      ) : (
        <AlertTriangle size={16} className="mt-0.5 shrink-0 text-amber-700" />
      )}

      <span>{message}</span>
    </div>
  )
}