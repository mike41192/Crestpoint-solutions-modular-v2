"use client"

import { useMemo, useState } from "react"
import { Target } from "lucide-react"
import { ResumeATSPanel } from "@/components/resume/ResumeATSPanel"
import { ResumeOptimizationPanel } from "@/components/resume/ResumeOptimizationPanel"
import type { ResumeBuilderFormData } from "@/modules/resume-builder"
import { generateATSReport } from "@/modules/ats-engine"
import {
  applyOptimizationSuggestion,
  generateResumeOptimizationReport,
} from "@/modules/resume-optimizer"
import type { ResumeOptimizationSuggestion } from "@/modules/resume-optimizer"

type ResumeJobMatchFormProps = {
  data: ResumeBuilderFormData
  onResumeUpdate?: (data: ResumeBuilderFormData) => void
}

export function ResumeJobMatchForm({
  data,
  onResumeUpdate,
}: ResumeJobMatchFormProps) {
  const [jobDescription, setJobDescription] = useState("")

  const atsResult = useMemo(
    () => generateATSReport(data, jobDescription),
    [data, jobDescription]
  )

  const optimizationResult = useMemo(
    () =>
      generateResumeOptimizationReport({
        resume: data,
        jobDescription,
        atsResult,
      }),
    [data, jobDescription, atsResult]
  )

  function handleApplySuggestion(suggestion: ResumeOptimizationSuggestion) {
    if (!onResumeUpdate) {
      return
    }

    const updatedResume = applyOptimizationSuggestion(data, suggestion)
    onResumeUpdate(updatedResume)
  }

  return (
    <section className="grid gap-4 rounded-3xl border border-violet-200 bg-violet-50 p-4 shadow-sm sm:p-5">
      <div className="flex items-start gap-3">
        <div className="rounded-2xl bg-white p-2 text-violet-700 shadow-sm">
          <Target size={18} />
        </div>

        <div>
          <h3 className="text-lg font-black text-slate-950">ATS Job Match</h3>

          <p className="mt-1 text-sm leading-6 text-slate-600">
            Paste a job description to compare your resume against target role
            keywords, missing skills, section strength, and ATS compatibility.
          </p>
        </div>
      </div>

      <label className="block text-sm font-black text-slate-700">
        Job Description
        <textarea
          value={jobDescription}
          onChange={(event) => setJobDescription(event.target.value)}
          placeholder="Paste job description here..."
          className="mt-2 min-h-[190px] w-full resize-y rounded-2xl border border-violet-200 bg-white p-4 text-sm leading-6 text-slate-700 outline-none transition focus:border-violet-500 focus:ring-4 focus:ring-violet-100"
        />
      </label>

      <ResumeATSPanel result={atsResult} />

      <ResumeOptimizationPanel
        result={optimizationResult}
        onApplySuggestion={handleApplySuggestion}
      />
    </section>
  )
}
