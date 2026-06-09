// =====================================================
// BLOCK: Interview Academy Constants
// Crestpoint Solutions V2
// Version: 1.10.0
// =====================================================

import type {
  InterviewAcademyHeroContent,
  InterviewAcademyTrack,
} from "./types"

export const INTERVIEW_ACADEMY_HERO: InterviewAcademyHeroContent = {
  eyebrow: "Guided Training",
  title: "Build interview skill before the pressure is on",
  description:
    "Use structured lessons to improve story selection, answer clarity, confidence, and follow-up strategy.",
  nextStepTitle: "Turn lessons into live practice",
  nextStepHref: "/dashboard/interview",
  nextStepLabel: "Open AI Interviewer",
}

export const INTERVIEW_ACADEMY_TRACKS: InterviewAcademyTrack[] = [
  {
    title: "Interview Basics",
    description:
      "Learn the foundations of successful interviewing and employer expectations.",
    iconKey: "book",
    lessons: [
      "Understand the interviewer's goal",
      "Prepare a concise career overview",
      "Close with thoughtful questions",
    ],
  },
  {
    title: "STAR Method",
    description:
      "Practice answering behavioral questions using the STAR framework.",
    iconKey: "target",
    lessons: [
      "Choose strong career stories",
      "Separate situation, task, action, and result",
      "Add measurable outcomes without rambling",
    ],
  },
  {
    title: "Confidence Training",
    description:
      "Improve communication, body language, and confidence during interviews.",
    iconKey: "mic",
    lessons: [
      "Control pacing and pauses",
      "Handle nerves with prepared openings",
      "Recover from unclear or difficult questions",
    ],
  },
  {
    title: "AI Interview Practice",
    description:
      "Practice mock interviews and receive AI-powered feedback and coaching.",
    iconKey: "sparkles",
    lessons: [
      "Use target roles for question context",
      "Review answer quality signals",
      "Convert feedback into next practice actions",
    ],
  },
]
