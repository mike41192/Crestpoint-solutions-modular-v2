// =====================================================
// BLOCK: AI Interviewer Constants
// Crestpoint Solutions V2
// Version: 1.10.0
// =====================================================

import type {
  AIInterviewHeroContent,
  AIInterviewPracticeMode,
  AIInterviewWorkflowLink,
} from "./types"

export const AI_INTERVIEWER_HERO: AIInterviewHeroContent = {
  eyebrow: "Interview Preparation",
  title: "Practice with the context of your real search",
  description:
    "Build interview prep around your target jobs, application stages, resume strengths, and follow-up priorities.",
  nextStepTitle: "Prepare from an active job application",
  nextStepHref: "/dashboard/jobs",
  nextStepLabel: "Open Job Tracker",
}

export const AI_INTERVIEWER_PRACTICE_MODES: AIInterviewPracticeMode[] = [
  {
    title: "Role-Based Practice",
    description:
      "Use a target role or saved job description to focus interview preparation.",
    iconKey: "briefcase",
  },
  {
    title: "Behavioral Questions",
    description:
      "Practice STAR-style answers for leadership, conflict, ownership, and problem solving.",
    iconKey: "message",
  },
  {
    title: "Readiness Notes",
    description:
      "Capture improvement areas and convert them into targeted prep actions.",
    iconKey: "clipboard",
  },
  {
    title: "Confidence Rehearsal",
    description:
      "Prepare concise opening answers, transitions, and closing questions.",
    iconKey: "mic",
  },
]

export const AI_INTERVIEWER_WORKFLOW_LINKS: AIInterviewWorkflowLink[] = [
  {
    title: "Open Interview Academy",
    description:
      "Review STAR method, confidence training, and interview fundamentals.",
    href: "/dashboard/interview-academy",
    iconKey: "book",
  },
  {
    title: "Use Job Descriptions",
    description:
      "Ground practice questions in the real requirements of target roles.",
    href: "/dashboard/job-descriptions",
    iconKey: "briefcase",
  },
  {
    title: "Review Job Pipeline",
    description:
      "Prepare for applications currently in interviewing or follow-up stages.",
    href: "/dashboard/jobs",
    iconKey: "target",
  },
]
