export async function extractTextFromPdf(
  fileBuffer: ArrayBuffer
) {
  const pdfParse = require("pdf-parse")

  const result = await pdfParse(
    Buffer.from(fileBuffer)
  )

  return result.text || ""
}