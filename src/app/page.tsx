import Link from "next/link"
import {
  ArrowRight,
  BarChart3,
  BriefcaseBusiness,
  CheckCircle2,
  ClipboardList,
  FileText,
  GraduationCap,
  MessageSquare,
  ShieldCheck,
  Sparkles,
  Star,
  Target,
  Users,
} from "lucide-react"

const features = [
  {
    title: "Resume Builder",
    description:
      "Create professional resumes with templates, autosave, version history, and export tools.",
    icon: FileText,
  },
  {
    title: "ATS Optimization",
    description:
      "Compare resumes against job descriptions and improve keyword alignment before applying.",
    icon: Target,
  },
  {
    title: "AI Interview Coach",
    description:
      "Practice realistic interviews and get feedback before speaking with employers.",
    icon: MessageSquare,
  },
  {
    title: "Job Tracker",
    description:
      "Organize applications, interviews, follow-ups, and networking activity in one place.",
    icon: BriefcaseBusiness,
  },
  {
    title: "LinkedIn Optimization",
    description:
      "Improve recruiter visibility with profile guidance, headline ideas, and positioning support.",
    icon: Users,
  },
  {
    title: "Career Analytics",
    description:
      "Track career activity, resume progress, AI usage, and job-search momentum.",
    icon: BarChart3,
  },
]

const steps = [
  {
    title: "Create your account",
    description:
      "Start your workspace and keep resumes, job notes, and progress connected.",
  },
  {
    title: "Build your resume",
    description:
      "Use structured sections, templates, autosave, and optimization tools.",
  },
  {
    title: "Improve your match",
    description:
      "Score your resume against jobs and strengthen your application strategy.",
  },
  {
    title: "Track the process",
    description:
      "Manage interviews, applications, networking, and follow-up actions.",
  },
]

const faqs = [
  {
    question: "Is Crestpoint only for resumes?",
    answer:
      "No. Crestpoint is designed as a full career operating system with resumes, ATS scoring, interview prep, job tracking, LinkedIn tools, and analytics.",
  },
  {
    question: "Can I use it before everything is finished?",
    answer:
      "Yes. The platform is being built in phases. Current working systems are available while new modules continue to improve.",
  },
  {
    question: "Will PDF export be included?",
    answer:
      "Yes. DOCX export is already part of the current system, and PDF export/import is planned as a major next phase.",
  },
  {
    question: "Does ATS scoring use real logic?",
    answer:
      "The goal is transparent scoring based on resume completeness, keyword alignment, formatting, and job-description relevance rather than fake arbitrary scores.",
  },
]

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-100">
      <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-slate-100/90 backdrop-blur">
        <div className="mx-auto flex max-w-[1450px] items-center justify-between px-5 py-4 lg:px-8">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-200">
              <Sparkles size={21} />
            </div>

            <div>
              <p className="text-sm font-black text-slate-950">
                Crestpoint Solutions
              </p>
              <p className="text-xs font-semibold text-slate-500">
                AI Career Operating System
              </p>
            </div>
          </Link>

          <Link
            href="/auth/login"
            className="rounded-full border border-slate-300 bg-white px-5 py-2.5 text-sm font-black text-slate-800 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-300 hover:text-blue-700"
          >
            Log In
          </Link>
        </div>
      </header>

      <section className="mx-auto grid max-w-[1450px] gap-10 px-5 pb-16 pt-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:px-8 lg:pb-24 lg:pt-20">
        <div>
          <div className="mb-5 flex w-fit items-center gap-2 rounded-full border border-blue-200 bg-white px-4 py-2 text-sm font-black text-blue-700 shadow-sm">
            <ShieldCheck size={16} />
            Built for serious job seekers and career growth
          </div>

          <h1 className="max-w-5xl text-4xl font-black tracking-tight text-slate-950 sm:text-6xl lg:text-7xl">
            Land more interviews with an AI-powered career system.
          </h1>

          <p className="mt-6 max-w-3xl text-base leading-8 text-slate-600 sm:text-lg">
            Crestpoint Solutions helps you build stronger resumes, improve ATS
            alignment, prepare for interviews, organize applications, and manage
            your entire career search from one professional workspace.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/auth/login?mode=signup"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-blue-600 px-7 py-3.5 text-sm font-black text-white shadow-lg shadow-blue-200 transition hover:-translate-y-0.5 hover:bg-blue-700"
            >
              Sign Up
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
            {["Resume Builder", "ATS Tools", "Interview Prep"].map((item) => (
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

        <div className="rounded-[36px] border border-slate-200 bg-white p-5 shadow-xl shadow-slate-200/70">
          <div className="rounded-[30px] bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 p-6 text-white">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-blue-200">
              Career Command Center
            </p>
            <h2 className="mt-2 text-2xl font-black">
              One workspace for the full job-search process.
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              Build, optimize, practice, track, and improve your career strategy
              without jumping between disconnected tools.
            </p>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {[
                "Resume save/load",
                "Version history",
                "ATS readiness",
                "Interview practice",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/10 px-3 py-2 text-sm font-bold text-slate-100"
                >
                  <CheckCircle2 size={15} className="text-blue-300" />
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {features.slice(0, 4).map((feature) => {
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

      <section className="mx-auto max-w-[1450px] px-5 pb-16 lg:px-8">
        <div className="grid gap-4 rounded-[36px] border border-slate-200 bg-white p-5 shadow-sm md:grid-cols-4">
          {[
            ["Resume-first", "Built around your career documents."],
            ["ATS-aware", "Designed for job-description matching."],
            ["Interview-ready", "Practice before employer conversations."],
            ["Organized", "Track the full application process."],
          ].map(([title, description]) => (
            <div key={title} className="rounded-3xl bg-slate-50 p-5">
              <Star size={20} className="text-blue-600" />
              <h3 className="mt-3 font-black text-slate-950">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                {description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-[1450px] px-5 pb-16 lg:px-8">
        <div className="mb-8 max-w-3xl">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-blue-600">
            Platform Features
          </p>
          <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
            Everything you need to manage your job search.
          </h2>
          <p className="mt-3 text-sm leading-7 text-slate-500 sm:text-base">
            Crestpoint combines resume tools, job-search systems, interview
            preparation, and AI optimization in one clean command center.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon

            return (
              <article
                key={feature.title}
                className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-md"
              >
                <div className="mb-4 w-fit rounded-2xl bg-blue-50 p-3 text-blue-700">
                  <Icon size={21} />
                </div>

                <h3 className="text-lg font-black text-slate-950">
                  {feature.title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  {feature.description}
                </p>
              </article>
            )
          })}
        </div>
      </section>

      <section className="mx-auto max-w-[1450px] px-5 pb-16 lg:px-8">
        <div className="rounded-[36px] border border-slate-200 bg-white p-6 shadow-sm lg:p-8">
          <div className="mb-8 max-w-3xl">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-blue-600">
              How It Works
            </p>
            <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
              From resume to interview pipeline.
            </h2>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {steps.map((step, index) => (
              <article
                key={step.title}
                className="rounded-[28px] border border-slate-200 bg-slate-50 p-5"
              >
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-600 text-sm font-black text-white">
                  {index + 1}
                </div>

                <h3 className="font-black text-slate-950">{step.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  {step.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1450px] px-5 pb-16 lg:px-8">
        <div className="grid gap-6 rounded-[36px] border border-slate-200 bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 p-6 text-white shadow-xl shadow-slate-200/70 lg:grid-cols-[1fr_360px] lg:items-center lg:p-8">
          <div>
            <div className="mb-4 flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-blue-100">
              <GraduationCap size={14} />
              Start Today
            </div>

            <h2 className="text-3xl font-black tracking-tight sm:text-4xl">
              Start building a stronger career system.
            </h2>

            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
              Use Crestpoint to organize your next resume, interview, and job
              application strategy.
            </p>
          </div>

          <div className="rounded-[28px] border border-white/15 bg-white/10 p-5">
            <p className="text-sm font-black uppercase tracking-[0.16em] text-blue-100">
              Trial Access
            </p>
            <h3 className="mt-2 text-2xl font-black">Get started now</h3>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              Create your account and begin using the career command center.
            </p>

            <Link
              href="/auth/login"
              className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-blue-500 px-5 py-3 text-sm font-black text-white shadow-lg shadow-blue-950/30 transition hover:-translate-y-0.5 hover:bg-blue-400"
            >
              Create Account
              <ArrowRight size={17} />
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1450px] px-5 pb-16 lg:px-8">
        <div className="mb-8 max-w-3xl">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-blue-600">
            FAQ
          </p>
          <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
            Common questions
          </h2>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {faqs.map((faq) => (
            <article
              key={faq.question}
              className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm"
            >
              <h3 className="font-black text-slate-950">{faq.question}</h3>
              <p className="mt-2 text-sm leading-7 text-slate-500">
                {faq.answer}
              </p>
            </article>
          ))}
        </div>
      </section>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-[1450px] flex-col gap-4 px-5 py-8 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between lg:px-8">
          <div>
            <p className="font-black text-slate-950">Crestpoint Solutions</p>
            <p className="mt-1">
              AI career tools for resumes, interviews, and job search systems.
            </p>
          </div>

          <div className="flex flex-wrap gap-4 font-bold">
            <Link href="/pricing" className="hover:text-blue-700">
              Pricing
            </Link>
            <Link href="/auth/login" className="hover:text-blue-700">
              Login
            </Link>
            <Link href="/admin/login" className="hover:text-blue-700">
              Admin
            </Link>
          </div>
        </div>
      </footer>
    </main>
  )
}
