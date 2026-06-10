import { createSupabaseServerClient } from "@/lib/supabase/server"
import {
  getStripeBillingEnvStatus,
  getStripePriceEnvKey,
  getStripePriceId,
  isStripeBillingInterval,
  isStripeBillingTier,
} from "@/lib/stripe/stripe-env"
import { getStripeClient } from "@/lib/stripe/stripe-client"
import { getStripeReturnBaseUrl } from "@/lib/stripe/stripe-urls"

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}))
    const tier = body?.tier
    const interval = body?.interval || "monthly"

    if (!isStripeBillingTier(tier)) {
      return Response.json(
        {
          status: "error",
          message:
            "A paid billing tier is required. Use starter, pro, premium, or business.",
        },
        { status: 400 },
      )
    }

    if (!isStripeBillingInterval(interval)) {
      return Response.json(
        {
          status: "error",
          message: "Billing interval must be monthly or yearly.",
        },
        { status: 400 },
      )
    }

    const priceId = getStripePriceId(tier, interval)
    const priceEnvKey = getStripePriceEnvKey(tier, interval)

    if (!priceId) {
      return Response.json(
        {
          status: "not_configured",
          message: `Stripe checkout cannot start until ${priceEnvKey} is set.`,
          missingKey: priceEnvKey,
        },
        { status: 503 },
      )
    }

    const supabase = await createSupabaseServerClient()
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return Response.json(
        {
          status: "unauthorized",
          message: "You must be signed in to start checkout.",
        },
        { status: 401 },
      )
    }

    const stripe = getStripeClient()
    const baseUrl = getStripeReturnBaseUrl(request)
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      customer_email: user.email || undefined,
      client_reference_id: user.id,
      metadata: {
        userId: user.id,
        tier,
        interval,
      },
      subscription_data: {
        metadata: {
          userId: user.id,
          tier,
          interval,
        },
      },
      success_url: `${baseUrl}/dashboard/billing?checkout=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/dashboard/billing?checkout=cancelled`,
    })

    return Response.json({
      status: "success",
      message: "Stripe checkout session created.",
      url: session.url,
    })
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Stripe checkout failed."

    return Response.json(
      {
        status: "error",
        message,
      },
      { status: 500 },
    )
  }
}

export async function GET() {
  return Response.json({
    status: "success",
    route: "stripe_checkout",
    billing: getStripeBillingEnvStatus(),
  })
}
