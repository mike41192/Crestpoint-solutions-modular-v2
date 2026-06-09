"use client"

// =====================================================
// BLOCK: React Imports
// Crestpoint Solutions V2
// Version: 1.10.0
// =====================================================

import { useState } from "react"

// =====================================================
// BLOCK: Icon Imports
// =====================================================

import { ChevronDown, GraduationCap } from "lucide-react"

// =====================================================
// BLOCK: Tutorial Content Imports
// =====================================================

import { tutorialContent } from "@/data/tutorial-content"

// =====================================================
// BLOCK: Component Types
// =====================================================

type FirstUseTutorialProps = {
  moduleKey: string
}

// =====================================================
// BLOCK: First Use Tutorial
// =====================================================

export function FirstUseTutorial({ moduleKey }: FirstUseTutorialProps) {
  const [open, setOpen] = useState(false)

  const tutorial = tutorialContent.find((item) => item.moduleKey === moduleKey)

  const title = tutorial?.title || "Quick Guide"
  const intro =
    tutorial?.intro || "Use this workspace to complete the module step by step."
  const steps =
    tutorial?.steps.map((step) => {
      return `${step.title}: ${step.description}`
    }) || ["Use this workspace to complete the module step by step."]

  return (
    <section className="overflow-hidden rounded-[28px] border border-blue-100 bg-white shadow-sm">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="flex w-full items-center justify-between gap-4 bg-blue-50/70 p-5 text-left transition hover:bg-blue-50"
      >
        <div className="flex min-w-0 items-start gap-3">
          <div className="rounded-2xl bg-white p-3 text-blue-700 shadow-sm">
            <GraduationCap size={20} />
          </div>

          <div className="min-w-0">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-blue-700">
              First-Time Help
            </p>

            <h2 className="mt-1 text-lg font-black text-slate-950">{title}</h2>

            <p className="mt-1 max-w-3xl text-sm leading-6 text-slate-600">
              {intro}
            </p>
          </div>
        </div>

        <div className="hidden shrink-0 items-center gap-2 rounded-full border border-blue-100 bg-white px-4 py-2 text-sm font-black text-blue-700 shadow-sm sm:inline-flex">
          {open ? "Hide" : "Show"} Guide
          <ChevronDown
            size={16}
            className={`transition ${open ? "rotate-180" : ""}`}
          />
        </div>
      </button>

      {open && (
        <div className="grid gap-3 border-t border-blue-100 p-5">
          {steps.map((step, index) => (
            <div
              key={`${moduleKey}-${index}`}
              className="flex gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4"
            >
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-600 text-xs font-black text-white">
                {index + 1}
              </span>

              <p className="text-sm font-semibold leading-6 text-slate-700">
                {step}
              </p>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
