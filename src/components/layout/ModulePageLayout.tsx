import type { ReactNode } from "react"
import { PageHeader } from "@/components/layout/PageHeader"

type ModulePageLayoutProps = {
  title: string
  description: string
  children?: ReactNode
}

export function ModulePageLayout({
  title,
  description,
  children,
}: ModulePageLayoutProps) {
  return (
    <main style={{ padding: "32px" }}>
      <PageHeader title={title} description={description} />

      {children}
    </main>
  )
}