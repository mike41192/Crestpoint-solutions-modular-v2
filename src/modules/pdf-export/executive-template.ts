import type { ResumeBuilderFormData } from "@/modules/resume-builder"
import type { PdfDoc } from "./types"
import { bullet, cleanText, ensurePageSpace, joinText, paragraph, sectionTitle } from "./shared"

export function drawExecutive(doc: PdfDoc, data: ResumeBuilderFormData) {
  doc.rect(0, 0, 612, 110).fill("#111827")

  doc
    .fillColor("#ffffff")
    .font("Helvetica-Bold")
    .fontSize(26)
    .text(data.contact.fullName || "Executive Candidate", 50, 32)

  doc
    .font("Helvetica")
    .fontSize(9)
    .fillColor("#d1d5db")
    .text(joinText([data.contact.email, data.contact.phone, data.contact.location]), 50, 68)

  const links = joinText([data.contact.linkedIn, data.contact.website])
  if (links) doc.text(links, 50, 82)

  doc.x = 50
  doc.y = 135

  sectionTitle(doc, "Executive Summary", "executive")
  paragraph(doc, cleanText(data.summary) || "Executive summary not added yet.")

  sectionTitle(doc, "Professional Experience", "executive")

  data.experience.forEach((job) => {
    ensurePageSpace(doc, 130)

    doc.font("Helvetica-Bold").fontSize(11.5).fillColor("#111827").text(job.role || "Position")

    if (job.company) {
      doc.font("Helvetica-Bold").fontSize(10).fillColor("#4b5563").text(job.company)
    }

    const meta = joinText([job.location, job.startDate, job.endDate])
    if (meta) doc.font("Helvetica").fontSize(9).fillColor("#6b7280").text(meta)

    job.bullets.filter(Boolean).forEach((item) => bullet(doc, item))
    doc.moveDown(0.6)
  })

  sectionTitle(doc, "Education", "executive")

  data.education.forEach((edu) => {
    ensurePageSpace(doc, 60)

    doc
      .font("Helvetica-Bold")
      .fontSize(10)
      .fillColor("#111827")
      .text(`${edu.degree || "Degree"}${edu.field ? `, ${edu.field}` : ""}`)

    doc
      .font("Helvetica")
      .fontSize(9.5)
      .fillColor("#374151")
      .text(`${edu.school || "School"}${edu.graduationDate ? ` • ${edu.graduationDate}` : ""}`)

    doc.moveDown(0.3)
  })

  sectionTitle(doc, "Skills", "executive")
  paragraph(doc, data.skills.length ? data.skills.join(", ") : "Skills not added yet.")

  sectionTitle(doc, "Certifications", "executive")
  paragraph(
    doc,
    data.certifications.length ? data.certifications.join(", ") : "Certifications not added yet."
  )
}
