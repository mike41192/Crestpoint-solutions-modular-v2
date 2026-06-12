// =====================================================
// BLOCK: Interview Academy Types
// Crestpoint Solutions V2
// Version: 1.10.0
// =====================================================

export type InterviewAcademyIconKey =
  | "book"
  | "brain"
  | "briefcase"
  | "clipboard"
  | "handshake"
  | "message"
  | "mic"
  | "phone"
  | "sparkles"
  | "target"
  | "trophy"
  | "users"

export type InterviewAcademyDifficulty =
  | "Foundation"
  | "Intermediate"
  | "Advanced"
  | "Career Closing"

export type InterviewAcademyTrack = {
  id: string
  title: string
  description: string
  iconKey: InterviewAcademyIconKey
  difficulty: InterviewAcademyDifficulty
  href: string
  ctaLabel: string
  lessons: string[]
}

export type InterviewAcademyHeroContent = {
  eyebrow: string
  title: string
  description: string
  nextStepTitle: string
  nextStepHref: string
  nextStepLabel: string
}

export type InterviewAcademyFramework = {
  id: string
  title: string
  purpose: string
  structure: string[]
  bestFor: string[]
}

export type InterviewAcademyVideo = {
  title: string
  provider: string
  embedUrl: string
  watchUrl: string
  durationLabel: string
  description: string
  objective: string
}

export type InterviewAcademyLessonSection = {
  title: string
  body: string
}

export type InterviewAcademyTopic = {
  id: string
  title: string
  subtitle: string
  description: string
  difficulty: InterviewAcademyDifficulty
  iconKey: InterviewAcademyIconKey
  videos: InterviewAcademyVideo[]
  guide: InterviewAcademyLessonSection[]
  interviewerSignals: string[]
  commonMistakes: string[]
  preparationChecklist: string[]
  practiceDrills: string[]
  aiPracticePrompt: string
  relatedTopicIds: string[]
}
