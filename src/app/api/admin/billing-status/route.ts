import { requireAdminUser } from "@/lib/security/admin-auth"

import {
  getMissingStripeEnvKeys,
  isStripeConfigured,
} from "@/lib/stripe/stripe-env"

export async function GET() {
  const admin = await requireAdminUser()

  if (admin.ok === false) {
    return admin.response
  }

  return Response.json({
    status: "success",
    configured: isStripeConfigured(),
    missingKeys: getMissingStripeEnvKeys(),
    checkedBy: admin.email,
    timestamp: new Date().toISOString(),
  })
}
