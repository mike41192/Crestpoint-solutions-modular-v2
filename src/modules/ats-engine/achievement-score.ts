// =====================================================
// BLOCK: Type Imports
// =====================================================

import type { ResumeBuilderFormData } from "@/modules/resume-builder"

// =====================================================
// BLOCK: Achievement Detection Patterns
// =====================================================

const STRONG_ACTION_VERB_PATTERN =
  /\b(achieved|improved|reduced|increased|generated|saved|led|managed|built|created|implemented|streamlined|optimized|trained|delivered|resolved|launched|developed|coordinated|supervised|maintained|repaired|installed|diagnosed|troubleshot|designed|executed|facilitated|directed|organized|operated|supported|inspected|analyzed)\b/i

const QUANTIFIED_PATTERN =
  /\d|%|\$|hours?|days?|weeks?|months?|years?|team|staff|employees?|customers?|clients?|units?|projects?|tickets?|orders?|revenue|cost|budget|production|inventory|accounts?|cases?|shipments?/i

const IMPACT_PATTERN =
  /\b(improved|reduced|increased|saved|boosted|accelerated|strengthened|optimized|minimized|maximized|enhanced|grew|expanded|streamlined)\b/i

// =====================================================
// BLOCK: Bullet Collection Helper
// =====================================================

function getExperienceBullets(data: ResumeBuilderFormData): string[] {
  return data.experience
    .flatMap((job) => job.bullets || [])
    .map((bullet) => bullet.trim())
    .filter(Boolean)
}

// =====================================================
// BLOCK: Achievement Score Calculator
// =====================================================

export function calculateAchievementScore(
  data: ResumeBuilderFormData,
): number {
  const bullets = getExperienceBullets(data)

  if (bullets.length === 0) {
    return 0
  }

  const strongVerbCount = bullets.filter((bullet) =>
    STRONG_ACTION_VERB_PATTERN.test(bullet),
  ).length

  const quantifiedCount = bullets.filter((bullet) =>
    QUANTIFIED_PATTERN.test(bullet),
  ).length

  const impactCount = bullets.filter((bullet) =>
    IMPACT_PATTERN.test(bullet),
  ).length

  // =====================================================
  // BLOCK: Category Scores
  // =====================================================

  const strongVerbScore = Math.round(
    (strongVerbCount / bullets.length) * 40,
  )

  const quantifiedScore = Math.round(
    (quantifiedCount / bullets.length) * 40,
  )

  const impactScore = Math.round(
    (impactCount / bullets.length) * 20,
  )

  return Math.min(
    100,
    strongVerbScore +
      quantifiedScore +
      impactScore,
  )
}

// =====================================================
// BLOCK: Achievement Quality Helpers
// =====================================================

export function hasMeasurableAchievements(
  data: ResumeBuilderFormData,
): boolean {
  return calculateAchievementScore(data) >= 50
}

export function getAchievementMetrics(
  data: ResumeBuilderFormData,
) {
  const bullets = getExperienceBullets(data)

  return {
    totalBullets: bullets.length,

    strongVerbBullets:
      bullets.filter((bullet) =>
        STRONG_ACTION_VERB_PATTERN.test(
          bullet,
        ),
      ).length,

    quantifiedBullets:
      bullets.filter((bullet) =>
        QUANTIFIED_PATTERN.test(
          bullet,
        ),
      ).length,

    impactBullets:
      bullets.filter((bullet) =>
        IMPACT_PATTERN.test(
          bullet,
        ),
      ).length,
  }
}
