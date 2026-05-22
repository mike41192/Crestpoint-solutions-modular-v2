import {
  getMissingVercelEnvKeys,
  isVercelConfigured,
} from "@/lib/vercel/vercel-env"

export async function GET() {
  const configured = isVercelConfigured()
  const missingKeys = getMissingVercelEnvKeys()

  return Response.json({
    configured,
    missingKeys,
    timestamp: new Date().toISOString(),
  })
}