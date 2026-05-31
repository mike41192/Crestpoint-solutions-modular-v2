import type { ResumeBuilderFormData } from "@/modules/resume-builder"
import type { PdfDoc } from "./types"
import {
  bullet,
  cleanText,
  ensurePageSpace,
  joinText,
  paragraph,
} from "./shared"

const PAGE_WIDTH = 612
const HEADER_HEIGHT = 110
const SIDEBAR_X = 40
const SIDEBAR_WIDTH = 165
const CONTENT_X = 230
const CONTENT_WIDTH = 332
const ACCENT_BLUE = "#2563eb"
const NAVY = "#0f172a"
const LIGHT_BG = "#f8fafc"
const BORDER = "#e2e8f0"

function modernSectionTitle(doc: PdfDoc, title: string, x: number, width: number) {
  ensurePageSpace(doc, 54)

  doc
    .font("Helvetica-Bold")
    .fontSize(10)
    .fillColor(NAVY)
    .text(title.toUpperCase(), x, doc.y, {
      width,
      characterSpacing: 0.8,
    })

  doc
    .moveTo(x, doc.y + 4)
    .lineTo(x + width, doc.y + 4)
    .strokeColor(ACCENT_BLUE)
    .lineWidth(1)
    .stroke()

  doc.moveDown(0.7)
}

function sidebarSectionTitle(doc: PdfDoc, title: string) {
  doc
    .font("Helvetica-Bold")
    .fontSize(9)
    .fillColor(NAVY)
    .text(title.toUpperCase(), SIDEBAR_X, doc.y, {
      width: SIDEBAR_WIDTH,
      characterSpacing: 0.7,
    })

  doc
    .moveTo(SIDEBAR_X, doc.y + 3)
    .lineTo(SIDEBAR_X + SIDEBAR_WIDTH, doc.y + 3)
    .strokeColor(ACCENT_BLUE)
    .lineWidth(0.8)
    .stroke()

  doc.moveDown(0.55)
}

function sidebarText(doc: PdfDoc, text: string) {
  if (!text.trim()) return

  doc
    .font("Helvetica")
    .fontSize(8.5)
    .fillColor("#475569")
    .text(text, SIDEBAR_X, doc.y, {
      width: SIDEBAR_WIDTH,
      lineGap: 1.5,
    })

  doc.moveDown(0.35)
}

function skillBadge(doc: PdfDoc, text: string) {
  const cleaned = cleanText(text)
  if (!cleaned) return

  const badgeHeight = 17

  if (doc.y + badgeHeight > 720) {
    doc.addPage()
    doc.y = 60
  }

  const y = doc.y

  doc
    .roundedRect(SIDEBAR_X, y, SIDEBAR_WIDTH, badgeHeight, 8)
    .fill("#e0f2fe")

  doc
    .font("Helvetica-Bold")
    .fontSize(7.6)
    .fillColor("#075985")
    .text(cleaned, SIDEBAR_X + 7, y + 4.5, {
      width: SIDEBAR_WIDTH - 14,
      lineBreak: false,
      ellipsis: true,
    })

  doc.y = y + badgeHeight + 5
}

function drawModernHeader(doc: PdfDoc, data: ResumeBuilderFormData) {
  doc.rect(0, 0, PAGE_WIDTH, HEADER_HEIGHT).fill(NAVY)
  doc.rect(0, 0, 10, HEADER_HEIGHT).fill(ACCENT_BLUE)

  doc
    .fillColor("#ffffff")
    .font("Helvetica-Bold")
    .fontSize(25)
    .text(data.contact.fullName || "Your Name", 40, 30, {
      width: 525,
    })

  const contactLine = joinText([
    data.contact.email,
    data.contact.phone,
    data.contact.location,
  ])

  doc
    .font("Helvetica")
    .fontSize(9)
    .fillColor("#cbd5e1")
    .text(contactLine, 40, 64, {
      width: 525,
    })

  const links = joinText([data.contact.linkedIn, data.contact.website])

  if (links) {
    doc
      .font("Helvetica")
      .fontSize(8.5)
      .fillColor("#93c5fd")
      .text(links, 40, 79, {
        width: 525,
      })
  }
}

function drawSidebarBackground(doc: PdfDoc) {
  doc.rect(0, HEADER_HEIGHT, 210, 700).fill(LIGHT_BG)
  doc
    .moveTo(210, HEADER_HEIGHT)
    .lineTo(210, 792)
    .strokeColor(BORDER)
    .lineWidth(1)
    .stroke()
}

function drawSidebar(doc: PdfDoc, data: ResumeBuilderFormData) {
  doc.y = HEADER_HEIGHT + 26

  sidebarSectionTitle(doc, "Skills")

  if (data.skills.length > 0) {
    data.skills.slice(0, 18).forEach((skill) => skillBadge(doc, skill))
  } else {
    sidebarText(doc, "Skills not added yet.")
  }

  doc.moveDown(0.7)
  sidebarSectionTitle(doc, "Certifications")

  if (data.certifications.length > 0) {
    data.certifications.slice(0, 10).forEach((certification) => {
      sidebarText(doc, `• ${certification}`)
    })
  } else {
    sidebarText(doc, "Certifications not added yet.")
  }

  doc.moveDown(0.7)
  sidebarSectionTitle(doc, "Education")

  data.education.forEach((edu) => {
    ensurePageSpace(doc, 52)

    doc
      .font("Helvetica-Bold")
      .fontSize(8.8)
      .fillColor(NAVY)
      .text(edu.degree || "Degree", SIDEBAR_X, doc.y, {
        width: SIDEBAR_WIDTH,
      })

    doc
      .font("Helvetica")
      .fontSize(8.3)
      .fillColor("#475569")
      .text(
        `${edu.school || "School"}${
          edu.graduationDate ? ` • ${edu.graduationDate}` : ""
        }`,
        SIDEBAR_X,
        doc.y + 2,
        {
          width: SIDEBAR_WIDTH,
          lineGap: 1,
        }
      )

    doc.moveDown(0.65)
  })
}

function drawMainContent(doc: PdfDoc, data: ResumeBuilderFormData) {
  doc.x = CONTENT_X
  doc.y = HEADER_HEIGHT + 26

  modernSectionTitle(doc, "Professional Summary", CONTENT_X, CONTENT_WIDTH)
  paragraph(
    doc,
    cleanText(data.summary) || "Professional summary not added yet.",
    "#334155"
  )

  modernSectionTitle(doc, "Work Experience", CONTENT_X, CONTENT_WIDTH)

  data.experience.forEach((job) => {
    ensurePageSpace(doc, 120)

    doc
      .font("Helvetica-Bold")
      .fontSize(11)
      .fillColor(NAVY)
      .text(`${job.role || "Role"}${job.company ? ` — ${job.company}` : ""}`, CONTENT_X, doc.y, {
        width: CONTENT_WIDTH,
      })

    const meta = joinText([job.location, job.startDate, job.endDate])

    if (meta) {
      doc
        .font("Helvetica")
        .fontSize(8.8)
        .fillColor("#64748b")
        .text(meta, CONTENT_X, doc.y + 2, {
          width: CONTENT_WIDTH,
        })
    }

    doc.moveDown(0.25)

    job.bullets.filter(Boolean).forEach((item) => {
      const cleaned = cleanText(item)
      if (!cleaned) return

      ensurePageSpace(doc, 42)

      doc
        .font("Helvetica")
        .fontSize(9.4)
        .fillColor("#374151")
        .text(`• ${cleaned}`, CONTENT_X, doc.y, {
          width: CONTENT_WIDTH,
          indent: 10,
          lineGap: 1.6,
        })
    })

    doc.moveDown(0.6)
  })
}

export function drawModern(doc: PdfDoc, data: ResumeBuilderFormData) {
  drawModernHeader(doc, data)
  drawSidebarBackground(doc)
  drawSidebar(doc, data)
  drawMainContent(doc, data)
}
