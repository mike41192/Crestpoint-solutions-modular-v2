export type ATSGrade = "A+" | "A" | "B" | "C" | "D" | "F"

export function getATSGrade(score: number): ATSGrade {
  if (score >= 95) return "A+"
  if (score >= 85) return "A"
  if (score >= 75) return "B"
  if (score >= 65) return "C"
  if (score >= 50) return "D"

  return "F"
}