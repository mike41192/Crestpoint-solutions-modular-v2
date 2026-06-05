// =====================================================
// BLOCK: Job Description Library Types
// Crestpoint Solutions V2
// Version: 1.8.1
// =====================================================

export type JobDescriptionStatus = "active" | "archived"

export type JobDescriptionRecord = {
  id: string
  userId: string
  title: string
  company: string
  role: string
  location: string
  description: string
  sourceUrl: string
  status: JobDescriptionStatus
  createdAt: string
  updatedAt: string
}

export type CreateJobDescriptionInput = {
  title: string
  company?: string
  role?: string
  location?: string
  description: string
  sourceUrl?: string
  status?: JobDescriptionStatus
}

export type UpdateJobDescriptionInput = CreateJobDescriptionInput
