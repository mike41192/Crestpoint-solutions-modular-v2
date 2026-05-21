export type MembershipTier =
  | "free"
  | "starter"
  | "pro"
  | "premium"
  | "business"
  | "admin"

export type ModuleKey =
  | "resume_builder"
  | "ai_resume_parser"
  | "ats_scoring"
  | "ai_interviewer"
  | "interview_academy"
  | "cover_letter_generator"
  | "linkedin_optimizer"
  | "job_tracker"
  | "career_coach"
  | "job_match_engine"
  | "networking_outreach"
  | "salary_intelligence"
  | "portfolio_builder"
  | "seo_blog"
  | "analytics_dashboard"
  | "billing_manager"
  | "admin_tools"

export type ModuleConfig = {
  key: ModuleKey
  name: string
  description: string
  enabled: boolean
  requiredTier: MembershipTier
  usageLimitKey?: string
}