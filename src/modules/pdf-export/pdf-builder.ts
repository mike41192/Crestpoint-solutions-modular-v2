import type {
  ResumeBuilderFormData,
  ResumeTemplateType,
} from "@/modules/resume-builder"
import type { PdfDoc } from "./types"
import { drawClassic } from "./classic-template"
import { drawModern } from "./modern-template"
import { drawExecutive } from "./executive-template"

export function drawResume(
  doc: PdfDoc,
  data: ResumeBuilderFormData,
  template: ResumeTemplateType
) {
  if (template === "modern") {
    drawModern(doc, data)
    return
  }

  if (template === "executive") {
    drawExecutive(doc, data)
    return
  }

  drawClassic(doc, data)
}

export async function buildResumePdfBuffer(
  data: ResumeBuilderFormData,
  template: ResumeTemplateType
) {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const PDFKitModule = require("pdfkit")
  const PDFDocument = PDFKitModule.default || PDFKitModule

  const doc = new PDFDocument({
    size: "LETTER",
    margin: 50,
  })

  const chunks: Uint8Array[] = []

  doc.on("data", (chunk: Uint8Array) => {
    chunks.push(chunk)
  })

  const pdfPromise = new Promise<Uint8Array>((resolve, reject) => {
    doc.on("end", () => {
      const merged = Buffer.concat(chunks.map((chunk) => Buffer.from(chunk)))
      resolve(new Uint8Array(merged))
    })

    doc.on("error", reject)
  })

  drawResume(doc, data, template)
  doc.end()

  return await pdfPromise
}
