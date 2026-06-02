// =====================================================
// BLOCK: Achievement Intelligence Types
// =====================================================

export type AchievementStrength = "strong" | "medium" | "weak"

export type AchievementCategory =
  | "metric"
  | "leadership"
  | "improvement"
  | "financial"
  | "training"
  | "project"
  | "weak_language"

export type AchievementSignal = {
  category: AchievementCategory
  pattern: string
  score: number
}

export type AchievementBulletResult = {
  bullet: string
  score: number
  strength: AchievementStrength
  signals: AchievementSignal[]
}

export type ResumeAchievementReport = {
  overallScore: number
  strongBullets: number
  mediumBullets: number
  weakBullets: number
  bulletResults: AchievementBulletResult[]
}
