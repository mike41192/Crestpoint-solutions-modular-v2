import type { ModuleKey } from "@/types/modules"

export type TutorialStep = {
  title: string
  description: string
}

export type ModuleTutorial = {
  moduleKey: ModuleKey
  title: string
  intro: string
  steps: TutorialStep[]
}

export const tutorialContent: ModuleTutorial[] = [
  {
    moduleKey: "resume_builder",
    title: "Resume Builder Tutorial",
    intro: "Learn how to create, edit, optimize, and export your resume.",
    steps: [
      {
        title: "Start with your basic information",
        description: "Add your name, contact details, work history, education, and skills.",
      },
      {
        title: "Use AI optimization",
        description: "Let Crestpoint suggest improvements for clarity, keywords, and structure.",
      },
      {
        title: "Export your resume",
        description: "Download a polished version when your resume is ready.",
      },
    ],
  },
  {
    moduleKey: "ats_scoring",
    title: "ATS Scoring Tutorial",
    intro: "Learn how to compare your resume against a job description.",
    steps: [
      {
        title: "Paste the job description",
        description: "Use the exact job posting so the score is relevant.",
      },
      {
        title: "Review missing keywords",
        description: "Crestpoint identifies important keywords and skills your resume may be missing.",
      },
      {
        title: "Improve and rescore",
        description: "Update your resume and run the score again to measure progress.",
      },
    ],
  },
  {
    moduleKey: "ai_interviewer",
    title: "AI Interviewer Tutorial",
    intro: "Practice interviews and receive AI-powered feedback.",
    steps: [
      {
        title: "Choose a role",
        description: "Select the job type or paste a job description.",
      },
      {
        title: "Answer practice questions",
        description: "Respond like you would in a real interview.",
      },
      {
        title: "Review feedback",
        description: "Use the feedback to improve structure, confidence, and clarity.",
      },
    ],
  },
  {
    moduleKey: "interview_academy",
    title: "Interview Academy Tutorial",
    intro: "Learn interview strategies through lessons and guided training.",
    steps: [
      {
        title: "Choose a topic",
        description: "Start with basics, STAR method, confidence, or salary negotiation.",
      },
      {
        title: "Complete lessons",
        description: "Track your learning progress as you prepare.",
      },
      {
        title: "Practice with AI",
        description: "Use the AI Interviewer to apply what you learned.",
      },
    ],
  },
]