"use client"

import type { ComponentType, ReactNode } from "react"
import { useEffect, useMemo, useState } from "react"
import {
  AlertTriangle,
  BarChart3,
  BriefcaseBusiness,
  Building2,
  CreditCard,
  Gauge,
  LineChart,
  Loader2,
  RefreshCw,
  Sparkles,
  Users,
} from "lucide-react"

type ChartPoint = {
  label: string
  users: number
  resumes: number
  jobs: number
  ai: number
}

type ChartItem = {
  label: string
  value: number
}

type AdminAnalyticsPayload = {
  status: string
  message?: string
  generatedAt: string
  warnings: { source: string; message: string }[]
  kpis: {
    users: number
    newUsers7d: number
    organizations: number
    activeCompanySeats: number
    paidMemberships: number
    activeSubscriptions: number
    cancelingSubscriptions: number
    resumes: number
    trackedJobs: number
    activeJobs: number
    interviewRate: number
    contacts: number
    relationshipCoverage: number
    aiEvents: number
    promptAverageScore: number | null
    negativeLearning: number
  }
  charts: {
    growth: ChartPoint[]
    memberships: ChartItem[]
    modules: ChartItem[]
    jobStatus: ChartItem[]
    aiSeverity: ChartItem[]
    promptStrength: ChartItem[]
    usage: ChartItem[]
    funnel: ChartItem[]
  }
}

const emptyPayload: AdminAnalyticsPayload = {
  status: "idle",
  generatedAt: "",
  warnings: [],
  kpis: {
    users: 0,
    newUsers7d: 0,
    organizations: 0,
    activeCompanySeats: 0,
    paidMemberships: 0,
    activeSubscriptions: 0,
    cancelingSubscriptions: 0,
    resumes: 0,
    trackedJobs: 0,
    activeJobs: 0,
    interviewRate: 0,
    contacts: 0,
    relationshipCoverage: 0,
    aiEvents: 0,
    promptAverageScore: null,
    negativeLearning: 0,
  },
  charts: {
    growth: [],
    memberships: [],
    modules: [],
    jobStatus: [],
    aiSeverity: [],
    promptStrength: [],
    usage: [],
    funnel: [],
  },
}

const growthOptions = [
  { key: "users", label: "Users" },
  { key: "resumes", label: "Resumes" },
  { key: "jobs", label: "Jobs" },
  { key: "ai", label: "AI Events" },
] as const

type GrowthKey = (typeof growthOptions)[number]["key"]

function compactNumber(value: number | null) {
  if (value === null) {
    return "n/a"
  }

  return new Intl.NumberFormat("en", {
    notation: value >= 10000 ? "compact" : "standard",
  }).format(value)
}

function titleCase(value: string) {
  return value
    .replaceAll("_", " ")
    .replace(/\b\w/g, (character) => character.toUpperCase())
}

function shortDate(value: string) {
  const date = new Date(`${value}T00:00:00.000Z`)

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  }).format(date)
}

export default function AdminAnalyticsPage() {
  const [payload, setPayload] = useState<AdminAnalyticsPayload>(emptyPayload)
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState("")
  const [growthMetric, setGrowthMetric] = useState<GrowthKey>("users")
  const [selectedSegment, setSelectedSegment] = useState<string | null>(null)

  const selectedGrowth = useMemo(
    () =>
      payload.charts.growth.map((point) => ({
        label: point.label,
        value: point[growthMetric],
      })),
    [growthMetric, payload.charts.growth],
  )

  async function loadAnalytics() {
    setLoading(true)
    setMessage("")

    try {
      const response = await fetch("/api/admin/analytics", {
        cache: "no-store",
      })
      const result = (await response.json()) as AdminAnalyticsPayload

      if (!response.ok) {
        throw new Error(result.message || "Admin analytics could not be loaded.")
      }

      setPayload(result)
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Admin analytics could not be loaded.",
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadAnalytics()
  }, [])

  return (
    <main className="min-h-screen bg-slate-100 px-5 py-6 lg:px-8">
      <div className="mx-auto grid max-w-[1500px] gap-6">
        <section className="rounded-[28px] border border-slate-200 bg-slate-950 p-6 text-white shadow-sm">
          <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-end">
            <div>
              <div className="mb-4 flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-blue-100">
                <BarChart3 size={14} />
                Admin Intelligence
              </div>
              <h1 className="text-3xl font-black tracking-tight">
                Admin Analytics
              </h1>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-300">
                Monitor customer adoption, company access, product usage, AI
                quality, and operational risk from one command view.
              </p>
            </div>

            <div className="flex flex-col gap-3 rounded-3xl border border-white/15 bg-white/10 p-4">
              <p className="text-xs font-black uppercase tracking-[0.14em] text-blue-100">
                Data Refresh
              </p>
              <button
                type="button"
                onClick={loadAnalytics}
                disabled={loading}
                className="inline-flex w-fit items-center gap-2 rounded-2xl bg-blue-500 px-4 py-2 text-sm font-black text-white hover:bg-blue-400 disabled:opacity-60"
              >
                {loading ? <Loader2 size={16} className="animate-spin" /> : <RefreshCw size={16} />}
                Refresh Analytics
              </button>
              <p className="text-xs font-semibold text-slate-300">
                {payload.generatedAt
                  ? `Last generated ${new Date(payload.generatedAt).toLocaleString()}`
                  : "Waiting for first load"}
              </p>
            </div>
          </div>
        </section>

        {message ? (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-bold text-rose-800">
            {message}
          </div>
        ) : null}

        {payload.warnings.length > 0 ? (
          <section className="rounded-[24px] border border-amber-200 bg-amber-50 p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="mt-0.5 text-amber-700" size={18} />
              <div>
                <h2 className="text-sm font-black text-amber-950">
                  Some analytics sources need setup
                </h2>
                <div className="mt-2 grid gap-1">
                  {payload.warnings.slice(0, 4).map((warning) => (
                    <p
                      key={`${warning.source}-${warning.message}`}
                      className="text-sm font-semibold leading-6 text-amber-800"
                    >
                      {warning.source}: {warning.message}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </section>
        ) : null}

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <KpiCard
            icon={Users}
            label="Users"
            value={payload.kpis.users}
            helper={`${payload.kpis.newUsers7d} new in 7 days`}
          />
          <KpiCard
            icon={CreditCard}
            label="Paid Memberships"
            value={payload.kpis.paidMemberships}
            helper={`${payload.kpis.activeSubscriptions} active subscriptions`}
          />
          <KpiCard
            icon={BriefcaseBusiness}
            label="Tracked Jobs"
            value={payload.kpis.trackedJobs}
            helper={`${payload.kpis.interviewRate}% interview / offer rate`}
          />
          <KpiCard
            icon={Sparkles}
            label="Prompt Score"
            value={payload.kpis.promptAverageScore}
            helper={`${payload.kpis.negativeLearning} AI events need review`}
          />
        </section>

        <section className="grid gap-5 xl:grid-cols-[minmax(0,1.25fr)_minmax(360px,0.75fr)]">
          <Panel
            eyebrow="Growth"
            title="14-day activity trend"
            action={
              <div className="flex flex-wrap gap-2">
                {growthOptions.map((option) => (
                  <button
                    key={option.key}
                    type="button"
                    onClick={() => setGrowthMetric(option.key)}
                    className={`rounded-2xl border px-3 py-2 text-xs font-black ${
                      growthMetric === option.key
                        ? "border-slate-950 bg-slate-950 text-white"
                        : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            }
          >
            <LineAreaChart data={selectedGrowth} />
          </Panel>

          <Panel eyebrow="Memberships" title="Tier mix">
            <DonutChart
              data={payload.charts.memberships}
              selected={selectedSegment}
              onSelect={setSelectedSegment}
            />
          </Panel>
        </section>

        <section className="grid gap-5 xl:grid-cols-3">
          <Panel eyebrow="Product" title="Module usage">
            <HorizontalBars data={payload.charts.modules} onSelect={setSelectedSegment} />
          </Panel>
          <Panel eyebrow="Pipeline" title="Job status mix">
            <HorizontalBars data={payload.charts.jobStatus} onSelect={setSelectedSegment} />
          </Panel>
          <Panel eyebrow="Usage" title="Usage counters">
            <HorizontalBars data={payload.charts.usage} onSelect={setSelectedSegment} />
          </Panel>
        </section>

        <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <Panel eyebrow="Conversion" title="Customer activation funnel">
            <FunnelChart data={payload.charts.funnel} />
          </Panel>
          <Panel eyebrow="AI Quality" title="Learning and prompt health">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <p className="mb-3 text-xs font-black uppercase tracking-[0.12em] text-slate-500">
                  Learning Severity
                </p>
                <HorizontalBars data={payload.charts.aiSeverity} compact />
              </div>
              <div>
                <p className="mb-3 text-xs font-black uppercase tracking-[0.12em] text-slate-500">
                  Prompt Strength
                </p>
                <HorizontalBars data={payload.charts.promptStrength} compact />
              </div>
            </div>
          </Panel>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          <SummaryCard
            icon={Building2}
            label="Companies"
            value={payload.kpis.organizations}
            detail={`${payload.kpis.activeCompanySeats} active company seats`}
          />
          <SummaryCard
            icon={Gauge}
            label="Relationship Coverage"
            value={`${payload.kpis.relationshipCoverage}%`}
            detail={`${payload.kpis.contacts} saved networking contacts`}
          />
          <SummaryCard
            icon={LineChart}
            label="Resume System"
            value={payload.kpis.resumes}
            detail={`${payload.charts.modules.find((item) => item.label === "ATS Reports")?.value || 0} ATS reports`}
          />
        </section>
      </div>
    </main>
  )
}

function KpiCard({
  icon: Icon,
  label,
  value,
  helper,
}: {
  icon: ComponentType<{ size?: number }>
  label: string
  value: number | null
  helper: string
}) {
  return (
    <article className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center gap-3">
        <div className="rounded-2xl bg-blue-50 p-3 text-blue-700">
          <Icon size={20} />
        </div>
        <p className="text-xs font-black uppercase tracking-[0.14em] text-slate-500">
          {label}
        </p>
      </div>
      <p className="text-3xl font-black text-slate-950">{compactNumber(value)}</p>
      <p className="mt-2 text-sm font-semibold leading-6 text-slate-500">
        {helper}
      </p>
    </article>
  )
}

function Panel({
  eyebrow,
  title,
  action,
  children,
}: {
  eyebrow: string
  title: string
  action?: ReactNode
  children: ReactNode
}) {
  return (
    <section className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-5 flex flex-col gap-3 border-b border-slate-100 pb-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.16em] text-blue-600">
            {eyebrow}
          </p>
          <h2 className="mt-1 text-xl font-black text-slate-950">{title}</h2>
        </div>
        {action}
      </div>
      {children}
    </section>
  )
}

function LineAreaChart({ data }: { data: ChartItem[] }) {
  const [hovered, setHovered] = useState<ChartItem | null>(null)
  const max = Math.max(...data.map((point) => point.value), 1)
  const width = 720
  const height = 260
  const padding = 28
  const usableWidth = width - padding * 2
  const usableHeight = height - padding * 2
  const points = data.map((point, index) => {
    const x =
      padding +
      (data.length <= 1 ? 0 : (index / (data.length - 1)) * usableWidth)
    const y = padding + usableHeight - (point.value / max) * usableHeight

    return { ...point, x, y }
  })
  const path = points
    .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`)
    .join(" ")
  const areaPath = `${path} L ${padding + usableWidth} ${padding + usableHeight} L ${padding} ${padding + usableHeight} Z`

  return (
    <div className="relative">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="h-[300px] w-full overflow-visible"
        role="img"
      >
        <path d={areaPath} fill="#dbeafe" opacity="0.75" />
        <path d={path} fill="none" stroke="#2563eb" strokeWidth="4" />
        {points.map((point) => (
          <g key={point.label}>
            <circle
              cx={point.x}
              cy={point.y}
              r={hovered?.label === point.label ? 8 : 5}
              fill="#ffffff"
              stroke="#2563eb"
              strokeWidth="3"
              onMouseEnter={() => setHovered(point)}
              onMouseLeave={() => setHovered(null)}
            />
          </g>
        ))}
      </svg>
      <div
        className="grid gap-1 text-center text-[11px] font-bold text-slate-400"
        style={{
          gridTemplateColumns: `repeat(${Math.max(data.length, 1)}, minmax(0, 1fr))`,
        }}
      >
        {data.map((point) => (
          <span key={point.label}>{shortDate(point.label)}</span>
        ))}
      </div>
      <div className="mt-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-700">
        {hovered
          ? `${shortDate(hovered.label)}: ${hovered.value}`
          : `Peak: ${compactNumber(max)} · Hover a point for day-level detail`}
      </div>
    </div>
  )
}

function HorizontalBars({
  data,
  onSelect,
  compact = false,
}: {
  data: ChartItem[]
  onSelect?: (label: string) => void
  compact?: boolean
}) {
  const max = Math.max(...data.map((item) => item.value), 1)

  if (data.length === 0) {
    return <EmptyChart />
  }

  return (
    <div className={`grid ${compact ? "gap-2" : "gap-3"}`}>
      {data.map((item) => (
        <button
          key={item.label}
          type="button"
          onClick={() => onSelect?.(item.label)}
          className="group text-left"
        >
          <div className="mb-1 flex items-center justify-between gap-3 text-xs font-black uppercase tracking-[0.1em] text-slate-500">
            <span>{titleCase(item.label)}</span>
            <span>{compactNumber(item.value)}</span>
          </div>
          <div className="h-3 overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-blue-600 transition group-hover:bg-blue-500"
              style={{ width: `${Math.max(3, (item.value / max) * 100)}%` }}
            />
          </div>
        </button>
      ))}
    </div>
  )
}

function DonutChart({
  data,
  selected,
  onSelect,
}: {
  data: ChartItem[]
  selected: string | null
  onSelect: (label: string | null) => void
}) {
  const total = data.reduce((sum, item) => sum + item.value, 0)

  if (data.length === 0 || total === 0) {
    return <EmptyChart />
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[220px_minmax(0,1fr)] lg:items-center">
      <div className="relative mx-auto aspect-square w-[220px] rounded-full bg-slate-100">
        {data.map((item, index) => {
          const percent = percentage(item.value, total)
          const previous = data
            .slice(0, index)
            .reduce((sum, segment) => sum + percentage(segment.value, total), 0)
          const color = ["#2563eb", "#16a34a", "#f59e0b", "#dc2626", "#7c3aed", "#0891b2"][
            index % 6
          ]

          return (
            <button
              key={item.label}
              type="button"
              aria-label={item.label}
              onClick={() => onSelect(selected === item.label ? null : item.label)}
              className="absolute inset-0 rounded-full transition"
              style={{
                background: `conic-gradient(from ${previous * 3.6}deg, ${color} 0deg ${percent * 3.6}deg, transparent ${percent * 3.6}deg)`,
                opacity: selected && selected !== item.label ? 0.25 : 1,
              }}
            />
          )
        })}
        <div className="absolute inset-[54px] grid place-items-center rounded-full bg-white text-center shadow-inner">
          <div>
            <p className="text-2xl font-black text-slate-950">{compactNumber(total)}</p>
            <p className="text-xs font-black uppercase tracking-[0.12em] text-slate-500">
              Accounts
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-2">
        {data.map((item) => (
          <button
            key={item.label}
            type="button"
            onClick={() => onSelect(selected === item.label ? null : item.label)}
            className={`rounded-2xl border px-3 py-2 text-left text-sm font-bold ${
              selected === item.label
                ? "border-blue-300 bg-blue-50 text-blue-800"
                : "border-slate-200 bg-slate-50 text-slate-700"
            }`}
          >
            {titleCase(item.label)} · {item.value} · {percentage(item.value, total)}%
          </button>
        ))}
      </div>
    </div>
  )
}

function FunnelChart({ data }: { data: ChartItem[] }) {
  const max = Math.max(...data.map((item) => item.value), 1)

  if (data.length === 0) {
    return <EmptyChart />
  }

  return (
    <div className="grid gap-3">
      {data.map((item, index) => (
        <div key={item.label} className="grid gap-1">
          <div className="flex items-center justify-between text-sm font-black text-slate-700">
            <span>{item.label}</span>
            <span>{compactNumber(item.value)}</span>
          </div>
          <div className="h-9 overflow-hidden rounded-2xl bg-slate-100">
            <div
              className="flex h-full items-center justify-end rounded-2xl bg-slate-950 px-3 text-xs font-black text-white"
              style={{
                width: `${Math.max(8, (item.value / max) * 100)}%`,
                opacity: 1 - index * 0.1,
              }}
            >
              {percentage(item.value, max)}%
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

function SummaryCard({
  icon: Icon,
  label,
  value,
  detail,
}: {
  icon: ComponentType<{ size?: number }>
  label: string
  value: string | number
  detail: string
}) {
  return (
    <article className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 rounded-2xl bg-slate-100 p-3 text-slate-700 w-fit">
        <Icon size={20} />
      </div>
      <p className="text-xs font-black uppercase tracking-[0.14em] text-slate-500">
        {label}
      </p>
      <p className="mt-2 text-2xl font-black text-slate-950">{value}</p>
      <p className="mt-2 text-sm font-semibold leading-6 text-slate-500">{detail}</p>
    </article>
  )
}

function EmptyChart() {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 p-8 text-center text-sm font-bold text-slate-500">
      No analytics data available yet.
    </div>
  )
}

function percentage(value: number, total: number) {
  if (total <= 0) {
    return 0
  }

  return Math.round((value / total) * 100)
}
