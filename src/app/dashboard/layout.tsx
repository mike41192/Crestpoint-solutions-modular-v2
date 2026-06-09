// =====================================================
// BLOCK: React / Next Imports
// =====================================================

import type { ReactNode } from "react"
import { redirect } from "next/navigation"

// =====================================================
// BLOCK: Supabase Server Imports
// =====================================================

import { createSupabaseServerClient } from "@/lib/supabase/server"

// =====================================================
// BLOCK: Dashboard Layout Types
// =====================================================

type DashboardLayoutProps = {
  children: ReactNode
}

// =====================================================
// BLOCK: Dashboard Server Auth Guard
// =====================================================

export default async function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  const supabase = await createSupabaseServerClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/auth/login")
  }

  const { data: aalData } =
    await supabase.auth.mfa.getAuthenticatorAssuranceLevel()

  if (
    aalData?.nextLevel === "aal2" &&
    aalData.currentLevel !== aalData.nextLevel
  ) {
    redirect("/mfa?redirectTo=/dashboard")
  }

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    redirect("/auth/login")
  }

  return <>{children}</>
}
