import Link from "next/link"
import { notFound } from "next/navigation"
import type { ComponentType } from "react"
import {
  ArrowLeft,
  ArrowRight,
  BookOpenCheck,
  Brain,
  BriefcaseBusiness,
  CheckCircle2,
  ClipboardCheck,
  ClipboardList,
  ExternalLink,
  Handshake,
  MessageSquare,
  Mic,
  Phone,
  PlayCircle,
  Sparkles,
  Target,
  Trophy,
  Users,
  XCircle,
} from "lucide-react"

import { ModulePageLayout } from "@/components/layout/ModulePageLayout"
import {
  getInterviewAcademyTopicById,
  getRelatedInterviewAcademyTopics,
  listInterviewAcademyTopics,
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

type InterviewAcademyTopicPageProps = {
  params: Promise<{
    topicId: string
  }>
}

export function generateStaticParams() {
  return listInterviewAcademyTopics().map((topic) => ({
    topicId: topic.id,
  }))
}

export async function generateMetadata({
  params,
}: InterviewAcademyTopicPageProps) {
  const { topicId } = await params
  const topic = getInterviewAcademyTopicById(topicId)

  if (!topic) {
    return {
      title: "Interview Academy Lesson",
    }
  }

  return {
    title: `${topic.title} | Interview Academy`,
    description: topic.description,
  }
}

export default async function InterviewAcademyTopicPage({
  params,
}: InterviewAcademyTopicPageProps) {
  const { topicId } = await params
  const topic = getInterviewAcademyTopicById(topicId)

  if (!topic) {
    notFound()
  }

  const Icon = iconMap[topic.iconKey]
  const relatedTopics = getRelatedInterviewAcademyTopics(topic.relatedTopicIds)

  return (
    <ModulePageLayout
      moduleKey="interview_academy"
      title={topic.title}
      description={topic.description}
    >
      <div className="grid gap-6">
        <Link
          href="/dashboard/interview-academy"
          className="inline-flex w-fit items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-black text-slate-700 shadow-sm transition hover:border-blue-200 hover:text-blue-700"
        >
          <ArrowLeft size={16} />
          Interview Academy
        </Link>

        <section className="rounded-[32px] border border-slate-200 bg-slate-950 p-6 text-white shadow-sm">
          <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px] xl:items-start">
            <div>
              <div className="mb-4 flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-blue-100">
                <Icon size={14} />
                {topic.difficulty}
              </div>

              <h2 className="text-3xl font-black tracking-tight">
                {topic.subtitle}
              </h2>

              <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-300">
                {topic.description}
              </p>
            </div>

            <div className="rounded-[24px] border border-white/15 bg-white/10 p-5">
              <p className="text-xs font-black uppercase tracking-[0.16em] text-blue-100">
                AI Practice Prompt
              </p>

              <p className="mt-3 text-sm font-semibold leading-6 text-white">
                {topic.aiPracticePrompt}
              </p>

              <Link
                href="/dashboard/interview"
                className="mt-5 inline-flex items-center gap-2 rounded-full bg-blue-500 px-4 py-2.5 text-sm font-black text-white transition hover:bg-blue-400"
              >
                Practice with AI
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-2">
          {topic.videos.map((video) => (
            <article
              key={video.title}
              className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm"
            >
              <div className="aspect-video bg-slate-950">
                <iframe
                  className="h-full w-full"
                  src={video.embedUrl}
                  title={video.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>

              <div className="p-5">
                <div className="flex flex-wrap items-center gap-2 text-xs font-black uppercase tracking-[0.14em] text-blue-600">
                  <PlayCircle size={14} />
                  {video.provider}
                  <span className="text-slate-300">/</span>
                  {video.durationLabel}
                </div>

                <h3 className="mt-3 text-lg font-black text-slate-950">
                  {video.title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  {video.objective}
                </p>

                <Link
                  href={video.watchUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 inline-flex items-center gap-2 text-sm font-black text-blue-700"
                >
                  Open video search
                  <ExternalLink size={15} />
                </Link>
              </div>
            </article>
          ))}
        </section>

        <section className="rounded-[32px] border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-blue-600">
              Lesson Guide
            </p>

            <h3 className="mt-1 text-xl font-black text-slate-950">
              What to learn before practice
            </h3>
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            {topic.guide.map((section) => (
              <article
                key={section.title}
                className="rounded-[24px] border border-slate-200 bg-slate-50 p-4"
              >
                <h4 className="font-black text-slate-950">
                  {section.title}
                </h4>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  {section.body}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="grid gap-4 xl:grid-cols-3">
          <SignalPanel
            title="Interviewer Signals"
            icon={Target}
            items={topic.interviewerSignals}
            tone="blue"
          />
          <SignalPanel
            title="Common Mistakes"
            icon={XCircle}
            items={topic.commonMistakes}
            tone="rose"
          />
          <SignalPanel
            title="Preparation Checklist"
            icon={ClipboardCheck}
            items={topic.preparationChecklist}
            tone="emerald"
          />
        </section>

        <section className="rounded-[32px] border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-blue-600">
              Practice Drills
            </p>

            <h3 className="mt-1 text-xl font-black text-slate-950">
              Convert the lesson into interview reps
            </h3>
          </div>

          <div className="grid gap-3 md:grid-cols-3">
            {topic.practiceDrills.map((drill, index) => (
              <div
                key={drill}
                className="rounded-[24px] border border-slate-200 bg-slate-50 p-4"
              >
                <p className="text-xs font-black uppercase tracking-[0.14em] text-slate-400">
                  Drill {index + 1}
                </p>

                <p className="mt-2 text-sm font-semibold leading-6 text-slate-700">
                  {drill}
                </p>
              </div>
            ))}
          </div>
        </section>

        {relatedTopics.length > 0 ? (
          <section className="rounded-[32px] border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-4">
              <p className="text-xs font-black uppercase tracking-[0.16em] text-blue-600">
                Related Lessons
              </p>

              <h3 className="mt-1 text-xl font-black text-slate-950">
                Continue building the skill stack
              </h3>
            </div>

            <div className="grid gap-4 lg:grid-cols-3">
              {relatedTopics.map((relatedTopic) => {
                const RelatedIcon = iconMap[relatedTopic.iconKey]

                return (
                  <Link
                    key={relatedTopic.id}
                    href={`/dashboard/interview-academy/${relatedTopic.id}`}
                    className="group rounded-[24px] border border-slate-200 bg-slate-50 p-4 transition hover:-translate-y-0.5 hover:border-blue-200 hover:bg-blue-50"
                  >
                    <div className="flex items-start gap-3">
                      <div className="rounded-2xl bg-white p-3 text-blue-700 shadow-sm">
                        <RelatedIcon size={18} />
                      </div>

                      <div>
                        <p className="text-xs font-black uppercase tracking-[0.14em] text-slate-400">
                          {relatedTopic.difficulty}
                        </p>

                        <h4 className="mt-1 font-black text-slate-950">
                          {relatedTopic.title}
                        </h4>

                        <p className="mt-1 text-sm leading-6 text-slate-500">
                          {relatedTopic.subtitle}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 inline-flex items-center gap-2 text-sm font-black text-blue-700">
                      Open lesson
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
        ) : null}
      </div>
    </ModulePageLayout>
  )
}

function SignalPanel({
  title,
  icon: Icon,
  items,
  tone,
}: {
  title: string
  icon: ComponentType<{ size?: number; className?: string }>
  items: string[]
  tone: "blue" | "emerald" | "rose"
}) {
  const toneClasses = {
    blue: "bg-blue-50 text-blue-700",
    emerald: "bg-emerald-50 text-emerald-700",
    rose: "bg-rose-50 text-rose-700",
  }

  return (
    <article className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
      <div className={`w-fit rounded-2xl p-3 ${toneClasses[tone]}`}>
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
