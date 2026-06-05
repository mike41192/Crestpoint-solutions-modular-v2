// =====================================================
// BLOCK: Type Imports
// =====================================================

import type { ReactNode } from "react"

// =====================================================
// BLOCK: Settings Section
// =====================================================

type SettingsSectionProps = {
  title: string
  description?: string
  children: ReactNode
}

export function SettingsSection({
  title,
  description,
  children,
}: SettingsSectionProps) {
  return (
    <section className="grid gap-4">
      <div>
        <h3 className="text-lg font-black text-slate-950">
          {title}
        </h3>

        {description && (
          <p className="mt-2 text-sm leading-6 text-slate-500">
            {description}
          </p>
        )}
      </div>

      {children}
    </section>
  )
}