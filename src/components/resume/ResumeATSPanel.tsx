import {
  AlertTriangle,
  CheckCircle2,
  Gauge,
  Lightbulb,
  SearchCheck,
  ShieldCheck,
  XCircle,
} from "lucide-react"
import type { ATSResult } from "@/modules/ats-engine"

type ResumeATSPanelProps = {
  result: ATSResult
}

function getScoreLabel(score: number) {
  if (score >= 85) return "Excellent Match"
  if (score >= 70) return "Strong Match"
  if (score >= 50) return "Developing Match"
  return "Needs Optimization"
}

function getScoreColorClass(score: number) {
  if (score >= 85) return "text-emerald-700"
  if (score >= 70) return "text-blue-700"
  if (score >= 50) return "text-amber-700"
  return "text-red-700"
}

function getScoreBarClass(score: number) {
  if (score >= 85) return "bg-emerald-600"
  if (score >= 70) return "bg-blue-600"
  if (score >= 50) return "bg-amber-500"
  return "bg-red-600"
}

function getSeverityClass(severity: "high" | "medium" | "low") {
  if (severity === "high") return "border-red-200 bg-red-50 text-red-800"
  if (severity === "medium") return "border-amber-200 bg-amber-50 text-amber-800"
  return "border-slate-200 bg-slate-50 text-slate-700"
}

export function ResumeATSPanel({ result }: ResumeATSPanelProps) {
  return (
    <div className="grid gap-4 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <div className="grid gap-4 lg:grid-cols-[220px_1fr]">
        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
          <div className="flex items-center gap-2 text-sm font-black text-slate-600">
            <Gauge size={16} />
            ATS Score
          </div>

          <div className={`mt-4 text-5xl font-black ${getScoreColorClass(result.overallScore)}`}>
            {result.overallScore}
          </div>

          <p className="mt-1 text-sm font-bold text-slate-500">
            Grade {result.grade} · {getScoreLabel(result.overallScore)}
          </p>

          <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-200">
            <div
              className={`h-full rounded-full ${getScoreBarClass(result.overallScore)}`}
              style={{ width: `${result.overallScore}%` }}
            />
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <MetricCard
            icon={<SearchCheck size={17} />}
            label="Keyword Match"
            value={`${result.keywordMatchPercent}%`}
            helper={`${result.matchedKeywords.length} matched keywords`}
          />

          <MetricCard
            icon={<ShieldCheck size={17} />}
            label="Missing Keywords"
            value={String(result.missingKeywords.length)}
            helper="Terms to consider adding naturally"
          />
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <KeywordPanel
          title="Matched Keywords"
          empty="Paste a job description to see matched keywords."
          keywords={result.matchedKeywords}
          tone="green"
        />

        <KeywordPanel
          title="Missing Keywords"
          empty="No missing keywords found."
          keywords={result.missingKeywords}
          tone="red"
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <ListPanel
          icon={<CheckCircle2 size={17} />}
          title="Strengths"
          empty="No strengths detected yet."
          items={result.strengths}
          tone="green"
        />

        <ListPanel
          icon={<XCircle size={17} />}
          title="Weaknesses"
          empty="No major weaknesses detected."
          items={result.weaknesses}
          tone="red"
        />
      </div>

      <div>
        <div className="mb-3 flex items-center gap-2 text-sm font-black text-slate-800">
          <Lightbulb size={17} />
          Recommendations
        </div>

        <div className="grid gap-3">
          {result.recommendations.length > 0 ? (
            result.recommendations.map((recommendation) => (
              <div
                key={`${recommendation.title}-${recommendation.description}`}
                className={`rounded-2xl border p-3 text-sm ${getSeverityClass(
                  recommendation.severity
                )}`}
              >
                <div className="flex items-start gap-2">
                  <AlertTriangle size={15} className="mt-0.5 shrink-0" />

                  <div>
                    <p className="font-black">{recommendation.title}</p>
                    <p className="mt-1 leading-6">{recommendation.description}</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="rounded-2xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-500">
              No recommendations yet.
            </p>
          )}
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
        <p className="text-sm font-black text-slate-800">Section Scores</p>

        <div className="mt-3 grid gap-3">
          {result.sectionScores.map((section) => (
            <div key={section.name}>
              <div className="mb-1 flex items-center justify-between text-xs font-bold text-slate-600">
                <span>{section.name}</span>
                <span>
                  {section.score}/{section.maxScore}
                </span>
              </div>

              <div className="h-2 overflow-hidden rounded-full bg-slate-200">
                <div
                  className={getScoreBarClass(section.score)}
                  style={{ width: `${section.score}%`, height: "100%" }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function MetricCard({
  icon,
  label,
  value,
  helper,
}: {
  icon: React.ReactNode
  label: string
  value: string
  helper: string
}) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center gap-2 text-sm font-black text-slate-600">
        {icon}
        {label}
      </div>

      <p className="mt-3 text-3xl font-black text-slate-950">{value}</p>
      <p className="mt-1 text-sm font-semibold text-slate-500">{helper}</p>
    </div>
  )
}

function KeywordPanel({
  title,
  keywords,
  empty,
  tone,
}: {
  title: string
  keywords: string[]
  empty: string
  tone: "green" | "red"
}) {
  const classes =
    tone === "green"
      ? "bg-emerald-50 text-emerald-700 border-emerald-100"
      : "bg-red-50 text-red-700 border-red-100"

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
      <p className="text-sm font-black text-slate-800">{title}</p>

      <div className="mt-3 flex flex-wrap gap-2">
        {keywords.length > 0 ? (
          keywords.slice(0, 24).map((keyword) => (
            <span
              key={keyword}
              className={`rounded-full border px-3 py-1 text-xs font-black ${classes}`}
            >
              {keyword}
            </span>
          ))
        ) : (
          <p className="text-sm text-slate-500">{empty}</p>
        )}
      </div>
    </div>
  )
}

function ListPanel({
  icon,
  title,
  items,
  empty,
  tone,
}: {
  icon: React.ReactNode
  title: string
  items: string[]
  empty: string
  tone: "green" | "red"
}) {
  const color = tone === "green" ? "text-emerald-700" : "text-red-700"

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className={`flex items-center gap-2 text-sm font-black ${color}`}>
        {icon}
        {title}
      </div>

      <ul className="mt-3 grid gap-2 text-sm leading-6 text-slate-600">
        {items.length > 0 ? (
          items.map((item) => <li key={item}>• {item}</li>)
        ) : (
          <li>{empty}</li>
        )}
      </ul>
    </div>
  )
}
