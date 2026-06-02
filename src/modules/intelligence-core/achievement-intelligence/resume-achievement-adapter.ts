// =====================================================
// BLOCK: Type Imports
// =====================================================

import type { ResumeBuilderFormData } from "@/modules/resume-builder"
import { analyzeResumeAchievements } from "./achievement-engine"
import type { ResumeAchievementReport } from "./types"

// =====================================================
// BLOCK: Resume Bullet Extraction
// =====================================================

export function extractResumeExperienceBullets(
  resume: ResumeBuilderFormData,
): string[] {
  return resume.experience.flatMap((experienceItem) => {
    return experienceItem.bullets.filter(Boolean)
  })
}

// =====================================================
// BLOCK: Public Resume Achievement Adapter
// =====================================================

export function analyzeResumeAchievementStrength(
  resume: ResumeBuilderFormData,
): ResumeAchievementReport {
  const bullets = extractResumeExperienceBullets(resume)

  return analyzeResumeAchievements(bullets)
}
