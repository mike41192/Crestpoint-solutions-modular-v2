import {
  extractTextFromDocx,
  extractTextFromPdf,
  parseTextResume,
} from "@/modules/resume-builder"

export const runtime = "nodejs"

async function extractResumeText(file: File) {
  const fileName = file.name.toLowerCase()
  const fileType = file.type
  const fileBuffer = await file.arrayBuffer()

  try {
    if (fileName.endsWith(".docx")) {
      return await extractTextFromDocx(fileBuffer)
    }

    if (
      fileName.endsWith(".pdf") ||
      fileType === "application/pdf"
    ) {
      return await extractTextFromPdf(fileBuffer)
    }

    return await file.text()
  } catch (error) {
    console.error("Resume extraction error:", error)
    return ""
  }
}

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

    const fileText = await extractResumeText(file)

    if (!fileText || !fileText.trim()) {
      return Response.json({
        status: "warning",
        message:
          "The file uploaded successfully, but readable text could not be extracted. Some PDFs are image-based or use unsupported formatting.",
        fileName,
        fileType,
        characterCount: 0,
        preview: "",
        detectedSections: [],
        parsedData: null,
      })
    }

    const parsedResult =
      parseTextResume(fileText)

    return Response.json({
      status: parsedResult.status,
      message: parsedResult.message,
      fileName,
      fileType,
      characterCount: fileText.length,
      preview: fileText.slice(0, 500),
      detectedSections:
        parsedResult.detectedSections,
      parsedData: parsedResult.parsedData,
    })
  } catch (error) {
    console.error(
      "Resume import route error:",
      error
    )

    return Response.json(
      {
        status: "error",
        message:
          "Resume import failed due to a parser or file-processing error.",
      },
      { status: 500 }
    )
  }
}

export async function GET() {
  return Response.json({
    status: "ok",
    route: "resume_import",
    supportedFormats: [
      ".txt",
      ".docx",
      ".pdf",
    ],
  })
}
