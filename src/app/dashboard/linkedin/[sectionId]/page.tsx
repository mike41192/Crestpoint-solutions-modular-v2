import Link from "next/link"
import { notFound } from "next/navigation"
import type { ComponentType } from "react"
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  BriefcaseBusiness,
  CheckCircle2,
  ClipboardCheck,
  FileText,
  Lightbulb,
  Search,
  Sparkles,
  Target,
  Users,
  Wand2,
  XCircle,
} from "lucide-react"

import { ModulePageLayout } from "@/components/layout/ModulePageLayout"
import {
  getLinkedInOptimizerSectionById,
  getRelatedLinkedInOptimizerSections,
  listLinkedInOptimizerSections,
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

type LinkedInSectionPageProps = {
  params: Promise<{
    sectionId: string
  }>
}

export function generateStaticParams() {
  return listLinkedInOptimizerSections().map((section) => ({
    sectionId: section.id,
  }))
}

export async function generateMetadata({ params }: LinkedInSectionPageProps) {
  const { sectionId } = await params
  const section = getLinkedInOptimizerSectionById(sectionId)

  if (!section) {
    return {
      title: "LinkedIn Optimizer",
    }
  }

  return {
    title: `${section.title} | LinkedIn Optimizer`,
    description: section.description,
  }
}

export default async function LinkedInSectionPage({
  params,
}: LinkedInSectionPageProps) {
  const { sectionId } = await params
  const section = getLinkedInOptimizerSectionById(sectionId)

  if (!section) {
    notFound()
  }

  const Icon = iconMap[section.iconKey]
  const relatedSections = getRelatedLinkedInOptimizerSections(
    section.relatedSectionIds,
  )

  return (
    <ModulePageLayout
      moduleKey="linkedin_optimizer"
      title={section.title}
      description={section.description}
    >
      <div className="grid gap-6">
        <Link
          href="/dashboard/linkedin"
          className="inline-flex w-fit items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-black text-slate-700 shadow-sm transition hover:border-blue-200 hover:text-blue-700"
        >
          <ArrowLeft size={16} />
          LinkedIn Optimizer
        </Link>

        <section className="rounded-[32px] border border-slate-200 bg-slate-950 p-6 text-white shadow-sm">
          <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px] xl:items-start">
            <div>
              <div className="mb-4 flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-blue-100">
                <Icon size={14} />
                {section.estimatedTime} playbook
              </div>

              <h2 className="text-3xl font-black tracking-tight">
                {section.subtitle}
              </h2>

              <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-300">
                {section.outcome}
              </p>
            </div>

            <div className="rounded-[24px] border border-white/15 bg-white/10 p-5">
              <p className="text-xs font-black uppercase tracking-[0.16em] text-blue-100">
                Use This With
              </p>

              <div className="mt-4 grid gap-3">
                {section.connectedTools.map((tool) => {
                  const ToolIcon = iconMap[tool.iconKey]

                  return (
                    <Link
                      key={tool.href}
                      href={tool.href}
                      className="group rounded-2xl border border-white/10 bg-white/10 p-3 transition hover:bg-white/15"
                    >
                      <div className="flex items-start gap-3">
                        <ToolIcon
                          size={18}
                          className="mt-0.5 shrink-0 text-blue-200"
                        />
                        <div>
                          <h3 className="text-sm font-black text-white">
                            {tool.title}
                          </h3>
                          <p className="mt-1 text-xs font-semibold leading-5 text-slate-300">
                            {tool.description}
                          </p>
                        </div>
                      </div>
                    </Link>
                  )
                })}
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-4 xl:grid-cols-3">
          <Panel
            title="Optimization Checklist"
            icon={ClipboardCheck}
            items={section.checklist}
            tone="blue"
          />
          <Panel
            title="Questions To Answer"
            icon={Lightbulb}
            items={section.prompts}
            tone="amber"
          />
          <Panel
            title="Execution Playbook"
            icon={Wand2}
            items={section.playbook.map((step) => `${step.title}: ${step.body}`)}
            tone="emerald"
          />
        </section>

        <section className="rounded-[32px] border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-blue-600">
              Before And After
            </p>

            <h3 className="mt-1 text-xl font-black text-slate-950">
              Compare generic language with recruiter-readable positioning
            </h3>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <ExampleCard
              title="Weak"
              icon={XCircle}
              body={section.examples.weak}
              tone="red"
            />
            <ExampleCard
              title="Stronger"
              icon={CheckCircle2}
              body={section.examples.strong}
              tone="emerald"
            />
          </div>

          <div className="mt-4 rounded-[24px] border border-blue-100 bg-blue-50 p-4">
            <p className="text-sm font-semibold leading-6 text-blue-950">
              {section.examples.why}
            </p>
          </div>
        </section>

        {relatedSections.length > 0 && (
          <section className="rounded-[32px] border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-4">
              <p className="text-xs font-black uppercase tracking-[0.16em] text-blue-600">
                Continue Polishing
              </p>

              <h3 className="mt-1 text-xl font-black text-slate-950">
                Related LinkedIn playbooks
              </h3>
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              {relatedSections.map((related) => {
                const RelatedIcon = iconMap[related.iconKey]

                return (
                  <Link
                    key={related.id}
                    href={related.href}
                    className="group rounded-[24px] border border-slate-200 bg-slate-50 p-4 transition hover:-translate-y-0.5 hover:border-blue-200 hover:bg-blue-50"
                  >
                    <div className="flex items-start gap-3">
                      <div className="rounded-2xl bg-white p-3 text-blue-700 shadow-sm">
                        <RelatedIcon size={18} />
                      </div>

                      <div>
                        <h4 className="font-black text-slate-950">
                          {related.title}
                        </h4>

                        <p className="mt-1 text-sm leading-6 text-slate-500">
                          {related.description}
                        </p>

                        <div className="mt-3 inline-flex items-center gap-2 text-sm font-black text-blue-700">
                          Open playbook
                          <ArrowRight
                            size={16}
                            className="transition group-hover:translate-x-1"
                          />
                        </div>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          </section>
        )}
      </div>
    </ModulePageLayout>
  )
}

type PanelProps = {
  title: string
  icon: ComponentType<{ size?: number; className?: string }>
  items: string[]
  tone: "amber" | "blue" | "emerald"
}

const panelTone: Record<PanelProps["tone"], string> = {
  amber: "bg-amber-50 text-amber-700",
  blue: "bg-blue-50 text-blue-700",
  emerald: "bg-emerald-50 text-emerald-700",
}

function Panel({ title, icon: Icon, items, tone }: PanelProps) {
  return (
    <article className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
      <div className={`w-fit rounded-2xl p-3 ${panelTone[tone]}`}>
        <Icon size={20} />
      </div>

      <h3 className="mt-4 text-lg font-black text-slate-950">{title}</h3>

      <div className="mt-4 grid gap-3">
        {items.map((item) => (
          <div
            key={item}
            className="flex items-start gap-2 text-sm font-semibold leading-6 text-slate-600"
          >
            <CheckCircle2
              size={15}
              className="mt-1 shrink-0 text-emerald-600"
            />
            {item}
          </div>
        ))}
      </div>
    </article>
  )
}

type ExampleCardProps = {
  title: string
  icon: ComponentType<{ size?: number; className?: string }>
  body: string
  tone: "emerald" | "red"
}

const exampleTone: Record<ExampleCardProps["tone"], string> = {
  emerald: "bg-emerald-50 text-emerald-700",
  red: "bg-rose-50 text-rose-700",
}

function ExampleCard({ title, icon: Icon, body, tone }: ExampleCardProps) {
  return (
    <article className="rounded-[24px] border border-slate-200 bg-slate-50 p-4">
      <div className="flex items-start gap-3">
        <div className={`rounded-2xl p-3 ${exampleTone[tone]}`}>
          <Icon size={18} />
        </div>

        <div>
          <h4 className="font-black text-slate-950">{title}</h4>
          <p className="mt-2 text-sm font-semibold leading-6 text-slate-600">
            {body}
          </p>
        </div>
      </div>
    </article>
  )
}
