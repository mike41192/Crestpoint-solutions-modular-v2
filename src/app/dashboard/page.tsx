import Link from "next/link"
import {
  ArrowRight,
  BarChart3,
  Brain,
  BriefcaseBusiness,
  CheckCircle2,
  ClipboardList,
  FileText,
  GraduationCap,
  MessageSquare,
  Sparkles,
  Target,
  TrendingUp,
  Users,
} from "lucide-react"
import { ModulePageLayout } from "@/components/layout/ModulePageLayout"

const quickActions = [
  {
    title: "Build Resume",
    description: "Open the resume builder and continue editing.",
    href: "/dashboard/resume",
    icon: FileText,
  },
  {
    title: "Run ATS Scan",
    description: "Compare your resume against a job description.",
    href: "/dashboard/ats",
    icon: Target,
  },
  {
    title: "Practice Interview",
    description: "Prepare with AI interview questions.",
    href: "/dashboard/interview",
    icon: MessageSquare,
  },
  {
    title: "Track Application",
    description: "Add jobs, interviews, and follow-ups.",
    href: "/dashboard/jobs",
    icon: BriefcaseBusiness,
  },
]

const moduleCards = [
  {
    title: "Resume Builder",
    description: "Build, optimize, save, and export professional resumes.",
    href: "/dashboard/resume",
    icon: FileText,
  },
  {
    title: "ATS Scoring",
    description: "Analyze resume compatibility against job descriptions.",
    href: "/dashboard/ats",
    icon: Target,
  },
  {
    title: "AI Interviewer",
    description: "Practice mock interviews with AI feedback.",
    href: "/dashboard/interview",
    icon: MessageSquare,
  },
  {
    title: "Interview Academy",
    description: "Learn STAR responses, confidence, and prep systems.",
    href: "/dashboard/interview-academy",
    icon: GraduationCap,
  },
  {
    title: "LinkedIn Optimizer",
    description: "Improve recruiter visibility and profile positioning.",
    href: "/dashboard/linkedin",
    icon: Users,
  },
  {
    title: "Job Tracker",
    description: "Track applications, interviews, networking, and progress.",
    href: "/dashboard/jobs",
    icon: BriefcaseBusiness,
  },
  {
    title: "Networking Outreach",
    description: "Generate recruiter outreach and follow-up messaging.",
    href: "/dashboard/networking",
    icon: ClipboardList,
  },
  {
    title: "Analytics Dashboard",
    description: "Review application metrics, AI usage, and trends.",
    href: "/dashboard/analytics",
    icon: BarChart3,
  },
]

const recommendationCards = [
  "Finish your resume profile sections before exporting.",
  "Run an ATS scan before submitting applications.",
  "Practice interview answers for your top target role.",
  "Track every application so follow-ups do not get missed.",
]

export default function DashboardHomePage() {
  return (
    <ModulePageLayout
      title="Career Command Center"
      description="Manage resumes, applications, interviews, optimization tools, and career progress from one workspace."
    >
      <div className="grid gap-6">
        <section className="rounded-[32px] border border-slate-200 bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 p-6 text-white shadow-sm">
          <div className="grid gap-6 lg:grid-cols-[1fr_360px] lg:items-center">
            <div>
              <div className="mb-4 flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-blue-100">
                <Sparkles size={14} />
                Crestpoint Career OS
              </div>

              <h2 className="text-3xl font-black tracking-tight sm:text-4xl">
                Your job search command center
              </h2>

              <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-300 sm:text-base">
                Continue building your resume, improving ATS alignment,
                practicing interviews, tracking applications, and organizing
                your career progress.
              </p>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/dashboard/resume"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-blue-500 px-5 py-3 text-sm font-black text-white shadow-lg shadow-blue-950/30 transition hover:-translate-y-0.5 hover:bg-blue-400"
                >
                  Continue Resume
                  <ArrowRight size={17} />
                </Link>

                <Link
                  href="/dashboard/ats"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 bg-white/10 px-5 py-3 text-sm font-black text-white transition hover:-translate-y-0.5 hover:bg-white/15"
                >
                  Run ATS Scan
                </Link>
              </div>
            </div>

            <div className="rounded-[28px] border border-white/15 bg-white/10 p-5">
              <p className="text-xs font-black uppercase tracking-[0.16em] text-blue-100">
                Recommended Next Step
              </p>
              <h3 className="mt-2 text-xl font-black">
                Complete your strongest resume version
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-300">
                Finish the resume builder polish, then run ATS scoring before
                exporting and applying.
              </p>
            </div>
          </div>
        </section>

        <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          <StatCard
            icon={FileText}
            label="Resume Progress"
            value="Active"
            description="Builder, autosave, versions, and DOCX export online."
          />
          <StatCard
            icon={Target}
            label="ATS Readiness"
            value="Ready"
            description="Scoring system prepared for job-match workflows."
          />
          <StatCard
            icon={MessageSquare}
            label="Interview Prep"
            value="Available"
            description="Practice modules available from the dashboard."
          />
          <StatCard
            icon={TrendingUp}
            label="Growth System"
            value="Phase 157.2"
            description="Command center modernization in progress."
          />
        </section>

        <section>
          <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-blue-600">
                Quick Actions
              </p>
              <h2 className="mt-1 text-2xl font-black text-slate-950">
                What do you want to do next?
              </h2>
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {quickActions.map((action) => {
              const Icon = action.icon

              return (
                <Link
                  key={action.href}
                  href={action.href}
                  className="group rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-md"
                >
                  <div className="mb-4 w-fit rounded-2xl bg-blue-50 p-3 text-blue-700 transition group-hover:bg-blue-600 group-hover:text-white">
                    <Icon size={21} />
                  </div>

                  <h3 className="text-lg font-black text-slate-950">
                    {action.title}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    {action.description}
                  </p>
                </Link>
              )
            })}
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
          <div className="rounded-[32px] border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-5 flex items-start gap-3 border-b border-slate-100 pb-4">
              <div className="rounded-2xl bg-blue-50 p-2 text-blue-700">
                <Brain size={19} />
              </div>

              <div>
                <h2 className="text-xl font-black text-slate-950">
                  AI Recommendations
                </h2>
                <p className="mt-1 text-sm leading-6 text-slate-500">
                  Suggested next actions to keep your career system moving.
                </p>
              </div>
            </div>

            <div className="grid gap-3">
              {recommendationCards.map((item) => (
                <div
                  key={item}
                  className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4"
                >
                  <CheckCircle2 size={18} className="mt-0.5 text-blue-600" />
                  <p className="text-sm font-semibold leading-6 text-slate-700">
                    {item}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[32px] border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-5 flex items-start gap-3 border-b border-slate-100 pb-4">
              <div className="rounded-2xl bg-blue-50 p-2 text-blue-700">
                <BarChart3 size={19} />
              </div>

              <div>
                <h2 className="text-xl font-black text-slate-950">
                  Activity Snapshot
                </h2>
                <p className="mt-1 text-sm leading-6 text-slate-500">
                  Live metrics will connect to Supabase in a later phase.
                </p>
              </div>
            </div>

            <div className="grid gap-3">
              <ActivityRow label="Recent resume update" value="Ready" />
              <ActivityRow label="Autosave engine" value="Online" />
              <ActivityRow label="Version history" value="Online" />
              <ActivityRow label="PDF integration" value="Next phase" />
            </div>
          </div>
        </section>

        <section>
          <div className="mb-4">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-blue-600">
              Career Modules
            </p>
            <h2 className="mt-1 text-2xl font-black text-slate-950">
              Explore your Crestpoint tools
            </h2>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {moduleCards.map((module) => {
              const Icon = module.icon

              return (
                <Link
                  key={module.href}
                  href={module.href}
                  className="group rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-md"
                >
                  <div className="mb-4 w-fit rounded-2xl bg-slate-100 p-3 text-slate-600 transition group-hover:bg-blue-50 group-hover:text-blue-700">
                    <Icon size={21} />
                  </div>

                  <h3 className="font-black text-slate-950">{module.title}</h3>

                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    {module.description}
                  </p>
                </Link>
              )
            })}
          </div>
        </section>
      </div>
    </ModulePageLayout>
  )
}

type StatCardProps = {
  icon: React.ComponentType<{ size?: number }>
  label: string
  value: string
  description: string
}

function StatCard({
  icon: Icon,
  label,
  value,
  description,
}: StatCardProps) {
  return (
    <article className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="rounded-2xl bg-blue-50 p-3 text-blue-700">
          <Icon size={20} />
        </div>

        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-600">
          {value}
        </span>
      </div>

      <h3 className="font-black text-slate-950">{label}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-500">{description}</p>
    </article>
  )
}

function ActivityRow({
  label,
  value,
}: {
  label: string
  value: string
}) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
      <p className="text-sm font-bold text-slate-700">{label}</p>
      <span className="rounded-full bg-white px-3 py-1 text-xs font-black text-blue-700">
        {value}
      </span>
    </div>
  )
}
