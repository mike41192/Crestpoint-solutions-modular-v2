import {
  ArrowUpRight,
  CheckCircle2,
  Lightbulb,
  Sparkles,
  Target,
} from "lucide-react"
import type {
  ResumeOptimizationResult,
  ResumeOptimizationSuggestion,
} from "@/modules/resume-optimizer"

type ResumeOptimizationPanelProps = {
  result: ResumeOptimizationResult
  onApplySuggestion?: (suggestion: ResumeOptimizationSuggestion) => void
}

function getImpactClass(impact: "high" | "medium" | "low") {
  if (impact === "high") {
    return "border-emerald-200 bg-emerald-50 text-emerald-800"
  }

  if (impact === "medium") {
    return "border-blue-200 bg-blue-50 text-blue-800"
  }

  return "border-slate-200 bg-slate-50 text-slate-700"
}

export function ResumeOptimizationPanel({
  result,
  onApplySuggestion,
}: ResumeOptimizationPanelProps) {
  return (
    <section className="grid gap-4 rounded-3xl border border-blue-200 bg-blue-50 p-4 shadow-sm sm:p-5">
      <div className="flex items-start gap-3">
        <div className="rounded-2xl bg-white p-2 text-blue-700 shadow-sm">
          <Sparkles size={18} />
        </div>

        <div>
          <h3 className="text-lg font-black text-slate-950">
            Resume Optimization Suggestions
          </h3>

          <p className="mt-1 text-sm leading-6 text-slate-600">
            Review high-impact improvements based on ATS score, keywords,
            achievements, and resume structure.
          </p>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-3xl border border-blue-200 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-2 text-sm font-black text-slate-600">
            <ArrowUpRight size={17} />
            Estimated Score Lift
          </div>

          <p className="mt-3 text-3xl font-black text-blue-700">
            +{result.estimatedScoreLift}
          </p>

          <p className="mt-1 text-sm font-semibold text-slate-500">
            Potential ATS improvement
          </p>
        </div>

        <div className="rounded-3xl border border-blue-200 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-2 text-sm font-black text-slate-600">
            <Target size={17} />
            Optimized Estimate
          </div>

          <p className="mt-3 text-3xl font-black text-emerald-700">
            {result.optimizedScoreEstimate}
          </p>

          <p className="mt-1 text-sm font-semibold text-slate-500">
            Estimated optimized ATS score
          </p>
        </div>
      </div>

      <div className="grid gap-3">
        {result.suggestions.length > 0 ? (
          result.suggestions.map((suggestion) => (
            <article
              key={suggestion.id}
              className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-black uppercase tracking-[0.16em] text-blue-600">
                    {suggestion.priority}
                  </p>

                  <h4 className="mt-1 text-base font-black text-slate-950">
                    {suggestion.title}
                  </h4>
                </div>

                <span
                  className={`rounded-full border px-3 py-1 text-xs font-black ${getImpactClass(
                    suggestion.expectedImpact
                  )}`}
                >
                  {suggestion.expectedImpact.toUpperCase()} IMPACT
                </span>
              </div>

              {suggestion.currentText && (
                <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-3">
                  <p className="text-xs font-black uppercase tracking-[0.14em] text-slate-500">
                    Current
                  </p>

                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {suggestion.currentText}
                  </p>
                </div>
              )}

              <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-3">
                <p className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.14em] text-emerald-700">
                  <CheckCircle2 size={14} />
                  Suggested Improvement
                </p>

                <p className="mt-2 text-sm leading-6 text-emerald-800">
                  {suggestion.suggestedText}
                </p>
              </div>

              <div className="mt-4 flex items-start gap-2 rounded-2xl border border-blue-100 bg-blue-50 p-3 text-sm text-blue-800">
                <Lightbulb size={15} className="mt-0.5 shrink-0" />
                <p className="leading-6">{suggestion.reason}</p>
              </div>

              {onApplySuggestion && (
                <button
                  type="button"
                  onClick={() => onApplySuggestion(suggestion)}
                  className="mt-4 rounded-2xl bg-blue-600 px-4 py-3 text-sm font-black text-white transition hover:bg-blue-700"
                >
                  Apply Suggestion
                </button>
              )}
            </article>
          ))
        ) : (
          <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-semibold text-emerald-700">
            No major optimization suggestions detected yet.
          </div>
        )}
      </div>
    </section>
  )
}
