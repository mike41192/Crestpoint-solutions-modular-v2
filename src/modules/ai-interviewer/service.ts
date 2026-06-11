// =====================================================
// BLOCK: AI Interviewer Service
// Crestpoint Solutions V2
// Version: 1.10.0
// =====================================================

import {
  AI_INTERVIEWER_HERO,
  AI_INTERVIEWER_PRACTICE_MODES,
  AI_INTERVIEWER_WORKFLOW_LINKS,
} from "./constants"
import { interviewQuestionTaxonomy } from "./interview-taxonomy"
import type {
  InterviewDifficulty,
  InterviewEvaluationResult,
  InterviewPracticeQuestion,
  InterviewQuestionCategory,
  InterviewQuestionRequest,
} from "./types"

export function getAIInterviewerPageContent() {
  return {
    hero: AI_INTERVIEWER_HERO,
    practiceModes: AI_INTERVIEWER_PRACTICE_MODES,
    workflowLinks: AI_INTERVIEWER_WORKFLOW_LINKS,
  }
}

export function listInterviewQuestionTaxonomy() {
  return interviewQuestionTaxonomy
}

export function listInterviewQuestionsByCategory(
  category: InterviewQuestionCategory,
) {
  return interviewQuestionTaxonomy.filter((entry) => {
    return entry.category === category
  })
}

export function selectTaxonomyQuestion({
  category,
  difficulty,
  previousQuestionIds = [],
}: {
  category: InterviewQuestionCategory
  difficulty: InterviewDifficulty
  previousQuestionIds?: string[]
}) {
  const exactMatches = interviewQuestionTaxonomy.filter((entry) => {
    return (
      entry.category === category &&
      entry.difficulty === difficulty &&
      !previousQuestionIds.includes(entry.id)
    )
  })

  if (exactMatches.length > 0) {
    return exactMatches[0]
  }

  const categoryMatches = interviewQuestionTaxonomy.filter((entry) => {
    return entry.category === category && !previousQuestionIds.includes(entry.id)
  })

  if (categoryMatches.length > 0) {
    return categoryMatches[0]
  }

  return interviewQuestionTaxonomy.find((entry) => {
    return !previousQuestionIds.includes(entry.id)
  }) || interviewQuestionTaxonomy[0]
}

export function createFallbackInterviewQuestion(
  request: InterviewQuestionRequest,
): InterviewPracticeQuestion {
  const taxonomyQuestion = selectTaxonomyQuestion(request)
  const rolePrefix = request.roleTitle
    ? `For a ${request.roleTitle} interview, `
    : ""

  return {
    id: taxonomyQuestion.id,
    question: `${rolePrefix}${taxonomyQuestion.questionStem}`,
    category: taxonomyQuestion.category,
    difficulty: taxonomyQuestion.difficulty,
    competency: taxonomyQuestion.competency,
    evaluationSignals: taxonomyQuestion.evaluationSignals,
    followUpPrompts: taxonomyQuestion.followUpPrompts,
    coachingTip:
      "Answer with a clear situation, specific actions you personally took, measurable results, and one lesson learned.",
    source: "taxonomy",
  }
}

function countSignalHits(answer: string, signals: string[]) {
  const normalizedAnswer = answer.toLowerCase()

  return signals.filter((signal) => {
    return signal.split(" ").some((word) => {
      return word.length > 4 && normalizedAnswer.includes(word.toLowerCase())
    })
  }).length
}

export function createFallbackInterviewEvaluation({
  question,
  answer,
}: {
  question: InterviewPracticeQuestion
  answer: string
}): InterviewEvaluationResult {
  const wordCount = answer.trim().split(/\s+/).filter(Boolean).length
  const signalHits = countSignalHits(answer, question.evaluationSignals)
  const hasResultLanguage = /\b(result|improved|increased|reduced|saved|grew|won|delivered|finished|resolved)\b/i.test(
    answer,
  )
  const hasLearningLanguage = /\b(learned|next time|would|feedback|improved)\b/i.test(
    answer,
  )
  const lengthScore = wordCount >= 90 ? 30 : wordCount >= 50 ? 22 : 14
  const signalScore = Math.min(signalHits * 12, 36)
  const resultScore = hasResultLanguage ? 20 : 8
  const learningScore = hasLearningLanguage ? 14 : 6
  const score = Math.min(lengthScore + signalScore + resultScore + learningScore, 100)

  return {
    score,
    verdict:
      score >= 82
        ? "Strong answer"
        : score >= 65
          ? "Solid foundation"
          : "Needs more structure",
    summary:
      "Your answer was reviewed against the interview rubric for clarity, ownership, evidence, and follow-through.",
    strengths: [
      wordCount >= 50
        ? "You provided enough detail for coaching."
        : "You started the answer, which gives us material to improve.",
      signalHits > 0
        ? "Your answer touched at least one expected evaluation signal."
        : "Your answer can be shaped toward the target competency.",
    ],
    improvements: [
      hasResultLanguage
        ? "Make the result more measurable if possible."
        : "Add a concrete result or business impact.",
      hasLearningLanguage
        ? "Keep the lesson learned concise."
        : "Close with what you learned or changed afterward.",
      "Use a tighter STAR structure: situation, task, action, result.",
    ],
    rewrittenAnswer:
      "A stronger version should briefly set the context, name the challenge, describe the specific actions you took, quantify the result, and close with what you learned.",
    followUpQuestion:
      question.followUpPrompts[0] ||
      "What would you do differently if you faced this situation again?",
    source: "rubric",
  }
}

export async function requestInterviewQuestion(
  payload: InterviewQuestionRequest,
) {
  const response = await fetch("/api/ai/interview-question", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  })

  const result = await response.json()

  if (!response.ok || result.status !== "success") {
    throw new Error(result.message || "Interview question request failed.")
  }

  return result.question as InterviewPracticeQuestion
}

export async function evaluateInterviewAnswer(payload: {
  roleTitle: string
  companyName?: string
  question: InterviewPracticeQuestion
  answer: string
  jobContext?: string
}) {
  const response = await fetch("/api/ai/evaluate-interview", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  })

  const result = await response.json()

  if (!response.ok || result.status !== "success") {
    throw new Error(result.message || "Interview evaluation request failed.")
  }

  return result.evaluation as InterviewEvaluationResult
}
