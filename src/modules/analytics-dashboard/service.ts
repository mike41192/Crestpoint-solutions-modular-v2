// =====================================================
// BLOCK: Analytics Dashboard Service
// Crestpoint Solutions V2
// Version: 1.10.0
// =====================================================

import {
  ANALYTICS_DASHBOARD_HERO,
  ANALYTICS_DASHBOARD_INSIGHT_AREAS,
  ANALYTICS_DASHBOARD_WORKFLOW_LINKS,
} from "./constants"

export function getAnalyticsDashboardPageContent() {
  return {
    hero: ANALYTICS_DASHBOARD_HERO,
    insightAreas: ANALYTICS_DASHBOARD_INSIGHT_AREAS,
    workflowLinks: ANALYTICS_DASHBOARD_WORKFLOW_LINKS,
  }
}

export function listAnalyticsDashboardInsightAreas() {
  return ANALYTICS_DASHBOARD_INSIGHT_AREAS
}

export function getAnalyticsDashboardInsightAreaById(id: string) {
  return ANALYTICS_DASHBOARD_INSIGHT_AREAS.find((area) => area.id === id)
}
