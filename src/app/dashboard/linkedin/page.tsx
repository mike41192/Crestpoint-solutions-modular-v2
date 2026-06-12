import Link from "next/link"
import type { ComponentType } from "react"
import {
  ArrowRight,
  BadgeCheck,
  BriefcaseBusiness,
  CheckCircle2,
  Clock3,
  FileText,
  Search,
  Sparkles,
  Target,
  Users,
} from "lucide-react"

import { ModulePageLayout } from "@/components/layout/ModulePageLayout"
import { FirstUseTutorial } from "@/components/onboarding/FirstUseTutorial"
import {
  getLinkedInOptimizerPageContent,
  type LinkedInOptimizerIconKey,
} from "@/modules/linkedin-optimizer"

const iconMap: Record<
  LinkedInOptimizerIconKey,
  ComponentType<{ size?: number; className?: string }>
> = {
  badge: BadgeCheck,
  briefcase: BriefcaseBusiness,
  file: FileText,
  search: Search,
  sparkles: Sparkles,
  target: Target,
  users: Users,
}

export default function LinkedInDashboardPage() {
  const { hero, sections, workflowLinks } = getLinkedInOptimizerPageContent()

  return (
    <ModulePageLayout
      moduleKey="linkedin_optimizer"
      title="LinkedIn Optimizer"
      description="Improve your LinkedIn profile, headline, about section, and recruiter visibility."
    >
      <div className="grid gap-6">
        <section className="rounded-[32px] border border-slate-200 bg-slate-950 p-6 text-white shadow-sm">
          <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-center">
            <div>
              <div className="mb-4 flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-blue-100">
                <Sparkles size={14} />
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

        <FirstUseTutorial moduleKey="linkedin_optimizer" />

        <section className="grid gap-5">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.16em] text-blue-600">
              Profile Optimization Playbooks
            </p>

            <h3 className="mt-1 text-2xl font-black text-slate-950">
              Tighten the profile sections recruiters inspect first
            </h3>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {sections.map((section) => {
              const Icon = iconMap[section.iconKey]

              return (
                <Link
                  key={section.id}
                  href={section.href}
                  className="group rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-md"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="w-fit rounded-2xl bg-blue-50 p-3 text-blue-700">
                      <Icon size={20} />
                    </div>

                    <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-600">
                      <Clock3 size={13} />
                      {section.estimatedTime}
                    </span>
                  </div>

                  <p className="mt-4 text-xs font-black uppercase tracking-[0.14em] text-blue-600">
                    {section.cardLabel}
                  </p>

                  <h3 className="mt-2 text-lg font-black text-slate-950">
                    {section.title}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    {section.description}
                  </p>

                  <div className="mt-4 border-t border-slate-100 pt-4">
                    <div className="flex items-start gap-2 text-xs font-semibold leading-5 text-slate-600">
                      <CheckCircle2
                        size={14}
                        className="mt-0.5 shrink-0 text-emerald-600"
                      />
                      {section.outcome}
                    </div>
                  </div>

                  <div className="mt-5 inline-flex items-center gap-2 text-sm font-black text-blue-700">
                    Open playbook
                    <ArrowRight
                      size={16}
                      className="transition group-hover:translate-x-1"
                    />
                  </div>
                </Link>
              )
            })}
          </div>
        </section>

        <section className="rounded-[32px] border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-blue-600">
              Connected Workflow
            </p>

            <h3 className="mt-1 text-xl font-black text-slate-950">
              Use live Crestpoint data to guide profile updates
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
      </div>
    </ModulePageLayout>
  )
}
