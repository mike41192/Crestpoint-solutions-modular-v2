import type {
  StripeBillingInterval,
  StripeBillingTier,
} from "@/lib/stripe/stripe-env"

export type BillingActionStatus =
  | "idle"
  | "loading"
  | "success"
  | "error"
  | "not_configured"

export type BillingActionResult = {
  status: BillingActionStatus
  message: string
}

export type CheckoutRequest = {
  tier: StripeBillingTier
  interval: StripeBillingInterval
}
