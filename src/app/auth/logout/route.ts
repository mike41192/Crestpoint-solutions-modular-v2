export async function GET() {
  return Response.json({
    status: "not_configured",
    route: "auth_logout",
    message:
      "Logout route is scaffolded but not connected yet.",
  })
}