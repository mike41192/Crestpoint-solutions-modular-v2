"use client"

// =====================================================
// BLOCK: Next Imports
// =====================================================

import Link from "next/link"
import { usePathname } from "next/navigation"

// =====================================================
// BLOCK: Navigation Items
// =====================================================

const items = [
  {
    label: "Profile",
    href: "/dashboard/settings/profile",
  },
  {
    label: "Membership",
    href: "/dashboard/settings/billing",
  },
  {
    label: "Preferences",
    href: "/dashboard/settings/preferences",
  },
  {
    label: "Security",
    href: "/dashboard/settings/security",
  },
]

// =====================================================
// BLOCK: Settings Sidebar
// =====================================================

export function SettingsSidebar() {
  const pathname = usePathname()

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="grid gap-2">
        {items.map((item) => {
          const active =
            pathname === item.href

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-2xl px-4 py-3 text-sm font-black transition ${
                active
                  ? "bg-blue-50 text-blue-700"
                  : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              {item.label}
            </Link>
          )
        })}
      </div>
    </div>
  )
}