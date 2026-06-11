import Stripe from "stripe"

import { createSupabaseAdminClient } from "@/lib/supabase/admin"
import { getStripeClient } from "@/lib/stripe/stripe-client"
import {
  getStripeIntervalForPriceId,
  getStripeProductId,
  getStripeTierForPriceId,
  getStripeWebhookSecret,
} from "@/lib/stripe/stripe-env"

function getSubscriptionPrice(subscription: Stripe.Subscription) {
  return subscription.items.data[0]?.price || null
}

function getSubscriptionCurrentPeriodEnd(subscription: Stripe.Subscription) {
  return subscription.items.data[0]?.current_period_end || null
}

function getUnixTimestampAsIso(value: number | null | undefined) {
  if (!value) {
    return null
  }

  return new Date(value * 1000).toISOString()
}

function throwIfSupabaseError(error: { message: string } | null) {
  if (error) {
    throw new Error(error.message)
  }
}

async function upsertMembershipFromCheckoutSession(
  session: Stripe.Checkout.Session,
) {
  const userId = session.client_reference_id || session.metadata?.userId

  if (!userId || !session.subscription) {
    return
  }

  const stripe = getStripeClient()
  const subscription = await stripe.subscriptions.retrieve(
    String(session.subscription),
  )

  await updateMembershipFromSubscription(subscription, userId)
}

async function updateMembershipFromSubscription(
  subscription: Stripe.Subscription,
  providedUserId?: string,
) {
  const price = getSubscriptionPrice(subscription)
  const priceId = price?.id || null
  const tier = getStripeTierForPriceId(priceId)
  const interval = getStripeIntervalForPriceId(priceId)
  const productId = tier ? getStripeProductId(tier) : String(price?.product || "")
  const userId = providedUserId || subscription.metadata?.userId
  const customerId = String(subscription.customer || "")
  const currentPeriodEnd = getUnixTimestampAsIso(
    getSubscriptionCurrentPeriodEnd(subscription),
  )

  if (!userId && !customerId) {
    return
  }

  const adminSupabase = createSupabaseAdminClient()
  const updatePayload = {
    plan_name: tier || "free",
    status: subscription.status,
    stripe_customer_id: customerId || null,
    stripe_subscription_id: subscription.id,
    stripe_price_id: priceId,
    stripe_product_id: productId || null,
    billing_interval: interval,
    current_period_end: currentPeriodEnd,
    cancel_at_period_end: Boolean(subscription.cancel_at_period_end),
  }

  if (userId) {
    const { data: existing, error: existingError } = await adminSupabase
      .from("memberships")
      .select("user_id")
      .eq("user_id", userId)
      .maybeSingle()

    throwIfSupabaseError(existingError)

    if (existing) {
      const { error: updateError } = await adminSupabase
        .from("memberships")
        .update(updatePayload)
        .eq("user_id", userId)

      throwIfSupabaseError(updateError)
      return
    }

    const { error: insertError } = await adminSupabase.from("memberships").insert({
      user_id: userId,
      ...updatePayload,
    })
    throwIfSupabaseError(insertError)
    return
  }

  const { error: updateError } = await adminSupabase
    .from("memberships")
    .update(updatePayload)
    .eq("stripe_customer_id", customerId)

  throwIfSupabaseError(updateError)
}

async function downgradeCancelledSubscription(
  subscription: Stripe.Subscription,
) {
  const adminSupabase = createSupabaseAdminClient()

  const { error } = await adminSupabase
    .from("memberships")
    .update({
      plan_name: "free",
      status: "canceled",
      stripe_subscription_id: subscription.id,
      stripe_price_id: null,
      stripe_product_id: null,
      billing_interval: null,
      current_period_end: getUnixTimestampAsIso(
        getSubscriptionCurrentPeriodEnd(subscription),
      ),
      cancel_at_period_end: false,
    })
    .eq("stripe_subscription_id", subscription.id)

  throwIfSupabaseError(error)
}

export async function POST(request: Request) {
  const webhookSecret = getStripeWebhookSecret()

  if (!webhookSecret) {
    return Response.json(
      {
        status: "not_configured",
        message: "Stripe webhook secret is not configured.",
      },
      { status: 503 },
    )
  }

  const signature = request.headers.get("stripe-signature")

  if (!signature) {
    return Response.json(
      {
        status: "error",
        message: "Missing Stripe signature.",
      },
      { status: 400 },
    )
  }

  const stripe = getStripeClient()
  const body = await request.text()
  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Invalid Stripe signature."

    return Response.json(
      {
        status: "error",
        message,
      },
      { status: 400 },
    )
  }

  try {
    if (event.type === "checkout.session.completed") {
      await upsertMembershipFromCheckoutSession(
        event.data.object as Stripe.Checkout.Session,
      )
    }

    if (
      event.type === "customer.subscription.created" ||
      event.type === "customer.subscription.updated"
    ) {
      await updateMembershipFromSubscription(
        event.data.object as Stripe.Subscription,
      )
    }

    if (event.type === "customer.subscription.deleted") {
      await downgradeCancelledSubscription(
        event.data.object as Stripe.Subscription,
      )
    }

    return Response.json({
      status: "success",
      received: true,
    })
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Stripe webhook handling failed."

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
    route: "stripe_webhook",
  })
}
