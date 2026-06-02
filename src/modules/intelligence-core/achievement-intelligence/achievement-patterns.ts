// =====================================================
// BLOCK: Imports
// =====================================================

import type { AchievementCategory } from "./types"

// =====================================================
// BLOCK: Achievement Pattern Types
// =====================================================

export type AchievementPattern = {
  category: AchievementCategory
  patterns: RegExp[]
  score: number
}

// =====================================================
// BLOCK: Achievement Pattern Registry
// =====================================================

export const achievementPatterns: AchievementPattern[] = [
  {
    category: "metric",
    score: 25,
    patterns: [
      /\b\d+(\.\d+)?%\b/i,
      /\b\d+(\.\d+)? percent\b/i,
      /\b\d+\+?\s+(employees|technicians|team members|projects|customers|orders|tickets|reports|locations|sites|vendors)\b/i,
    ],
  },
  {
    category: "financial",
    score: 25,
    patterns: [
      /\$\s?\d+/i,
      /\b(saved|reduced costs|cut costs|increased revenue|grew revenue)\b/i,
    ],
  },
  {
    category: "leadership",
    score: 20,
    patterns: [
      /\b(managed|led|supervised|directed|oversaw)\b/i,
      /\bteam of\b/i,
    ],
  },
  {
    category: "improvement",
    score: 20,
    patterns: [
      /\b(improved|reduced|increased|streamlined|optimized|enhanced|accelerated)\b/i,
      /\b(downtime|efficiency|productivity|accuracy|quality|throughput)\b/i,
    ],
  },
  {
    category: "training",
    score: 15,
    patterns: [
      /\b(trained|coached|mentored|onboarded)\b/i,
      /\bnew hires\b/i,
    ],
  },
  {
    category: "project",
    score: 15,
    patterns: [
      /\b(project|projects|initiative|initiatives|implementation|rollout|upgrade|deployment)\b/i,
    ],
  },
  {
    category: "weak_language",
    score: -20,
    patterns: [
      /\b(responsible for|helped|assisted|worked on|participated in|handled)\b/i,
    ],
  },
]
