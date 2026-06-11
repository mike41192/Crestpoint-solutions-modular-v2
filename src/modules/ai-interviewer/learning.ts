import { createSupabaseAdminClient } from "@/lib/supabase/admin"

import {
  AI_INTERVIEWER_PROMPT_VERSION,
  AI_INTERVIEWER_RUBRIC_VERSION,
} from "./prompt-builder"
import type {
  InterviewEvaluationResult,
  InterviewPracticeQuestion,
  InterviewQuestionRequest,
} from "./types"

type InterviewLearningEvent =
  | "question_generated"
  | "answer_evaluated"
  | "user_feedback"

type LearningPayload = {
  userId: string
  eventType: InterviewLearningEvent
  question?: InterviewPracticeQuestion
  questionRequest?: InterviewQuestionRequest
  evaluation?: InterviewEvaluationResult
  answer?: string
  feedbackRating?: number
  feedbackNote?: string
}

function truncate(value: string | undefined, maxLength: number) {
  if (!value) {
    return null
  }

  return value.trim().slice(0, maxLength) || null
}

export async function recordInterviewLearningSignal(payload: LearningPayload) {
  try {
    const supabase = createSupabaseAdminClient()

    const { error } = await supabase.from("ai_interviewer_learning_signals").insert({
      user_id: payload.userId,
      event_type: payload.eventType,
      prompt_version: AI_INTERVIEWER_PROMPT_VERSION,
      rubric_version: AI_INTERVIEWER_RUBRIC_VERSION,
      source: payload.evaluation?.source || payload.question?.source || null,
      role_title: truncate(payload.questionRequest?.roleTitle, 160),
      company_name: truncate(payload.questionRequest?.companyName, 160),
      category: payload.question?.category || payload.questionRequest?.category,
      difficulty:
        payload.question?.difficulty || payload.questionRequest?.difficulty,
      competency: payload.question?.competency || null,
      question_text: truncate(payload.question?.question, 1200),
      answer_text: truncate(payload.answer, 6000),
      score: payload.evaluation?.score ?? null,
      feedback_rating: payload.feedbackRating ?? null,
      feedback_note: truncate(payload.feedbackNote, 1500),
      metadata: {
        question: payload.question || null,
        questionRequest: payload.questionRequest || null,
        evaluation: payload.evaluation || null,
      },
    })

    if (error) {
      throw new Error(error.message)
    }

    return true
  } catch (error) {
    console.error(
      "AI interviewer learning signal was not recorded:",
      error instanceof Error ? error.message : "Unknown error",
    )

    return false
  }
}
