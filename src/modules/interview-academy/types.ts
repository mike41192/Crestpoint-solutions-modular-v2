// =====================================================
// BLOCK: Interview Academy Types
// Crestpoint Solutions V2
// Version: 1.10.0
// =====================================================

export type InterviewAcademyIconKey =
  | "book"
  | "brain"
  | "message"
  | "mic"
  | "sparkles"
  | "target"

export type InterviewAcademyTrack = {
  title: string
  description: string
  iconKey: InterviewAcademyIconKey
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
