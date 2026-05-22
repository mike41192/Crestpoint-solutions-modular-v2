export async function GET() {
  return Response.json({
    status: "not_configured",
    route: "auth_callback",
    message:
      "Supabase auth callback is scaffolded but not connected yet.",
  })
}