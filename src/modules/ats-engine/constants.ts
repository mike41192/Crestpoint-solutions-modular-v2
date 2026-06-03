// =====================================================
// BLOCK: ATS Engine Constants
// Crestpoint Solutions V2
// Version: 1.5.7
// =====================================================

export const ATS_SCORE_LIMITS = {
  excellent: 85,
  strong: 70,
  developing: 50,
} as const

export const ATS_KEYWORD_LIMITS = {
  maxMatchedKeywords: 24,
  maxMissingKeywords: 24,
  maxRecommendationKeywords: 8,
  maxRecommendations: 8,
  maxRiskFlags: 8,
} as const

export const ATS_SECTION_NAMES = {
  contact: "Contact Information",
  summary: "Professional Summary",
  skills: "Skills",
  experience: "Work Experience",
  education: "Education",
  readability: "Readability",
  achievements: "Achievements",
} as const

export const ATS_INDUSTRY_FALLBACK = "General Professional"
export const ATS_TARGET_ROLE_FALLBACK = "Target Role Not Detected"
