import "./globals.css"
import type { ReactNode } from "react"

export const metadata = {
  title: "Crestpoint Solutions",
  description: "Crestpoint Modular V2 Career Operating System",
}

export default function RootLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}