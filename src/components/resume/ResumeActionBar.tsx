"use client"

import { motion } from "framer-motion"
import {
  CheckCircle2,
  Clock,
  Download,
  FileText,
  RotateCcw,
  Save,
  Trash2,
} from "lucide-react"

type ResumeActionBarProps = {
  title: string
  status: string
  hasUnsavedChanges: boolean
  onSaveLocal: () => void
  onClearLocal: () => void
  onSaveServer: () => void
  onLoadServer: () => void
  onExport: () => void
}

export function ResumeActionBar({
  title,
  status,
  hasUnsavedChanges,
  onClearLocal,
  onSaveServer,
  onLoadServer,
  onExport,
}: ResumeActionBarProps) {
  return (
    <section className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
      <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 px-5 py-6 text-white sm:px-7">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
          <div className="min-w-0">
            <div className="mb-3 flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-blue-100">
              <FileText size={14} />
              Resume Workspace
            </div>

            <h1 className="truncate text-2xl font-black tracking-tight sm:text-3xl">
              {title}
            </h1>

            <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-slate-200">
              <span
                className={`inline-flex items-center gap-1 rounded-full px-3 py-1 font-bold ${
                  hasUnsavedChanges
                    ? "bg-amber-400/15 text-amber-200"
                    : "bg-emerald-400/15 text-emerald-200"
                }`}
              >
                {hasUnsavedChanges ? (
                  <Clock size={14} />
                ) : (
                  <CheckCircle2 size={14} />
                )}
                {hasUnsavedChanges ? "Unsaved Changes" : status}
              </span>

              <span className="hidden text-slate-400 sm:inline">•</span>

              <span className="text-slate-300">
                Edit, preview, save, and export from one clean workspace.
              </span>
            </div>
          </div>

          <div className="grid gap-2 sm:grid-cols-2 xl:flex xl:items-center">
            <HeaderButton
              icon={Save}
              label="Save"
              onClick={onSaveServer}
              variant="secondary"
            />

            <HeaderButton
              icon={Download}
              label="Export Resume"
              onClick={onExport}
              variant="primary"
            />

            <HeaderButton
              icon={RotateCcw}
              label="Load"
              onClick={onLoadServer}
              variant="secondary"
            />

            <HeaderButton
              icon={Trash2}
              label="Clear"
              onClick={onClearLocal}
              variant="danger"
            />
          </div>
        </div>
      </div>
    </section>
  )
}

type HeaderButtonProps = {
  label: string
  onClick: () => void
  icon: React.ComponentType<{ size?: number }>
  variant: "primary" | "secondary" | "danger"
}

function HeaderButton({
  label,
  onClick,
  icon: Icon,
  variant,
}: HeaderButtonProps) {
  const className =
    variant === "primary"
      ? "bg-blue-500 text-white shadow-lg shadow-blue-950/30 hover:bg-blue-400"
      : variant === "danger"
        ? "border border-red-300/30 bg-red-500/15 text-red-100 hover:bg-red-500/25"
        : "border border-white/15 bg-white/10 text-white hover:bg-white/15"

  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.97 }}
      className={`inline-flex w-full items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-extrabold transition xl:w-auto ${className}`}
    >
      <Icon size={16} />
      {label}
    </motion.button>
  )
}
