"use client"

// =====================================================
// BLOCK: Imports
// Crestpoint Solutions V2
// Version: 1.8.5
// =====================================================

import { Target } from "lucide-react"

// =====================================================
// BLOCK: Resume Job Match Header Component
// =====================================================

export function ResumeJobMatchHeader() {
  return (
    <div className="flex min-w-0 items-start gap-3">
      <div className="shrink-0 rounded-2xl bg-white p-2 text-violet-700 shadow-sm">
        <Target size={18} />
      </div>

      <div className="min-w-0">
        <h3 className="break-words text-lg font-black text-slate-950">
          ATS Job Match
        </h3>

        <p className="mt-1 break-words text-sm leading-6 text-slate-600">
          Paste or load a saved job description to compare your resume against
          target role keywords, missing skills, section strength, gaps, and ATS
          compatibility.
        </p>
      </div>
    </div>
  )
}
