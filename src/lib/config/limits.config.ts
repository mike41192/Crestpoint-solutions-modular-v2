import type { MembershipTier } from "@/types/modules"

export type TierUsageLimits = {
  tier: MembershipTier
  aiCreditsPerMonth: number
  resumeUploadsPerMonth: number
  resumeExportsPerMonth: number
  atsScansPerMonth: number
  mockInterviewsPerMonth: number
  trackedJobs: number
}

export const usageLimits: TierUsageLimits[] = [
  {
    tier: "free",
    aiCreditsPerMonth: 10,
    resumeUploadsPerMonth: 1,
    resumeExportsPerMonth: 1,
    atsScansPerMonth: 1,
    mockInterviewsPerMonth: 0,
    trackedJobs: 5,
  },
  {
    tier: "starter",
    aiCreditsPerMonth: 100,
    resumeUploadsPerMonth: 10,
    resumeExportsPerMonth: 10,
    atsScansPerMonth: 20,
    mockInterviewsPerMonth: 2,
    trackedJobs: 25,
  },
  {
    tier: "pro",
    aiCreditsPerMonth: 500,
    resumeUploadsPerMonth: 50,
    resumeExportsPerMonth: 50,
    atsScansPerMonth: 100,
    mockInterviewsPerMonth: 20,
    trackedJobs: 100,
  },
  {
    tier: "premium",
    aiCreditsPerMonth: 1500,
    resumeUploadsPerMonth: 150,
    resumeExportsPerMonth: 150,
    atsScansPerMonth: 300,
    mockInterviewsPerMonth: 100,
    trackedJobs: 500,
  },
  {
    tier: "business",
    aiCreditsPerMonth: 5000,
    resumeUploadsPerMonth: 500,
    resumeExportsPerMonth: 500,
    atsScansPerMonth: 1000,
    mockInterviewsPerMonth: 300,
    trackedJobs: 2500,
  },
  {
    tier: "admin",
    aiCreditsPerMonth: -1,
    resumeUploadsPerMonth: -1,
    resumeExportsPerMonth: -1,
    atsScansPerMonth: -1,
    mockInterviewsPerMonth: -1,
    trackedJobs: -1,
  },
]