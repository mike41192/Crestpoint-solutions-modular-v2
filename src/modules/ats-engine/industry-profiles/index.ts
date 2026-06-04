// =====================================================
// BLOCK: Industry Profile Types
// Crestpoint Solutions V2
// Version: 1.6.0
// =====================================================

export type ATSIndustryProfile = {
  industry: string
  weights: {
    contact: number
    summary: number
    skills: number
    experience: number
    education: number
    readability: number
    achievements: number
  }
  priorityKeywords: string[]
}

// =====================================================
// BLOCK: Industry Profiles
// =====================================================

export const ATS_INDUSTRY_PROFILES: ATSIndustryProfile[] = [
  {
    industry: "Manufacturing / Maintenance",
    weights: {
      contact: 0.08,
      summary: 0.12,
      skills: 0.22,
      experience: 0.34,
      education: 0.07,
      readability: 0.07,
      achievements: 0.10,
    },
    priorityKeywords: [
      "preventive maintenance",
      "equipment troubleshooting",
      "cmms",
      "osha",
      "root cause analysis",
      "hydraulic systems",
      "pneumatic systems",
      "production equipment",
      "safety compliance",
      "work orders",
    ],
  },
  {
    industry: "Information Technology",
    weights: {
      contact: 0.08,
      summary: 0.12,
      skills: 0.28,
      experience: 0.28,
      education: 0.08,
      readability: 0.08,
      achievements: 0.08,
    },
    priorityKeywords: [
      "typescript",
      "javascript",
      "react",
      "next.js",
      "database design",
      "api integration",
      "cloud",
      "security",
      "github",
      "dashboard development",
    ],
  },
  {
    industry: "Healthcare",
    weights: {
      contact: 0.10,
      summary: 0.15,
      skills: 0.18,
      experience: 0.30,
      education: 0.12,
      readability: 0.08,
      achievements: 0.07,
    },
    priorityKeywords: [
      "patient care",
      "clinical documentation",
      "medical records",
      "care coordination",
      "healthcare",
      "patient",
      "clinical",
      "nursing",
    ],
  },
  {
    industry: "Sales / Customer Success",
    weights: {
      contact: 0.08,
      summary: 0.15,
      skills: 0.18,
      experience: 0.30,
      education: 0.05,
      readability: 0.09,
      achievements: 0.15,
    },
    priorityKeywords: [
      "sales",
      "customer relationship management",
      "crm",
      "pipeline",
      "revenue",
      "quota",
      "account management",
      "customer success",
    ],
  },
  {
    industry: "Operations / Management",
    weights: {
      contact: 0.08,
      summary: 0.14,
      skills: 0.20,
      experience: 0.32,
      education: 0.07,
      readability: 0.08,
      achievements: 0.11,
    },
    priorityKeywords: [
      "operations management",
      "team leadership",
      "process improvement",
      "staff training",
      "workflow optimization",
      "performance management",
      "budget",
      "supervision",
    ],
  },
]

// =====================================================
// BLOCK: Fallback Profile
// =====================================================

export const DEFAULT_ATS_INDUSTRY_PROFILE: ATSIndustryProfile = {
  industry: "General Professional",
  weights: {
    contact: 0.10,
    summary: 0.15,
    skills: 0.20,
    experience: 0.30,
    education: 0.10,
    readability: 0.10,
    achievements: 0.05,
  },
  priorityKeywords: [],
}

// =====================================================
// BLOCK: Industry Profile Lookup
// =====================================================

export function getATSIndustryProfile(industry: string) {
  return (
    ATS_INDUSTRY_PROFILES.find((profile) => profile.industry === industry) ||
    DEFAULT_ATS_INDUSTRY_PROFILE
  )
}