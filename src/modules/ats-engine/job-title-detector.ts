// =====================================================
// BLOCK: Type Imports
// =====================================================

import type { ResumeBuilderFormData } from "@/modules/resume-builder"

// =====================================================
// BLOCK: Role Detection Constants
// =====================================================

const FALLBACK_ROLE = "Target Role Not Detected"

const INVALID_ROLE_VALUES = new Set([
  "summary",
  "education",
  "experience",
  "qualifications",
  "requirements",
  "responsibilities",
  "skills",
  "job description",
  "about the role",
  "about us",
])

const KNOWN_ROLE_PATTERNS = [
  "maintenance manager",
  "maintenance supervisor",
  "industrial maintenance technician",
  "maintenance technician",
  "maintenance mechanic",
  "industrial mechanic",
  "manufacturing supervisor",
  "manufacturing manager",
  "production supervisor",
  "production manager",
  "operations supervisor",
  "operations manager",
  "plant manager",
  "facility maintenance technician",
  "facility maintenance manager",
  "mechanical technician",
  "electrical technician",
  "equipment technician",
  "field service technician",
]

// =====================================================
// BLOCK: Text Helpers
// =====================================================

function cleanRole(value: string) {
  return value
    .replace(/[*_`#]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 80)
}

function isValidDetectedRole(value: string) {
  const cleaned = cleanRole(value).toLowerCase()

  if (!cleaned) return false
  if (INVALID_ROLE_VALUES.has(cleaned)) return false
  if (cleaned.length < 4) return false

  return true
}

// =====================================================
// BLOCK: Known Role Matching
// =====================================================

function detectKnownRole(jobDescription: string) {
  const normalized = jobDescription.toLowerCase()

  return KNOWN_ROLE_PATTERNS.find((role) => normalized.includes(role)) || ""
}

// =====================================================
// BLOCK: Label-Based Role Matching
// =====================================================

function detectLabeledRole(jobDescription: string) {
  const titlePatterns = [
    /job title[:\s]+([^\n]+)/i,
    /position[:\s]+([^\n]+)/i,
    /role[:\s]+([^\n]+)/i,
    /hiring\s+([A-Za-z\s/-]+?)(?:\.|\n|,)/i,
    /seeking\s+(?:a|an)?\s*([A-Za-z\s/-]+?)(?:\.|\n|,)/i,
  ]

  for (const pattern of titlePatterns) {
    const match = jobDescription.match(pattern)
    const detectedRole = cleanRole(match?.[1] || "")

    if (isValidDetectedRole(detectedRole)) {
      return detectedRole
    }
  }

  return ""
}

// =====================================================
// BLOCK: Resume Fallback Role Matching
// =====================================================

function detectResumeRole(data: ResumeBuilderFormData) {
  const firstRole = data.experience.find((job) => job.role?.trim())?.role || ""

  if (isValidDetectedRole(firstRole)) {
    return cleanRole(firstRole)
  }

  return ""
}

// =====================================================
// BLOCK: Public Target Role Detector
// =====================================================

export function detectTargetJobTitle(
  data: ResumeBuilderFormData,
  jobDescription = "",
) {
  const knownRole = detectKnownRole(jobDescription)

  if (knownRole) {
    return knownRole
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  }

  const labeledRole = detectLabeledRole(jobDescription)

  if (labeledRole) {
    return labeledRole
  }

  const resumeRole = detectResumeRole(data)

  if (resumeRole) {
    return resumeRole
  }

  return FALLBACK_ROLE
}