"use client"

// =====================================================
// BLOCK: Imports
// Crestpoint Solutions V2
// Version: 1.8.5
// =====================================================

import {
  ATSDashboardTabs,
  type ATSDashboardTab,
} from "@/components/ats/ATSDashboardTabs"

// =====================================================
// BLOCK: Component Types
// =====================================================

type ResumeJobMatchTabsProps = {
  activeTab: ATSDashboardTab
  onTabChange: (tab: ATSDashboardTab) => void
}

// =====================================================
// BLOCK: Resume Job Match Tabs Component
// =====================================================

export function ResumeJobMatchTabs({
  activeTab,
  onTabChange,
}: ResumeJobMatchTabsProps) {
  return <ATSDashboardTabs activeTab={activeTab} onTabChange={onTabChange} />
}