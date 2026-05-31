import type { ResumeBuilderFormData } from "@/modules/resume-builder"
import type { PdfDoc } from "./types"
import {
  bullet,
  cleanText,
  ensurePageSpace,
  joinText,
  paragraph,
  sectionTitle,
} from "./shared"

export function drawATS(doc: PdfDoc, data: ResumeBuilderFormData) {
  doc.fillColor("#111827")

  doc
    .font("Helvetica-Bold")
    .fontSize(22)
    .text(data.contact.fullName || "Your Name", {
      align: "center",
    })

  doc.moveDown(0.25)

  doc
    .font("Helvetica")
    .fontSize(9.5)
    .fillColor("#374151")
    .text(
      joinText([
        data.contact.email,
        data.contact.phone,
        data.contact.location,
        data.contact.linkedIn,
        data.contact.website,
      ]),
      {
        align: "center",
      }
    )

  doc.moveDown(0.7)

  doc
    .moveTo(50, doc.y)
    .lineTo(562, doc.y)
    .strokeColor("#111827")
    .lineWidth(0.8)
    .stroke()

  sectionTitle(doc, "Professional Summary", "classic")
  paragraph(
    doc,
    cleanText(data.summary) || "Professional summary not added yet.",
    "#111827"
  )

  sectionTitle(doc, "Core Skills", "classic")
  paragraph(
    doc,
    data.skills.length ? data.skills.join(", ") : "Skills not added yet.",
    "#111827"
  )

  sectionTitle(doc, "Professional Experience", "classic")

  data.experience.forEach((job) => {
    ensurePageSpace(doc, 120)

    doc
      .font("Helvetica-Bold")
      .fontSize(10.8)
      .fillColor("#111827")
      .text(`${job.role || "Role"}${job.company ? ` — ${job.company}` : ""}`)

    const meta = joinText([job.location, job.startDate, job.endDate])

    if (meta) {
      doc.font("Helvetica").fontSize(9.2).fillColor("#374151").text(meta)
    }

    job.bullets.filter(Boolean).forEach((item) => {
      bullet(doc, item)
    })

    doc.moveDown(0.45)
  })

  sectionTitle(doc, "Education", "classic")

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
      .text(
        `${edu.school || "School"}${
          edu.graduationDate ? ` • ${edu.graduationDate}` : ""
        }`
      )

    doc.moveDown(0.3)
  })

  sectionTitle(doc, "Certifications", "classic")
  paragraph(
    doc,
    data.certifications.length
      ? data.certifications.join(", ")
      : "Certifications not added yet.",
    "#111827"
  )
}
