import {
  AlignmentType,
  BorderStyle,
  Document,
  HeadingLevel,
  Packer,
  Paragraph,
  ShadingType,
  Table,
  TableCell,
  TableRow,
  TextRun,
  WidthType,
} from "docx"
import type {
  ResumeBuilderFormData,
  ResumeTemplateType,
} from "@/modules/resume-builder"

function stripHtml(value: string) {
  return value.replace(/<[^>]+>/g, "").trim()
}

function text(value: string | undefined | null) {
  return stripHtml(value || "")
}

function contactLine(data: ResumeBuilderFormData) {
  return [
    data.contact.email,
    data.contact.phone,
    data.contact.location,
    data.contact.linkedIn,
    data.contact.website,
  ]
    .filter(Boolean)
    .map((item) => text(item))
    .join(" • ")
}

function heading(label: string, color = "111827") {
  return new Paragraph({
    children: [
      new TextRun({
        text: label.toUpperCase(),
        bold: true,
        color,
        size: 24,
      }),
    ],
    spacing: {
      before: 260,
      after: 120,
    },
    border: {
      bottom: {
        color,
        size: 6,
        style: BorderStyle.SINGLE,
      },
    },
  })
}

function paragraph(value: string) {
  return new Paragraph({
    children: [
      new TextRun({
        text: value,
        size: 22,
      }),
    ],
    spacing: {
      after: 100,
    },
  })
}

function italicParagraph(value: string) {
  return new Paragraph({
    children: [
      new TextRun({
        text: value,
        italics: true,
        color: "4B5563",
        size: 21,
      }),
    ],
    spacing: {
      after: 90,
    },
  })
}

function bullet(value: string) {
  return new Paragraph({
    children: [
      new TextRun({
        text: text(value),
        size: 21,
      }),
    ],
    bullet: {
      level: 0,
    },
    spacing: {
      after: 70,
    },
  })
}

function experienceParagraphs(data: ResumeBuilderFormData) {
  const children: Paragraph[] = []

  data.experience.forEach((item) => {
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: `${text(item.role || "Role")}${
              item.company ? ` — ${text(item.company)}` : ""
            }`,
            bold: true,
            size: 22,
          }),
        ],
        spacing: {
          before: 120,
          after: 70,
        },
      })
    )

    const meta = [item.location, item.startDate, item.endDate]
      .filter(Boolean)
      .map((value) => text(value))
      .join(" • ")

    if (meta) {
      children.push(italicParagraph(meta))
    }

    item.bullets.filter(Boolean).forEach((itemBullet) => {
      children.push(bullet(itemBullet))
    })
  })

  return children
}

function educationParagraphs(data: ResumeBuilderFormData) {
  const children: Paragraph[] = []

  data.education.forEach((item) => {
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: `${text(item.degree || "Degree")}${
              item.field ? `, ${text(item.field)}` : ""
            }`,
            bold: true,
            size: 22,
          }),
        ],
        spacing: {
          after: 70,
        },
      })
    )

    const meta = [item.school, item.graduationDate]
      .filter(Boolean)
      .map((value) => text(value))
      .join(" • ")

    if (meta) {
      children.push(italicParagraph(meta))
    }
  })

  return children
}

function classicChildren(data: ResumeBuilderFormData) {
  return [
    new Paragraph({
      children: [
        new TextRun({
          text: text(data.contact.fullName || "Your Name"),
          bold: true,
          size: 48,
        }),
      ],
      alignment: AlignmentType.CENTER,
      spacing: {
        after: 90,
      },
    }),

    new Paragraph({
      children: [
        new TextRun({
          text: contactLine(data),
          size: 21,
        }),
      ],
      alignment: AlignmentType.CENTER,
      spacing: {
        after: 220,
      },
    }),

    heading("Professional Summary"),
    paragraph(text(data.summary) || "Professional summary not added yet."),

    heading("Work Experience"),
    ...experienceParagraphs(data),

    heading("Education"),
    ...educationParagraphs(data),

    heading("Skills"),
    paragraph(
      data.skills.length
        ? data.skills.map((skill) => text(skill)).join(", ")
        : "Skills not added yet."
    ),

    heading("Certifications"),
    paragraph(
      data.certifications.length
        ? data.certifications.map((certification) => text(certification)).join(", ")
        : "Certifications not added yet."
    ),
  ]
}

function modernSkillParagraphs(data: ResumeBuilderFormData) {
  if (!data.skills.length) {
    return [paragraph("Skills not added yet.")]
  }

  return data.skills.map(
    (skill) =>
      new Paragraph({
        children: [
          new TextRun({
            text: text(skill),
            bold: true,
            color: "075985",
            size: 20,
          }),
        ],
        shading: {
          type: ShadingType.CLEAR,
          color: "auto",
          fill: "E0F2FE",
        },
        spacing: {
          after: 80,
        },
      })
  )
}

function modernChildren(data: ResumeBuilderFormData) {
  return [
    new Table({
      width: {
        size: 100,
        type: WidthType.PERCENTAGE,
      },
      rows: [
        new TableRow({
          children: [
            new TableCell({
              shading: {
                type: ShadingType.CLEAR,
                color: "auto",
                fill: "111827",
              },
              margins: {
                top: 260,
                bottom: 260,
                left: 260,
                right: 260,
              },
              children: [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: text(data.contact.fullName || "Your Name"),
                      bold: true,
                      color: "FFFFFF",
                      size: 46,
                    }),
                  ],
                  spacing: {
                    after: 100,
                  },
                }),
                new Paragraph({
                  children: [
                    new TextRun({
                      text: contactLine(data),
                      color: "CBD5E1",
                      size: 21,
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
      ],
    }),

    new Paragraph({ text: "", spacing: { after: 160 } }),

    new Table({
      width: {
        size: 100,
        type: WidthType.PERCENTAGE,
      },
      rows: [
        new TableRow({
          children: [
            new TableCell({
              width: {
                size: 32,
                type: WidthType.PERCENTAGE,
              },
              shading: {
                type: ShadingType.CLEAR,
                color: "auto",
                fill: "F8FAFC",
              },
              margins: {
                top: 180,
                bottom: 180,
                left: 180,
                right: 180,
              },
              children: [
                heading("Skills", "075985"),
                ...modernSkillParagraphs(data),
                heading("Certifications", "075985"),
                paragraph(
                  data.certifications.length
                    ? data.certifications
                        .map((certification) => text(certification))
                        .join(", ")
                    : "Certifications not added yet."
                ),
                heading("Education", "075985"),
                ...educationParagraphs(data),
              ],
            }),
            new TableCell({
              width: {
                size: 68,
                type: WidthType.PERCENTAGE,
              },
              margins: {
                top: 180,
                bottom: 180,
                left: 260,
                right: 180,
              },
              children: [
                heading("Professional Summary"),
                paragraph(
                  text(data.summary) || "Professional summary not added yet."
                ),
                heading("Work Experience"),
                ...experienceParagraphs(data),
              ],
            }),
          ],
        }),
      ],
    }),
  ]
}

function executiveChildren(data: ResumeBuilderFormData) {
  return [
    new Paragraph({
      children: [
        new TextRun({
          text: text(data.contact.fullName || "Executive Candidate"),
          bold: true,
          size: 54,
          color: "111827",
        }),
      ],
      alignment: AlignmentType.CENTER,
      spacing: {
        after: 100,
      },
    }),

    new Paragraph({
      children: [
        new TextRun({
          text: contactLine(data),
          color: "4B5563",
          size: 22,
        }),
      ],
      alignment: AlignmentType.CENTER,
      spacing: {
        after: 280,
      },
    }),

    heading("Executive Summary", "111827"),
    paragraph(text(data.summary) || "Executive summary not added yet."),

    heading("Professional Experience", "111827"),
    ...experienceParagraphs(data),

    heading("Education", "111827"),
    ...educationParagraphs(data),

    heading("Leadership Skills", "111827"),
    paragraph(
      data.skills.length
        ? data.skills.map((skill) => text(skill)).join(", ")
        : "Skills not added yet."
    ),

    heading("Certifications", "111827"),
    paragraph(
      data.certifications.length
        ? data.certifications.map((certification) => text(certification)).join(", ")
        : "Certifications not added yet."
    ),
  ]
}

export async function buildResumeDocxBuffer(
  data: ResumeBuilderFormData,
  template: ResumeTemplateType = "classic"
) {
  const children =
    template === "modern"
      ? modernChildren(data)
      : template === "executive"
        ? executiveChildren(data)
        : classicChildren(data)

  const document = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 720,
              right: 720,
              bottom: 720,
              left: 720,
            },
          },
        },
        children,
      },
    ],
  })

  return Packer.toBuffer(document)
}
