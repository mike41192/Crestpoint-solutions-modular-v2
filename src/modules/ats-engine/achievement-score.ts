import type { ResumeBuilderFormData } from "@/modules/resume-builder"

const strongActionVerbPattern =
  /\b(achieved|improved|reduced|increased|generated|saved|led|managed|built|created|implemented|streamlined|optimized|trained|delivered|resolved|launched|developed|coordinated|supervised|maintained|repaired|installed|diagnosed|troubleshot)\b/i

const quantifiedPattern =
  /\d|%|\$|hours?|days?|weeks?|months?|years?|team|staff|employees?|customers?|units?|projects?|tickets?|orders?|revenue|cost|budget/i

export function calculateAchievementScore(data: ResumeBuilderFormData) {
  const bullets = data.experience.flatMap((job) => job.bullets).filter(Boolean)

  if (bullets.length === 0) return 0

  const strongVerbCount = bullets.filter((bullet) =>
    strongActionVerbPattern.test(bullet)
  ).length

  const quantifiedCount = bullets.filter((bullet) =>
    quantifiedPattern.test(bullet)
  ).length

  const strongVerbScore = Math.round((strongVerbCount / bullets.length) * 50)
  const quantifiedScore = Math.round((quantifiedCount / bullets.length) * 50)

  return Math.min(100, strongVerbScore + quantifiedScore)
}

export function hasMeasurableAchievements(data: ResumeBuilderFormData) {
  return calculateAchievementScore(data) >= 50
}
