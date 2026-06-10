import Link from "next/link"
import {
  ArrowRight,
  CalendarClock,
  MessageSquareText,
  Send,
  Sparkles,
  UserPlus,
  Users,
} from "lucide-react"

import { ModulePageLayout } from "@/components/layout/ModulePageLayout"
import { FirstUseTutorial } from "@/components/onboarding/FirstUseTutorial"

const outreachTypes = [
  {
    title: "Recruiter Outreach",
    description:
      "Start a concise conversation with recruiters connected to target roles or companies.",
    icon: Send,
  },
  {
    title: "Referral Request",
    description:
      "Ask for a referral with clear context, role alignment, and respectful timing.",
    icon: UserPlus,
  },
  {
    title: "Follow-Up Message",
    description:
      "Keep applications warm after submitting, interviewing, or connecting with a contact.",
    icon: CalendarClock,
  },
  {
    title: "Networking Check-In",
    description:
      "Maintain relationships with mentors, coworkers, and professional contacts.",
    icon: MessageSquareText,
  },
]

const workflowLinks = [
  {
    title: "Manage Contacts",
    description: "Open your Career CRM to review people, notes, and follow-up dates.",
    href: "/dashboard/contacts",
    icon: Users,
  },
  {
    title: "Review Job Pipeline",
    description: "Use application status and next actions to decide who to message.",
    href: "/dashboard/jobs",
    icon: CalendarClock,
  },
  {
    title: "Prepare LinkedIn",
    description: "Align your profile before outreach so contacts see a clear story.",
    href: "/dashboard/linkedin",
    icon: Sparkles,
  },
]

export default function NetworkingDashboardPage() {
  return (
    <ModulePageLayout
      moduleKey="networking_outreach"
      title="Networking Assistant"
      description="Create recruiter messages, referral requests, follow-ups, and professional outreach."
    >
      <div className="grid gap-6">
        <section className="rounded-[32px] border border-slate-200 bg-slate-950 p-6 text-white shadow-sm">
          <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-center">
            <div>
              <div className="mb-4 flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-blue-100">
                <Users size={14} />
                Relationship Workflow
              </div>

              <h2 className="text-3xl font-black tracking-tight">
                Turn contacts into a consistent search rhythm
              </h2>

              <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-300">
                Use Career CRM contacts, application status, and saved notes to
                plan outreach without losing context between conversations.
              </p>
            </div>

            <div className="rounded-[24px] border border-white/15 bg-white/10 p-5">
              <p className="text-xs font-black uppercase tracking-[0.16em] text-blue-100">
                Best Next Step
              </p>

              <h3 className="mt-2 text-xl font-black">
                Review contacts with upcoming follow-ups
              </h3>

              <Link
                href="/dashboard/contacts"
                className="mt-4 inline-flex items-center gap-2 rounded-full bg-blue-500 px-4 py-2.5 text-sm font-black text-white transition hover:bg-blue-400"
              >
                Open Contacts
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </section>

        <FirstUseTutorial moduleKey="networking_outreach" />

        <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {outreachTypes.map((type) => {
            const Icon = type.icon

            return (
              <article
                key={type.title}
                className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-md"
              >
                <div className="w-fit rounded-2xl bg-blue-50 p-3 text-blue-700">
                  <Icon size={20} />
                </div>

                <h3 className="mt-4 text-lg font-black text-slate-950">
                  {type.title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  {type.description}
                </p>
              </article>
            )
          })}
        </section>

        <section className="rounded-[32px] border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-blue-600">
              Connected Workflow
            </p>

            <h3 className="mt-1 text-xl font-black text-slate-950">
              Pull outreach context from your Career OS
            </h3>
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            {workflowLinks.map((item) => {
              const Icon = item.icon

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
