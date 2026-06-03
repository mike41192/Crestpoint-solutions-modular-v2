// =====================================================
// BLOCK: ATS Grade Imports
// =====================================================

import { ATS_SCORE_LIMITS } from "./constants"

// =====================================================
// BLOCK: ATS Grade Type
// =====================================================

export type ATSGrade = "A" | "B" | "C" | "D" | "F"

// =====================================================
// BLOCK: Public Grade Helper
// =====================================================

export function getATSGrade(score: number): ATSGrade {
  if (score >= ATS_SCORE_LIMITS.excellent) return "A"
  if (score >= ATS_SCORE_LIMITS.strong) return "B"
  if (score >= ATS_SCORE_LIMITS.developing) return "C"
  if (score >= 35) return "D"

  return "F"
}
