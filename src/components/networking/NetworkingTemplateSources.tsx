"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import {
  BriefcaseBusiness,
  CheckCircle2,
  FileText,
  RefreshCcw,
} from "lucide-react"

import type { ResumeBuilderFormData } from "@/modules/resume-builder/types"

type SavedResumeRecord = {
  id?: string
  title?: string
  resume_data?: ResumeBuilderFormData
  updated_at?: string
}

type JobDescriptionApiRecord = {
  id?: string
  title?: string
  company?: string
  role?: string
  description?: string
  updated_at?: string
}

type NetworkingTemplateSourcesProps = {
  resumeHints: string[]
  jobDescriptionHints: string[]
  customizationFields: string[]
}

export function NetworkingTemplateSources({
  resumeHints,
  jobDescriptionHints,
  customizationFields,
}: NetworkingTemplateSourcesProps) {
  const [resumes, setResumes] = useState<SavedResumeRecord[]>([])
  const [jobDescriptions, setJobDescriptions] = useState<JobDescriptionApiRecord[]>(
    [],
  )
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    async function loadSources() {
      setLoading(true)

      const [resumeResponse, jobDescriptionResponse] = await Promise.allSettled([
        fetch("/api/resume/load"),
        fetch("/api/job-descriptions/list"),
      ])

      if (!mounted) {
        return
      }

      if (
        resumeResponse.status === "fulfilled" &&
        resumeResponse.value.ok
      ) {
        const resumePayload = await resumeResponse.value.json()
        setResumes(resumePayload.resumes || [])
      }

      if (
        jobDescriptionResponse.status === "fulfilled" &&
        jobDescriptionResponse.value.ok
      ) {
        const jobDescriptionPayload = await jobDescriptionResponse.value.json()
        setJobDescriptions(jobDescriptionPayload.jobDescriptions || [])
      }

      setLoading(false)
    }

    loadSources()

    return () => {
      mounted = false
    }
  }, [])

  const latestResume = resumes[0]
  const latestJobDescription = jobDescriptions[0]

  const resumeProofPoints = useMemo(() => {
    const data = latestResume?.resume_data

    if (!data) {
      return []
    }

    const bullets = data.experience.flatMap((item) =>
      item.bullets.filter((bullet) => bullet.trim().length > 0),
    )

    return [
      data.summary,
      ...bullets,
      ...data.skills.slice(0, 8),
      ...data.certifications.slice(0, 4),
    ]
      .filter(Boolean)
      .slice(0, 6)
  }, [latestResume])

  const jobKeywords = useMemo(() => {
    const description = latestJobDescription?.description || ""

    return Array.from(
      new Set(
        description
          .replace(/[^a-zA-Z0-9+#.\s-]/g, " ")
          .split(/\s+/)
          .filter((word) => word.length > 5)
          .slice(0, 40),
      ),
    ).slice(0, 10)
  }, [latestJobDescription])

  return (
    <section className="rounded-[32px] border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.16em] text-blue-600">
            Source Context
          </p>

          <h3 className="mt-1 text-xl font-black text-slate-950">
            Fill templates from your resume and saved job descriptions
          </h3>
        </div>

        <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-600">
          <RefreshCcw size={13} />
          {loading ? "Loading sources" : "Live account data"}
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <SourceCard
          title="Resume Builder"
          icon={FileText}
          href="/dashboard/resume"
          emptyTitle="No saved resume found"
          emptyDescription="Create or save a resume first, then use its summary, bullets, skills, and certifications inside outreach templates."
          sourceTitle={latestResume?.title || "Latest saved resume"}
          sourceMeta={latestResume?.resume_data?.contact.fullName || "Resume source"}
          hints={resumeHints}
          samples={resumeProofPoints}
        />

        <SourceCard
          title="Job Description Library"
          icon={BriefcaseBusiness}
          href="/dashboard/job-descriptions"
          emptyTitle="No saved job description found"
          emptyDescription="Save a target job first, then use its title, company, requirements, and keywords inside outreach templates."
          sourceTitle={latestJobDescription?.title || "Latest saved job"}
          sourceMeta={[
            latestJobDescription?.company,
            latestJobDescription?.role,
          ]
            .filter(Boolean)
            .join(" / ")}
          hints={jobDescriptionHints}
          samples={jobKeywords}
        />
      </div>

      <div className="mt-4 rounded-[24px] border border-slate-200 bg-slate-50 p-4">
        <p className="text-xs font-black uppercase tracking-[0.14em] text-slate-500">
          Template Fields To Personalize
        </p>

        <div className="mt-3 flex flex-wrap gap-2">
          {customizationFields.map((field) => (
            <span
              key={field}
              className="rounded-full bg-white px-3 py-1 text-xs font-black text-blue-700 shadow-sm"
            >
              {field}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}

type SourceCardProps = {
  title: string
  icon: typeof FileText
  href: string
  emptyTitle: string
  emptyDescription: string
  sourceTitle: string
  sourceMeta?: string
  hints: string[]
  samples: string[]
}

function SourceCard({
  title,
  icon: Icon,
  href,
  emptyTitle,
  emptyDescription,
  sourceTitle,
  sourceMeta,
  hints,
  samples,
}: SourceCardProps) {
  const hasSamples = samples.length > 0

  return (
    <article className="rounded-[28px] border border-slate-200 bg-slate-50 p-4">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="rounded-2xl bg-white p-3 text-blue-700 shadow-sm">
            <Icon size={18} />
          </div>

          <div>
            <p className="text-xs font-black uppercase tracking-[0.14em] text-blue-600">
              {title}
            </p>
            <h4 className="mt-1 font-black text-slate-950">
              {hasSamples ? sourceTitle : emptyTitle}
            </h4>
            <p className="mt-1 text-sm font-semibold leading-6 text-slate-500">
              {hasSamples ? sourceMeta || "Saved source" : emptyDescription}
            </p>
          </div>
        </div>

        <Link
          href={href}
          className="shrink-0 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-black text-slate-700 transition hover:border-blue-200 hover:text-blue-700"
        >
          Open
        </Link>
      </div>

      <div className="mt-4 grid gap-3 lg:grid-cols-2">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.14em] text-slate-500">
            Use This For
          </p>
          <div className="mt-3 grid gap-2">
            {hints.map((hint) => (
              <div
                key={hint}
                className="flex items-start gap-2 text-xs font-semibold leading-5 text-slate-600"
              >
                <CheckCircle2
                  size={14}
                  className="mt-0.5 shrink-0 text-emerald-600"
                />
                {hint}
              </div>
            ))}
          </div>
        </div>

        <div>
          <p className="text-xs font-black uppercase tracking-[0.14em] text-slate-500">
            Available Signals
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {hasSamples ? (
              samples.map((sample) => (
                <span
                  key={sample}
                  className="line-clamp-2 rounded-2xl bg-white px-3 py-1 text-xs font-bold leading-5 text-slate-600 shadow-sm"
                >
                  {sample}
                </span>
              ))
            ) : (
              <span className="rounded-2xl bg-white px-3 py-1 text-xs font-bold text-slate-500 shadow-sm">
                Save source data to activate suggestions.
              </span>
            )}
          </div>
        </div>
      </div>
    </article>
  )
}
