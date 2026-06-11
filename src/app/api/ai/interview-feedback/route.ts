import { createSupabaseServerClient } from "@/lib/supabase/server"
import { recordInterviewLearningSignal } from "@/modules/ai-interviewer/learning"
import type {
  InterviewEvaluationResult,
  InterviewPracticeQuestion,
} from "@/modules/ai-interviewer"

function cleanText(value: unknown, fallback = "") {
  return typeof value === "string" ? value.trim() : fallback
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}))
    const question = body?.question as InterviewPracticeQuestion | undefined
    const evaluation = body?.evaluation as InterviewEvaluationResult | undefined
    const feedbackRating = Number(body?.feedbackRating)
    const feedbackNote = cleanText(body?.feedbackNote).slice(0, 1500)

    if (!question?.question || !Number.isFinite(feedbackRating)) {
      return Response.json(
        {
          status: "error",
          message: "Question and feedback rating are required.",
        },
        { status: 400 },
      )
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

    await recordInterviewLearningSignal({
      userId: user.id,
      eventType: "user_feedback",
      question,
      evaluation,
      feedbackRating: Math.max(1, Math.min(feedbackRating, 5)),
      feedbackNote,
    })

    return Response.json({
      status: "success",
      message: "Feedback recorded for AI Interviewer learning.",
    })
  } catch (error) {
    return Response.json(
      {
        status: "error",
        message:
          error instanceof Error
            ? error.message
            : "Interview feedback request failed.",
      },
      { status: 500 },
    )
  }
}
