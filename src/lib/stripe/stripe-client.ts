import Stripe from "stripe"

import {
  getStripeSecretKey,
  isStripeSecretKeyFormatValid,
} from "@/lib/stripe/stripe-env"

let stripeClient: Stripe | null = null

export function getStripeClient() {
  const secretKey = getStripeSecretKey()

  if (!secretKey) {
    throw new Error("Stripe secret key is not configured.")
  }

  if (!isStripeSecretKeyFormatValid()) {
    throw new Error("Stripe secret key must start with sk_.")
  }

  if (!stripeClient) {
    stripeClient = new Stripe(secretKey, {
      typescript: true,
    })
  }

  return stripeClient
}
