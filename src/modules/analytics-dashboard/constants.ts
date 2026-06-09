// =====================================================
// BLOCK: Analytics Dashboard Constants
// Crestpoint Solutions V2
// Version: 1.10.0
// =====================================================

import type {
  AnalyticsDashboardHeroContent,
  AnalyticsDashboardInsightArea,
  AnalyticsDashboardWorkflowLink,
} from "./types"

export const ANALYTICS_DASHBOARD_HERO: AnalyticsDashboardHeroContent = {
  eyebrow: "Career Intelligence",
  title: "Turn scattered job-search activity into direction",
  description:
    "Use live Crestpoint modules as the source of truth for progress, readiness, follow-ups, and next actions.",
  nextStepTitle: "Start with live pipeline performance",
  nextStepHref: "/dashboard/jobs",
  nextStepLabel: "Open Job Tracker",
}

export const ANALYTICS_DASHBOARD_INSIGHT_AREAS: AnalyticsDashboardInsightArea[] =
  [
    {
      title: "Application Momentum",
      description:
        "Use your job tracker stages, reminders, and follow-ups to understand search activity.",
      iconKey: "briefcase",
    },
    {
      title: "Resume Readiness",
      description:
        "Review resume library progress, ATS scans, and export readiness signals.",
      iconKey: "file",
    },
    {
      title: "Relationship Coverage",
      description:
        "Use Career CRM contacts to see whether target companies have people attached.",
      iconKey: "users",
    },
    {
      title: "Prep Focus",
      description:
        "Connect interview preparation and job stage context to decide what to practice next.",
      iconKey: "target",
    },
  ]

export const ANALYTICS_DASHBOARD_WORKFLOW_LINKS: AnalyticsDashboardWorkflowLink[] =
  [
    {
      title: "Job Tracker Analytics",
      description: "Open the live job pipeline analytics and reminder panels.",
      href: "/dashboard/jobs",
      iconKey: "barChart",
    },
    {
      title: "Resume Library",
      description:
        "Review saved resumes and versions used across applications.",
      href: "/dashboard/resumes",
      iconKey: "clipboard",
    },
    {
      title: "Career CRM",
      description:
        "Review contacts and relationship follow-ups for networking coverage.",
      href: "/dashboard/contacts",
      iconKey: "users",
    },
  ]
