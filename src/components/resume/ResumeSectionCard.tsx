"use client"

import { ReactNode, useState } from "react"

type ResumeSectionCardProps = {
  title: string
  description?: string
  defaultOpen?: boolean
  children: ReactNode
}

export default function ResumeSectionCard({
  title,
  description,
  defaultOpen = false,
  children,
}: ResumeSectionCardProps) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
      >
        <div>
          <h3 className="text-base font-semibold text-slate-900">{title}</h3>
          {description ? (
            <p className="mt-1 text-sm text-slate-500">{description}</p>
          ) : null}
        </div>

        <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700">
          {open ? "Collapse" : "Expand"}
        </span>
      </button>

      {open ? <div className="border-t border-slate-100 p-5">{children}</div> : null}
    </section>
  )
}
