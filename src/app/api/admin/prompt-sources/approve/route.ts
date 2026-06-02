import { requireAdminUser } from "@/lib/security/admin-auth"

export async function GET() {
  const admin = await requireAdminUser()

  if (!admin.ok) {
    return admin.response
  }

  return Response.json({
    status: "ok",
    admin: admin.email,
    timestamp: new Date().toISOString(),
  })
}