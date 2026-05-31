"use client"

// =====================================================
// BLOCK: Imports
// =====================================================

import { History, RotateCcw, Trash2 } from "lucide-react"
import type { ResumeBuilderFormData } from "@/modules/resume-builder"
import type { RewriteHistoryItem } from "@/modules/rewrite-history"

// =====================================================
// BLOCK: Component Types
// =====================================================

type ResumeRewriteHistoryPanelProps = {
  items: RewriteHistoryItem[]
  onRestore: (resume: ResumeBuilderFormData) => void
  onClear: () => void
}

// =====================================================
// BLOCK: Helpers
// =====================================================

function formatDate(value: string) {
  try {
    return new Date(value).toLocaleString()
  } catch {
    return value
  }
}

// =====================================================
// BLOCK: Component
// =====================================================

export function ResumeRewriteHistoryPanel({
  items,
  onRestore,
  onClear,
}: ResumeRewriteHistoryPanelProps) {
  return (
    <section className="grid gap-4 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="rounded-2xl bg-slate-100 p-2 text-slate-700">
            <History size={18} />
          </div>

          <div>
            <h3 className="text-lg font-black text-slate-950">
              Rewrite History
            </h3>

            <p className="mt-1 text-sm leading-6 text-slate-500">
              Restore a previous resume state if a rewrite does not improve the
              result.
            </p>
          </div>
        </div>

        {items.length > 0 && (
          <button
            type="button"
            onClick={onClear}
            className="inline-flex items-center gap-2 rounded-2xl border border-red-200 bg-red-50 px-4 py-2 text-sm font-black text-red-700 transition hover:bg-red-100"
          >
            <Trash2 size={15} />
            Clear History
          </button>
        )}
      </div>

      {items.length > 0 ? (
        <div className="grid gap-3">
          {items.map((item) => (
            <article
              key={item.id}
              className="rounded-3xl border border-slate-200 bg-slate-50 p-4"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-500">
                    {item.rewriteType} rewrite
                  </p>

                  <p className="mt-1 text-sm font-bold text-slate-700">
                    {formatDate(item.createdAt)}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => onRestore(item.resumeBefore)}
                  className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-4 py-2 text-sm font-black text-white transition hover:bg-slate-700"
                >
                  <RotateCcw size={15} />
                  Restore Before
                </button>
              </div>

              <div className="mt-4 grid gap-3 lg:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 bg-white p-3">
                  <p className="text-xs font-black uppercase tracking-[0.14em] text-slate-500">
                    Before
                  </p>

                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {item.result.originalText || "No previous text found."}
                  </p>
                </div>

                <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-3">
                  <p className="text-xs font-black uppercase tracking-[0.14em] text-emerald-700">
                    After
                  </p>

                  <p className="mt-2 text-sm leading-6 text-emerald-800">
                    {item.result.rewrittenText}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <p className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm font-semibold text-slate-500">
          No rewrite history yet.
        </p>
      )}
    </section>
  )
}
