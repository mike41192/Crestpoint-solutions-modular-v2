export async function POST(request: Request) {
  try {
    const body = await request.json()

    return Response.json({
      status: "scaffolded",
      message:
        "Resume save API is scaffolded. Supabase persistence will activate after auth/session wiring is connected.",
      receivedFields: Object.keys(body || {}),
      nextStep:
        "Connect Supabase server client, authenticated user session, and resume upsert logic.",
    })
  } catch {
    return Response.json(
      {
        status: "error",
        message: "Invalid request body.",
      },
      {
        status: 400,
      }
    )
  }
}

export async function GET() {
  return Response.json({
    status: "ok",
    route: "resume_save",
  })
}