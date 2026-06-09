"use client"

// =====================================================
// BLOCK: Next Imports
// =====================================================

import Link from "next/link"
import { usePathname } from "next/navigation"

// =====================================================
// BLOCK: Icon Imports
// =====================================================

import {
  Bell,
  CreditCard,
  LayoutDashboard,
  Lock,
  UserRound,
} from "lucide-react"

// =====================================================
// BLOCK: Navigation Items
// =====================================================

const items = [
  {
    label: "Overview",
    href: "/dashboard/settings",
    icon: LayoutDashboard,
  },
  {
    label: "Profile",
    href: "/dashboard/settings/profile",
    icon: UserRound,
  },
  {
    label: "Membership",
    href: "/dashboard/settings/billing",
    icon: CreditCard,
  },
  {
    label: "Preferences",
    href: "/dashboard/settings/preferences",
    icon: Bell,
  },
  {
    label: "Security",
    href: "/dashboard/settings/security",
    icon: Lock,
  },
]

// =====================================================
// BLOCK: Settings Navigation
// =====================================================

export function SettingsSidebar() {
  const pathname = usePathname()

  return (
    <nav className="rounded-[28px] border border-slate-200 bg-white p-3 shadow-sm">
      <div className="grid gap-2 md:grid-cols-5">
        {items.map((item) => {
          const Icon = item.icon
          const active =
            item.href === "/dashboard/settings"
              ? pathname === item.href
              : pathname === item.href || pathname.startsWith(`${item.href}/`)

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center justify-center gap-2 rounded-2xl border px-4 py-3 text-sm font-black transition ${
                active
                  ? "border-blue-200 bg-blue-50 text-blue-700"
                  : "border-transparent text-slate-600 hover:border-slate-200 hover:bg-slate-50 hover:text-slate-950"
              }`}
            >
              <Icon size={16} />
              {item.label}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
