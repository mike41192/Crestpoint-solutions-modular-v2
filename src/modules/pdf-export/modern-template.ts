import type { ResumeBuilderFormData } from "@/modules/resume-builder"
import type { PdfDoc } from "./types"
import { bullet, cleanText, ensurePageSpace, joinText, paragraph, sectionTitle } from "./shared"

export function drawModern(doc: PdfDoc, data: ResumeBuilderFormData) {
  doc.rect(0, 0, 612, 100).fill("#0f172a")

  doc
    .fillColor("#ffffff")
    .font("Helvetica-Bold")
    .fontSize(24)
    .text(data.contact.fullName || "Your Name", 50, 30)

  doc
    .font("Helvetica")
    .fontSize(9)
    .fillColor("#cbd5e1")
    .text(joinText([data.contact.email, data.contact.phone, data.contact.location]), 50, 62)

  const links = joinText([data.contact.linkedIn, data.contact.website])
  if (links) doc.text(links, 50, 76)

  doc.x = 50
  doc.y = 125

  sectionTitle(doc, "Professional Summary", "modern")
  paragraph(doc, cleanText(data.summary) || "Professional summary not added yet.", "#334155")

  sectionTitle(doc, "Work Experience", "modern")

  data.experience.forEach((job) => {
    ensurePageSpace(doc, 120)

    doc
      .font("Helvetica-Bold")
      .fontSize(11)
      .fillColor("#0f172a")
      .text(`${job.role || "Role"}${job.company ? ` — ${job.company}` : ""}`)

    const meta = joinText([job.location, job.startDate, job.endDate])
    if (meta) doc.font("Helvetica").fontSize(9).fillColor("#64748b").text(meta)

    job.bullets.filter(Boolean).forEach((item) => bullet(doc, item))
    doc.moveDown(0.5)
  })

  sectionTitle(doc, "Skills", "modern")
  paragraph(
    doc,
    data.skills.length ? data.skills.join(" • ") : "Skills not added yet.",
    "#075985"
  )

  sectionTitle(doc, "Education", "modern")

  data.education.forEach((edu) => {
    ensurePageSpace(doc, 60)

    doc
      .font("Helvetica-Bold")
      .fontSize(10)
      .fillColor("#0f172a")
      .text(`${edu.degree || "Degree"}${edu.field ? `, ${edu.field}` : ""}`)

    doc
      .font("Helvetica")
      .fontSize(9.5)
      .fillColor("#475569")
      .text(`${edu.school || "School"}${edu.graduationDate ? ` • ${edu.graduationDate}` : ""}`)

    doc.moveDown(0.3)
  })

  sectionTitle(doc, "Certifications", "modern")
  paragraph(
    doc,
    data.certifications.length ? data.certifications.join(", ") : "Certifications not added yet.",
    "#334155"
  )
}
