const requiredSupabaseEnvKeys = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  "SUPABASE_SERVICE_ROLE_KEY",
] as const

export function getMissingSupabaseEnvKeys() {
  return requiredSupabaseEnvKeys.filter((key) => !process.env[key])
}

export function isSupabaseConfigured() {
  return getMissingSupabaseEnvKeys().length === 0
}