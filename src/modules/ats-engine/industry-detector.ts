// =====================================================
// BLOCK: Type Imports
// =====================================================

import type { ResumeBuilderFormData } from "@/modules/resume-builder"

// =====================================================
// BLOCK: Industry Types
// =====================================================

type IndustryMatch = {
  industry: string
  score: number
  matchedKeywords: string[]
}

// =====================================================
// BLOCK: Industry Keyword Map
// Multi-word terms are weighted higher than single words.
// =====================================================

const industryKeywordMap: Record<string, string[]> = {
  "Manufacturing / Maintenance": [
    "industrial maintenance",
    "preventive maintenance",
    "corrective maintenance",
    "equipment troubleshooting",
    "mechanical systems",
    "electrical systems",
    "hydraulic systems",
    "pneumatic systems",
    "production equipment",
    "maintenance",
    "mechanic",
    "technician",
    "hydraulic",
    "pneumatic",
    "plc",
    "production",
    "machine",
    "repair",
    "manufacturing",
    "cmms",
  ],

  "Information Technology": [
    "software development",
    "web development",
    "api integration",
    "database design",
    "cloud infrastructure",
    "cybersecurity",
    "software",
    "developer",
    "engineer",
    "javascript",
    "typescript",
    "react",
    "database",
    "cloud",
    "api",
    "security",
  ],

  Healthcare: [
    "patient care",
    "clinical documentation",
    "medical records",
    "care coordination",
    "healthcare",
    "medical",
    "nursing",
    "hospital",
    "pharmacy",
    "clinical",
    "patient",
  ],

  "Sales / Customer Success": [
    "customer relationship management",
    "account management",
    "sales pipeline",
    "revenue growth",
    "customer success",
    "sales",
    "customer",
    "account",
    "crm",
    "pipeline",
    "revenue",
    "quota",
  ],

  "Operations / Management": [
    "operations management",
    "process improvement",
    "workflow optimization",
    "team leadership",
    "staff training",
    "performance management",
    "operations",
    "manager",
    "supervisor",
    "workflow",
    "budget",
    "training",
  ],
}

// =====================================================
// BLOCK: Resume Text Builder
// =====================================================

function buildResumeText(data: ResumeBuilderFormData) {
  return [
    data.summary,
    ...data.skills,
    ...data.certifications,
    ...data.education.flatMap((education) => [
      education.school,
      education.degree,
      education.field,
    ]),
    ...data.experience.flatMap((job) => [
      job.role,
      job.company,
      job.location,
      ...job.bullets,
    ]),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase()
}

// =====================================================
// BLOCK: Keyword Weighting Helper
// =====================================================

function getKeywordWeight(keyword: string) {
  const wordCount = keyword.trim().split(/\s+/).length

  if (wordCount >= 3) return 4
  if (wordCount === 2) return 3

  return 1
}

// =====================================================
// BLOCK: Industry Scoring Helper
// =====================================================

function scoreIndustry(text: string, industry: string, keywords: string[]): IndustryMatch {
  const matchedKeywords = keywords.filter((keyword) => {
    return text.includes(keyword.toLowerCase())
  })

  const score = matchedKeywords.reduce((total, keyword) => {
    return total + getKeywordWeight(keyword)
  }, 0)

  return {
    industry,
    score,
    matchedKeywords,
  }
}

// =====================================================
// BLOCK: Public Industry Detector
// =====================================================

export function detectIndustry(data: ResumeBuilderFormData) {
  const text = buildResumeText(data)

  const ranked = Object.entries(industryKeywordMap)
    .map(([industry, keywords]) => scoreIndustry(text, industry, keywords))
    .sort((a, b) => b.score - a.score)

  const bestMatch = ranked[0]

  if (!bestMatch || bestMatch.score <= 0) {
    return "General Professional"
  }

  return bestMatch.industry
}
