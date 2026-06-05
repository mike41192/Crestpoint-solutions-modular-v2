// =====================================================
// BLOCK: Layout Imports
// =====================================================

import { ModulePageLayout } from "@/components/layout/ModulePageLayout"
import { ProfileSettingsForm } from "@/components/settings/ProfileSettingsForm"
import { SettingsBackLink } from "@/components/settings/SettingsBackLink"
import { SettingsPageShell } from "@/components/settings/SettingsPageShell"

// =====================================================
// BLOCK: Profile Settings Page
// =====================================================

export default function ProfileSettingsPage() {
  return (
    <ModulePageLayout
      title="Profile Settings"
      description="Manage your personal information and career profile details."
    >
      <SettingsPageShell
        eyebrow="Account Settings"
        title="Profile Information"
        description="Update your account profile, contact details, and career identity."
      >
        <SettingsBackLink />

        <ProfileSettingsForm />
      </SettingsPageShell>
    </ModulePageLayout>
  )
}
