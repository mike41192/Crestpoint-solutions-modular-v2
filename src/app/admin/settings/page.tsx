"use client"

import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import {
  ArrowRight,
  Bot,
  CheckCircle2,
  ChevronRight,
  CreditCard,
  Database,
  Gauge,
  GitBranch,
  Layers3,
  LockKeyhole,
  PackageCheck,
  RefreshCcw,
  Settings,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Users,
  Wrench,
  XCircle,
} from "lucide-react"

type StatusKey = "app" | "supabase" | "stripe" | "openai" | "vercel" | "github"

type SystemStatus = {
  status?: string
  timestamp?: string
  checkedBy?: string
} & Record<
  StatusKey,
  {
    configured: boolean
    missingKeys: string[]
  }
>

type DashboardTab = "overview" | "access" | "platform" | "ai" | "maintenance"

const tabs: { id: DashboardTab; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "access", label: "Access" },
  { id: "platform", label: "Platform" },
  { id: "ai", label: "AI" },
  { id: "maintenance", label: "Maintenance" },
]

const primaryActions = [
  {
    title: "Users",
    description: "Manage memberships, overrides, and admin access.",
    href: "/admin/settings/users",
    icon: Users,
    area: "access",
  },
  {
    title: "Modules",
    description: "Review enabled modules and access requirements.",
    href: "/admin/settings/modules",
    icon: Layers3,
    area: "access",
  },
  {
    title: "Pricing",
    description: "Check plan structure and Stripe price mappings.",
    href: "/admin/settings/pricing",
    icon: CreditCard,
    area: "access",
  },
  {
    title: "AI Quality",
    description: "Review prompt scores, feedback signals, and learning events.",
    href: "/admin/ai-quality",
    icon: Sparkles,
    area: "ai",
  },
  {
    title: "Prompt Library",
    description: "Manage curated prompts, imports, and prompt assignments.",
    href: "/admin/prompt-library",
    icon: Bot,
    area: "ai",
  },
  {
    title: "System Health",
    description: "Inspect app, database, billing, AI, deploy, and repo readiness.",
    href: "/admin/settings/system-status",
    icon: Gauge,
    area: "platform",
  },
]

const workflowCards = [
  {
    title: "Membership Control",
    description: "Edit users, plan access, tiers, and monthly limits.",
    links: [
      { label: "Users", href: "/admin/settings/users" },
      { label: "Tiers", href: "/admin/settings/tiers" },
      { label: "Usage Limits", href: "/admin/settings/usage" },
      { label: "Access Test", href: "/admin/settings/access-test" },
    ],
    icon: ShieldCheck,
    tab: "access" as const,
  },
  {
    title: "Platform Readiness",
    description: "Check environment readiness for core services.",
    links: [
      { label: "Supabase", href: "/admin/settings/supabase-status" },
      { label: "Billing", href: "/admin/settings/billing-status" },
      { label: "Vercel", href: "/admin/settings/vercel-status" },
      { label: "GitHub", href: "/admin/settings/github-status" },
    ],
    icon: PackageCheck,
    tab: "platform" as const,
  },
  {
    title: "AI Operations",
    description: "Tune prompts, measure response quality, and check AI readiness.",
    links: [
      { label: "AI Quality", href: "/admin/ai-quality" },
      { label: "Prompt Library", href: "/admin/prompt-library" },
      { label: "AI Status", href: "/admin/settings/ai-status" },
    ],
    icon: Bot,
    tab: "ai" as const,
  },
  {
    title: "Maintenance",
    description: "Keep cleanup, backups, and registry checks out of the main path.",
    links: [
      { label: "Backup Status", href: "/admin/settings/backup-status" },
      { label: "Module Registry", href: "/admin/settings/module-registry" },
      { label: "Cleanup Checklist", href: "/admin/settings/cleanup-checklist" },
      { label: "Deprecated Files", href: "/admin/settings/deprecated-files" },
    ],
    icon: Wrench,
    tab: "maintenance" as const,
  },
]

const statusLabels: Record<StatusKey, { label: string; icon: typeof Settings }> = {
  app: { label: "App", icon: Settings },
  supabase: { label: "Supabase", icon: Database },
  stripe: { label: "Stripe", icon: CreditCard },
  openai: { label: "OpenAI", icon: Bot },
  vercel: { label: "Vercel", icon: PackageCheck },
  github: { label: "GitHub", icon: GitBranch },
}

const maintenanceLinks = [
  {
    title: "General",
    description: "Legacy general configuration notes.",
    href: "/admin/settings/general",
    icon: Settings,
  },
  {
    title: "Appearance",
    description: "Manage logo, favicon, names, and brand color.",
    href: "/admin/settings/appearance",
    icon: SlidersHorizontal,
  },
  {
    title: "Advanced",
    description: "Owner-level developer controls.",
    href: "/admin/settings/advanced",
    icon: LockKeyhole,
  },
  {
    title: "Security Status",
    description: "Environment and secret handling checks.",
    href: "/admin/settings/security-status",
    icon: ShieldCheck,
  },
  {
    title: "App Status",
    description: "Legacy app environment readiness page.",
    href: "/admin/settings/app-status",
    icon: Gauge,
  },
]

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState<DashboardTab>("overview")
  const [status, setStatus] = useState<SystemStatus | null>(null)
  const [statusError, setStatusError] = useState("")
  const [loadingStatus, setLoadingStatus] = useState(true)

  async function loadStatus() {
    setLoadingStatus(true)
    setStatusError("")

    try {
      const response = await fetch("/api/admin/system-status", {
        cache: "no-store",
      })
      const payload = await response.json()

      if (!response.ok || payload.status !== "success") {
        throw new Error(payload.message || "System status is unavailable.")
      }

      setStatus(payload as SystemStatus)
    } catch (error) {
      setStatus(null)
      setStatusError(
        error instanceof Error ? error.message : "System status is unavailable.",
      )
    } finally {
      setLoadingStatus(false)
    }
  }

  useEffect(() => {
    loadStatus()
  }, [])

  const statusItems = useMemo(() => {
    if (!status) {
      return []
    }

    return (Object.keys(statusLabels) as StatusKey[]).map((key) => ({
      key,
      ...statusLabels[key],
      configured: status[key]?.configured ?? false,
      missingKeys: status[key]?.missingKeys || [],
    }))
  }, [status])

  const configuredCount = statusItems.filter((item) => item.configured).length
  const readinessScore =
    statusItems.length > 0
      ? Math.round((configuredCount / statusItems.length) * 100)
      : null

  const filteredWorkflows =
    activeTab === "overview"
      ? workflowCards
      : workflowCards.filter((card) => card.tab === activeTab)
  const filteredActions =
    activeTab === "overview"
      ? primaryActions
      : primaryActions.filter((action) => action.area === activeTab)

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-5 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-[1500px] gap-5">
        <section className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
          <div className="grid gap-0 lg:grid-cols-[minmax(0,1fr)_380px]">
            <div className="bg-slate-950 p-6 text-white sm:p-7">
              <div className="mb-5 flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-blue-100">
                <Settings size={14} />
                Admin Settings
              </div>

              <h1 className="max-w-3xl text-3xl font-black tracking-tight sm:text-4xl">
                Control center
              </h1>

              <p className="mt-3 max-w-4xl text-sm font-semibold leading-7 text-slate-300">
                Use this dashboard to manage active admin workflows, check
                service readiness, and keep maintenance pages out of the main
                path.
              </p>

              <div className="mt-6 flex flex-wrap gap-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`min-h-10 rounded-full px-4 text-sm font-black transition ${
                      activeTab === tab.id
                        ? "bg-blue-500 text-white"
                        : "bg-white/10 text-slate-200 hover:bg-white/15"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid content-between gap-4 border-t border-slate-200 bg-slate-50 p-5 lg:border-l lg:border-t-0">
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-500">
                      Readiness
                    </p>
                    <p className="mt-2 text-4xl font-black text-slate-950">
                      {readinessScore === null ? "--" : `${readinessScore}%`}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={loadStatus}
                    disabled={loadingStatus}
                    className="inline-flex min-h-10 items-center gap-2 rounded-full border border-slate-200 bg-white px-3 text-xs font-black text-slate-700 transition hover:border-blue-200 hover:text-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <RefreshCcw
                      size={14}
                      className={loadingStatus ? "animate-spin" : ""}
                    />
                    Refresh
                  </button>
                </div>

                <p className="mt-3 text-sm font-semibold leading-6 text-slate-500">
                  {statusError ||
                    (status?.timestamp
                      ? `Last checked ${new Date(
                          status.timestamp,
                        ).toLocaleString()}`
                      : "Checking live system status.")}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <StatusPill label="Configured" value={configuredCount} />
                <StatusPill
                  label="Needs Work"
                  value={Math.max(statusItems.length - configuredCount, 0)}
                />
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div className="grid gap-4">
            <PanelHeader
              eyebrow="Priority Controls"
              title={
                activeTab === "overview"
                  ? "Most-used admin actions"
                  : `${tabs.find((tab) => tab.id === activeTab)?.label} actions`
              }
            />

            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {filteredActions.length > 0 ? (
                filteredActions.map((action) => (
                  <ActionCard key={action.href} {...action} />
                ))
              ) : (
                <EmptyState />
              )}
            </div>

            <PanelHeader eyebrow="Workflows" title="Grouped admin tasks" />

            <div className="grid gap-3 xl:grid-cols-2">
              {filteredWorkflows.map((workflow) => {
                const Icon = workflow.icon

                return (
                  <article
                    key={workflow.title}
                    className="rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm"
                  >
                    <div className="flex items-start gap-3">
                      <div className="rounded-2xl bg-blue-50 p-3 text-blue-700">
                        <Icon size={18} />
                      </div>
                      <div className="min-w-0">
                        <h2 className="text-lg font-black text-slate-950">
                          {workflow.title}
                        </h2>
                        <p className="mt-1 text-sm font-semibold leading-6 text-slate-500">
                          {workflow.description}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 grid gap-2 sm:grid-cols-2">
                      {workflow.links.map((link) => (
                        <Link
                          key={link.href}
                          href={link.href}
                          className="flex min-h-11 items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-3 text-sm font-black text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                        >
                          {link.label}
                          <ChevronRight size={15} />
                        </Link>
                      ))}
                    </div>
                  </article>
                )
              })}
            </div>
          </div>

          <aside className="grid content-start gap-4">
            <section className="rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.16em] text-blue-600">
                    Live Status
                  </p>
                  <h2 className="mt-1 text-lg font-black text-slate-950">
                    Service readiness
                  </h2>
                </div>
                <Gauge size={20} className="text-blue-700" />
              </div>

              <div className="mt-4 grid gap-2">
                {loadingStatus && statusItems.length === 0 ? (
                  <p className="rounded-2xl bg-slate-50 p-3 text-sm font-bold text-slate-500">
                    Loading status...
                  </p>
                ) : statusItems.length > 0 ? (
                  statusItems.map((item) => (
                    <StatusRow
                      key={item.key}
                      label={item.label}
                      icon={item.icon}
                      configured={item.configured}
                      missingKeys={item.missingKeys}
                    />
                  ))
                ) : (
                  <p className="rounded-2xl bg-red-50 p-3 text-sm font-bold text-red-700">
                    {statusError || "Status unavailable."}
                  </p>
                )}
              </div>
            </section>

            <section className="rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm">
              <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-500">
                Maintenance Drawer
              </p>
              <h2 className="mt-1 text-lg font-black text-slate-950">
                Less-used pages
              </h2>
              <p className="mt-2 text-sm font-semibold leading-6 text-slate-500">
                These are still available, but no longer clutter the primary
                settings workflow.
              </p>

              <div className="mt-4 grid gap-2">
                {maintenanceLinks.map((link) => {
                  const Icon = link.icon

                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="group flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-3 transition hover:border-blue-200 hover:bg-blue-50"
                    >
                      <div className="rounded-xl bg-white p-2 text-slate-500 shadow-sm group-hover:text-blue-700">
                        <Icon size={15} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-black text-slate-800">
                          {link.title}
                        </p>
                        <p className="mt-0.5 text-xs font-semibold leading-5 text-slate-500">
                          {link.description}
                        </p>
                      </div>
                    </Link>
                  )
                })}
              </div>
            </section>
          </aside>
        </section>
      </div>
    </main>
  )
}

function StatusPill({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-3">
      <p className="text-xs font-black uppercase tracking-[0.14em] text-slate-500">
        {label}
      </p>
      <p className="mt-1 text-2xl font-black text-slate-950">{value}</p>
    </div>
  )
}

function PanelHeader({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div>
      <p className="text-xs font-black uppercase tracking-[0.16em] text-blue-600">
        {eyebrow}
      </p>
      <h2 className="mt-1 text-xl font-black text-slate-950">{title}</h2>
    </div>
  )
}

function ActionCard({
  title,
  description,
  href,
  icon: Icon,
}: {
  title: string
  description: string
  href: string
  icon: typeof Settings
  area: string
}) {
  return (
    <Link
      href={href}
      className="group rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:bg-blue-50"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="rounded-2xl bg-blue-50 p-3 text-blue-700 transition group-hover:bg-blue-600 group-hover:text-white">
          <Icon size={18} />
        </div>
        <ArrowRight
          size={17}
          className="mt-2 text-slate-300 transition group-hover:translate-x-1 group-hover:text-blue-700"
        />
      </div>

      <h3 className="mt-4 text-lg font-black text-slate-950">{title}</h3>
      <p className="mt-2 text-sm font-semibold leading-6 text-slate-500">
        {description}
      </p>
    </Link>
  )
}

function StatusRow({
  label,
  icon: Icon,
  configured,
  missingKeys,
}: {
  label: string
  icon: typeof Settings
  configured: boolean
  missingKeys: string[]
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Icon size={16} className="text-slate-500" />
          <span className="text-sm font-black text-slate-800">{label}</span>
        </div>
        <span
          className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-[11px] font-black uppercase tracking-[0.08em] ${
            configured
              ? "bg-emerald-50 text-emerald-700"
              : "bg-amber-50 text-amber-700"
          }`}
        >
          {configured ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
          {configured ? "Ready" : "Needs setup"}
        </span>
      </div>

      {!configured && missingKeys.length > 0 && (
        <p className="mt-2 truncate text-xs font-semibold text-slate-500">
          Missing: {missingKeys.join(", ")}
        </p>
      )}
    </div>
  )
}

function EmptyState() {
  return (
    <div className="rounded-[24px] border border-dashed border-slate-300 bg-white p-5 text-sm font-bold leading-6 text-slate-500">
      This tab uses workflow links instead of primary action cards.
    </div>
  )
}
