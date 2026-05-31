import { buildRewriteResult } from "./rewrite-scoring"
import type { RewriteResult } from "./types"

export function rewriteBullet(
  bullet: string
): RewriteResult {
  const rewritten =
    bullet.trim().length > 0
      ? `${bullet} while improving efficiency, maintaining quality standards, and supporting operational goals.`
      : bullet

  return buildRewriteResult(
    bullet,
    rewritten,
    "Strengthened bullet point with action-oriented language and business impact."
  )
}
