import type { ResumeTemplateType } from "@/modules/resume-builder"
import type { PdfDoc } from "./types"

export const PAGE_BOTTOM_MARGIN = 720
export const PAGE_TOP_AFTER_BREAK = 60

export function ensurePageSpace(doc: PdfDoc, requiredHeight = 80) {
  if (doc.y + requiredHeight > PAGE_BOTTOM_MARGIN) {
    doc.addPage()
    doc.y = PAGE_TOP_AFTER_BREAK
    doc.x = 50
  }
}

export function estimateBulletHeight(text: string) {
  const length = text?.length || 0
  if (length < 80) return 22
  if (length < 160) return 38
  if (length < 240) return 54
  return 76
}

export function estimateParagraphHeight(text: string) {
  const length = text?.length || 0
  if (length < 200) return 45
  if (length < 400) return 75
  if (length < 700) return 120
  return 160
}

export function stripHtml(value: string) {
  return value.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim()
}

export function cleanText(value?: string) {
  return stripHtml(value || "")
}

export function joinText(values: Array<string | undefined>) {
  return values.filter(Boolean).join(" • ")
}

export function sectionTitle(
  doc: PdfDoc,
  title: string,
  template: ResumeTemplateType
) {
  ensurePageSpace(doc, 70)

  const isModern = template === "modern"
  const isExecutive = template === "executive"

  doc.moveDown(0.8)

  doc
    .font("Helvetica-Bold")
    .fontSize(isExecutive ? 13 : 12)
    .fillColor(isModern ? "#0f172a" : "#111827")
    .text(title.toUpperCase(), {
      characterSpacing: isExecutive ? 1.2 : 0.7,
    })

  doc
    .moveTo(50, doc.y + 4)
    .lineTo(562, doc.y + 4)
    .strokeColor(isModern ? "#2563eb" : "#111827")
    .lineWidth(isExecutive ? 1 : 0.7)
    .stroke()

  doc.moveDown(0.6)
}

export function paragraph(doc: PdfDoc, text: string, color = "#374151") {
  const cleaned = cleanText(text)
  ensurePageSpace(doc, estimateParagraphHeight(cleaned))

  doc.font("Helvetica").fontSize(10).fillColor(color).text(cleaned, {
    lineGap: 2,
    width: 500,
  })
}

export function bullet(doc: PdfDoc, text: string) {
  const cleaned = cleanText(text)
  if (!cleaned) return

  ensurePageSpace(doc, estimateBulletHeight(cleaned))

  doc.font("Helvetica").fontSize(10).fillColor("#374151").text(`• ${cleaned}`, {
    indent: 10,
    lineGap: 2,
    width: 500,
  })
}
