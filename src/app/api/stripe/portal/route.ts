import { createSupabaseAdminClient } from "@/lib/supabase/admin"
import { createSupabaseServerClient } from "@/lib/supabase/server"
import { getStripeBillingEnvStatus } from "@/lib/stripe/stripe-env"
import { getStripeClient } from "@/lib/stripe/stripe-client"
import { getStripeReturnBaseUrl } from "@/lib/stripe/stripe-urls"

type MembershipBillingRow = {
  id: string
  user_id: string
  plan_name: string | null
  status: string | null
  stripe_customer_id: string | null
}

function isMissingStripeCustomerColumnError(error: { message?: string }) {
  const message = error.message || ""

  return (
    message.includes("stripe_customer_id") ||
    message.includes("schema cache") ||
    message.includes("column")
  )
}

export async function POST(request: Request) {
  try {
    const supabase = await createSupabaseServerClient()
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return Response.json(
        {
          status: "unauthorized",
          message: "You must be signed in to open the billing portal.",
        },
        { status: 401 },
      )
    }

    const adminSupabase = createSupabaseAdminClient()
    const { data: membership, error: membershipError } = await adminSupabase
      .from("memberships")
      .select("id, user_id, plan_name, status, stripe_customer_id")
      .eq("user_id", user.id)
      .maybeSingle<MembershipBillingRow>()

    if (membershipError) {
      if (isMissingStripeCustomerColumnError(membershipError)) {
        return Response.json(
          {
            status: "database_not_configured",
            message:
              "Add the Stripe billing columns to public.memberships before opening the billing portal.",
            sqlFile: "supabase/stripe-membership-billing-columns.sql",
          },
          { status: 503 },
        )
      }

      throw new Error(membershipError.message)
    }

    const stripe = getStripeClient()
    let customerId = membership?.stripe_customer_id || ""

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email || undefined,
        metadata: {
          userId: user.id,
        },
      })

      customerId = customer.id

      if (membership) {
        const { error: updateError } = await adminSupabase
          .from("memberships")
          .update({
            stripe_customer_id: customerId,
          })
          .eq("user_id", user.id)

        if (updateError) {
          throw new Error(updateError.message)
        }
      } else {
        const { error: insertError } = await adminSupabase
          .from("memberships")
          .insert({
            user_id: user.id,
            plan_name: "free",
            status: "active",
            stripe_customer_id: customerId,
          })

        if (insertError) {
          throw new Error(insertError.message)
        }
      }
    }

    const baseUrl = getStripeReturnBaseUrl(request)
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${baseUrl}/dashboard/billing`,
    })

    return Response.json({
      status: "success",
      message: "Stripe billing portal session created.",
      url: portalSession.url,
    })
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Stripe portal request failed."

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
    route: "stripe_portal",
    billing: getStripeBillingEnvStatus(),
  })
}
