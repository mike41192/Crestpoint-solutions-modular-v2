import Link from "next/link"
import { notFound } from "next/navigation"
import type { ComponentType } from "react"
import {
  ArrowLeft,
  ArrowRight,
  BriefcaseBusiness,
  CalendarClock,
  ContactRound,
  MessageSquareText,
  Send,
  Sparkles,
  UserPlus,
  Users,
} from "lucide-react"

import { ModulePageLayout } from "@/components/layout/ModulePageLayout"
import { NetworkingAssistantWorkspace } from "@/components/networking/NetworkingAssistantWorkspace"
import {
  getNetworkingOutreachPlaybookById,
  getRelatedNetworkingOutreachPlaybooks,
  listNetworkingOutreachPlaybooks,
  type NetworkingOutreachIconKey,
} from "@/modules/networking-outreach"

const iconMap: Record<
  NetworkingOutreachIconKey,
  ComponentType<{ size?: number; className?: string }>
> = {
  calendar: CalendarClock,
  contacts: ContactRound,
  linkedin: Users,
  message: MessageSquareText,
  pipeline: BriefcaseBusiness,
  send: Send,
  sparkles: Sparkles,
  "user-plus": UserPlus,
  users: Users,
}

type NetworkingPlaybookPageProps = {
  params: Promise<{
    playbookId: string
  }>
}

export function generateStaticParams() {
  return listNetworkingOutreachPlaybooks().map((playbook) => ({
    playbookId: playbook.id,
  }))
}

export async function generateMetadata({
  params,
}: NetworkingPlaybookPageProps) {
  const { playbookId } = await params
  const playbook = getNetworkingOutreachPlaybookById(playbookId)

  if (!playbook) {
    return {
      title: "Networking Assistant",
    }
  }

  return {
    title: `${playbook.title} | Networking Assistant`,
    description: playbook.description,
  }
}

export default async function NetworkingPlaybookPage({
  params,
}: NetworkingPlaybookPageProps) {
  const { playbookId } = await params
  const playbook = getNetworkingOutreachPlaybookById(playbookId)

  if (!playbook) {
    notFound()
  }

  const Icon = iconMap[playbook.iconKey]
  const relatedPlaybooks = getRelatedNetworkingOutreachPlaybooks(
    playbook.relatedPlaybookIds,
  )

  return (
    <ModulePageLayout
      moduleKey="networking_outreach"
      title={playbook.title}
      description={playbook.description}
    >
      <div className="grid gap-6">
        <Link
          href="/dashboard/networking"
          className="inline-flex w-fit items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-black text-slate-700 shadow-sm transition hover:border-blue-200 hover:text-blue-700"
        >
          <ArrowLeft size={16} />
          Networking Assistant
        </Link>

        <section className="rounded-[32px] border border-slate-200 bg-slate-950 p-6 text-white shadow-sm">
          <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px] xl:items-start">
            <div>
              <div className="mb-4 flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-blue-100">
                <Icon size={14} />
                {playbook.estimatedTime} template set
              </div>

              <h2 className="text-3xl font-black tracking-tight">
                {playbook.subtitle}
              </h2>

              <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-300">
                {playbook.outcome}
              </p>
            </div>

            <div className="rounded-[24px] border border-white/15 bg-white/10 p-5">
              <p className="text-xs font-black uppercase tracking-[0.16em] text-blue-100">
                Use This With
              </p>

              <div className="mt-4 grid gap-3">
                {playbook.connectedTools.map((tool) => {
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

        <NetworkingAssistantWorkspace playbook={playbook} />

        {relatedPlaybooks.length > 0 && (
          <section className="rounded-[32px] border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-4">
              <p className="text-xs font-black uppercase tracking-[0.16em] text-blue-600">
                Continue Polishing
              </p>

              <h3 className="mt-1 text-xl font-black text-slate-950">
                Related template sets
              </h3>
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              {relatedPlaybooks.map((related) => {
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
                          Open templates
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
