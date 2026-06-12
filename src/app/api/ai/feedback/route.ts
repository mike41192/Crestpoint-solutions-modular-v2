import { createSupabaseServerClient } from "@/lib/supabase/server"
import { recordAILearningEvent } from "@/modules/ai-learning"

const FEATURE_BY_MODULE: Record<string, Set<string>> = {
  ai_interviewer: new Set([
    "question_generation",
    "answer_evaluation",
    "user_feedback",
  ]),
  cover_letter: new Set(["generation"]),
  resume_feedback: new Set(["review"]),
  ats_score: new Set(["score_explanation"]),
  linkedin_optimizer: new Set(["headline", "about_section", "profile_polish"]),
  networking_outreach: new Set([
    "recruiter_outreach",
    "referral_request",
    "follow_up",
    "check_in",
  ]),
  job_followup_ai: new Set(["follow_up"]),
  ai_rewriter: new Set(["bullet_rewrite"]),
  career_coach: new Set(["general_coaching"]),
}

function cleanText(value: unknown, maxLength = 2000) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : ""
}

function cleanRecord(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return {}
  }

  return value as Record<string, unknown>
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}))
    const moduleKey = cleanText(body?.moduleKey, 80)
    const featureKey = cleanText(body?.featureKey, 80)
    const feedbackRating = Number(body?.feedbackRating)
    const score =
      Number.isFinite(Number(body?.score)) ? Number(body?.score) : null
    const outputSummary = cleanText(body?.outputSummary)
    const inputSummary = cleanText(body?.inputSummary)
    const userFeedback = cleanText(body?.feedbackNote, 1500)

    if (!FEATURE_BY_MODULE[moduleKey]?.has(featureKey)) {
      return Response.json(
        {
          status: "error",
          message: "Unsupported AI feedback target.",
        },
        { status: 400 },
      )
    }

    if (!Number.isFinite(feedbackRating) || feedbackRating < 1) {
      return Response.json(
        {
          status: "error",
          message: "A feedback rating from 1 to 5 is required.",
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

    const recorded = await recordAILearningEvent({
      userId: user.id,
      moduleKey,
      featureKey,
      eventType: "user_feedback",
      inputSummary,
      outputSummary,
      score,
      userRating: Math.max(1, Math.min(Math.round(feedbackRating), 5)),
      userFeedback,
      metadata: {
        source: "generic_ai_feedback_endpoint",
        ...cleanRecord(body?.metadata),
      },
    })

    if (!recorded) {
      return Response.json(
        {
          status: "error",
          message: "Feedback could not be saved.",
        },
        { status: 500 },
      )
    }

    return Response.json({
      status: "success",
      message: "Feedback recorded for prompt quality scoring.",
    })
  } catch (error) {
    return Response.json(
      {
        status: "error",
        message:
          error instanceof Error ? error.message : "AI feedback request failed.",
      },
      { status: 500 },
    )
  }
}
