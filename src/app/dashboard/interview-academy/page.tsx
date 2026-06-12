import Link from "next/link"
import type { ComponentType } from "react"
import {
  ArrowRight,
  BookOpenCheck,
  Brain,
  BriefcaseBusiness,
  CheckCircle2,
  ClipboardList,
  Handshake,
  MessageSquare,
  Mic,
  Phone,
  Sparkles,
  Target,
  Trophy,
  Users,
} from "lucide-react"

import { ModulePageLayout } from "@/components/layout/ModulePageLayout"
import { FirstUseTutorial } from "@/components/onboarding/FirstUseTutorial"
import {
  getInterviewAcademyPageContent,
  type InterviewAcademyDifficulty,
  type InterviewAcademyIconKey,
} from "@/modules/interview-academy"

const iconMap: Record<
  InterviewAcademyIconKey,
  ComponentType<{ size?: number; className?: string }>
> = {
  book: BookOpenCheck,
  brain: Brain,
  briefcase: BriefcaseBusiness,
  clipboard: ClipboardList,
  handshake: Handshake,
  message: MessageSquare,
  mic: Mic,
  phone: Phone,
  sparkles: Sparkles,
  target: Target,
  trophy: Trophy,
  users: Users,
}

const difficultyOrder: InterviewAcademyDifficulty[] = [
  "Foundation",
  "Intermediate",
  "Advanced",
  "Career Closing",
]

export default function InterviewAcademyPage() {
  const { hero, tracks, frameworks } = getInterviewAcademyPageContent()

  return (
    <ModulePageLayout
      moduleKey="interview_academy"
      title="Interview Academy"
      description="Learn how to prepare for interviews, improve confidence, answer difficult questions, and increase your chances of getting hired."
    >
      <div className="grid gap-6">
        <section className="rounded-[32px] border border-slate-200 bg-slate-950 p-6 text-white shadow-sm">
          <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-center">
            <div>
              <div className="mb-4 flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-blue-100">
                <BookOpenCheck size={14} />
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

        <FirstUseTutorial moduleKey="interview_academy" />

        <section className="grid gap-5">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.16em] text-blue-600">
              Career Readiness Curriculum
            </p>

            <h3 className="mt-1 text-2xl font-black text-slate-950">
              Learn, drill, and practice by interview stage
            </h3>
          </div>

          {difficultyOrder.map((difficulty) => {
            const difficultyTracks = tracks.filter(
              (track) => track.difficulty === difficulty,
            )

            if (difficultyTracks.length === 0) {
              return null
            }

            return (
              <div key={difficulty} className="grid gap-3">
                <div className="flex items-center gap-3">
                  <span className="h-px flex-1 bg-slate-200" />
                  <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-black uppercase tracking-[0.14em] text-slate-500">
                    {difficulty}
                  </span>
                  <span className="h-px flex-1 bg-slate-200" />
                </div>

                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {difficultyTracks.map((track) => {
                    const Icon = iconMap[track.iconKey]

                    return (
                      <Link
                        key={track.id}
                        href={track.href}
                        className="group rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-md"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="w-fit rounded-2xl bg-blue-50 p-3 text-blue-700">
                            <Icon size={20} />
                          </div>

                          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-600">
                            {track.lessons.length} lessons
                          </span>
                        </div>

                        <h4 className="mt-4 text-lg font-black text-slate-950">
                          {track.title}
                        </h4>

                        <p className="mt-2 text-sm leading-6 text-slate-500">
                          {track.description}
                        </p>

                        <div className="mt-4 grid gap-2 border-t border-slate-100 pt-4">
                          {track.lessons.map((lesson) => (
                            <div
                              key={lesson}
                              className="flex items-start gap-2 text-xs font-semibold leading-5 text-slate-600"
                            >
                              <CheckCircle2
                                size={14}
                                className="mt-0.5 shrink-0 text-emerald-600"
                              />
                              {lesson}
                            </div>
                          ))}
                        </div>

                        <div className="mt-5 inline-flex items-center gap-2 text-sm font-black text-blue-700">
                          {track.ctaLabel}
                          <ArrowRight
                            size={16}
                            className="transition group-hover:translate-x-1"
                          />
                        </div>
                      </Link>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </section>

        <section className="rounded-[32px] border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-blue-600">
              Answer Framework Taxonomy
            </p>

            <h3 className="mt-1 text-xl font-black text-slate-950">
              Structured frameworks for coaching and future AI feedback
            </h3>
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            {frameworks.map((framework) => (
              <article
                key={framework.id}
                className="rounded-[24px] border border-slate-200 bg-slate-50 p-4"
              >
                <h4 className="font-black text-slate-950">
                  {framework.title}
                </h4>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  {framework.purpose}
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                  {framework.structure.map((step) => (
                    <span
                      key={step}
                      className="rounded-full bg-white px-3 py-1 text-xs font-black text-blue-700 shadow-sm"
                    >
                      {step}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </ModulePageLayout>
  )
}
