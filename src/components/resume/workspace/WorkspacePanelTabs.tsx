"use client"

// =====================================================
// BLOCK: Animation Imports
// =====================================================

import { motion } from "framer-motion"

// =====================================================
// BLOCK: Type Imports
// =====================================================

import type { ComponentType } from "react"

// =====================================================
// BLOCK: Component Types
// =====================================================

export type WorkspacePanelId =
  | "editor"
  | "preview"
  | "health"
  | "versions"
  | "import"
  | "optimize"
  | "match"

export type WorkspacePanelTab = {
  id: WorkspacePanelId
  label: string
  icon: ComponentType<{ size?: number }>
}

type WorkspacePanelTabsProps = {
  panels: readonly WorkspacePanelTab[]
  activePanel: WorkspacePanelId
  onPanelChange: (panel: WorkspacePanelId) => void
}

// =====================================================
// BLOCK: Workspace Panel Tabs Component
// =====================================================

export function WorkspacePanelTabs({
  panels,
  activePanel,
  onPanelChange,
}: WorkspacePanelTabsProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
      <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-7">
        {panels.map((panel) => {
          const Icon = panel.icon
          const active = activePanel === panel.id

          return (
            <motion.button
              key={panel.id}
              type="button"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onPanelChange(panel.id)}
              className={`flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-extrabold transition ${
                active
                  ? "border-blue-600 bg-blue-50 text-blue-700"
                  : "border-slate-200 bg-slate-50 text-slate-600 hover:bg-white"
              }`}
            >
              <Icon size={16} />
              {panel.label}
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}
