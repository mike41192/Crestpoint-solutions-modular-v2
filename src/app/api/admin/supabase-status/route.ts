import {
  getMissingSupabaseEnvKeys,
  isSupabaseConfigured,
} from "@/lib/supabase/supabase-env"

export async function GET() {
  const configured = isSupabaseConfigured()
  const missingKeys = getMissingSupabaseEnvKeys()

  return Response.json({
    configured,
    missingKeys,
    timestamp: new Date().toISOString(),
  })
}