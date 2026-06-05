// =====================================================
// BLOCK: Type Imports
// =====================================================

import type { ReactNode } from "react"

// =====================================================
// BLOCK: Settings Card
// =====================================================

type SettingsCardProps = {
  children: ReactNode
}

export function SettingsCard({
  children,
}: SettingsCardProps) {
  return (
    <div
      className="
      rounded-3xl
      border
      border-slate-200
      bg-white
      p-5
      shadow-sm
      "
    >
      {children}
    </div>
  )
}