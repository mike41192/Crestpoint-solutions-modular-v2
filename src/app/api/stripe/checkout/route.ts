export async function POST() {
  return Response.json({
    status: "not_configured",
    message:
      "Stripe checkout is scaffolded but not connected yet. Add Stripe keys and price IDs before enabling live checkout.",
  })
}

export async function GET() {
  return Response.json({
    status: "ok",
    route: "stripe_checkout",
  })
}