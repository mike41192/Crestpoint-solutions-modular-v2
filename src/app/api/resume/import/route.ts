import { parseTextResume } from "@/modules/resume-builder"

export const runtime = "nodejs"

const MAX_FILE_SIZE_MB = 8
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024

const IMAGE_EXTENSIONS = [".png", ".jpg", ".jpeg", ".webp"]

function normalizeExtractedText(value: string) {
  return value
    .replace(/\r/g, "\n")
    .replace(/\t/g, " ")
    .replace(/[ ]{2,}/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim()
}

function isPdfFile(file: File) {
  return file.name.toLowerCase().endsWith(".pdf") || file.type === "application/pdf"
}

function isImageFile(file: File) {
  const fileName = file.name.toLowerCase()

  return (
    IMAGE_EXTENSIONS.some((extension) => fileName.endsWith(extension)) ||
    file.type.startsWith("image/")
  )
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

async function extractTextFromImage(fileBuffer: ArrayBuffer) {
  const { createWorker } = await import("tesseract.js")
  const worker = await createWorker("eng")

  try {
    const result = await worker.recognize(Buffer.from(fileBuffer))
    return normalizeExtractedText(result.data.text || "")
  } finally {
    await worker.terminate()
  }
}

async function extractResumeText(file: File) {
  const fileName = file.name.toLowerCase()
  const fileType = file.type
  const fileBuffer = await file.arrayBuffer()

  if (fileName.endsWith(".docx")) {
    return await extractTextFromDocx(fileBuffer)
  }

  if (isPdfFile(file)) {
    return await extractTextFromPdf(fileBuffer)
  }

  if (isImageFile(file)) {
    return await extractTextFromImage(fileBuffer)
  }

  return normalizeExtractedText(await file.text())
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
          ? "This PDF appears to be scanned or image-based. Text-based PDFs, DOCX, TXT, and image uploads import automatically. Full scanned PDF OCR is the next import upgrade."
          : "Readable text could not be extracted from this file.",
        fileName: file.name,
        fileType: file.type,
        characterCount: 0,
        preview: "",
        detectedSections: [],
        parsedData: null,
        needsOcr: isPdfFile(file),
        recommendedAction: isPdfFile(file)
          ? "For now, upload a text-based PDF, DOCX, TXT, or an image scan such as PNG/JPG."
          : "Try uploading a TXT, DOCX, text-based PDF, PNG, JPG, JPEG, or WEBP version.",
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
    supportedFormats: [".txt", ".docx", ".pdf", ".png", ".jpg", ".jpeg", ".webp"],
    maxFileSizeMb: MAX_FILE_SIZE_MB,
    ocrStatus: "image_upload_supported",
    scannedPdfOcrStatus: "planned",
  })
}
