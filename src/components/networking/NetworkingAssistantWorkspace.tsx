"use client"

import { useEffect, useMemo, useState, type ReactNode } from "react"
import Link from "next/link"
import {
  BriefcaseBusiness,
  CalendarClock,
  CheckCircle2,
  Clipboard,
  ContactRound,
  FileText,
  RefreshCcw,
  Sparkles,
} from "lucide-react"

import type {
  NetworkingOutreachPlaybook,
  NetworkingOutreachTemplate,
} from "@/modules/networking-outreach"
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

type NetworkingAssistantWorkspaceProps = {
  playbook: NetworkingOutreachPlaybook
}

type AssistantFormState = {
  contactName: string
  company: string
  role: string
  relationshipContext: string
  conversationDetail: string
  personalUpdate: string
}

const defaultFormState: AssistantFormState = {
  contactName: "",
  company: "",
  role: "",
  relationshipContext: "",
  conversationDetail: "",
  personalUpdate: "",
}

export function NetworkingAssistantWorkspace({
  playbook,
}: NetworkingAssistantWorkspaceProps) {
  const [resumes, setResumes] = useState<SavedResumeRecord[]>([])
  const [jobDescriptions, setJobDescriptions] = useState<
    JobDescriptionApiRecord[]
  >([])
  const [selectedResumeId, setSelectedResumeId] = useState("")
  const [selectedJobId, setSelectedJobId] = useState("")
  const [selectedTemplateLabel, setSelectedTemplateLabel] = useState(
    playbook.templates[0]?.label || "",
  )
  const [formState, setFormState] = useState<AssistantFormState>(
    defaultFormState,
  )
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)

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

      if (resumeResponse.status === "fulfilled" && resumeResponse.value.ok) {
        const resumePayload = await resumeResponse.value.json()
        const savedResumes: SavedResumeRecord[] = resumePayload.resumes || []
        setResumes(savedResumes)
        setSelectedResumeId(savedResumes[0]?.id || "")
      }

      if (
        jobDescriptionResponse.status === "fulfilled" &&
        jobDescriptionResponse.value.ok
      ) {
        const jobDescriptionPayload = await jobDescriptionResponse.value.json()
        const savedJobs: JobDescriptionApiRecord[] =
          jobDescriptionPayload.jobDescriptions || []
        setJobDescriptions(savedJobs)
        setSelectedJobId(savedJobs[0]?.id || "")

        const latestJob = savedJobs[0]
        if (latestJob) {
          setFormState((current) => ({
            ...current,
            company: latestJob.company || current.company,
            role: latestJob.role || latestJob.title || current.role,
          }))
        }
      }

      setLoading(false)
    }

    loadSources()

    return () => {
      mounted = false
    }
  }, [])

  const selectedResume = useMemo(
    () => resumes.find((resume) => resume.id === selectedResumeId) || resumes[0],
    [resumes, selectedResumeId],
  )

  const selectedJobDescription = useMemo(
    () =>
      jobDescriptions.find((job) => job.id === selectedJobId) ||
      jobDescriptions[0],
    [jobDescriptions, selectedJobId],
  )

  const selectedTemplate = useMemo(
    () =>
      playbook.templates.find(
        (template) => template.label === selectedTemplateLabel,
      ) || playbook.templates[0],
    [playbook.templates, selectedTemplateLabel],
  )

  const resumeSignals = useMemo(
    () => extractResumeSignals(selectedResume?.resume_data),
    [selectedResume],
  )

  const jobSignals = useMemo(
    () => extractJobSignals(selectedJobDescription),
    [selectedJobDescription],
  )

  const assistantDraft = useMemo(
    () =>
      buildAssistantDraft({
        playbook,
        template: selectedTemplate,
        formState,
        resumeSignals,
        jobSignals,
        selectedJobDescription,
      }),
    [
      formState,
      jobSignals,
      playbook,
      resumeSignals,
      selectedJobDescription,
      selectedTemplate,
    ],
  )

  async function copyDraft() {
    await navigator.clipboard.writeText(
      `Subject: ${assistantDraft.subject}\n\n${assistantDraft.body}`,
    )
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1600)
  }

  function updateField(field: keyof AssistantFormState, value: string) {
    setFormState((current) => ({
      ...current,
      [field]: value,
    }))
  }

  return (
    <section className="rounded-[32px] border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.16em] text-blue-600">
            Networking Assistant
          </p>

          <h3 className="mt-1 text-xl font-black text-slate-950">
            Build the message, context, and follow-up plan in one place
          </h3>

          <p className="mt-2 max-w-3xl text-sm font-semibold leading-6 text-slate-500">
            Select a saved resume and job description, add the relationship
            details, then use the assistant draft as your working message.
          </p>
        </div>

        <div className="inline-flex w-fit items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-600">
          <RefreshCcw size={13} />
          {loading ? "Loading account data" : "Using live saved sources"}
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,420px)_minmax(0,1fr)]">
        <div className="grid gap-4">
          <AssistantPanel
            eyebrow="Source Data"
            title="Resume and job context"
            icon={Sparkles}
          >
            <SourceSelect
              label="Resume Builder"
              value={selectedResumeId}
              emptyLabel="No saved resumes yet"
              href="/dashboard/resume"
              options={resumes.map((resume, index) => ({
                value: resume.id || `resume-${index}`,
                label: resume.title || `Saved resume ${index + 1}`,
              }))}
              onChange={setSelectedResumeId}
            />

            <SourceSelect
              label="Job Description Library"
              value={selectedJobId}
              emptyLabel="No saved job descriptions yet"
              href="/dashboard/job-descriptions"
              options={jobDescriptions.map((job, index) => ({
                value: job.id || `job-${index}`,
                label:
                  [job.company, job.role || job.title].filter(Boolean).join(" - ") ||
                  `Saved job ${index + 1}`,
              }))}
              onChange={(value) => {
                setSelectedJobId(value)
                const job = jobDescriptions.find((item) => item.id === value)
                if (job) {
                  setFormState((current) => ({
                    ...current,
                    company: job.company || current.company,
                    role: job.role || job.title || current.role,
                  }))
                }
              }}
            />

            <SignalList
              title="Resume proof points"
              emptyText="Save a resume to pull achievements, skills, and summary language."
              items={resumeSignals.slice(0, 5)}
            />

            <SignalList
              title="Job description signals"
              emptyText="Save a job description to pull company, role, requirements, and keywords."
              items={jobSignals.slice(0, 5)}
            />
          </AssistantPanel>

          <AssistantPanel
            eyebrow="Personalization"
            title="Relationship details"
            icon={ContactRound}
          >
            <InputField
              label="Contact name"
              value={formState.contactName}
              placeholder="Jordan"
              onChange={(value) => updateField("contactName", value)}
            />

            <div className="grid gap-3 sm:grid-cols-2">
              <InputField
                label="Company"
                value={formState.company}
                placeholder="Target company"
                onChange={(value) => updateField("company", value)}
              />
              <InputField
                label="Role"
                value={formState.role}
                placeholder="Target role"
                onChange={(value) => updateField("role", value)}
              />
            </div>

            <InputField
              label="Relationship context"
              value={formState.relationshipContext}
              placeholder="Former coworker, alumni connection, recruiter for the team"
              onChange={(value) => updateField("relationshipContext", value)}
            />

            <InputField
              label="Conversation detail"
              value={formState.conversationDetail}
              placeholder="The hiring timeline, team priorities, recent post, or shared context"
              onChange={(value) => updateField("conversationDetail", value)}
            />

            <InputField
              label="Short update"
              value={formState.personalUpdate}
              placeholder="Recent win, certification, portfolio update, or job search focus"
              onChange={(value) => updateField("personalUpdate", value)}
            />
          </AssistantPanel>
        </div>

        <div className="grid gap-4">
          <AssistantPanel
            eyebrow="Assistant Draft"
            title="Message composer"
            icon={FileText}
          >
            <label className="grid gap-2">
              <span className="text-xs font-black uppercase tracking-[0.14em] text-slate-500">
                Message type
              </span>
              <select
                value={selectedTemplateLabel}
                onChange={(event) => setSelectedTemplateLabel(event.target.value)}
                className="min-h-11 rounded-2xl border border-slate-200 bg-white px-3 text-sm font-bold text-slate-800 outline-none transition focus:border-blue-300 focus:ring-4 focus:ring-blue-100"
              >
                {playbook.templates.map((template) => (
                  <option key={template.label} value={template.label}>
                    {template.label}
                  </option>
                ))}
              </select>
            </label>

            <div className="rounded-[24px] border border-blue-100 bg-blue-50 p-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.14em] text-blue-700">
                    Generated Working Draft
                  </p>
                  <p className="mt-2 text-sm font-black text-slate-950">
                    Subject: {assistantDraft.subject}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={copyDraft}
                  className="inline-flex w-fit items-center gap-2 rounded-full bg-blue-600 px-4 py-2 text-xs font-black text-white transition hover:bg-blue-700"
                >
                  <Clipboard size={14} />
                  {copied ? "Copied" : "Copy Draft"}
                </button>
              </div>

              <p className="mt-4 whitespace-pre-line text-sm font-semibold leading-7 text-slate-700">
                {assistantDraft.body}
              </p>
            </div>
          </AssistantPanel>

          <div className="grid gap-4 lg:grid-cols-2">
            <AssistantPanel
              eyebrow="Follow-Up Manager"
              title="What to do next"
              icon={CalendarClock}
            >
              <SignalList
                title="Recommended actions"
                emptyText=""
                items={getManagedNextActions(playbook.id)}
              />
            </AssistantPanel>

            <AssistantPanel
              eyebrow="Quality Check"
              title="Before you send"
              icon={CheckCircle2}
            >
              <SignalList
                title="Assistant checks"
                emptyText=""
                items={playbook.checklist.slice(0, 4)}
              />
            </AssistantPanel>
          </div>
        </div>
      </div>
    </section>
  )
}

function AssistantPanel({
  eyebrow,
  title,
  icon: Icon,
  children,
}: {
  eyebrow: string
  title: string
  icon: typeof Sparkles
  children: ReactNode
}) {
  return (
    <article className="rounded-[28px] border border-slate-200 bg-slate-50 p-4">
      <div className="mb-4 flex items-start gap-3">
        <div className="rounded-2xl bg-white p-3 text-blue-700 shadow-sm">
          <Icon size={18} />
        </div>
        <div>
          <p className="text-xs font-black uppercase tracking-[0.14em] text-blue-600">
            {eyebrow}
          </p>
          <h4 className="mt-1 font-black text-slate-950">{title}</h4>
        </div>
      </div>

      <div className="grid gap-3">{children}</div>
    </article>
  )
}

function SourceSelect({
  label,
  value,
  emptyLabel,
  href,
  options,
  onChange,
}: {
  label: string
  value: string
  emptyLabel: string
  href: string
  options: { value: string; label: string }[]
  onChange: (value: string) => void
}) {
  return (
    <div className="grid gap-2">
      <div className="flex items-center justify-between gap-3">
        <label className="text-xs font-black uppercase tracking-[0.14em] text-slate-500">
          {label}
        </label>
        <Link
          href={href}
          className="text-xs font-black text-blue-700 transition hover:text-blue-900"
        >
          Open
        </Link>
      </div>

      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        disabled={options.length === 0}
        className="min-h-11 rounded-2xl border border-slate-200 bg-white px-3 text-sm font-bold text-slate-800 outline-none transition disabled:text-slate-400 focus:border-blue-300 focus:ring-4 focus:ring-blue-100"
      >
        {options.length > 0 ? (
          options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))
        ) : (
          <option>{emptyLabel}</option>
        )}
      </select>
    </div>
  )
}

function InputField({
  label,
  value,
  placeholder,
  onChange,
}: {
  label: string
  value: string
  placeholder: string
  onChange: (value: string) => void
}) {
  return (
    <label className="grid gap-2">
      <span className="text-xs font-black uppercase tracking-[0.14em] text-slate-500">
        {label}
      </span>
      <input
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="min-h-11 rounded-2xl border border-slate-200 bg-white px-3 text-sm font-bold text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-300 focus:ring-4 focus:ring-blue-100"
      />
    </label>
  )
}

function SignalList({
  title,
  emptyText,
  items,
}: {
  title: string
  emptyText: string
  items: string[]
}) {
  return (
    <div className="rounded-[22px] border border-slate-200 bg-white p-3">
      <p className="text-xs font-black uppercase tracking-[0.14em] text-slate-500">
        {title}
      </p>

      <div className="mt-3 grid gap-2">
        {items.length > 0 ? (
          items.map((item) => (
            <div
              key={item}
              className="flex items-start gap-2 text-xs font-semibold leading-5 text-slate-600"
            >
              <CheckCircle2
                size={14}
                className="mt-0.5 shrink-0 text-emerald-600"
              />
              <span>{item}</span>
            </div>
          ))
        ) : (
          <p className="text-xs font-semibold leading-5 text-slate-500">
            {emptyText}
          </p>
        )}
      </div>
    </div>
  )
}

function extractResumeSignals(data?: ResumeBuilderFormData) {
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
    .slice(0, 8)
}

function extractJobSignals(job?: JobDescriptionApiRecord) {
  if (!job) {
    return []
  }

  const keywordSignals = Array.from(
    new Set(
      (job.description || "")
        .replace(/[^a-zA-Z0-9+#.\s-]/g, " ")
        .split(/\s+/)
        .filter((word) => word.length > 5)
        .slice(0, 24),
    ),
  ).slice(0, 6)

  return [
    job.company ? `Company: ${job.company}` : "",
    job.role || job.title ? `Role: ${job.role || job.title}` : "",
    ...keywordSignals,
  ].filter(Boolean)
}

function buildAssistantDraft({
  playbook,
  template,
  formState,
  resumeSignals,
  jobSignals,
  selectedJobDescription,
}: {
  playbook: NetworkingOutreachPlaybook
  template?: NetworkingOutreachTemplate
  formState: AssistantFormState
  resumeSignals: string[]
  jobSignals: string[]
  selectedJobDescription?: JobDescriptionApiRecord
}) {
  const primaryProof =
    resumeSignals.find((signal) => signal.length > 24) ||
    resumeSignals[0] ||
    "a relevant background in the work this role needs"
  const secondaryProof =
    resumeSignals.find((signal) => signal !== primaryProof) ||
    "skills that match the team priorities"
  const role =
    formState.role ||
    selectedJobDescription?.role ||
    selectedJobDescription?.title ||
    "the role"
  const company = formState.company || selectedJobDescription?.company || "the company"
  const businessProblem =
    jobSignals.find((signal) => !signal.startsWith("Company:") && !signal.startsWith("Role:")) ||
    "the priorities in the job description"
  const contactName = formState.contactName || "Name"
  const relationshipContext =
    formState.relationshipContext || "your work with the team"
  const conversationDetail =
    formState.conversationDetail || "the opportunity and team priorities"
  const personalUpdate =
    formState.personalUpdate || primaryProof

  const subject = replaceTemplateFields(template?.subject || playbook.title, {
    contactName,
    company,
    role,
    primaryProof,
    secondaryProof,
    businessProblem,
    relationshipContext,
    conversationDetail,
    personalUpdate,
  })

  const body = replaceTemplateFields(template?.body || "", {
    contactName,
    company,
    role,
    primaryProof,
    secondaryProof,
    businessProblem,
    relationshipContext,
    conversationDetail,
    personalUpdate,
  })

  return {
    subject,
    body,
  }
}

function replaceTemplateFields(
  value: string,
  replacements: {
    contactName: string
    company: string
    role: string
    primaryProof: string
    secondaryProof: string
    businessProblem: string
    relationshipContext: string
    conversationDetail: string
    personalUpdate: string
  },
) {
  return value
    .replaceAll("[Name]", replacements.contactName)
    .replaceAll("[role/company]", `${replacements.role} at ${replacements.company}`)
    .replaceAll("[company]", replacements.company)
    .replaceAll("[role]", replacements.role)
    .replaceAll("[specific skill or result]", replacements.primaryProof)
    .replaceAll("[skill/result]", replacements.primaryProof)
    .replaceAll("[business problem]", replacements.businessProblem)
    .replaceAll("[job requirement]", replacements.businessProblem)
    .replaceAll("[specific fit]", replacements.primaryProof)
    .replaceAll("[fit reason]", replacements.primaryProof)
    .replaceAll("[one-line fit summary]", replacements.primaryProof)
    .replaceAll("[conversation detail]", replacements.conversationDetail)
    .replaceAll("[shared context/update]", replacements.relationshipContext)
    .replaceAll("[their company/project]", replacements.company)
    .replaceAll("[short update]", replacements.personalUpdate)
    .replaceAll("[resource/update]", replacements.conversationDetail)
    .replaceAll("[topic/project]", replacements.businessProblem)
    .replaceAll("[update]", replacements.conversationDetail)
}

function getManagedNextActions(playbookId: string) {
  if (playbookId === "referral-request") {
    return [
      "Send the role link, resume, and two proof points in the same message.",
      "Wait 5 to 7 business days before checking in.",
      "Log the referral request in Career CRM with the contact and company.",
      "If they say yes, follow up with a thank-you and any missing details.",
    ]
  }

  if (playbookId === "follow-up-message") {
    return [
      "Send only after the expected response window has passed.",
      "Set the next follow-up reminder 5 business days out.",
      "Update the job tracker stage if the employer replies.",
      "Stop follow-ups after two unanswered messages unless new context appears.",
    ]
  }

  if (playbookId === "networking-check-in") {
    return [
      "Keep the first message light and relationship-first.",
      "Add the contact to Career CRM with a 30 to 60 day check-in cadence.",
      "Reply with value before making any career ask.",
      "Turn the conversation into a referral request only if the opening is natural.",
    ]
  }

  return [
    "Send a short recruiter message tied to one role or function.",
    "Set a follow-up reminder for 4 to 6 business days.",
    "Save the recruiter in Career CRM with company and role notes.",
    "Update the job tracker if the recruiter responds or redirects you.",
  ]
}
