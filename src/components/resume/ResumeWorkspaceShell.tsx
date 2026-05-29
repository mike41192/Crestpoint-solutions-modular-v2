import type { ReactNode } from "react"

type ResumeWorkspaceShellProps = {
  header: ReactNode
  editor: ReactNode
  preview: ReactNode
}

export function ResumeWorkspaceShell({
  header,
  editor,
  preview,
}: ResumeWorkspaceShellProps) {
  return (
    <div className="mx-auto grid w-full max-w-[1500px] gap-6">
      <div className="w-full min-w-0">{header}</div>

      <div className="grid w-full min-w-0 gap-6 xl:grid-cols-[minmax(0,1fr)_460px] 2xl:grid-cols-[minmax(0,1fr)_500px]">
        <main className="min-w-0 rounded-[28px] border border-slate-200 bg-white/80 p-4 shadow-sm backdrop-blur sm:p-5">
          {editor}
        </main>

        <aside className="min-w-0 xl:sticky xl:top-6 xl:h-[calc(100vh-3rem)] xl:overflow-y-auto xl:rounded-[28px] xl:border xl:border-slate-200 xl:bg-white xl:p-4 xl:shadow-sm">
          {preview}
        </aside>
      </div>
    </div>
  )
}
