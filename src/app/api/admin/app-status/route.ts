// =====================================================
// BLOCK: Admin Security Imports
// =====================================================

import { requireAdminUser } from "@/lib/security/admin-auth"

// =====================================================
// BLOCK: App Environment Imports
// =====================================================

import {
  getMissingAppEnvKeys,
  isAppEnvConfigured,
} from "@/lib/config/app-env"

// =====================================================
// BLOCK: Admin App Status Route
// =====================================================

export async function GET() {
  const admin = await requireAdminUser()

  if (admin.ok === false) {
    return admin.response
  }

  const configured = isAppEnvConfigured()
  const missingKeys = getMissingAppEnvKeys()

  return Response.json({
    status: "success",
    configured,
    missingKeys,
    checkedBy: admin.email,
    timestamp: new Date().toISOString(),
  })
}
