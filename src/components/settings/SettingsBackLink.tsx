// =====================================================
// BLOCK: Next Imports
// =====================================================

import Link from "next/link"

// =====================================================
// BLOCK: Icon Imports
// =====================================================

import { ArrowLeft } from "lucide-react"

// =====================================================
// BLOCK: Settings Back Link
// =====================================================

export function SettingsBackLink() {
  return (
    <Link
      href="/dashboard/settings"
      className="inline-flex w-fit items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-black text-slate-700 shadow-sm transition hover:border-blue-200 hover:text-blue-700"
    >
      <ArrowLeft size={16} />
      Back to Settings
    </Link>
  )
}
