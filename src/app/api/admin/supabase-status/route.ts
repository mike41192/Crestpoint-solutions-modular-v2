import { requireAdminUser } from "@/lib/security/admin-auth"

import {
  getMissingSupabaseEnvKeys,
  isSupabaseConfigured,
} from "@/lib/supabase/supabase-env"

export async function GET() {
  const admin = await requireAdminUser()

  if (!admin.ok) {
    return admin.response
  }

  return Response.json({
    configured: isSupabaseConfigured(),
    missingKeys: getMissingSupabaseEnvKeys(),
    checkedBy: admin.email,
    timestamp: new Date().toISOString(),
  })
}
