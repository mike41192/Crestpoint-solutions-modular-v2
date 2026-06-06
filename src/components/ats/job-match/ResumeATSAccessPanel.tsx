"use client"

// =====================================================
// BLOCK: Component Types
// Crestpoint Solutions V2
// Version: 1.8.5
// =====================================================

type ResumeATSAccessPanelProps = {
  loadingAccess: boolean
  scanLoading: boolean
  atsLimitText: string
  accessAllowed: boolean
  onRunATSAnalysis: () => void
}

// =====================================================
// BLOCK: Resume ATS Access Panel Component
// =====================================================

export function ResumeATSAccessPanel({
  loadingAccess,
  scanLoading,
  atsLimitText,
  accessAllowed,
  onRunATSAnalysis,
}: ResumeATSAccessPanelProps) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-violet-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-sm font-black text-slate-950">
          {loadingAccess ? "Loading ATS access..." : atsLimitText}
        </p>

        <p className="mt-1 text-xs font-semibold text-slate-500">
          Click Run ATS Analysis to refresh scoring and count usage.
        </p>
      </div>

      <button
        type="button"
        onClick={onRunATSAnalysis}
        disabled={scanLoading || loadingAccess || !accessAllowed}
        className="w-fit rounded-full bg-violet-600 px-5 py-3 text-sm font-black text-white shadow-sm transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:bg-slate-400"
      >
        {scanLoading ? "Running..." : "Run ATS Analysis"}
      </button>
    </div>
  )
}
