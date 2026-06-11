import { createSupabaseServerClient } from "@/lib/supabase/server"
import { getOpenAIClient, getOpenAIModel } from "@/lib/ai/openai-client"
import { isOpenAIConfigured } from "@/lib/ai/openai-env"
import {
  buildInterviewQuestionPrompt,
  AI_INTERVIEWER_PROMPT_VERSION,
  AI_INTERVIEWER_RUBRIC_VERSION,
} from "@/modules/ai-interviewer/prompt-builder"
import { recordInterviewLearningSignal } from "@/modules/ai-interviewer/learning"
import {
  createFallbackInterviewQuestion,
} from "@/modules/ai-interviewer/service"
import type {
  InterviewDifficulty,
  InterviewQuestionCategory,
  InterviewQuestionRequest,
  InterviewSessionMode,
} from "@/modules/ai-interviewer"

const categories: InterviewQuestionCategory[] = [
  "behavioral",
  "technical",
  "leadership",
  "situational",
  "culture",
]

const difficulties: InterviewDifficulty[] = [
  "foundation",
  "intermediate",
  "advanced",
]

const modes: InterviewSessionMode[] = [
  "behavioral",
  "role_based",
  "technical",
  "leadership",
  "culture",
]

function cleanText(value: unknown, fallback = "") {
  return typeof value === "string" ? value.trim() : fallback
}

function cleanStringArray(value: unknown) {
  if (!Array.isArray(value)) {
    return []
  }

  return value.filter((item): item is string => {
    return typeof item === "string" && Boolean(item.trim())
  })
}

function cleanCategory(value: unknown): InterviewQuestionCategory {
  return typeof value === "string" &&
    categories.includes(value as InterviewQuestionCategory)
    ? (value as InterviewQuestionCategory)
    : "behavioral"
}

function cleanDifficulty(value: unknown): InterviewDifficulty {
  return typeof value === "string" &&
    difficulties.includes(value as InterviewDifficulty)
    ? (value as InterviewDifficulty)
    : "foundation"
}

function cleanMode(value: unknown): InterviewSessionMode {
  return typeof value === "string" && modes.includes(value as InterviewSessionMode)
    ? (value as InterviewSessionMode)
    : "behavioral"
}

function parseOpenAIQuestion(rawText: string) {
  const trimmed = rawText.trim()
  const jsonText = trimmed
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```$/i, "")
    .trim()

  return JSON.parse(jsonText) as {
    question?: string
    competency?: string
    evaluationSignals?: string[]
    followUpPrompts?: string[]
    coachingTip?: string
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}))
    const payload: InterviewQuestionRequest = {
      roleTitle: cleanText(body?.roleTitle, "Target role").slice(0, 120),
      companyName: cleanText(body?.companyName).slice(0, 120),
      interviewMode: cleanMode(body?.interviewMode),
      category: cleanCategory(body?.category),
      difficulty: cleanDifficulty(body?.difficulty),
      jobContext: cleanText(body?.jobContext).slice(0, 2500),
      resumeContext: cleanText(body?.resumeContext).slice(0, 2000),
      previousQuestionIds: cleanStringArray(body?.previousQuestionIds),
    }

    const supabase = await createSupabaseServerClient()
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser()

    if (error || !user) {
      return Response.json(
        {
          status: "unauthorized",
          message: "Authentication required.",
        },
        { status: 401 },
      )
    }

    let question = createFallbackInterviewQuestion(payload)

    if (isOpenAIConfigured()) {
      try {
        const openai = getOpenAIClient()
        const completion = await openai.chat.completions.create({
          model: getOpenAIModel(),
          temperature: 0.6,
          messages: [
            {
              role: "system",
              content:
                "You create structured, safe, job-search interview practice questions. Return valid JSON only.",
            },
            {
              role: "user",
              content: buildInterviewQuestionPrompt(payload),
            },
          ],
        })

        const content = completion.choices[0]?.message?.content || ""
        const parsed = parseOpenAIQuestion(content)

        if (parsed.question) {
          question = {
            ...question,
            id: `openai-${Date.now()}`,
            question: parsed.question,
            competency: parsed.competency || question.competency,
            evaluationSignals:
              parsed.evaluationSignals?.filter(Boolean).slice(0, 5) ||
              question.evaluationSignals,
            followUpPrompts:
              parsed.followUpPrompts?.filter(Boolean).slice(0, 3) ||
              question.followUpPrompts,
            coachingTip: parsed.coachingTip || question.coachingTip,
            source: "openai",
          }
        }
      } catch (openAIError) {
        console.error(
          "OpenAI interview question fallback used:",
          openAIError instanceof Error ? openAIError.message : "Unknown error",
        )
      }
    }

    await recordInterviewLearningSignal({
      userId: user.id,
      eventType: "question_generated",
      question,
      questionRequest: payload,
    })

    return Response.json({
      status: "success",
      message: "Interview question generated.",
      promptVersion: AI_INTERVIEWER_PROMPT_VERSION,
      rubricVersion: AI_INTERVIEWER_RUBRIC_VERSION,
      question,
    })
  } catch (error) {
    return Response.json(
      {
        status: "error",
        message:
          error instanceof Error
            ? error.message
            : "Interview question request failed.",
      },
      { status: 500 },
    )
  }
}

export async function GET() {
  return Response.json({
    status: "success",
    route: "interview_question",
    promptVersion: AI_INTERVIEWER_PROMPT_VERSION,
    rubricVersion: AI_INTERVIEWER_RUBRIC_VERSION,
  })
}
