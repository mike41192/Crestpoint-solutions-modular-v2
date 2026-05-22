export async function POST() {
  return Response.json({
    status: "not_configured",
    message:
      "Stripe webhook is scaffolded but not connected yet. Add webhook signature verification before enabling live events.",
  })
}

export async function GET() {
  return Response.json({
    status: "ok",
    route: "stripe_webhook",
  })
}