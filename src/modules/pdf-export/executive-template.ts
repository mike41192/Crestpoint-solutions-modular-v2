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
const HEADER_HEIGHT = 118
const SIDEBAR_X = 40
const SIDEBAR_WIDTH = 165
const CONTENT_X = 230
const CONTENT_WIDTH = 332
const CHARCOAL = "#111827"
const GOLD = "#b45309"
const GOLD_LIGHT = "#fef3c7"
const SLATE = "#374151"
const MUTED = "#6b7280"
const SIDEBAR_BG = "#f9fafb"
const BORDER = "#d1d5db"

function executiveSectionTitle(
  doc: PdfDoc,
  title: string,
  x: number,
  width: number
) {
  ensurePageSpace(doc, 58)

  doc
    .font("Helvetica-Bold")
    .fontSize(10.5)
    .fillColor(CHARCOAL)
    .text(title.toUpperCase(), x, doc.y, {
      width,
      characterSpacing: 1.15,
    })

  doc
    .moveTo(x, doc.y + 4)
    .lineTo(x + width, doc.y + 4)
    .strokeColor(GOLD)
    .lineWidth(1)
    .stroke()

  doc.moveDown(0.75)
}

function sidebarSectionTitle(doc: PdfDoc, title: string) {
  ensurePageSpace(doc, 44)

  doc
    .font("Helvetica-Bold")
    .fontSize(9.2)
    .fillColor(CHARCOAL)
    .text(title.toUpperCase(), SIDEBAR_X, doc.y, {
      width: SIDEBAR_WIDTH,
      characterSpacing: 0.9,
    })

  doc
    .moveTo(SIDEBAR_X, doc.y + 3)
    .lineTo(SIDEBAR_X + SIDEBAR_WIDTH, doc.y + 3)
    .strokeColor(GOLD)
    .lineWidth(0.8)
    .stroke()

  doc.moveDown(0.65)
}

function sidebarLine(doc: PdfDoc, text: string) {
  const cleaned = cleanText(text)
  if (!cleaned) return

  ensurePageSpace(doc, 24)

  doc
    .font("Helvetica")
    .fontSize(8.7)
    .fillColor(SLATE)
    .text(cleaned, SIDEBAR_X, doc.y, {
      width: SIDEBAR_WIDTH,
      lineGap: 1.5,
    })

  doc.moveDown(0.35)
}

function competencyChip(doc: PdfDoc, text: string) {
  const cleaned = cleanText(text)
  if (!cleaned) return

  const chipHeight = 17

  if (doc.y + chipHeight > 720) {
    doc.addPage()
    doc.y = 60
    doc.x = SIDEBAR_X
  }

  const y = doc.y

  doc
    .roundedRect(SIDEBAR_X, y, SIDEBAR_WIDTH, chipHeight, 7)
    .fill(GOLD_LIGHT)

  doc
    .font("Helvetica-Bold")
    .fontSize(7.5)
    .fillColor(GOLD)
    .text(cleaned, SIDEBAR_X + 7, y + 4.5, {
      width: SIDEBAR_WIDTH - 14,
      lineBreak: false,
      ellipsis: true,
    })

  doc.y = y + chipHeight + 5
}

function drawExecutiveHeader(doc: PdfDoc, data: ResumeBuilderFormData) {
  doc.rect(0, 0, PAGE_WIDTH, HEADER_HEIGHT).fill(CHARCOAL)
  doc.rect(0, HEADER_HEIGHT - 6, PAGE_WIDTH, 6).fill(GOLD)

  doc
    .fillColor("#ffffff")
    .font("Helvetica-Bold")
    .fontSize(27)
    .text(data.contact.fullName || "Executive Candidate", 40, 30, {
      width: 532,
    })

  doc
    .font("Helvetica")
    .fontSize(9)
    .fillColor("#e5e7eb")
    .text(
      joinText([data.contact.email, data.contact.phone, data.contact.location]),
      40,
      69,
      {
        width: 532,
      }
    )

  const links = joinText([data.contact.linkedIn, data.contact.website])

  if (links) {
    doc
      .font("Helvetica")
      .fontSize(8.5)
      .fillColor("#fcd34d")
      .text(links, 40, 84, {
        width: 532,
      })
  }
}

function drawSidebarBackground(doc: PdfDoc) {
  doc.rect(0, HEADER_HEIGHT, 210, 700).fill(SIDEBAR_BG)

  doc
    .moveTo(210, HEADER_HEIGHT)
    .lineTo(210, 792)
    .strokeColor(BORDER)
    .lineWidth(1)
    .stroke()
}

function drawExecutiveSidebar(doc: PdfDoc, data: ResumeBuilderFormData) {
  doc.y = HEADER_HEIGHT + 26
  doc.x = SIDEBAR_X

  sidebarSectionTitle(doc, "Leadership Areas")

  const leadershipSkills = data.skills.length
    ? data.skills.slice(0, 14)
    : [
        "Strategic Leadership",
        "Operations Management",
        "Team Development",
        "Business Growth",
      ]

  leadershipSkills.forEach((skill) => competencyChip(doc, skill))

  doc.moveDown(0.8)
  sidebarSectionTitle(doc, "Credentials")

  if (data.certifications.length > 0) {
    data.certifications.slice(0, 10).forEach((certification) => {
      sidebarLine(doc, `• ${certification}`)
    })
  } else {
    sidebarLine(doc, "Certifications not added yet.")
  }

  doc.moveDown(0.8)
  sidebarSectionTitle(doc, "Education")

  data.education.forEach((edu) => {
    ensurePageSpace(doc, 56)

    doc
      .font("Helvetica-Bold")
      .fontSize(8.8)
      .fillColor(CHARCOAL)
      .text(edu.degree || "Degree", SIDEBAR_X, doc.y, {
        width: SIDEBAR_WIDTH,
      })

    doc
      .font("Helvetica")
      .fontSize(8.3)
      .fillColor(MUTED)
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

function executiveSummaryBox(doc: PdfDoc, summary: string) {
  const text = cleanText(summary) || "Executive summary not added yet."

  ensurePageSpace(doc, 110)

  const startY = doc.y

  doc.roundedRect(CONTENT_X, startY, CONTENT_WIDTH, 76, 10).fill("#fffbeb")

  doc
    .font("Helvetica")
    .fontSize(9.6)
    .fillColor(SLATE)
    .text(text, CONTENT_X + 14, startY + 12, {
      width: CONTENT_WIDTH - 28,
      lineGap: 2,
    })

  doc.y = Math.max(doc.y, startY + 90)
}

function executiveBullet(doc: PdfDoc, text: string) {
  const cleaned = cleanText(text)
  if (!cleaned) return

  ensurePageSpace(doc, 44)

  doc
    .font("Helvetica")
    .fontSize(9.3)
    .fillColor(SLATE)
    .text(`• ${cleaned}`, CONTENT_X, doc.y, {
      width: CONTENT_WIDTH,
      indent: 10,
      lineGap: 1.7,
    })
}

function drawExecutiveMainContent(doc: PdfDoc, data: ResumeBuilderFormData) {
  doc.x = CONTENT_X
  doc.y = HEADER_HEIGHT + 26

  executiveSectionTitle(doc, "Executive Profile", CONTENT_X, CONTENT_WIDTH)
  executiveSummaryBox(doc, data.summary)

  executiveSectionTitle(doc, "Professional Experience", CONTENT_X, CONTENT_WIDTH)

  data.experience.forEach((job) => {
    ensurePageSpace(doc, 135)

    doc
      .font("Helvetica-Bold")
      .fontSize(11.5)
      .fillColor(CHARCOAL)
      .text(job.role || "Executive Role", CONTENT_X, doc.y, {
        width: CONTENT_WIDTH,
      })

    if (job.company) {
      doc
        .font("Helvetica-Bold")
        .fontSize(9.8)
        .fillColor(GOLD)
        .text(job.company, CONTENT_X, doc.y + 1, {
          width: CONTENT_WIDTH,
        })
    }

    const meta = joinText([job.location, job.startDate, job.endDate])

    if (meta) {
      doc
        .font("Helvetica")
        .fontSize(8.8)
        .fillColor(MUTED)
        .text(meta, CONTENT_X, doc.y + 2, {
          width: CONTENT_WIDTH,
        })
    }

    doc.moveDown(0.3)

    job.bullets.filter(Boolean).forEach((item) => executiveBullet(doc, item))

    doc.moveDown(0.7)
  })
}

export function drawExecutive(doc: PdfDoc, data: ResumeBuilderFormData) {
  drawExecutiveHeader(doc, data)
  drawSidebarBackground(doc)
  drawExecutiveSidebar(doc, data)
  drawExecutiveMainContent(doc, data)
}
