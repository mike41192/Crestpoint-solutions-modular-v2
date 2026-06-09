import Link from "next/link"
import {
  ArrowRight,
  BadgeCheck,
  BriefcaseBusiness,
  FileText,
  Search,
  Sparkles,
  Target,
  Users,
} from "lucide-react"

import { ModulePageLayout } from "@/components/layout/ModulePageLayout"
import { FirstUseTutorial } from "@/components/onboarding/FirstUseTutorial"

const optimizationAreas = [
  {
    title: "Headline Positioning",
    description:
      "Shape a recruiter-friendly headline around target roles, industries, and searchable keywords.",
    icon: Target,
  },
  {
    title: "About Section",
    description:
      "Turn your summary into a concise career narrative that supports your resume and applications.",
    icon: FileText,
  },
  {
    title: "Keyword Visibility",
    description:
      "Align profile language with job descriptions, ATS findings, and recruiter search patterns.",
    icon: Search,
  },
  {
    title: "Relationship Signals",
    description:
      "Use contacts, companies, and outreach context to guide profile updates before networking.",
    icon: Users,
  },
]

const workflowLinks = [
  {
    title: "Review Target Jobs",
    description: "Use saved job descriptions to identify recurring profile keywords.",
    href: "/dashboard/job-descriptions",
    icon: BriefcaseBusiness,
  },
  {
    title: "Open Career CRM",
    description: "Review recruiters and networking contacts before profile outreach.",
    href: "/dashboard/contacts",
    icon: Users,
  },
  {
    title: "Run ATS Scoring",
    description: "Use resume gaps to find missing LinkedIn positioning signals.",
    href: "/dashboard/ats",
    icon: BadgeCheck,
  },
]

export default function LinkedInDashboardPage() {
  return (
    <ModulePageLayout
      title="LinkedIn Optimizer"
      description="Improve your LinkedIn profile, headline, about section, and recruiter visibility."
    >
      <div className="grid gap-6">
        <section className="rounded-[32px] border border-slate-200 bg-slate-950 p-6 text-white shadow-sm">
          <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-center">
            <div>
              <div className="mb-4 flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-blue-100">
                <Sparkles size={14} />
                Profile Visibility
              </div>

              <h2 className="text-3xl font-black tracking-tight">
                Build a recruiter-readable LinkedIn presence
              </h2>

              <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-300">
                Use your resume, ATS gaps, target jobs, and Career CRM context
                to tighten how you show up in recruiter searches and outreach.
              </p>
            </div>

            <div className="rounded-[24px] border border-white/15 bg-white/10 p-5">
              <p className="text-xs font-black uppercase tracking-[0.16em] text-blue-100">
                Best Next Step
              </p>

              <h3 className="mt-2 text-xl font-black">
                Compare profile keywords against saved job descriptions
              </h3>

              <Link
                href="/dashboard/job-descriptions"
                className="mt-4 inline-flex items-center gap-2 rounded-full bg-blue-500 px-4 py-2.5 text-sm font-black text-white transition hover:bg-blue-400"
              >
                Open Job Descriptions
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </section>

        <FirstUseTutorial moduleKey="linkedin_optimizer" />

        <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {optimizationAreas.map((area) => {
            const Icon = area.icon

            return (
              <article
                key={area.title}
                className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-md"
              >
                <div className="w-fit rounded-2xl bg-blue-50 p-3 text-blue-700">
                  <Icon size={20} />
                </div>

                <h3 className="mt-4 text-lg font-black text-slate-950">
                  {area.title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  {area.description}
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
              Use live Crestpoint data to guide profile updates
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
