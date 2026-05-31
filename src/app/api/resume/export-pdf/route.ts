import type {
  ResumeBuilderFormData,
  ResumeTemplateType,
} from "@/modules/resume-builder"

export const runtime = "nodejs"

type PdfDoc = any

function stripHtml(value: string) {
  return value.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim()
}

function cleanText(value?: string) {
  return stripHtml(value || "")
}

function joinText(values: Array<string | undefined>) {
  return values.filter(Boolean).join(" • ")
}

function sectionTitle(doc: PdfDoc, title: string, template: ResumeTemplateType) {
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

function bullet(doc: PdfDoc, text: string) {
  if (!text.trim()) return

  doc
    .font("Helvetica")
    .fontSize(10)
    .fillColor("#374151")
    .text(`• ${cleanText(text)}`, {
      indent: 10,
      lineGap: 2,
    })
}

function drawClassic(doc: PdfDoc, data: ResumeBuilderFormData) {
  doc.fillColor("#111827")

  doc
    .font("Helvetica-Bold")
    .fontSize(24)
    .text(data.contact.fullName || "Your Name", {
      align: "center",
    })

  doc.moveDown(0.3)

  doc
    .font("Helvetica")
    .fontSize(9.5)
    .fillColor("#374151")
    .text(
      joinText([
        data.contact.email,
        data.contact.phone,
        data.contact.location,
      ]),
      { align: "center" }
    )

  const links = joinText([data.contact.linkedIn, data.contact.website])

  if (links) {
    doc.text(links, { align: "center" })
  }

  doc.moveDown(0.7)

  doc
    .moveTo(50, doc.y)
    .lineTo(562, doc.y)
    .strokeColor("#111827")
    .lineWidth(1)
    .stroke()

  sectionTitle(doc, "Professional Summary", "classic")

  doc
    .font("Helvetica")
    .fontSize(10)
    .fillColor("#374151")
    .text(cleanText(data.summary) || "Professional summary not added yet.", {
      lineGap: 2,
    })

  sectionTitle(doc, "Work Experience", "classic")

  data.experience.forEach((job) => {
    doc
      .font("Helvetica-Bold")
      .fontSize(10.5)
      .fillColor("#111827")
      .text(`${job.role || "Role"}${job.company ? ` — ${job.company}` : ""}`)

    const meta = joinText([job.location, job.startDate, job.endDate])

    if (meta) {
      doc.font("Helvetica").fontSize(9).fillColor("#64748b").text(meta)
    }

    job.bullets.filter(Boolean).forEach((item) => bullet(doc, item))

    doc.moveDown(0.4)
  })

  sectionTitle(doc, "Education", "classic")

  data.education.forEach((edu) => {
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

  sectionTitle(doc, "Skills", "classic")

  doc
    .font("Helvetica")
    .fontSize(10)
    .fillColor("#374151")
    .text(data.skills.length ? data.skills.join(", ") : "Skills not added yet.")

  sectionTitle(doc, "Certifications", "classic")

  doc
    .font("Helvetica")
    .fontSize(10)
    .fillColor("#374151")
    .text(
      data.certifications.length
        ? data.certifications.join(", ")
        : "Certifications not added yet."
    )
}

function drawModern(doc: PdfDoc, data: ResumeBuilderFormData) {
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
    .text(
      joinText([
        data.contact.email,
        data.contact.phone,
        data.contact.location,
      ]),
      50,
      62
    )

  const links = joinText([data.contact.linkedIn, data.contact.website])

  if (links) {
    doc.text(links, 50, 76)
  }

  doc.x = 50
  doc.y = 125

  sectionTitle(doc, "Professional Summary", "modern")

  doc
    .font("Helvetica")
    .fontSize(10)
    .fillColor("#334155")
    .text(cleanText(data.summary) || "Professional summary not added yet.", {
      lineGap: 2,
    })

  sectionTitle(doc, "Work Experience", "modern")

  data.experience.forEach((job) => {
    doc
      .font("Helvetica-Bold")
      .fontSize(11)
      .fillColor("#0f172a")
      .text(`${job.role || "Role"}${job.company ? ` — ${job.company}` : ""}`)

    const meta = joinText([job.location, job.startDate, job.endDate])

    if (meta) {
      doc.font("Helvetica").fontSize(9).fillColor("#64748b").text(meta)
    }

    job.bullets.filter(Boolean).forEach((item) => bullet(doc, item))

    doc.moveDown(0.5)
  })

  sectionTitle(doc, "Skills", "modern")

  doc
    .font("Helvetica")
    .fontSize(10)
    .fillColor("#075985")
    .text(data.skills.length ? data.skills.join(" • ") : "Skills not added yet.", {
      lineGap: 2,
    })

  sectionTitle(doc, "Education", "modern")

  data.education.forEach((edu) => {
    doc
      .font("Helvetica-Bold")
      .fontSize(10)
      .fillColor("#0f172a")
      .text(`${edu.degree || "Degree"}${edu.field ? `, ${edu.field}` : ""}`)

    doc
      .font("Helvetica")
      .fontSize(9.5)
      .fillColor("#475569")
      .text(
        `${edu.school || "School"}${
          edu.graduationDate ? ` • ${edu.graduationDate}` : ""
        }`
      )

    doc.moveDown(0.3)
  })

  sectionTitle(doc, "Certifications", "modern")

  doc
    .font("Helvetica")
    .fontSize(10)
    .fillColor("#334155")
    .text(
      data.certifications.length
        ? data.certifications.join(", ")
        : "Certifications not added yet."
    )
}

function drawExecutive(doc: PdfDoc, data: ResumeBuilderFormData) {
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
    .text(
      joinText([
        data.contact.email,
        data.contact.phone,
        data.contact.location,
      ]),
      50,
      68
    )

  const links = joinText([data.contact.linkedIn, data.contact.website])

  if (links) {
    doc.text(links, 50, 82)
  }

  doc.x = 50
  doc.y = 135

  sectionTitle(doc, "Executive Summary", "executive")

  doc
    .font("Helvetica")
    .fontSize(10.5)
    .fillColor("#374151")
    .text(cleanText(data.summary) || "Executive summary not added yet.", {
      lineGap: 3,
    })

  sectionTitle(doc, "Professional Experience", "executive")

  data.experience.forEach((job) => {
    doc
      .font("Helvetica-Bold")
      .fontSize(11.5)
      .fillColor("#111827")
      .text(job.role || "Position")

    if (job.company) {
      doc.font("Helvetica-Bold").fontSize(10).fillColor("#4b5563").text(job.company)
    }

    const meta = joinText([job.location, job.startDate, job.endDate])

    if (meta) {
      doc.font("Helvetica").fontSize(9).fillColor("#6b7280").text(meta)
    }

    job.bullets.filter(Boolean).forEach((item) => bullet(doc, item))

    doc.moveDown(0.6)
  })

  sectionTitle(doc, "Education", "executive")

  data.education.forEach((edu) => {
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

  sectionTitle(doc, "Skills", "executive")

  doc
    .font("Helvetica")
    .fontSize(10)
    .fillColor("#374151")
    .text(data.skills.length ? data.skills.join(", ") : "Skills not added yet.")

  sectionTitle(doc, "Certifications", "executive")

  doc
    .font("Helvetica")
    .fontSize(10)
    .fillColor("#374151")
    .text(
      data.certifications.length
        ? data.certifications.join(", ")
        : "Certifications not added yet."
    )
}

function drawResume(
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

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const data = body.data as ResumeBuilderFormData
    const template = (body.template || "classic") as ResumeTemplateType

    if (!data) {
      return Response.json(
        {
          status: "error",
          message: "Resume data missing.",
        },
        {
          status: 400,
        }
      )
    }

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

    const pdfPromise = new Promise<Uint8Array>((resolve) => {
      doc.on("end", () => {
        const merged = Buffer.concat(chunks.map((chunk) => Buffer.from(chunk)))
        resolve(new Uint8Array(merged))
      })
    })

    drawResume(doc, data, template)

    doc.end()

    const pdfBytes = await pdfPromise

    return new Response(pdfBytes as unknown as BodyInit, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="crestpoint-resume-${template}.pdf"`,
      },
    })
  } catch (error) {
    console.error("PDF export route error:", error)

    return Response.json(
      {
        status: "error",
        message: String(error),
      },
      {
        status: 500,
      }
    )
  }
}
