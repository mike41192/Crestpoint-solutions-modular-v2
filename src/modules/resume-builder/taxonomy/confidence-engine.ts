import {
  JOB_TITLE_KEYWORDS,
  STRONG_JOB_TITLE_PHRASES,
} from "./job-title-taxonomy"
import { COMPANY_KEYWORDS } from "./company-taxonomy"

// =====================================================
// BLOCK: Confidence Engine
// =====================================================

export function scoreJobTitle(line: string): number {
  const lower = line.toLowerCase()
  let score = 0

  STRONG_JOB_TITLE_PHRASES.forEach((phrase) => {
    if (lower === phrase || lower.includes(phrase)) {
      score += 80
    }
  })

  JOB_TITLE_KEYWORDS.forEach((keyword) => {
    if (lower.includes(keyword)) {
      score += 30
    }
  })

  return Math.min(score, 100)
}

export function scoreCompany(line: string): number {
  const lower = line.toLowerCase()
  let score = 0

  COMPANY_KEYWORDS.forEach((keyword) => {
    if (lower.includes(keyword)) {
      score += 30
    }
  })

  return Math.min(score, 100)
}