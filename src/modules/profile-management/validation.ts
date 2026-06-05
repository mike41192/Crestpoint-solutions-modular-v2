// =====================================================
// BLOCK: Type Imports
// =====================================================

import type { ProfileValidationIssue, UserProfileData } from "./types"

// =====================================================
// BLOCK: Profile Validation
// =====================================================

export function validateUserProfile(
  profile: UserProfileData,
): ProfileValidationIssue[] {
  const issues: ProfileValidationIssue[] = []

  if (!profile.fullName.trim()) {
    issues.push({
      field: "fullName",
      message: "Full name is required.",
    })
  }

  if (!profile.email.trim()) {
    issues.push({
      field: "email",
      message: "Email address is required.",
    })
  }

  if (profile.website && !profile.website.startsWith("http")) {
    issues.push({
      field: "website",
      message: "Website should start with http:// or https://.",
    })
  }

  if (profile.linkedIn && !profile.linkedIn.startsWith("http")) {
    issues.push({
      field: "linkedIn",
      message: "LinkedIn URL should start with http:// or https://.",
    })
  }

  return issues
}