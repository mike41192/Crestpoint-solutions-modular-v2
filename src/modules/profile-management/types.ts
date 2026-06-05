// =====================================================
// BLOCK: Profile Management Types
// Crestpoint Solutions V2
// Version: 1.7.1
// =====================================================

export type UserProfileData = {
  fullName: string
  email: string
  phone: string
  location: string
  linkedIn: string
  website: string
}

export type ProfileValidationIssue = {
  field: keyof UserProfileData
  message: string
}

export type ProfileSaveResult = {
  status: "success" | "error"
  message: string
}
