// =====================================================
// BLOCK: Type Imports
// =====================================================

import type { ReactNode } from "react"

// =====================================================
// BLOCK: Settings Imports
// =====================================================

import { SettingsSidebar } from "@/components/settings/SettingsSidebar"

// =====================================================
// BLOCK: Component Types
// =====================================================

type SettingsPageShellProps = {
  eyebrow: string
  title: string
  description: string
  children: ReactNode
}

// =====================================================
// BLOCK: Settings Page Shell
// =====================================================

export function SettingsPageShell({
  eyebrow,
  title,
  description,
  children,
}: SettingsPageShellProps) {
  return (
    <div className="grid gap-5">
      <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-blue-600">
              {eyebrow}
            </p>

            <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">
              {title}
            </h2>

            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-500">
              {description}
            </p>
          </div>

          <div className="rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm font-black text-blue-700">
            Settings
          </div>
        </div>
      </section>

      <SettingsSidebar />

      {children}
    </div>
  )
}
