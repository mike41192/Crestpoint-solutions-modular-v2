"use client"

// =====================================================
// BLOCK: React / Next Imports
// Crestpoint Solutions V2
// Version: 1.8.3
// =====================================================

import type { ReactNode } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

// =====================================================
// BLOCK: Icon Imports
// =====================================================

import {
  BarChart3,
  BriefcaseBusiness,
  ClipboardList,
  CreditCard,
  FileText,
  FolderOpen,
  GraduationCap,
  Home,
  MessageSquare,
  Settings,
  Target,
  Users,
} from "lucide-react"

// =====================================================
// BLOCK: Auth Imports
// =====================================================

import { LogoutButton } from "@/components/auth/LogoutButton"

// =====================================================
// BLOCK: Component Types
// =====================================================

type ModulePageLayoutProps = {
  title: string
  description: string
  children?: ReactNode
}

// =====================================================
// BLOCK: Navigation Config
// =====================================================

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: Home },
  { label: "Resume Builder", href: "/dashboard/resume", icon: FileText },
  { label: "Resume Library", href: "/dashboard/resumes", icon: FolderOpen },
  {
    label: "Job Descriptions",
    href: "/dashboard/job-descriptions",
    icon: ClipboardList,
  },
  { label: "ATS Scoring", href: "/dashboard/ats", icon: Target },
  { label: "AI Interviewer", href: "/dashboard/interview", icon: MessageSquare },
  {
    label: "Interview Academy",
    href: "/dashboard/interview-academy",
    icon: GraduationCap,
  },
  { label: "Job Tracker", href: "/dashboard/jobs", icon: BriefcaseBusiness },
  { label: "Contacts", href: "/dashboard/contacts", icon: Users },
  { label: "LinkedIn Tools", href: "/dashboard/linkedin", icon: Users },
  { label: "Networking", href: "/dashboard/networking", icon: Users },
  { label: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
  { label: "Billing", href: "/dashboard/billing", icon: CreditCard },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
]

// =====================================================
// BLOCK: Module Page Layout Component
// =====================================================

export function ModulePageLayout({
  title,
  description,
  children,
}: ModulePageLayoutProps) {
  const pathname = usePathname()

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="mx-auto grid w-full max-w-[1700px] gap-6 px-3 py-5 sm:px-4 lg:grid-cols-[280px_minmax(0,1fr)] xl:px-6">
        <aside className="hidden lg:block">
          <div className="sticky top-5 rounded-[28px] border border-slate-200 bg-white p-4 shadow-sm">
            <div className="mb-5 rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 p-5 text-white">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 backdrop-blur">
                  <span className="text-xl font-black text-blue-300">C</span>
                </div>

                <div>
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-blue-200">
                    Crestpoint
                  </p>

                  <h2 className="text-xl font-black">Career OS</h2>
                </div>
              </div>

              <p className="mt-4 text-sm leading-6 text-slate-300">
                Resume, interview, job search, and career growth tools.
              </p>
            </div>

            <nav className="grid gap-1">
              {navItems.map((item) => {
                const Icon = item.icon

                const active =
                  pathname === item.href ||
                  (item.href !== "/dashboard" && pathname.startsWith(item.href))

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-extrabold transition ${
                      active
                        ? "border border-blue-200 bg-blue-50 text-blue-700"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-950"
                    }`}
                  >
                    <Icon size={17} />
                    {item.label}
                  </Link>
                )
              })}
            </nav>

            <div className="mt-5 border-t border-slate-200 pt-4">
              <LogoutButton />
            </div>
          </div>
        </aside>

        <main className="min-w-0">
          <header className="mb-6 rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-blue-600">
                  Crestpoint Solutions
                </p>

                <h1 className="mt-2 text-2xl font-black tracking-tight text-slate-950 sm:text-4xl">
                  {title}
                </h1>

                <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-500 sm:text-base">
                  {description}
                </p>
              </div>

              <div className="hidden lg:block">
                <LogoutButton />
              </div>
            </div>

            <div className="mt-5 grid gap-2 sm:grid-cols-2 lg:hidden">
              {navItems.slice(0, 7).map((item) => {
                const Icon = item.icon

                const active =
                  pathname === item.href ||
                  (item.href !== "/dashboard" && pathname.startsWith(item.href))

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center justify-center gap-2 rounded-2xl border px-3 py-3 text-sm font-extrabold ${
                      active
                        ? "border-blue-200 bg-blue-50 text-blue-700"
                        : "border-slate-200 bg-slate-50 text-slate-600"
                    }`}
                  >
                    <Icon size={16} />
                    {item.label}
                  </Link>
                )
              })}

              <div className="sm:col-span-2">
                <LogoutButton />
              </div>
            </div>
          </header>

          {children}
        </main>
      </div>
    </div>
  )
}
