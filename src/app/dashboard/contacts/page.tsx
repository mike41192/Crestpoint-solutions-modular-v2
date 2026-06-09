// =====================================================
// BLOCK: Layout Imports
// Crestpoint Solutions V2
// Version: 1.10.0
// =====================================================

import { CareerContactsDashboard } from "@/components/crm/CareerContactsDashboard"
import { ModulePageLayout } from "@/components/layout/ModulePageLayout"

// =====================================================
// BLOCK: Contacts Page
// =====================================================

export default function ContactsPage() {
  return (
    <ModulePageLayout
      title="Career Contacts"
      description="Manage recruiters, hiring managers, mentors, coworkers, and networking relationships across your career search."
    >
      <CareerContactsDashboard />
    </ModulePageLayout>
  )
}
