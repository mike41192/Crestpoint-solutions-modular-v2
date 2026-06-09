// =====================================================
// BLOCK: AI Interviewer Types
// Crestpoint Solutions V2
// Version: 1.10.0
// =====================================================

export type AIInterviewerIconKey =
  | "book"
  | "briefcase"
  | "clipboard"
  | "message"
  | "mic"
  | "target"

export type AIInterviewPracticeMode = {
  title: string
  description: string
  iconKey: AIInterviewerIconKey
}

export type AIInterviewWorkflowLink = {
  title: string
  description: string
  href: string
  iconKey: AIInterviewerIconKey
}

export type AIInterviewHeroContent = {
  eyebrow: string
  title: string
  description: string
  nextStepTitle: string
  nextStepHref: string
  nextStepLabel: string
}

export type InterviewQuestionCategory =
  | "behavioral"
  | "technical"
  | "leadership"
  | "situational"
  | "culture"

export type InterviewDifficulty = "foundation" | "intermediate" | "advanced"

export type InterviewQuestionTaxonomyEntry = {
  id: string
  category: InterviewQuestionCategory
  difficulty: InterviewDifficulty
  competency: string
  questionStem: string
  evaluationSignals: string[]
  followUpPrompts: string[]
}
