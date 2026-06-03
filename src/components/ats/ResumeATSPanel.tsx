// =====================================================
// BLOCK: Icon Imports
// =====================================================

import {
  AlertTriangle,
  BriefcaseBusiness,
  CheckCircle2,
  Gauge,
  GraduationCap,
  Lightbulb,
  SearchCheck,
  ShieldAlert,
  Sparkles,
  Target,
  XCircle,
} from "lucide-react"

// =====================================================
// BLOCK: Type Imports
// =====================================================

import type { ReactNode } from "react"
import type { ATSResult } from "@/modules/ats-engine"

// =====================================================
// BLOCK: Component Types
// =====================================================

type ResumeATSPanelProps = {
  result: ATSResult
}

// =====================================================
// BLOCK: Score Helper Functions
// =====================================================

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

// =====================================================
// BLOCK: Main ATS Panel Component
// =====================================================

export function ResumeATSPanel({ result }: ResumeATSPanelProps) {
  return (
    <div className="grid min-w-0 max-w-full gap-4 overflow-hidden rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      {/* =====================================================
          BLOCK: Score And Metrics
      ===================================================== */}

      <div className="grid min-w-0 gap-4">
        <ScoreCard result={result} />

        <div className="grid min-w-0 gap-3 sm:grid-cols-2">
          <MetricCard
            icon={<SearchCheck size={17} />}
            label="Keyword Match"
            value={`${result.keywordMatchPercent}%`}
            helper={`${result.matchedKeywords.length} matched keywords`}
          />

          <MetricCard
            icon={<Sparkles size={17} />}
            label="Readability"
            value={`${result.readabilityScore}`}
            helper="Resume clarity and length"
          />

          <MetricCard
            icon={<Target size={17} />}
            label="Achievements"
            value={`${result.achievementScore}`}
            helper="Action verbs and measurable impact"
          />

          <MetricCard
            icon={<ShieldAlert size={17} />}
            label="Risk Flags"
            value={String(result.riskFlags.length)}
            helper="Issues that may reduce ATS readiness"
          />
        </div>
      </div>

      {/* =====================================================
          BLOCK: Detected Context Cards
      ===================================================== */}

      <div className="grid min-w-0 gap-4 lg:grid-cols-2">
        <InfoCard
          icon={<BriefcaseBusiness size={17} />}
          label="Detected Industry"
          value={result.detectedIndustry}
          helper="Estimated from resume wording, roles, and skills."
        />

        <InfoCard
          icon={<GraduationCap size={17} />}
          label="Detected Target Role"
          value={result.detectedTargetRole}
          helper="Estimated from the job description or your most recent role."
        />
      </div>

      {/* =====================================================
          BLOCK: Keyword Panels
      ===================================================== */}

      <div className="grid min-w-0 gap-4 lg:grid-cols-2">
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

      {/* =====================================================
          BLOCK: Strength / Weakness Panels
      ===================================================== */}

      <div className="grid min-w-0 gap-4 lg:grid-cols-2">
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

      <RiskFlagsPanel result={result} />

      <RecommendationsPanel result={result} />

      <SectionScoresPanel result={result} />
    </div>
  )
}

// =====================================================
// BLOCK: Score Card Component
// =====================================================

function ScoreCard({ result }: { result: ATSResult }) {
  return (
    <div className="min-w-0 overflow-hidden rounded-3xl border border-slate-200 bg-slate-50 p-4">
      <div className="flex min-w-0 items-center gap-2 text-sm font-black text-slate-600">
        <Gauge size={16} className="shrink-0" />
        <span className="break-words">ATS Score</span>
      </div>

      <div
        className={`mt-4 break-words text-5xl font-black ${getScoreColorClass(
          result.overallScore,
        )}`}
      >
        {result.overallScore}
      </div>

      <p className="mt-1 break-words text-sm font-bold text-slate-500">
        Grade {result.grade} · {getScoreLabel(result.overallScore)}
      </p>

      <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-200">
        <div
          className={`h-full rounded-full ${getScoreBarClass(
            result.overallScore,
          )}`}
          style={{ width: `${result.overallScore}%` }}
        />
      </div>
    </div>
  )
}

// =====================================================
// BLOCK: Metric Card Component
// =====================================================

function MetricCard({
  icon,
  label,
  value,
  helper,
}: {
  icon: ReactNode
  label: string
  value: string
  helper: string
}) {
  return (
    <div className="min-w-0 overflow-hidden rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex min-w-0 items-start gap-2 text-sm font-black text-slate-600">
        <span className="mt-0.5 shrink-0">{icon}</span>
        <span className="min-w-0 break-words leading-5">{label}</span>
      </div>

      <p className="mt-3 break-words text-3xl font-black leading-tight text-slate-950">
        {value}
      </p>

      <p className="mt-1 break-words text-sm font-semibold leading-5 text-slate-500">
        {helper}
      </p>
    </div>
  )
}

// =====================================================
// BLOCK: Info Card Component
// =====================================================

function InfoCard({
  icon,
  label,
  value,
  helper,
}: {
  icon: ReactNode
  label: string
  value: string
  helper: string
}) {
  return (
    <div className="min-w-0 overflow-hidden rounded-3xl border border-slate-200 bg-slate-50 p-4">
      <div className="flex min-w-0 items-start gap-2 text-sm font-black text-slate-700">
        <span className="mt-0.5 shrink-0">{icon}</span>
        <span className="min-w-0 break-words leading-5">{label}</span>
      </div>

      <p className="mt-3 break-words text-lg font-black leading-6 text-slate-950">
        {value}
      </p>

      <p className="mt-1 break-words text-sm leading-6 text-slate-500">
        {helper}
      </p>
    </div>
  )
}

// =====================================================
// BLOCK: Keyword Panel Component
// =====================================================

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
    <div className="min-w-0 overflow-hidden rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
      <p className="break-words text-sm font-black text-slate-800">{title}</p>

      <div className="mt-3 flex min-w-0 flex-wrap gap-2">
        {keywords.length > 0 ? (
          keywords.slice(0, 24).map((keyword) => (
            <span
              key={keyword}
              className={`max-w-full break-words rounded-full border px-3 py-1 text-xs font-black leading-5 ${classes}`}
            >
              {keyword}
            </span>
          ))
        ) : (
          <p className="break-words text-sm text-slate-500">{empty}</p>
        )}
      </div>
    </div>
  )
}

// =====================================================
// BLOCK: List Panel Component
// =====================================================

function ListPanel({
  icon,
  title,
  items,
  empty,
  tone,
}: {
  icon: ReactNode
  title: string
  items: string[]
  empty: string
  tone: "green" | "red"
}) {
  const color = tone === "green" ? "text-emerald-700" : "text-red-700"

  return (
    <div className="min-w-0 overflow-hidden rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className={`flex min-w-0 items-start gap-2 text-sm font-black ${color}`}>
        <span className="mt-0.5 shrink-0">{icon}</span>
        <span className="min-w-0 break-words">{title}</span>
      </div>

      <ul className="mt-3 grid min-w-0 gap-2 text-sm leading-6 text-slate-600">
        {items.length > 0 ? (
          items.map((item) => (
            <li key={item} className="min-w-0 break-words">
              • {item}
            </li>
          ))
        ) : (
          <li className="min-w-0 break-words">{empty}</li>
        )}
      </ul>
    </div>
  )
}

// =====================================================
// BLOCK: Risk Flags Panel Component
// =====================================================

function RiskFlagsPanel({ result }: { result: ATSResult }) {
  return (
    <div className="min-w-0 overflow-hidden">
      <div className="mb-3 flex min-w-0 items-center gap-2 text-sm font-black text-slate-800">
        <ShieldAlert size={17} className="shrink-0" />
        <span className="break-words">ATS Risk Flags</span>
      </div>

      <div className="grid min-w-0 gap-3">
        {result.riskFlags.length > 0 ? (
          result.riskFlags.map((flag) => (
            <div
              key={`${flag.title}-${flag.description}`}
              className={`min-w-0 overflow-hidden rounded-2xl border p-3 text-sm ${getSeverityClass(
                flag.severity,
              )}`}
            >
              <p className="break-words font-black">{flag.title}</p>
              <p className="mt-1 break-words leading-6">{flag.description}</p>
            </div>
          ))
        ) : (
          <p className="min-w-0 break-words rounded-2xl border border-emerald-200 bg-emerald-50 p-3 text-sm font-semibold text-emerald-700">
            No major ATS risk flags detected.
          </p>
        )}
      </div>
    </div>
  )
}

// =====================================================
// BLOCK: Recommendations Panel Component
// =====================================================

function RecommendationsPanel({ result }: { result: ATSResult }) {
  return (
    <div className="min-w-0 overflow-hidden">
      <div className="mb-3 flex min-w-0 items-center gap-2 text-sm font-black text-slate-800">
        <Lightbulb size={17} className="shrink-0" />
        <span className="break-words">Recommendations</span>
      </div>

      <div className="grid min-w-0 gap-3">
        {result.recommendations.length > 0 ? (
          result.recommendations.map((recommendation) => (
            <div
              key={`${recommendation.title}-${recommendation.description}`}
              className={`min-w-0 overflow-hidden rounded-2xl border p-3 text-sm ${getSeverityClass(
                recommendation.severity,
              )}`}
            >
              <div className="flex min-w-0 items-start gap-2">
                <AlertTriangle size={15} className="mt-0.5 shrink-0" />

                <div className="min-w-0">
                  <p className="break-words font-black">
                    {recommendation.title}
                  </p>

                  <p className="mt-1 break-words leading-6">
                    {recommendation.description}
                  </p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="min-w-0 break-words rounded-2xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-500">
            No recommendations yet.
          </p>
        )}
      </div>
    </div>
  )
}

// =====================================================
// BLOCK: Section Scores Panel Component
// =====================================================

function SectionScoresPanel({ result }: { result: ATSResult }) {
  return (
    <div className="min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <p className="break-words text-sm font-black text-slate-800">
        Section Scores
      </p>

      <div className="mt-3 grid min-w-0 gap-3">
        {result.sectionScores.map((section) => (
          <div key={section.name} className="min-w-0">
            <div className="mb-1 flex min-w-0 items-center justify-between gap-3 text-xs font-bold text-slate-600">
              <span className="min-w-0 break-words">{section.name}</span>

              <span className="shrink-0">
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
  )
}