"use client"

// =====================================================
// BLOCK: React / Animation Imports
// =====================================================

import { motion } from "framer-motion"

// =====================================================
// BLOCK: Type Imports
// =====================================================

import type { ComponentType, ReactNode } from "react"

// =====================================================
// BLOCK: Component Types
// =====================================================

type WorkspaceCardProps = {
  icon: ComponentType<{ size?: number }>
  title: string
  description?: string
  children: ReactNode
}

// =====================================================
// BLOCK: Workspace Card Component
// =====================================================

export function WorkspaceCard({
  icon: Icon,
  title,
  description,
  children,
}: WorkspaceCardProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5"
    >
      {/* =====================================================
          BLOCK: Card Header
      ===================================================== */}

      <div className="mb-4 flex items-start gap-3 border-b border-slate-100 pb-4">
        <div className="rounded-2xl bg-blue-50 p-2 text-blue-700">
          <Icon size={18} />
        </div>

        <div>
          <h2 className="text-lg font-black text-slate-950">{title}</h2>

          {description && (
            <p className="mt-1 text-sm leading-6 text-slate-500">
              {description}
            </p>
          )}
        </div>
      </div>

      {/* =====================================================
          BLOCK: Card Content
      ===================================================== */}

      {children}
    </motion.section>
  )
}
