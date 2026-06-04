"use client"

// =====================================================
// BLOCK: React Imports
// =====================================================

import { useState } from "react"

// =====================================================
// BLOCK: Supabase Imports
// =====================================================

import { createSupabaseBrowserClient } from "@/lib/supabase/client"

// =====================================================
// BLOCK: Logout Button Component
// =====================================================

export function LogoutButton() {
  const [loading, setLoading] = useState(false)
  const supabase = createSupabaseBrowserClient()

  async function handleLogout() {
    setLoading(true)

    await supabase.auth.signOut()

    window.location.href = "/auth/login"
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={loading}
      className="rounded-2xl border border-red-200 bg-red-50 px-4 py-2 text-sm font-black text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {loading ? "Logging out..." : "Log out"}
    </button>
  )
}
