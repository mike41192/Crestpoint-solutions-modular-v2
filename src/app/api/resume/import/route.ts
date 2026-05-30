import { parseTextResume } from "@/modules/resume-builder"

export const runtime = "nodejs"

const MAX_FILE_SIZE_MB = 8
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024

function normalizeExtractedText(value: string) {
  return value
    .replace(/\r/g, "\n")
    .replace(/\t/g, " ")
    .replace(/[ ]{2,}/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim()
}

async function extractTextFromDocx(fileBuffer: ArrayBuffer) {
  const mammoth = await import("mammoth")

  const result = await mammoth.extractRawText({
    buffer: Buffer.from(fileBuffer),
  })

  return normalizeExtractedText(result.value || "")
}

async function extractTextFromPdf(fileBuffer: ArrayBuffer) {
  // pdf-parse root index can try loading ./test/data in Next.
  // Use the parser implementation directly.
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const pdfParse = require("pdf-parse/lib/pdf-parse.js")

  const result = await pdfParse(Buffer.from(fileBuffer))

  return normalizeExtractedText(result.text || "")
}

async function extractResumeText(file: File) {
  const fileName = file.name.toLowerCase()
  const fileType = file.type
  const fileBuffer = await file.arrayBuffer()

  if (fileName.endsWith(".docx")) {
    return await extractTextFromDocx(fileBuffer)
  }

  if (fileName.endsWith(".pdf") || fileType === "application/pdf") {
    return await extractTextFromPdf(fileBuffer)
  }

  return normalizeExtractedText(await file.text())
}

function isPdfFile(file: File) {
  return file.name.toLowerCase().endsWith(".pdf") || file.type === "application/pdf"
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get("file")

    if (!file || !(file instanceof File)) {
      return Response.json(
        { status: "error", message: "Resume file is required." },
        { status: 400 }
      )
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      return Response.json(
        {
          status: "error",
          message: `Resume file is too large. Maximum supported size is ${MAX_FILE_SIZE_MB}MB.`,
        },
        { status: 400 }
      )
    }

    const fileText = await extractResumeText(file)

    if (!fileText.trim()) {
      return Response.json({
        status: "warning",
        message: isPdfFile(file)
          ? "This PDF appears to be scanned or image-based. Text-based PDFs, DOCX, and TXT files import automatically. OCR support is the next import upgrade."
          : "Readable text could not be extracted from this file.",
        fileName: file.name,
        fileType: file.type,
        characterCount: 0,
        preview: "",
        detectedSections: [],
        parsedData: null,
        needsOcr: isPdfFile(file),
        recommendedAction: isPdfFile(file)
          ? "Upload a text-based PDF or DOCX version for now, or continue to the OCR upgrade phase."
          : "Try uploading a TXT, DOCX, or text-based PDF version.",
      })
    }

    const parsedResult = parseTextResume(fileText)

    return Response.json({
      status: parsedResult.status,
      message: parsedResult.message,
      fileName: file.name,
      fileType: file.type,
      characterCount: fileText.length,
      preview: fileText.slice(0, 1200),
      detectedSections: parsedResult.detectedSections,
      parsedData: parsedResult.parsedData,
      needsOcr: false,
    })
  } catch (error) {
    console.error("Resume import route error:", error)

    return Response.json(
      {
        status: "error",
        message: String(error),
      },
      { status: 500 }
    )
  }
}

export async function GET() {
  return Response.json({
    status: "ok",
    route: "resume_import",
    supportedFormats: [".txt", ".docx", ".pdf"],
    maxFileSizeMb: MAX_FILE_SIZE_MB,
    ocrStatus: "planned",
  })
}
