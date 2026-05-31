import { buildRewriteResult } from "./rewrite-scoring"
import type { RewriteResult } from "./types"

export function rewriteKeywords(
  text: string
): RewriteResult {
  const rewritten =
    text.trim().length > 0
      ? `${text} utilizing industry best practices, process improvement methodologies, and performance optimization techniques`
      : text

  return buildRewriteResult(
    text,
    rewritten,
    "Enhanced content with ATS-friendly keyword language."
  )
}
