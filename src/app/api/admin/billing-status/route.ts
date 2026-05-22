import {
  getMissingStripeEnvKeys,
  isStripeConfigured,
} from "@/lib/stripe/stripe-env"

export async function GET() {
  const configured = isStripeConfigured()
  const missingKeys = getMissingStripeEnvKeys()

  return Response.json({
    configured,
    missingKeys,
    timestamp: new Date().toISOString(),
  })
}