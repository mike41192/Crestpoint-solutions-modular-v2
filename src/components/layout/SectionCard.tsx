import type { ReactNode } from "react"

type SectionCardProps = {
  children: ReactNode
}

export function SectionCard({ children }: SectionCardProps) {
  return (
    <div
      style={{
        border: "1px solid #e2e8f0",
        borderRadius: "16px",
        padding: "20px",
        background: "#ffffff",
      }}
    >
      {children}
    </div>
  )
}