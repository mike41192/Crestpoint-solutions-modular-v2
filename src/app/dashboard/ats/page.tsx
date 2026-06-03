// =====================================================
// BLOCK: Layout / Onboarding Imports
// =====================================================

import { ModulePageLayout } from "@/components/layout/ModulePageLayout"
import { FirstUseTutorial } from "@/components/onboarding/FirstUseTutorial"

// =====================================================
// BLOCK: ATS Component Imports
// =====================================================

import { ATSDashboardClient } from "@/components/ats/ATSDashboardClient"

// =====================================================
// BLOCK: ATS Dashboard Page
// =====================================================

export default function ATSDashboardPage() {
  return (
    <ModulePageLayout
      title="ATS Scoring"
      description="Score your resume against job descriptions and improve keyword alignment."
    >
      <FirstUseTutorial moduleKey="ats_scoring" />

      <ATSDashboardClient />
    </ModulePageLayout>
  )
}