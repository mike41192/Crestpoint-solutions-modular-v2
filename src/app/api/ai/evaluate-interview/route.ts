import { createSupabaseServerClient } from "@/lib/supabase/server"
import { getOpenAIClient, getOpenAIModel } from "@/lib/ai/openai-client"
import { isOpenAIConfigured } from "@/lib/ai/openai-env"
import {
  AI_INTERVIEWER_PROMPT_VERSION,
  AI_INTERVIEWER_RUBRIC_VERSION,
  buildInterviewEvaluationPrompt,
} from "@/modules/ai-interviewer/prompt-builder"
import { recordInterviewLearningSignal } from "@/modules/ai-interviewer/learning"
import {
  createFallbackInterviewEvaluation,
} from "@/modules/ai-interviewer/service"
import type {
  InterviewEvaluationRequest,
  InterviewEvaluationResult,
  InterviewPracticeQuestion,
} from "@/modules/ai-interviewer"

function cleanText(value: unknown, fallback = "") {
  return typeof value === "string" ? value.trim() : fallback
}

function parseOpenAIEvaluation(rawText: string) {
  const trimmed = rawText.trim()
  const jsonText = trimmed
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```$/i, "")
    .trim()

  return JSON.parse(jsonText) as Partial<InterviewEvaluationResult>
}

function normalizeEvaluation(
  parsed: Partial<InterviewEvaluationResult>,
  fallback: InterviewEvaluationResult,
): InterviewEvaluationResult {
  return {
    score: Math.max(0, Math.min(Number(parsed.score ?? fallback.score), 100)),
    verdict: cleanText(parsed.verdict, fallback.verdict),
    summary: cleanText(parsed.summary, fallback.summary),
    strengths: Array.isArray(parsed.strengths)
      ? parsed.strengths.filter(Boolean).slice(0, 3)
      : fallback.strengths,
    improvements: Array.isArray(parsed.improvements)
      ? parsed.improvements.filter(Boolean).slice(0, 4)
      : fallback.improvements,
    rewrittenAnswer: cleanText(
      parsed.rewrittenAnswer,
      fallback.rewrittenAnswer,
    ),
    followUpQuestion: cleanText(
      parsed.followUpQuestion,
      fallback.followUpQuestion,
    ),
    source: "openai",
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}))
    const question = body?.question as InterviewPracticeQuestion | undefined
    const answer = cleanText(body?.answer).slice(0, 6000)

    if (!question?.question || !answer) {
      return Response.json(
        {
          status: "error",
          message: "Question and answer are required.",
        },
        { status: 400 },
      )
    }

    const payload: InterviewEvaluationRequest = {
      roleTitle: cleanText(body?.roleTitle, "Target role").slice(0, 120),
      companyName: cleanText(body?.companyName).slice(0, 120),
      question,
      answer,
      jobContext: cleanText(body?.jobContext).slice(0, 2500),
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

    let evaluation = createFallbackInterviewEvaluation({
      question,
      answer,
    })

    if (isOpenAIConfigured()) {
      try {
        const openai = getOpenAIClient()
        const completion = await openai.chat.completions.create({
          model: getOpenAIModel(),
          temperature: 0.35,
          messages: [
            {
              role: "system",
              content:
                "You evaluate job interview practice answers. Return valid JSON only and never invent user details.",
            },
            {
              role: "user",
              content: buildInterviewEvaluationPrompt(payload),
            },
          ],
        })

        const content = completion.choices[0]?.message?.content || ""
        evaluation = normalizeEvaluation(
          parseOpenAIEvaluation(content),
          evaluation,
        )
      } catch (openAIError) {
        console.error(
          "OpenAI interview evaluation fallback used:",
          openAIError instanceof Error ? openAIError.message : "Unknown error",
        )
      }
    }

    await recordInterviewLearningSignal({
      userId: user.id,
      eventType: "answer_evaluated",
      question,
      evaluation,
      answer,
      questionRequest: {
        roleTitle: payload.roleTitle,
        companyName: payload.companyName,
        interviewMode: "behavioral",
        category: question.category,
        difficulty: question.difficulty,
        jobContext: payload.jobContext,
      },
    })

    return Response.json({
      status: "success",
      message: "Interview answer evaluated.",
      promptVersion: AI_INTERVIEWER_PROMPT_VERSION,
      rubricVersion: AI_INTERVIEWER_RUBRIC_VERSION,
      evaluation,
    })
  } catch (error) {
    return Response.json(
      {
        status: "error",
        message:
          error instanceof Error
            ? error.message
            : "Interview evaluation request failed.",
      },
      { status: 500 },
    )
  }
}

export async function GET() {
  return Response.json({
    status: "success",
    route: "evaluate_interview",
    promptVersion: AI_INTERVIEWER_PROMPT_VERSION,
    rubricVersion: AI_INTERVIEWER_RUBRIC_VERSION,
  })
}
