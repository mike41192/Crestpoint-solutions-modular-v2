import Link from "next/link"
import {
  ArrowRight,
  BarChart3,
  BriefcaseBusiness,
  CheckCircle2,
  FileText,
  MessageSquare,
  ShieldCheck,
  Sparkles,
  Target,
} from "lucide-react"

const features = [
  {
    title: "Resume Builder",
    description: "Create polished resumes with templates, autosave, and export tools.",
    icon: FileText,
  },
  {
    title: "ATS Scoring",
    description: "Understand how your resume matches job descriptions before applying.",
    icon: Target,
  },
  {
    title: "Interview Practice",
    description: "Prepare with AI-powered interview questions and feedback.",
    icon: MessageSquare,
  },
  {
    title: "Job Tracker",
    description: "Organize applications, interviews, follow-ups, and networking.",
    icon: BriefcaseBusiness,
  },
]

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-100">
      <header className="mx-auto flex max-w-[1400px] items-center justify-between px-5 py-5 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-600 text-white">
            <Sparkles size={20} />
          </div>

          <div>
            <p className="text-sm font-black text-slate-950">
              Crestpoint Solutions
            </p>
            <p className="text-xs font-semibold text-slate-500">
              Career Operating System
            </p>
          </div>
        </Link>

        <Link
          href="/auth/login"
          className="rounded-full border border-slate-300 bg-white px-5 py-2.5 text-sm font-black text-slate-800 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-300 hover:text-blue-700"
        >
          Log In
        </Link>
      </header>

      <section className="mx-auto grid max-w-[1400px] gap-10 px-5 pb-12 pt-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:px-8 lg:pt-14">
        <div>
          <div className="mb-5 flex w-fit items-center gap-2 rounded-full border border-blue-200 bg-white px-4 py-2 text-sm font-black text-blue-700 shadow-sm">
            <ShieldCheck size={16} />
            AI-powered career tools for serious job seekers
          </div>

          <h1 className="max-w-4xl text-4xl font-black tracking-tight text-slate-950 sm:text-6xl">
            Build better resumes. Apply smarter. Interview with confidence.
          </h1>

          <p className="mt-5 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
            Crestpoint Solutions gives you one career command center for resume
            building, ATS scoring, interview preparation, job tracking, and AI
            optimization — so every application is more focused and professional.
          </p>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-blue-600 px-7 py-3.5 text-sm font-black text-white shadow-lg shadow-blue-200 transition hover:-translate-y-0.5 hover:bg-blue-700"
            >
              Start Building Your Career System
              <ArrowRight size={17} />
            </Link>

            <Link
              href="/pricing"
              className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-7 py-3.5 text-sm font-black text-slate-800 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-300 hover:text-blue-700"
            >
              View Plans
            </Link>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {[
              "Resume tools",
              "ATS optimization",
              "Interview prep",
            ].map((item) => (
              <div
                key={item}
                className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-extrabold text-slate-700 shadow-sm"
              >
                <CheckCircle2 size={16} className="text-blue-600" />
                {item}
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[32px] border border-slate-200 bg-white p-5 shadow-xl shadow-slate-200/70">
          <div className="rounded-[28px] bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 p-6 text-white">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-blue-200">
              Career Command Center
            </p>
            <h2 className="mt-2 text-2xl font-black">
              Everything you need to improve your job search.
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              Built for resumes, applications, interviews, and career growth.
            </p>
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {features.map((feature) => {
              const Icon = feature.icon

              return (
                <article
                  key={feature.title}
                  className="rounded-3xl border border-slate-200 bg-slate-50 p-4 transition hover:-translate-y-1 hover:border-blue-200 hover:bg-white hover:shadow-md"
                >
                  <div className="mb-3 w-fit rounded-2xl bg-blue-50 p-2 text-blue-700">
                    <Icon size={19} />
                  </div>

                  <h3 className="font-black text-slate-950">
                    {feature.title}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    {feature.description}
                  </p>
                </article>
              )
            })}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1400px] px-5 pb-14 lg:px-8">
        <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="grid gap-6 lg:grid-cols-3">
            <div>
              <BarChart3 className="text-blue-600" size={24} />
              <h3 className="mt-3 text-lg font-black text-slate-950">
                Track your progress
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Keep resumes, interviews, applications, and optimization work in
                one organized system.
              </p>
            </div>

            <div>
              <Target className="text-blue-600" size={24} />
              <h3 className="mt-3 text-lg font-black text-slate-950">
                Apply with strategy
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Use ATS scoring and job-matching tools to improve every
                application before you submit.
              </p>
            </div>

            <div>
              <Sparkles className="text-blue-600" size={24} />
              <h3 className="mt-3 text-lg font-black text-slate-950">
                Improve with AI
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Generate stronger resumes, better summaries, interview answers,
                and outreach messages.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
