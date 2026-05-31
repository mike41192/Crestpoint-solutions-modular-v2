import { rewriteBullet } from "./bullet-rewriter"
import { rewriteKeywords } from "./keyword-rewriter"
import { rewriteSummary } from "./summary-rewriter"

export const AIRewriteEngine = {
  rewriteSummary,
  rewriteBullet,
  rewriteKeywords,
}
