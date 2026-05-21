import type { ModuleConfig } from "@/types/modules"

export const modulesConfig: ModuleConfig[] = [
  {
    key: "resume_builder",
    name: "Resume Builder",
    description: "Create and manage professional resumes.",
    enabled: true,
    requiredTier: "free",
  },
  {
    key: "ai_resume_parser",
    name: "AI Resume Parser",
    description: "Import resumes and structure sections with AI.",
    enabled: true,
    requiredTier: "starter",
  },
  {
    key: "ats_scoring",
    name: "ATS Scoring",
    description: "Score resumes against job descriptions.",
    enabled: true,
    requiredTier: "starter",
  },
  {
    key: "ai_interviewer",
    name: "AI Interviewer",
    description: "Practice interviews with AI feedback.",
    enabled: true,
    requiredTier: "pro",
  },
  {
    key: "interview_academy",
    name: "Interview Academy",
    description: "Video lessons and job interview training.",
    enabled: true,
    requiredTier: "pro",
  },
  {
    key: "admin_tools",
    name: "Admin Tools",
    description: "Owner controls for the Crestpoint platform.",
    enabled: true,
    requiredTier: "admin",
  },
]