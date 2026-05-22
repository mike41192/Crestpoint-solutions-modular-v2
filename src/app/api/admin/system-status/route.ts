import {
  getMissingOpenAIEnvKeys,
  isOpenAIConfigured,
} from "@/lib/ai/openai-env"
import {
  getMissingAppEnvKeys,
  isAppEnvConfigured,
} from "@/lib/config/app-env"
import {
  getMissingGitHubEnvKeys,
  isGitHubConfigured,
} from "@/lib/github/github-env"
import {
  getMissingStripeEnvKeys,
  isStripeConfigured,
} from "@/lib/stripe/stripe-env"
import {
  getMissingSupabaseEnvKeys,
  isSupabaseConfigured,
} from "@/lib/supabase/supabase-env"
import {
  getMissingVercelEnvKeys,
  isVercelConfigured,
} from "@/lib/vercel/vercel-env"

export async function GET() {
  return Response.json({
    app: {
      configured: isAppEnvConfigured(),
      missingKeys: getMissingAppEnvKeys(),
    },
    supabase: {
      configured: isSupabaseConfigured(),
      missingKeys: getMissingSupabaseEnvKeys(),
    },
    stripe: {
      configured: isStripeConfigured(),
      missingKeys: getMissingStripeEnvKeys(),
    },
    openai: {
      configured: isOpenAIConfigured(),
      missingKeys: getMissingOpenAIEnvKeys(),
    },
    vercel: {
      configured: isVercelConfigured(),
      missingKeys: getMissingVercelEnvKeys(),
    },
    github: {
      configured: isGitHubConfigured(),
      missingKeys: getMissingGitHubEnvKeys(),
    },
    timestamp: new Date().toISOString(),
  })
}