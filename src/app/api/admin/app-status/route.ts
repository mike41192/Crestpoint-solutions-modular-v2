import {
  getMissingAppEnvKeys,
  isAppEnvConfigured,
} from "@/lib/config/app-env"

export async function GET() {
  const configured = isAppEnvConfigured()
  const missingKeys = getMissingAppEnvKeys()

  return Response.json({
    configured,
    missingKeys,
    timestamp: new Date().toISOString(),
  })
}