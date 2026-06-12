import Link from "next/link"
import {
  ArrowRight,
  BarChart3,
  BriefcaseBusiness,
  ClipboardList,
  FileText,
  Gauge,
  Sparkles,
  Target,
  Users,
} from "lucide-react"

import { ModulePageLayout } from "@/components/layout/ModulePageLayout"
import { FirstUseTutorial } from "@/components/onboarding/FirstUseTutorial"
import {
  getAnalyticsDashboardPageContent,
  type AnalyticsDashboardIconKey,
} from "@/modules/analytics-dashboard"

const iconMap: Record<
  AnalyticsDashboardIconKey,
  React.ComponentType<{ size?: number; className?: string }>
> = {
  barChart: BarChart3,
  briefcase: BriefcaseBusiness,
  clipboard: ClipboardList,
  file: FileText,
  target: Target,
  users: Users,
}

export default function DashboardAnalyticsPage() {
  const { hero, insightAreas, workflowLinks } =
    getAnalyticsDashboardPageContent()

  return (
    <ModulePageLayout
      moduleKey="analytics_dashboard"
      title="Career Analytics"
      description="View readiness scores, activity insights, application progress, and career growth metrics."
    >
      <div className="grid gap-6">
        <section className="rounded-[32px] border border-slate-200 bg-slate-950 p-6 text-white shadow-sm">
          <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-center">
            <div>
              <div className="mb-4 flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-blue-100">
                <Gauge size={14} />
                {hero.eyebrow}
              </div>

              <h2 className="text-3xl font-black tracking-tight">
                {hero.title}
              </h2>

              <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-300">
                {hero.description}
              </p>
            </div>

            <div className="rounded-[24px] border border-white/15 bg-white/10 p-5">
              <p className="text-xs font-black uppercase tracking-[0.16em] text-blue-100">
                Best Next Step
              </p>

              <h3 className="mt-2 text-xl font-black">
                {hero.nextStepTitle}
              </h3>

              <Link
                href={hero.nextStepHref}
                className="mt-4 inline-flex items-center gap-2 rounded-full bg-blue-500 px-4 py-2.5 text-sm font-black text-white transition hover:bg-blue-400"
              >
                {hero.nextStepLabel}
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </section>

        <FirstUseTutorial moduleKey="analytics_dashboard" />

        <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {insightAreas.map((area) => {
            const Icon = iconMap[area.iconKey]

            return (
              <Link
                key={area.title}
                href={area.href}
                className="group rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="w-fit rounded-2xl bg-blue-50 p-3 text-blue-700">
                    <Icon size={20} />
                  </div>

                  <ArrowRight
                    size={18}
                    className="mt-3 text-slate-300 transition group-hover:translate-x-1 group-hover:text-blue-600"
                  />
                </div>

                <h3 className="mt-4 text-lg font-black text-slate-950">
                  {area.title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  {area.description}
                </p>
              </Link>
            )
          })}
        </section>

        <section className="rounded-[32px] border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-blue-600">
              Live Data Sources
            </p>

            <h3 className="mt-1 text-xl font-black text-slate-950">
              Current analytics are distributed across active modules
            </h3>
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            {workflowLinks.map((item) => {
              const Icon = iconMap[item.iconKey]

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group rounded-[24px] border border-slate-200 bg-slate-50 p-4 transition hover:-translate-y-0.5 hover:border-blue-200 hover:bg-blue-50"
                >
                  <div className="flex items-start gap-3">
                    <div className="rounded-2xl bg-white p-3 text-blue-700 shadow-sm">
                      <Icon size={18} />
                    </div>

                    <div>
                      <h4 className="font-black text-slate-950">
                        {item.title}
                      </h4>

                      <p className="mt-1 text-sm leading-6 text-slate-500">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </section>

        <section className="rounded-[32px] border border-blue-100 bg-blue-50 p-5">
          <div className="flex items-start gap-3">
            <div className="rounded-2xl bg-white p-3 text-blue-700 shadow-sm">
              <Sparkles size={20} />
            </div>

            <div>
              <h3 className="text-lg font-black text-blue-950">
                Unified Career OS dashboard is the next analytics milestone
              </h3>

              <p className="mt-2 text-sm leading-6 text-blue-800">
                This page now routes users to real module data. The future
                unified dashboard can consolidate those signals once each module
                has enough production history to summarize safely.
              </p>
            </div>
          </div>
        </section>
      </div>
    </ModulePageLayout>
  )
}
