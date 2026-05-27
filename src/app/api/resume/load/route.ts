export async function GET() {
  return Response.json({
    status: "scaffolded",
    message:
      "Resume load API is scaffolded. Supabase resume loading will activate after auth/session wiring is connected.",
    resumes: [],
    nextStep:
      "Connect Supabase server client, authenticated user session, and resume select logic.",
  })
}
