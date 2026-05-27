import mammoth from "mammoth"

export async function extractTextFromDocx(fileBuffer: ArrayBuffer) {
  const result = await mammoth.extractRawText({
    buffer: Buffer.from(fileBuffer),
  })

  return result.value || ""
}