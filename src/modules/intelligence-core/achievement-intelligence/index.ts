// =====================================================
// BLOCK: Public Type Exports
// =====================================================

export type {
  AchievementBulletResult,
  AchievementCategory,
  AchievementSignal,
  AchievementStrength,
  ResumeAchievementReport,
} from "./types"

// =====================================================
// BLOCK: Public Pattern Exports
// =====================================================

export { achievementPatterns } from "./achievement-patterns"

// =====================================================
// BLOCK: Public Engine Exports
// =====================================================

export {
  analyzeResumeAchievements,
  scoreAchievementBullet,
} from "./achievement-engine"

// =====================================================
// BLOCK: Public Resume Adapter Exports
// =====================================================

export {
  analyzeResumeAchievementStrength,
  extractResumeExperienceBullets,
} from "./resume-achievement-adapter"
