"use client"

import { useEffect, useMemo, useState } from "react"
import {
  Brain,
  BriefcaseBusiness,
  CheckCircle2,
  ClipboardList,
  MessageSquare,
  RefreshCcw,
  Send,
  Sparkles,
  Star,
  Target,
} from "lucide-react"

import {
  evaluateInterviewAnswer,
  requestInterviewQuestion,
  type InterviewDifficulty,
  type InterviewEvaluationResult,
  type InterviewPracticeQuestion,
  type InterviewQuestionCategory,
  type InterviewSessionMode,
} from "@/modules/ai-interviewer"
import {
  loadJobDescriptions,
  type JobDescriptionRecord,
} from "@/modules/job-description-library"

const categoryOptions: {
  label: string
  value: InterviewQuestionCategory
}[] = [
  { label: "Behavioral", value: "behavioral" },
  { label: "Technical", value: "technical" },
  { label: "Leadership", value: "leadership" },
  { label: "Situational", value: "situational" },
  { label: "Culture", value: "culture" },
]

const difficultyOptions: {
  label: string
  value: InterviewDifficulty
}[] = [
  { label: "Foundation", value: "foundation" },
  { label: "Intermediate", value: "intermediate" },
  { label: "Advanced", value: "advanced" },
]

const modeOptions: {
  label: string
  value: InterviewSessionMode
}[] = [
  { label: "Behavioral", value: "behavioral" },
  { label: "Role Based", value: "role_based" },
  { label: "Technical", value: "technical" },
  { label: "Leadership", value: "leadership" },
  { label: "Culture", value: "culture" },
]

function getScoreColor(score: number) {
  if (score >= 82) {
    return "text-emerald-700"
  }

  if (score >= 65) {
    return "text-blue-700"
  }

  return "text-amber-700"
}

export function AIInterviewPracticeWorkspace() {
  const [jobDescriptions, setJobDescriptions] = useState<
    JobDescriptionRecord[]
  >([])
  const [selectedJobDescriptionId, setSelectedJobDescriptionId] = useState("")
  const [loadingJobDescriptions, setLoadingJobDescriptions] = useState(true)
  const [roleTitle, setRoleTitle] = useState("")
  const [companyName, setCompanyName] = useState("")
  const [interviewMode, setInterviewMode] =
    useState<InterviewSessionMode>("behavioral")
  const [category, setCategory] =
    useState<InterviewQuestionCategory>("behavioral")
  const [difficulty, setDifficulty] =
    useState<InterviewDifficulty>("foundation")
  const [jobContext, setJobContext] = useState("")
  const [resumeContext, setResumeContext] = useState("")
  const [answer, setAnswer] = useState("")
  const [question, setQuestion] = useState<InterviewPracticeQuestion | null>(
    null,
  )
  const [evaluation, setEvaluation] =
    useState<InterviewEvaluationResult | null>(null)
  const [previousQuestionIds, setPreviousQuestionIds] = useState<string[]>([])
  const [feedbackRating, setFeedbackRating] = useState(0)
  const [feedbackNote, setFeedbackNote] = useState("")
  const [message, setMessage] = useState("")
  const [loadingQuestion, setLoadingQuestion] = useState(false)
  const [evaluating, setEvaluating] = useState(false)
  const [submittingFeedback, setSubmittingFeedback] = useState(false)

  const answerWordCount = useMemo(() => {
    return answer.trim().split(/\s+/).filter(Boolean).length
  }, [answer])

  const selectedJobDescription = useMemo(() => {
    return (
      jobDescriptions.find((item) => item.id === selectedJobDescriptionId) ||
      null
    )
  }, [jobDescriptions, selectedJobDescriptionId])

  async function loadSavedJobDescriptions() {
    setLoadingJobDescriptions(true)

    const records = await loadJobDescriptions()

    setJobDescriptions(records)
    setLoadingJobDescriptions(false)
  }

  useEffect(() => {
    loadSavedJobDescriptions()
  }, [])

  function buildJobContextFromDescription(jobDescription: JobDescriptionRecord) {
    const contextParts = [
      jobDescription.title ? `Title: ${jobDescription.title}` : "",
      jobDescription.company ? `Company: ${jobDescription.company}` : "",
      jobDescription.role ? `Role: ${jobDescription.role}` : "",
      jobDescription.location ? `Location: ${jobDescription.location}` : "",
      jobDescription.description,
    ].filter(Boolean)

    return contextParts.join("\n\n")
  }

  async function generateQuestionWithContext(
    overrides: Partial<{
      nextRoleTitle: string
      nextCompanyName: string
      nextJobContext: string
      nextInterviewMode: InterviewSessionMode
      nextCategory: InterviewQuestionCategory
      nextDifficulty: InterviewDifficulty
    }> = {},
  ) {
    setLoadingQuestion(true)
    setMessage("")
    setEvaluation(null)
    setAnswer("")
    setFeedbackRating(0)
    setFeedbackNote("")

    try {
      const nextRoleTitle = overrides.nextRoleTitle ?? roleTitle
      const nextCompanyName = overrides.nextCompanyName ?? companyName
      const nextJobContext = overrides.nextJobContext ?? jobContext
      const nextInterviewMode = overrides.nextInterviewMode ?? interviewMode
      const nextCategory = overrides.nextCategory ?? category
      const nextDifficulty = overrides.nextDifficulty ?? difficulty

      const nextQuestion = await requestInterviewQuestion({
        roleTitle: nextRoleTitle || "Target role",
        companyName: nextCompanyName,
        interviewMode: nextInterviewMode,
        category: nextCategory,
        difficulty: nextDifficulty,
        jobContext: nextJobContext,
        resumeContext,
        previousQuestionIds,
      })

      setQuestion(nextQuestion)
      setPreviousQuestionIds((current) => [...current, nextQuestion.id])
      setMessage(
        nextQuestion.source === "openai"
          ? "AI-generated question ready."
          : "Taxonomy question ready. Live AI fallback was used.",
      )
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Question generation failed.",
      )
    } finally {
      setLoadingQuestion(false)
    }
  }

  async function handleGenerateQuestion() {
    await generateQuestionWithContext()
  }

  async function handleStartFromSavedJobDescription() {
    if (!selectedJobDescription) {
      setMessage("Select a saved job description first.")
      return
    }

    const nextRoleTitle =
      selectedJobDescription.role || selectedJobDescription.title
    const nextCompanyName = selectedJobDescription.company
    const nextJobContext = buildJobContextFromDescription(selectedJobDescription)

    setRoleTitle(nextRoleTitle)
    setCompanyName(nextCompanyName)
    setJobContext(nextJobContext)
    setInterviewMode("role_based")
    setCategory("behavioral")
    setDifficulty("foundation")

    await generateQuestionWithContext({
      nextRoleTitle,
      nextCompanyName,
      nextJobContext,
      nextInterviewMode: "role_based",
      nextCategory: "behavioral",
      nextDifficulty: "foundation",
    })
  }

  async function handleEvaluateAnswer() {
    if (!question) {
      setMessage("Generate a question first.")
      return
    }

    if (!answer.trim()) {
      setMessage("Write an answer before requesting feedback.")
      return
    }

    setEvaluating(true)
    setMessage("")
    setFeedbackRating(0)
    setFeedbackNote("")

    try {
      const result = await evaluateInterviewAnswer({
        roleTitle: roleTitle || "Target role",
        companyName,
        question,
        answer,
        jobContext,
      })

      setEvaluation(result)
      setMessage(
        result.source === "openai"
          ? "AI feedback completed."
          : "Rubric feedback completed. Live AI fallback was used.",
      )
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Answer evaluation failed.",
      )
    } finally {
      setEvaluating(false)
    }
  }

  async function handleSubmitFeedback() {
    if (!question || !evaluation || feedbackRating < 1) {
      setMessage("Choose a rating before submitting feedback.")
      return
    }

    setSubmittingFeedback(true)
    setMessage("")

    try {
      const response = await fetch("/api/ai/interview-feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question,
          evaluation,
          feedbackRating,
          feedbackNote,
        }),
      })

      const result = await response.json()

      if (!response.ok || result.status !== "success") {
        throw new Error(result.message || "Feedback request failed.")
      }

      setMessage("Feedback saved for AI Interviewer learning.")
      setFeedbackNote("")
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Feedback could not be saved.",
      )
    } finally {
      setSubmittingFeedback(false)
    }
  }

  return (
    <section className="grid gap-6 xl:grid-cols-[380px_minmax(0,1fr)]">
      <aside className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-blue-50 p-3 text-blue-700">
            <Target size={20} />
          </div>

          <div>
            <p className="text-xs font-black uppercase tracking-[0.16em] text-blue-700">
              Practice Setup
            </p>
            <h2 className="text-lg font-black text-slate-950">
              Interview context
            </h2>
          </div>
        </div>

        <div className="mt-5 grid gap-4">
          <div className="rounded-[24px] border border-blue-100 bg-blue-50 p-4">
            <div className="flex items-start gap-3">
              <div className="rounded-2xl bg-white p-2 text-blue-700 shadow-sm">
                <BriefcaseBusiness size={18} />
              </div>

              <div>
                <p className="text-sm font-black text-slate-950">
                  Saved Job Description
                </p>
                <p className="mt-1 text-xs font-semibold leading-5 text-slate-600">
                  Auto-fill the interviewer and start a mock interview from a
                  saved target role.
                </p>
              </div>
            </div>

            <div className="mt-4 grid gap-2">
              <select
                value={selectedJobDescriptionId}
                onChange={(event) =>
                  setSelectedJobDescriptionId(event.target.value)
                }
                disabled={
                  loadingJobDescriptions || jobDescriptions.length === 0
                }
                className="min-h-12 min-w-0 rounded-2xl border border-blue-200 bg-white px-4 text-sm font-bold text-slate-700 outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-100"
              >
                <option value="">
                  {loadingJobDescriptions
                    ? "Loading saved job descriptions..."
                    : jobDescriptions.length === 0
                      ? "No saved job descriptions yet"
                      : "Select a saved job description"}
                </option>

                {jobDescriptions.map((jobDescription) => (
                  <option key={jobDescription.id} value={jobDescription.id}>
                    {jobDescription.title}
                    {jobDescription.company
                      ? ` - ${jobDescription.company}`
                      : ""}
                  </option>
                ))}
              </select>

              <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-1">
                <button
                  type="button"
                  onClick={loadSavedJobDescriptions}
                  disabled={loadingJobDescriptions}
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl border border-blue-200 bg-white px-4 text-sm font-black text-blue-700 transition hover:border-blue-300 hover:bg-blue-100 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <RefreshCcw
                    size={15}
                    className={loadingJobDescriptions ? "animate-spin" : ""}
                  />
                  Refresh
                </button>

                <button
                  type="button"
                  onClick={handleStartFromSavedJobDescription}
                  disabled={!selectedJobDescription || loadingQuestion}
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl bg-blue-600 px-4 text-sm font-black text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
                >
                  Start Mock Interview
                  <Sparkles size={15} />
                </button>
              </div>
            </div>
          </div>

          <label className="grid gap-2">
            <span className="text-sm font-black text-slate-700">
              Target Role
            </span>
            <input
              value={roleTitle}
              onChange={(event) => setRoleTitle(event.target.value)}
              placeholder="Product Manager, Nurse, Software Engineer..."
              className="min-h-12 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold text-slate-900 outline-none transition focus:border-blue-300 focus:bg-white"
            />
          </label>

          <label className="grid gap-2">
            <span className="text-sm font-black text-slate-700">
              Company
            </span>
            <input
              value={companyName}
              onChange={(event) => setCompanyName(event.target.value)}
              placeholder="Optional"
              className="min-h-12 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold text-slate-900 outline-none transition focus:border-blue-300 focus:bg-white"
            />
          </label>

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
            <SelectField
              label="Mode"
              value={interviewMode}
              onChange={(value) =>
                setInterviewMode(value as InterviewSessionMode)
              }
              options={modeOptions}
            />

            <SelectField
              label="Category"
              value={category}
              onChange={(value) =>
                setCategory(value as InterviewQuestionCategory)
              }
              options={categoryOptions}
            />

            <SelectField
              label="Difficulty"
              value={difficulty}
              onChange={(value) =>
                setDifficulty(value as InterviewDifficulty)
              }
              options={difficultyOptions}
            />
          </div>

          <label className="grid gap-2">
            <span className="text-sm font-black text-slate-700">
              Job Context
            </span>
            <textarea
              value={jobContext}
              onChange={(event) => setJobContext(event.target.value)}
              placeholder="Paste a few job requirements or interview stage notes."
              rows={5}
              className="resize-none rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm font-semibold leading-6 text-slate-900 outline-none transition focus:border-blue-300 focus:bg-white"
            />
          </label>

          <label className="grid gap-2">
            <span className="text-sm font-black text-slate-700">
              Resume Context
            </span>
            <textarea
              value={resumeContext}
              onChange={(event) => setResumeContext(event.target.value)}
              placeholder="Add 2-3 strengths, accomplishments, or experience notes."
              rows={4}
              className="resize-none rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm font-semibold leading-6 text-slate-900 outline-none transition focus:border-blue-300 focus:bg-white"
            />
          </label>

          <button
            type="button"
            onClick={handleGenerateQuestion}
            disabled={loadingQuestion}
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-blue-600 px-5 text-sm font-black text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            {loadingQuestion ? (
              <>
                <RefreshCcw size={16} className="animate-spin" />
                Generating
              </>
            ) : (
              <>
                Generate Question
                <Sparkles size={16} />
              </>
            )}
          </button>
        </div>
      </aside>

      <div className="grid gap-6">
        <article className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <div className="mb-3 flex w-fit items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-black uppercase tracking-[0.16em] text-blue-700">
                <MessageSquare size={14} />
                Practice Question
              </div>

              <h2 className="text-xl font-black text-slate-950">
                {question
                  ? question.question
                  : "Generate a question to begin your mock interview."}
              </h2>
            </div>

            {question && (
              <span className="w-fit rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-black uppercase tracking-[0.12em] text-slate-500">
                {question.source}
              </span>
            )}
          </div>

          {question && (
            <div className="mt-5 grid gap-4 lg:grid-cols-[minmax(0,1fr)_280px]">
              <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-black uppercase tracking-[0.14em] text-slate-400">
                  Coaching Tip
                </p>
                <p className="mt-2 text-sm font-semibold leading-6 text-slate-600">
                  {question.coachingTip}
                </p>
              </div>

              <div className="rounded-[24px] border border-slate-200 bg-white p-4">
                <p className="text-xs font-black uppercase tracking-[0.14em] text-slate-400">
                  Signals
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {question.evaluationSignals.map((signal) => (
                    <span
                      key={signal}
                      className="rounded-full bg-blue-50 px-3 py-1 text-xs font-black text-blue-700"
                    >
                      {signal}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </article>

        <article className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-blue-50 p-3 text-blue-700">
                <ClipboardList size={20} />
              </div>

              <div>
                <p className="text-xs font-black uppercase tracking-[0.16em] text-blue-700">
                  Your Answer
                </p>
                <h2 className="text-lg font-black text-slate-950">
                  Practice response
                </h2>
              </div>
            </div>

            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-500">
              {answerWordCount} words
            </span>
          </div>

          <textarea
            value={answer}
            onChange={(event) => setAnswer(event.target.value)}
            placeholder="Write your answer here. Aim for a clear STAR response with a measurable result."
            rows={9}
            className="w-full resize-none rounded-[24px] border border-slate-200 bg-slate-50 p-4 text-sm font-semibold leading-6 text-slate-900 outline-none transition focus:border-blue-300 focus:bg-white"
          />

          <button
            type="button"
            onClick={handleEvaluateAnswer}
            disabled={evaluating || !question}
            className="mt-4 inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-slate-950 px-5 text-sm font-black text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            {evaluating ? (
              <>
                <RefreshCcw size={16} className="animate-spin" />
                Evaluating
              </>
            ) : (
              <>
                Evaluate Answer
                <Send size={16} />
              </>
            )}
          </button>
        </article>

        {evaluation && (
          <article className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
            <div className="grid gap-5 lg:grid-cols-[220px_minmax(0,1fr)]">
              <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-5">
                <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">
                  Score
                </p>
                <p
                  className={`mt-2 text-5xl font-black ${getScoreColor(
                    evaluation.score,
                  )}`}
                >
                  {evaluation.score}
                </p>
                <p className="mt-2 text-sm font-black text-slate-700">
                  {evaluation.verdict}
                </p>
                <p className="mt-3 text-xs font-bold uppercase tracking-[0.12em] text-slate-400">
                  Source: {evaluation.source}
                </p>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <Brain size={18} className="text-blue-700" />
                  <h2 className="text-xl font-black text-slate-950">
                    Coaching Feedback
                  </h2>
                </div>

                <p className="mt-3 text-sm font-semibold leading-6 text-slate-600">
                  {evaluation.summary}
                </p>

                <div className="mt-5 grid gap-4 lg:grid-cols-2">
                  <FeedbackList
                    title="Strengths"
                    items={evaluation.strengths}
                    tone="positive"
                  />
                  <FeedbackList
                    title="Improve Next"
                    items={evaluation.improvements}
                    tone="coaching"
                  />
                </div>

                <div className="mt-5 rounded-[24px] border border-blue-100 bg-blue-50 p-4">
                  <p className="text-sm font-black text-blue-950">
                    Stronger Answer Structure
                  </p>
                  <p className="mt-2 text-sm font-semibold leading-6 text-blue-900">
                    {evaluation.rewrittenAnswer}
                  </p>
                </div>

                <div className="mt-4 rounded-[24px] border border-slate-200 bg-slate-50 p-4">
                  <p className="text-sm font-black text-slate-950">
                    Likely Follow-Up
                  </p>
                  <p className="mt-2 text-sm font-semibold leading-6 text-slate-600">
                    {evaluation.followUpQuestion}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-5 rounded-[24px] border border-slate-200 bg-slate-50 p-4">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <p className="text-sm font-black text-slate-950">
                    Help train this module
                  </p>
                  <p className="mt-1 text-sm font-semibold leading-6 text-slate-500">
                    Rate whether this feedback was useful. Reviewed signals can
                    improve future prompt and rubric versions.
                  </p>
                </div>

                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      type="button"
                      onClick={() => setFeedbackRating(rating)}
                      className={`rounded-full p-2 transition ${
                        feedbackRating >= rating
                          ? "bg-amber-100 text-amber-600"
                          : "bg-white text-slate-300 hover:text-amber-500"
                      }`}
                      aria-label={`Rate ${rating} out of 5`}
                    >
                      <Star size={18} fill="currentColor" />
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-4 flex flex-col gap-3 lg:flex-row">
                <input
                  value={feedbackNote}
                  onChange={(event) => setFeedbackNote(event.target.value)}
                  placeholder="Optional note for future training review"
                  className="min-h-12 flex-1 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-900 outline-none transition focus:border-blue-300"
                />

                <button
                  type="button"
                  onClick={handleSubmitFeedback}
                  disabled={submittingFeedback || feedbackRating < 1}
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-blue-600 px-5 text-sm font-black text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
                >
                  {submittingFeedback ? "Saving" : "Save Feedback"}
                </button>
              </div>
            </div>
          </article>
        )}

        {message && (
          <p className="rounded-2xl border border-slate-200 bg-white p-4 text-sm font-bold leading-6 text-slate-600 shadow-sm">
            {message}
          </p>
        )}
      </div>
    </section>
  )
}

function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  options: { label: string; value: string }[]
}) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-black text-slate-700">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="min-h-12 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-black text-slate-900 outline-none transition focus:border-blue-300 focus:bg-white"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  )
}

function FeedbackList({
  title,
  items,
  tone,
}: {
  title: string
  items: string[]
  tone: "positive" | "coaching"
}) {
  return (
    <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-4">
      <p className="text-sm font-black text-slate-950">{title}</p>
      <div className="mt-3 grid gap-2">
        {items.map((item) => (
          <div
            key={item}
            className="flex items-start gap-2 text-sm font-semibold leading-6 text-slate-600"
          >
            <CheckCircle2
              size={16}
              className={`mt-1 shrink-0 ${
                tone === "positive" ? "text-emerald-600" : "text-blue-700"
              }`}
            />
            <span>{item}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
