import { buildRewriteResult } from "./rewrite-scoring"
import type { RewriteResult } from "./types"

export function rewriteSummary(
  summary: string
): RewriteResult {
  const rewritten =
    summary.trim().length > 0
      ? `${summary} Focused on delivering measurable results, improving operational performance, and supporting business objectives through strong technical and professional expertise.`
      : "Experienced professional with proven ability to deliver measurable results, improve operational performance, and contribute to organizational success."

  return buildRewriteResult(
    summary,
    rewritten,
    "Expanded summary with stronger value proposition and ATS-friendly language."
  )
}
