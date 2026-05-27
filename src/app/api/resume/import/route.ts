import { parseTextResume } from "@/modules/resume-builder"

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
    const parsedResult = parseTextResume(fileText)

    return Response.json({
      status: parsedResult.status,
      message: parsedResult.message,
      fileName,
      fileType,
      characterCount: fileText.length,
      preview: fileText.slice(0, 500),
      detectedSections: parsedResult.detectedSections,
      parsedData: parsedResult.parsedData,
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