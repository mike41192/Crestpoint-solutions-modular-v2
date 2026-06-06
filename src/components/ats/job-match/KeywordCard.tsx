"use client"

// =====================================================
// BLOCK: Component Types
// Crestpoint Solutions V2
// Version: 1.8.5
// =====================================================

type KeywordCardProps = {
  title: string
  keywords: string[]
  empty: string
  tone: "green" | "red"
}

// =====================================================
// BLOCK: Keyword Card Component
// =====================================================

export function KeywordCard({
  title,
  keywords,
  empty,
  tone,
}: KeywordCardProps) {
  const classes =
    tone === "green"
      ? "border-emerald-100 bg-emerald-50 text-emerald-700"
      : "border-red-100 bg-red-50 text-red-700"

  return (
    <div className="min-w-0 rounded-3xl border border-slate-200 bg-slate-50 p-4">
      <p className="text-sm font-black text-slate-800">{title}</p>

      <div className="mt-3 flex flex-wrap gap-2">
        {keywords.length > 0 ? (
          keywords.slice(0, 40).map((keyword) => (
            <span
              key={keyword}
              className={`rounded-full border px-3 py-1 text-xs font-black ${classes}`}
            >
              {keyword}
            </span>
          ))
        ) : (
          <p className="text-sm text-slate-500">{empty}</p>
        )}
      </div>
    </div>
  )
}
