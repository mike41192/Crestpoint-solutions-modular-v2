export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get("file")

    if (!file || !(file instanceof File)) {
      return Response.json(
        {
          status: "error",
          message: "Resume file is required.",
        },
        { status: 400 }
      )
    }

    const fileName = file.name
    const fileType = file.type
    const fileText = await file.text()

    return Response.json({
      status: "scaffolded",
      message:
        "Resume import scaffold received the file. TXT parsing will be expanded in the next import phase.",
      fileName,
      fileType,
      characterCount: fileText.length,
      preview: fileText.slice(0, 500),
    })
  } catch {
    return Response.json(
      {
        status: "error",
        message: "Resume import failed.",
      },
      { status: 500 }
    )
  }
}

export async function GET() {
  return Response.json({
    status: "ok",
    route: "resume_import",
  })
}