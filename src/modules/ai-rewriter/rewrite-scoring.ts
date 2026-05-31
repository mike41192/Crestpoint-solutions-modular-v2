import type { RewriteResult } from "./types"

const actionVerbPattern =
  /\b(achieved|improved|reduced|increased|generated|saved|led|managed|built|created|implemented|streamlined|optimized|trained|delivered|resolved|launched|developed|coordinated|supervised|maintained|repaired|installed|diagnosed|troubleshot)\b/i

const quantifiedPattern =
  /\d|%|\$|hours?|days?|weeks?|months?|years?|team|staff|employees?|customers?|units?|projects?|tickets?|orders?|revenue|cost|budget/i

export function calculateRewriteImprovement(
  originalText: string,
  rewrittenText: string
) {
  let score = 0

  if (
    !actionVerbPattern.test(originalText) &&
    actionVerbPattern.test(rewrittenText)
  ) {
    score += 25
  }

  if (
    !quantifiedPattern.test(originalText) &&
    quantifiedPattern.test(rewrittenText)
  ) {
    score += 25
  }

  if (rewrittenText.length > originalText.length) {
    score += 15
  }

  if (rewrittenText.length > originalText.length * 1.5) {
    score += 10
  }

  return Math.min(score, 100)
}

export function buildRewriteResult(
  originalText: string,
  rewrittenText: string,
  explanation: string
): RewriteResult {
  return {
    originalText,
    rewrittenText,
    explanation,
    estimatedImprovement: calculateRewriteImprovement(
      originalText,
      rewrittenText
    ),
  }
}
