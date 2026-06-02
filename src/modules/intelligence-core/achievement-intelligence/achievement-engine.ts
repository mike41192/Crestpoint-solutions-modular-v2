// =====================================================
// BLOCK: Imports
// =====================================================

import { achievementPatterns } from "./achievement-patterns"
import type {
  AchievementBulletResult,
  AchievementSignal,
  AchievementStrength,
  ResumeAchievementReport,
} from "./types"

// =====================================================
// BLOCK: Helpers
// =====================================================

function normalizeText(value: string): string {
  return value
    .replace(/\s+/g, " ")
    .trim()
}

function getStrength(score: number): AchievementStrength {
  if (score >= 70) return "strong"
  if (score >= 40) return "medium"
  return "weak"
}

function clampScore(score: number): number {
  return Math.max(0, Math.min(score, 100))
}

function averageScore(scores: number[]): number {
  if (scores.length === 0) return 0

  const total = scores.reduce((sum, score) => sum + score, 0)

  return Math.round(total / scores.length)
}

// =====================================================
// BLOCK: Bullet Scoring
// =====================================================

export function scoreAchievementBullet(bullet: string): AchievementBulletResult {
  const normalizedBullet = normalizeText(bullet)
  const signals: AchievementSignal[] = []

  let score = 20

  for (const patternGroup of achievementPatterns) {
    const matched = patternGroup.patterns.some((pattern) => {
      return pattern.test(normalizedBullet)
    })

    if (!matched) {
      continue
    }

    signals.push({
      category: patternGroup.category,
      pattern: patternGroup.patterns[0].source,
      score: patternGroup.score,
    })

    score += patternGroup.score
  }

  const finalScore = clampScore(score)

  return {
    bullet,
    score: finalScore,
    strength: getStrength(finalScore),
    signals,
  }
}

// =====================================================
// BLOCK: Resume Scoring
// =====================================================

export function analyzeResumeAchievements(
  bullets: string[],
): ResumeAchievementReport {
  const cleanedBullets = bullets
    .map(normalizeText)
    .filter(Boolean)

  const bulletResults = cleanedBullets.map(scoreAchievementBullet)

  const overallScore = averageScore(
    bulletResults.map((result) => result.score),
  )

  return {
    overallScore,
    strongBullets: bulletResults.filter((result) => result.strength === "strong")
      .length,
    mediumBullets: bulletResults.filter((result) => result.strength === "medium")
      .length,
    weakBullets: bulletResults.filter((result) => result.strength === "weak")
      .length,
    bulletResults,
  }
}
