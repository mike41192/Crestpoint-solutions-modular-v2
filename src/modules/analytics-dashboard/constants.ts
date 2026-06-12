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
      id: "application-momentum",
      title: "Application Momentum",
      subtitle: "Track pipeline volume, stage movement, and search velocity.",
      description:
        "Use your job tracker stages, reminders, and follow-ups to understand search activity.",
      href: "/dashboard/analytics/application-momentum",
      iconKey: "briefcase",
      sourceLabel: "Job Tracker",
      sourceHref: "/dashboard/jobs",
      metricLabels: [
        "Total applications",
        "Response rate",
        "Interview rate",
        "Weekly movement",
      ],
      recommendedActions: [
        "Move saved roles into applied or archived so the pipeline stays honest.",
        "Follow up on applications that have stalled in the follow-up stage.",
        "Prioritize roles with upcoming interviews, high priority, or active next actions.",
      ],
    },
    {
      id: "resume-readiness",
      title: "Resume Readiness",
      subtitle: "Measure how complete and reusable your resume library is.",
      description:
        "Review resume library progress, ATS scans, and export readiness signals.",
      href: "/dashboard/analytics/resume-readiness",
      iconKey: "file",
      sourceLabel: "Resume Builder",
      sourceHref: "/dashboard/resumes",
      metricLabels: [
        "Saved resumes",
        "Complete resumes",
        "Skills coverage",
        "Recent updates",
      ],
      recommendedActions: [
        "Keep one strong base resume and one role-specific resume for active targets.",
        "Add measurable experience bullets before applying to competitive roles.",
        "Refresh skills and certifications when saved job descriptions show repeated keywords.",
      ],
    },
    {
      id: "relationship-coverage",
      title: "Relationship Coverage",
      subtitle: "See whether target companies have people attached.",
      description:
        "Use Career CRM contacts to see whether target companies have people attached.",
      href: "/dashboard/analytics/relationship-coverage",
      iconKey: "users",
      sourceLabel: "Career CRM",
      sourceHref: "/dashboard/contacts",
      metricLabels: [
        "Total contacts",
        "Active relationships",
        "Follow-ups due",
        "Target company coverage",
      ],
      recommendedActions: [
        "Add contacts for active target companies without relationship coverage.",
        "Set follow-up dates for warm contacts so outreach does not depend on memory.",
        "Separate recruiter, referral, mentor, and networking contacts for better outreach strategy.",
      ],
    },
    {
      id: "prep-focus",
      title: "Prep Focus",
      subtitle: "Choose the interview practice that matches your current search risk.",
      description:
        "Connect interview preparation and job stage context to decide what to practice next.",
      href: "/dashboard/analytics/prep-focus",
      iconKey: "target",
      sourceLabel: "Interview Practice",
      sourceHref: "/dashboard/interview",
      metricLabels: [
        "Interviewing roles",
        "Saved job descriptions",
        "Practice priority",
        "Follow-up readiness",
      ],
      recommendedActions: [
        "Practice against saved job descriptions for every interviewing role.",
        "Convert resume bullets into story bank answers before recruiter screens.",
        "Prepare follow-up notes before interviews so next steps are easy after the call.",
      ],
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
