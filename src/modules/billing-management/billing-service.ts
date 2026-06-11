import type {
  BillingActionResult,
  CheckoutRequest,
} from "@/modules/billing-management/types"

async function readBillingResponse(response: Response) {
  const result = await response.json().catch(() => ({}))

  if (!response.ok || result.status !== "success" || !result.url) {
    throw new Error(
      result.message || "Billing request failed. Please try again.",
    )
  }

  return String(result.url)
}

export async function openStripePortal(): Promise<BillingActionResult> {
  try {
    const response = await fetch("/api/stripe/portal", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    })

    const url = await readBillingResponse(response)
    window.location.href = url

    return {
      status: "success",
      message: "Redirecting to Stripe billing portal.",
    }
  } catch (error) {
    return {
      status: "error",
      message:
        error instanceof Error
          ? error.message
          : "Billing portal could not be opened.",
    }
  }
}

export async function startStripeCheckout({
  tier,
  interval,
}: CheckoutRequest): Promise<BillingActionResult> {
  try {
    const response = await fetch("/api/stripe/checkout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        tier,
        interval,
      }),
    })

    const url = await readBillingResponse(response)
    window.location.href = url

    return {
      status: "success",
      message: "Redirecting to Stripe checkout.",
    }
  } catch (error) {
    return {
      status: "error",
      message:
        error instanceof Error
          ? error.message
          : "Stripe checkout could not be started.",
    }
  }
}
