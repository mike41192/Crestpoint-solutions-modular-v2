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
import type { InterviewQuestionCategory } from "./types"

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
