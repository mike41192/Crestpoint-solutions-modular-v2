// =====================================================
// BLOCK: Imports
// =====================================================

import {
  AlertTriangle,
  BadgeCheck,
  Brain,
  CheckCircle2,
  ListChecks,
  Target,
} from "lucide-react"
import type { ResumeGapAnalysisResult, GapPriority } from "@/modules/gap-analyzer"

// =====================================================
// BLOCK: Component Types
// =====================================================

type ResumeGapAnalysisPanelProps = {
  result: ResumeGapAnalysisResult
}

// =====================================================
// BLOCK: Style Helpers
// =====================================================

function getPriorityClass(priority: GapPriority) {
  if (priority === "high") {
    return "border-red-200 bg-red-50 text-red-800"
  }

  if (priority === "medium") {
    return "border-amber-200 bg-amber-50 text-amber-800"
  }

  return "border-slate-200 bg-slate-50 text-slate-700"
}

function getReadinessColor(score: number) {
  if (score >= 85) return "text-emerald-700"
  if (score >= 70) return "text-blue-700"
  if (score >= 55) return "text-amber-700"

  return "text-red-700"
}

// =====================================================
// BLOCK: Component
// =====================================================

export function ResumeGapAnalysisPanel({ result }: ResumeGapAnalysisPanelProps) {
  return (
    <section className="grid gap-4 rounded-3xl border border-cyan-200 bg-cyan-50 p-4 shadow-sm sm:p-5">
      <div className="flex items-start gap-3">
        <div className="rounded-2xl bg-white p-2 text-cyan-700 shadow-sm">
          <Brain size={18} />
        </div>

        <div>
          <h3 className="text-lg font-black text-slate-950">
            Resume Gap Analysis
          </h3>

          <p className="mt-1 text-sm leading-6 text-slate-600">
            Compare your resume against the target job and identify missing
            skills, certifications, experience areas, and keywords.
          </p>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          icon={<Target size={17} />}
          label="Readiness"
          value={`${result.readinessScore}`}
          valueClass={getReadinessColor(result.readinessScore)}
          helper="Estimated job-readiness score"
        />

        <MetricCard
          icon={<ListChecks size={17} />}
          label="Skill Gaps"
          value={String(result.missingSkills.length)}
          valueClass="text-blue-700"
          helper="Missing skill terms"
        />

        <MetricCard
          icon={<BadgeCheck size={17} />}
          label="Certification Gaps"
          value={String(result.missingCertifications.length)}
          valueClass="text-amber-700"
          helper="Credential gaps"
        />

        <MetricCard
          icon={<AlertTriangle size={17} />}
          label="Experience Gaps"
          value={String(result.experienceGaps.length)}
          valueClass="text-red-700"
          helper="Missing experience signals"
        />
      </div>

      <div className="grid gap-3">
        {result.gaps.length > 0 ? (
          result.gaps.slice(0, 18).map((gap) => (
            <article
              key={gap.id}
              className={`rounded-3xl border p-4 shadow-sm ${getPriorityClass(
                gap.priority
              )}`}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.14em] opacity-80">
                    {gap.category}
                  </p>

                  <h4 className="mt-1 text-sm font-black">{gap.title}</h4>
                </div>

                <span className="rounded-full border border-current px-3 py-1 text-xs font-black">
                  {gap.priority.toUpperCase()}
                </span>
              </div>

              <p className="mt-3 text-sm leading-6">{gap.description}</p>

              <div className="mt-3 rounded-2xl border border-current/20 bg-white/60 p-3 text-sm leading-6">
                <strong>Suggested action:</strong> {gap.suggestedAction}
              </div>
            </article>
          ))
        ) : (
          <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-semibold text-emerald-700">
            <div className="flex items-start gap-2">
              <CheckCircle2 size={16} className="mt-0.5 shrink-0" />
              No major resume gaps detected for this job description.
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

// =====================================================
// BLOCK: Metric Card Subcomponent
// =====================================================

function MetricCard({
  icon,
  label,
  value,
  valueClass,
  helper,
}: {
  icon: React.ReactNode
  label: string
  value: string
  valueClass: string
  helper: string
}) {
  return (
    <div className="rounded-3xl border border-cyan-200 bg-white p-4 shadow-sm">
      <div className="flex items-center gap-2 text-sm font-black text-slate-600">
        {icon}
        {label}
      </div>

      <p className={`mt-3 text-3xl font-black ${valueClass}`}>{value}</p>

      <p className="mt-1 text-sm font-semibold text-slate-500">{helper}</p>
    </div>
  )
}
