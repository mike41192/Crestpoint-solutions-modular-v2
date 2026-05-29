"use client"

import { ReactNode } from "react"

type ResumeBuilderShellProps = {
  title?: string
  subtitle?: string
  sidebar: ReactNode
  editor: ReactNode
  preview: ReactNode
}

export default function ResumeBuilderShell({
  title = "Resume Builder",
  subtitle = "Edit, preview, save, and export your resume.",
  sidebar,
  editor,
  preview,
}: ResumeBuilderShellProps) {
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        <header className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h1 className="text-2xl font-bold text-slate-950 sm:text-3xl">{title}</h1>
          <p className="mt-2 text-sm text-slate-600 sm:text-base">{subtitle}</p>
        </header>

        <div className="grid gap-6 lg:grid-cols-[260px_minmax(0,1fr)] xl:grid-cols-[280px_minmax(0,1fr)_420px]">
          <aside className="order-1 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm lg:sticky lg:top-6 lg:h-fit">
            {sidebar}
          </aside>

          <section className="order-2 min-w-0 space-y-4">{editor}</section>

          <section className="order-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm xl:sticky xl:top-6 xl:h-fit">
            {preview}
          </section>
        </div>
      </div>
    </main>
  )
}
