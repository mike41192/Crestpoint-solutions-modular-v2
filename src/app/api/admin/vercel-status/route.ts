import { requireAdminUser } from "@/lib/security/admin-auth"

import {
  getMissingVercelEnvKeys,
  isVercelConfigured,
} from "@/lib/vercel/vercel-env"

export async function GET() {
  const admin = await requireAdminUser()

  if (!admin.ok) {
    return admin.response
  }

  return Response.json({
    configured: isVercelConfigured(),
    missingKeys: getMissingVercelEnvKeys(),
    checkedBy: admin.email,
    timestamp: new Date().toISOString(),
  })
}