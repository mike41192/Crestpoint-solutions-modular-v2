// =====================================================
// BLOCK: Imports
// =====================================================

import type { ResumeBuilderFormData } from "@/modules/resume-builder"
import type { RewriteResult } from "@/modules/ai-rewriter"
import type { RewriteHistoryItem, RewriteHistoryState } from "./types"

// =====================================================
// BLOCK: Constants
// =====================================================

const REWRITE_HISTORY_STORAGE_KEY = "crestpoint_rewrite_history"
const MAX_HISTORY_ITEMS = 10

// =====================================================
// BLOCK: Safe JSON Helpers
// =====================================================

function safeParseHistory(value: string | null): RewriteHistoryState {
  if (!value) {
    return { items: [] }
  }

  try {
    const parsed = JSON.parse(value) as RewriteHistoryState

    if (!parsed || !Array.isArray(parsed.items)) {
      return { items: [] }
    }

    return parsed
  } catch {
    return { items: [] }
  }
}

// =====================================================
// BLOCK: Browser Storage Helpers
// =====================================================

export function loadRewriteHistory(): RewriteHistoryState {
  if (typeof window === "undefined") {
    return { items: [] }
  }

  return safeParseHistory(window.localStorage.getItem(REWRITE_HISTORY_STORAGE_KEY))
}

export function saveRewriteHistory(state: RewriteHistoryState) {
  if (typeof window === "undefined") {
    return
  }

  window.localStorage.setItem(REWRITE_HISTORY_STORAGE_KEY, JSON.stringify(state))
}

export function clearRewriteHistory() {
  if (typeof window === "undefined") {
    return
  }

  window.localStorage.removeItem(REWRITE_HISTORY_STORAGE_KEY)
}

// =====================================================
// BLOCK: History Creation
// =====================================================

export function createRewriteHistoryItem({
  rewriteType,
  result,
  resumeBefore,
  resumeAfter,
}: {
  rewriteType: "summary" | "bullet"
  result: RewriteResult
  resumeBefore: ResumeBuilderFormData
  resumeAfter: ResumeBuilderFormData
}): RewriteHistoryItem {
  return {
    id: `rewrite-${Date.now()}`,
    createdAt: new Date().toISOString(),
    rewriteType,
    result,
    resumeBefore,
    resumeAfter,
  }
}

export function addRewriteHistoryItem(item: RewriteHistoryItem): RewriteHistoryState {
  const currentState = loadRewriteHistory()

  const nextState: RewriteHistoryState = {
    items: [item, ...currentState.items].slice(0, MAX_HISTORY_ITEMS),
  }

  saveRewriteHistory(nextState)

  return nextState
}
