import Link from "next/link"
import {
  ArrowRight,
  BookOpenCheck,
  Brain,
  CheckCircle2,
  MessageSquare,
  Mic,
  Sparkles,
  Target,
} from "lucide-react"

import { ModulePageLayout } from "@/components/layout/ModulePageLayout"
import { FirstUseTutorial } from "@/components/onboarding/FirstUseTutorial"
import {
  getInterviewAcademyPageContent,
  type InterviewAcademyIconKey,
} from "@/modules/interview-academy"

const iconMap: Record<
  InterviewAcademyIconKey,
  React.ComponentType<{ size?: number; className?: string }>
> = {
  book: BookOpenCheck,
  brain: Brain,
  message: MessageSquare,
  mic: Mic,
  sparkles: Sparkles,
  target: Target,
}

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

        <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {tracks.map((track) => {
            const Icon = iconMap[track.iconKey]

            return (
              <article
                key={track.title}
                className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-md"
              >
                <div className="w-fit rounded-2xl bg-blue-50 p-3 text-blue-700">
                  <Icon size={20} />
                </div>

                <h3 className="mt-4 text-lg font-black text-slate-950">
                  {track.title}
                </h3>

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
              </article>
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
