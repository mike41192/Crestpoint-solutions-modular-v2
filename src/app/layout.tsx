import "./globals.css"
import type { Metadata } from "next"
import type { ReactNode } from "react"

export const metadata: Metadata = {
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
      <body className="bg-slate-100 text-slate-950 antialiased">
        {children}
      </body>
    </html>
  )
}
