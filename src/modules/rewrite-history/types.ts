// =====================================================
// BLOCK: Imports
// =====================================================

import type { ResumeBuilderFormData } from "@/modules/resume-builder"
import type { RewriteResult } from "@/modules/ai-rewriter"

// =====================================================
// BLOCK: Rewrite History Types
// =====================================================

export type RewriteHistoryItem = {
  id: string
  createdAt: string
  rewriteType: "summary" | "bullet"
  result: RewriteResult
  resumeBefore: ResumeBuilderFormData
  resumeAfter: ResumeBuilderFormData
}

export type RewriteHistoryState = {
  items: RewriteHistoryItem[]
}
