import type { ATSResult } from "@/modules/ats-engine"

export function estimateScoreLift(atsResult: ATSResult) {
  let lift = 0

  if (atsResult.keywordMatchPercent < 50) lift += 12
  else if (atsResult.keywordMatchPercent < 75) lift += 8

  if (atsResult.achievementScore < 50) lift += 8
  else if (atsResult.achievementScore < 75) lift += 5

  if (atsResult.readabilityScore < 70) lift += 5

  if (atsResult.riskFlags.length > 0) lift += Math.min(10, atsResult.riskFlags.length * 3)

  return Math.min(lift, 25)
}

export function estimateOptimizedScore(atsResult: ATSResult) {
  return Math.min(100, atsResult.overallScore + estimateScoreLift(atsResult))
}
