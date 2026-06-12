import Link from "next/link"
import { notFound } from "next/navigation"
import type { ComponentType } from "react"
import {
  ArrowLeft,
  BarChart3,
  BriefcaseBusiness,
  ClipboardList,
  FileText,
  Target,
  Users,
} from "lucide-react"

import { AnalyticsInsightWorkspace } from "@/components/analytics/AnalyticsInsightWorkspace"
import { ModulePageLayout } from "@/components/layout/ModulePageLayout"
import {
  getAnalyticsDashboardInsightAreaById,
  listAnalyticsDashboardInsightAreas,
  type AnalyticsDashboardIconKey,
} from "@/modules/analytics-dashboard"

const iconMap: Record<
  AnalyticsDashboardIconKey,
  ComponentType<{ size?: number; className?: string }>
> = {
  barChart: BarChart3,
  briefcase: BriefcaseBusiness,
  clipboard: ClipboardList,
  file: FileText,
  target: Target,
  users: Users,
}

type AnalyticsSectionPageProps = {
  params: Promise<{
    sectionId: string
  }>
}

export function generateStaticParams() {
  return listAnalyticsDashboardInsightAreas().map((area) => ({
    sectionId: area.id,
  }))
}

export async function generateMetadata({
  params,
}: AnalyticsSectionPageProps) {
  const { sectionId } = await params
  const area = getAnalyticsDashboardInsightAreaById(sectionId)

  if (!area) {
    return {
      title: "Career Analytics",
    }
  }

  return {
    title: `${area.title} | Career Analytics`,
    description: area.description,
  }
}

export default async function AnalyticsSectionPage({
  params,
}: AnalyticsSectionPageProps) {
  const { sectionId } = await params
  const area = getAnalyticsDashboardInsightAreaById(sectionId)

  if (!area) {
    notFound()
  }

  const Icon = iconMap[area.iconKey]
  const allAreas = listAnalyticsDashboardInsightAreas()

  return (
    <ModulePageLayout
      moduleKey="analytics_dashboard"
      title={area.title}
      description={area.description}
    >
      <div className="grid gap-6">
        <Link
          href="/dashboard/analytics"
          className="inline-flex w-fit items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-black text-slate-700 shadow-sm transition hover:border-blue-200 hover:text-blue-700"
        >
          <ArrowLeft size={16} />
          Career Analytics
        </Link>

        <section className="rounded-[32px] border border-slate-200 bg-slate-950 p-6 text-white shadow-sm">
          <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px] xl:items-start">
            <div>
              <div className="mb-4 flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-blue-100">
                <Icon size={14} />
                Customer progress stats
              </div>

              <h2 className="text-3xl font-black tracking-tight">
                {area.subtitle}
              </h2>

              <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-300">
                {area.description}
              </p>
            </div>

            <div className="rounded-[24px] border border-white/15 bg-white/10 p-5">
              <p className="text-xs font-black uppercase tracking-[0.16em] text-blue-100">
                Data Source
              </p>

              <h3 className="mt-2 text-xl font-black">{area.sourceLabel}</h3>

              <Link
                href={area.sourceHref}
                className="mt-4 inline-flex items-center gap-2 rounded-full bg-blue-500 px-4 py-2.5 text-sm font-black text-white transition hover:bg-blue-400"
              >
                Open Source Module
              </Link>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-2 rounded-[24px] border border-slate-200 bg-slate-50 p-2 md:grid-cols-2 xl:grid-cols-4">
          {allAreas.map((item) => {
            const active = item.id === area.id

            return (
              <Link
                key={item.id}
                href={item.href}
                className={`rounded-[18px] px-4 py-3 text-sm font-black transition ${
                  active
                    ? "bg-white text-blue-700 shadow-sm"
                    : "text-slate-600 hover:bg-white/70 hover:text-slate-950"
                }`}
              >
                {item.title}
              </Link>
            )
          })}
        </section>

        <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {area.metricLabels.map((label) => (
            <div
              key={label}
              className="rounded-[22px] border border-slate-200 bg-white px-4 py-3 text-sm font-black text-slate-700 shadow-sm"
            >
              {label}
            </div>
          ))}
        </section>

        <AnalyticsInsightWorkspace area={area} />
      </div>
    </ModulePageLayout>
  )
}
