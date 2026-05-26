export async function POST(request: Request) {
  try {
    const body = await request.json()

    return Response.json({
      status: "scaffolded",
      message:
        "Resume optimization API is scaffolded but not connected to OpenAI yet.",
      receivedFields: Object.keys(body || {}),
      nextStep:
        "Connect OpenAI optimization service after prompt and safety rules are finalized.",
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
    route: "resume_optimize",
  })
}