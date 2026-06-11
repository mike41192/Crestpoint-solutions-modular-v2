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

export type InterviewSessionMode =
  | "behavioral"
  | "role_based"
  | "technical"
  | "leadership"
  | "culture"

export type InterviewQuestionRequest = {
  roleTitle: string
  companyName?: string
  interviewMode: InterviewSessionMode
  category: InterviewQuestionCategory
  difficulty: InterviewDifficulty
  jobContext?: string
  resumeContext?: string
  previousQuestionIds?: string[]
}

export type InterviewPracticeQuestion = {
  id: string
  question: string
  category: InterviewQuestionCategory
  difficulty: InterviewDifficulty
  competency: string
  evaluationSignals: string[]
  followUpPrompts: string[]
  coachingTip: string
  source: "taxonomy" | "openai"
}

export type InterviewEvaluationRequest = {
  roleTitle: string
  companyName?: string
  question: InterviewPracticeQuestion
  answer: string
  jobContext?: string
}

export type InterviewEvaluationResult = {
  score: number
  verdict: string
  summary: string
  strengths: string[]
  improvements: string[]
  rewrittenAnswer: string
  followUpQuestion: string
  source: "rubric" | "openai"
}
