// =====================================================
// BLOCK: Imports
// =====================================================

import type { RewriteScoreGrade, RewriteScoreResult } from "./types"

// =====================================================
// BLOCK: Patterns
// =====================================================

const actionVerbPattern =
  /\b(achieved|improved|reduced|increased|generated|saved|led|managed|built|created|implemented|streamlined|optimized|trained|delivered|resolved|launched|developed|coordinated|supervised|maintained|repaired|installed|diagnosed|troubleshot)\b/i

const quantifiedPattern =
  /\d|%|\$|hours?|days?|weeks?|months?|years?|team|staff|employees?|customers?|units?|projects?|tickets?|orders?|revenue|cost|budget|downtime|efficiency|quality/i

const weakPhrasePattern =
  /\b(responsible for|helped with|worked on|assisted with|tasked with|handled|did|various duties)\b/gi

// =====================================================
// BLOCK: Helpers
// =====================================================

function clampScore(value: number) {
  return Math.max(0, Math.min(100, value))
}

function getGrade(score: number): RewriteScoreGrade {
  if (score >= 95) return "A+"
  if (score >= 85) return "A"
  if (score >= 75) return "B"
  if (score >= 65) return "C"
  if (score >= 50) return "D"

  return "F"
}

function countWords(text: string) {
  return text.trim().split(/\s+/).filter(Boolean).length
}

function calculateReadability(text: string) {
  const wordCount = countWords(text)

  if (wordCount === 0) return 0
  if (wordCount <= 28) return 100
  if (wordCount <= 40) return 85
  if (wordCount <= 55) return 70

  return 55
}

function countWeakPhrases(text: string) {
  return text.match(weakPhrasePattern)?.length || 0
}

// =====================================================
// BLOCK: Public Scoring Function
// =====================================================

export function scoreRewriteQuality(
  originalText: string,
  rewrittenText: string
): RewriteScoreResult {
  const hasActionVerb = actionVerbPattern.test(rewrittenText)
  const hasQuantification = quantifiedPattern.test(rewrittenText)
  const readabilityScore = calculateReadability(rewrittenText)
  const weakPhraseCount = countWeakPhrases(rewrittenText)

  let score = 40

  if (rewrittenText.trim().length > originalText.trim().length) score += 10
  if (hasActionVerb) score += 20
  if (hasQuantification) score += 20
  if (readabilityScore >= 85) score += 10
  if (weakPhraseCount > 0) score -= weakPhraseCount * 10

  const finalScore = clampScore(score)
  const improvementDelta = Math.max(0, finalScore - 40)

  const strengths: string[] = []
  const warnings: string[] = []

  if (hasActionVerb) strengths.push("Uses a stronger action verb.")
  else warnings.push("Add a stronger action verb.")

  if (hasQuantification) strengths.push("Includes measurable or impact-focused language.")
  else warnings.push("Add numbers, scope, time savings, quality impact, or measurable results.")

  if (readabilityScore >= 85) strengths.push("Maintains clear resume-friendly readability.")
  else warnings.push("Shorten or simplify the rewrite for stronger readability.")

  if (weakPhraseCount > 0) {
    warnings.push("Remove weak phrases such as responsible for, helped with, or worked on.")
  }

  return {
    score: finalScore,
    grade: getGrade(finalScore),
    improvementDelta,
    hasActionVerb,
    hasQuantification,
    readabilityScore,
    weakPhraseCount,
    strengths,
    warnings,
  }
}
