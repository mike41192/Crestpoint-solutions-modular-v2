// =====================================================
// BLOCK: Imports
// =====================================================

import { BarChart3, CheckCircle2, TriangleAlert } from "lucide-react"
import type { RewriteScoreResult } from "@/modules/rewrite-scoring"

// =====================================================
// BLOCK: Component Types
// =====================================================

type ResumeRewriteScoreCardProps = {
  result: RewriteScoreResult
}

// =====================================================
// BLOCK: Style Helpers
// =====================================================

function getScoreColor(score: number) {
  if (score >= 85) return "text-emerald-700"
  if (score >= 70) return "text-blue-700"
  if (score >= 50) return "text-amber-700"

  return "text-red-700"
}

function getScoreBarColor(score: number) {
  if (score >= 85) return "bg-emerald-600"
  if (score >= 70) return "bg-blue-600"
  if (score >= 50) return "bg-amber-500"

  return "bg-red-600"
}

// =====================================================
// BLOCK: Component
// =====================================================

export function ResumeRewriteScoreCard({ result }: ResumeRewriteScoreCardProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="flex items-center gap-2 text-sm font-black text-slate-700">
            <BarChart3 size={16} />
            Rewrite Quality Score
          </p>

          <p className="mt-1 text-sm text-slate-500">
            Estimated quality of the rewritten content.
          </p>
        </div>

        <div className="text-right">
          <p className={`text-3xl font-black ${getScoreColor(result.score)}`}>
            {result.score}
          </p>

          <p className="text-xs font-black uppercase tracking-[0.14em] text-slate-500">
            Grade {result.grade}
          </p>
        </div>
      </div>

      <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-200">
        <div
          className={`h-full rounded-full ${getScoreBarColor(result.score)}`}
          style={{ width: `${result.score}%` }}
        />
      </div>

      <div className="mt-4 grid gap-2 text-sm">
        {result.strengths.map((strength) => (
          <p
            key={strength}
            className="flex items-start gap-2 rounded-xl border border-emerald-100 bg-emerald-50 p-2 font-semibold text-emerald-700"
          >
            <CheckCircle2 size={15} className="mt-0.5 shrink-0" />
            {strength}
          </p>
        ))}

        {result.warnings.map((warning) => (
          <p
            key={warning}
            className="flex items-start gap-2 rounded-xl border border-amber-100 bg-amber-50 p-2 font-semibold text-amber-700"
          >
            <TriangleAlert size={15} className="mt-0.5 shrink-0" />
            {warning}
          </p>
        ))}
      </div>
    </div>
  )
}
