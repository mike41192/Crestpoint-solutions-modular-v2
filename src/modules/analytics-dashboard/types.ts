// =====================================================
// BLOCK: Analytics Dashboard Types
// Crestpoint Solutions V2
// Version: 1.10.0
// =====================================================

export type AnalyticsDashboardIconKey =
  | "barChart"
  | "briefcase"
  | "clipboard"
  | "file"
  | "target"
  | "users"

export type AnalyticsDashboardInsightArea = {
  id: string
  title: string
  subtitle: string
  description: string
  href: string
  iconKey: AnalyticsDashboardIconKey
  sourceLabel: string
  sourceHref: string
  metricLabels: string[]
  recommendedActions: string[]
}

export type AnalyticsDashboardWorkflowLink = {
  title: string
  description: string
  href: string
  iconKey: AnalyticsDashboardIconKey
}

export type AnalyticsDashboardHeroContent = {
  eyebrow: string
  title: string
  description: string
  nextStepTitle: string
  nextStepHref: string
  nextStepLabel: string
}
