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
        description:
          "Add your name, contact details, work history, education, and skills.",
      },
      {
        title: "Use AI optimization",
        description:
          "Let Crestpoint suggest improvements for clarity, keywords, and structure.",
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
        description:
          "Crestpoint identifies important keywords and skills your resume may be missing.",
      },
      {
        title: "Improve and rescore",
        description:
          "Update your resume and run the score again to measure progress.",
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
        description:
          "Use the feedback to improve structure, confidence, and clarity.",
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
        description:
          "Start with basics, STAR method, confidence, or salary negotiation.",
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

  {
    moduleKey: "linkedin_optimizer",
    title: "LinkedIn Optimizer Tutorial",
    intro: "Improve your LinkedIn profile for recruiter visibility.",
    steps: [
      {
        title: "Review your current profile",
        description:
          "Check your headline, about section, experience, skills, and keywords.",
      },
      {
        title: "Optimize for recruiter search",
        description:
          "Use role-specific keywords and clearer positioning to improve visibility.",
      },
      {
        title: "Apply improvements",
        description:
          "Update your profile sections and compare before/after quality.",
      },
    ],
  },

  {
    moduleKey: "job_tracker",
    title: "Job Tracker Tutorial",
    intro: "Track your job search like a professional pipeline.",
    steps: [
      {
        title: "Add applications",
        description:
          "Save jobs you applied to, including company, role, date, and status.",
      },
      {
        title: "Track each stage",
        description:
          "Move jobs through applied, interviewing, offer, rejected, and accepted.",
      },
      {
        title: "Follow up on time",
        description:
          "Use reminders and notes to stay organized with recruiters and hiring managers.",
      },
    ],
  },

  {
    moduleKey: "networking_outreach",
    title: "Networking Assistant Tutorial",
    intro: "Create recruiter messages, referral requests, and follow-ups.",
    steps: [
      {
        title: "Choose message type",
        description:
          "Select recruiter outreach, referral request, thank-you note, or follow-up.",
      },
      {
        title: "Add context",
        description:
          "Include the role, company, recipient, and your goal for the message.",
      },
      {
        title: "Send professionally",
        description:
          "Review the message, personalize it, and send it through your preferred platform.",
      },
    ],
  },

  {
    moduleKey: "analytics_dashboard",
    title: "Career Analytics Tutorial",
    intro: "Understand your job-search activity and career readiness.",
    steps: [
      {
        title: "Review your activity",
        description:
          "See applications, interviews, resume updates, and completed prep tasks.",
      },
      {
        title: "Find weak spots",
        description:
          "Use insights to identify where your job search needs improvement.",
      },
      {
        title: "Improve your readiness",
        description:
          "Follow recommendations to raise your hiring readiness score over time.",
      },
    ],
  },

  {
    moduleKey: "billing_manager",
    title: "Billing Tutorial",
    intro: "Understand your membership, billing status, and upgrade options.",
    steps: [
      {
        title: "Review your current plan",
        description:
          "Check which membership tier you currently have and what features are available.",
      },
      {
        title: "Compare upgrade options",
        description:
          "Review higher tiers to unlock more modules, AI credits, and career tools.",
      },
      {
        title: "Manage billing",
        description:
          "Update billing details, review subscription status, and manage payment access.",
      },
    ],
  },

  {
    moduleKey: "admin_tools",
    title: "Account Settings Tutorial",
    intro: "Manage your profile, preferences, access, and account controls.",
    steps: [
      {
        title: "Review your profile",
        description:
          "Confirm your personal information and career preferences are accurate.",
      },
      {
        title: "Update preferences",
        description:
          "Adjust account settings, notifications, and platform preferences.",
      },
      {
        title: "Check access",
        description:
          "Review which features your account can currently use.",
      },
    ],
  },
]