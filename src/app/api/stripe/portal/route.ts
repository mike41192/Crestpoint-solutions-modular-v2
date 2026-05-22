export async function POST() {
  return Response.json({
    status: "not_configured",
    message:
      "Stripe customer portal is scaffolded but not connected yet. Add Stripe keys and customer IDs before enabling portal access.",
  })
}

export async function GET() {
  return Response.json({
    status: "ok",
    route: "stripe_portal",
  })
}
