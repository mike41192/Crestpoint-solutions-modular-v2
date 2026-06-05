// =====================================================
// BLOCK: Type Imports
// =====================================================

import type { UserProfileData } from "@/modules/profile-management/types"
import type { MembershipData } from "@/modules/membership-management/types"
import type { UserPreferences } from "@/modules/preferences-management/types"

import type {
  AccountHealthCheck,
  AccountHealthReport,
} from "./types"

// =====================================================
// BLOCK: Account Health Calculator
// =====================================================

export function calculateAccountHealth({
  profile,
  membership,
  preferences,
}: {
  profile: UserProfileData
  membership: MembershipData
  preferences: UserPreferences
}): AccountHealthReport {
  const checks: AccountHealthCheck[] = [
    {
      label: "Profile Completed",
      completed:
        profile.fullName.length > 0 &&
        profile.email.length > 0,
    },

    {
      label: "Contact Information Added",
      completed:
        profile.phone.length > 0,
    },

    {
      label: "Location Added",
      completed:
        profile.location.length > 0,
    },

    {
      label: "Membership Active",
      completed:
        membership.status === "active",
    },

    {
      label: "Preferences Configured",
      completed: true,
    },
  ]

  const completedChecks =
    checks.filter(check => check.completed).length

  const score =
    Math.round(
      (completedChecks / checks.length) * 100,
    )

  return {
    score,
    checks,
  }
}