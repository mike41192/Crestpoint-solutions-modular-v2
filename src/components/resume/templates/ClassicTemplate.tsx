import type { ResumeBuilderFormData } from "@/modules/resume-builder"

// =====================================================
// BLOCK: Utility Imports
// =====================================================

import {
  buildExperienceMetaLine,
} from "@/modules/resume-builder/utils/experience-date-normalizer"

// =====================================================
// BLOCK: Component Types
// =====================================================

type ClassicTemplateProps = {
  data: ResumeBuilderFormData
}

// =====================================================
// BLOCK: Text Cleanup Helpers
// =====================================================

function stripHtml(value: string) {
  return value.replace(/<[^>]+>/g, "").trim()
}

function cleanText(value?: string) {
  return stripHtml(value || "").replace(/\s+/g, " ").trim()
}

// =====================================================
// BLOCK: Shared Styles
// =====================================================

const sectionTitleStyle = {
  fontSize: "12px",
  fontWeight: 900,
  textTransform: "uppercase" as const,
  letterSpacing: "0.08em",
  borderBottom: "1px solid #111827",
  paddingBottom: "3px",
  marginBottom: "7px",
  breakAfter: "avoid" as const,
  pageBreakAfter: "avoid" as const,
}

// =====================================================
// BLOCK: Classic Resume Template
// =====================================================

export function ClassicTemplate({ data }: ClassicTemplateProps) {
  console.log("CLASSIC TEMPLATE FULL EXPERIENCE DATA:", data.experience)

  return (
    <article
      style={{
        background: "#ffffff",
        color: "#111827",
        padding: "24px 30px",
        border: "1px solid #e5e7eb",
        borderRadius: "14px",
        lineHeight: 1.35,
        fontSize: "12px",
      }}
    >
      {/* =====================================================
          BLOCK: Resume Header
      ===================================================== */}

      <header
        style={{
          textAlign: "center",
          borderBottom: "1.5px solid #111827",
          paddingBottom: "10px",
        }}
      >
        <h1 style={{ fontSize: "25px", fontWeight: 900, lineHeight: 1.1, margin: 0 }}>
          {data.contact.fullName || "Your Name"}
        </h1>

        <p style={{ marginTop: "6px", marginBottom: 0, color: "#374151", fontSize: "11px" }}>
          {[data.contact.email, data.contact.phone, data.contact.location]
            .filter(Boolean)
            .join(" • ")}
        </p>

        {[data.contact.linkedIn, data.contact.website].filter(Boolean).length > 0 && (
          <p style={{ marginTop: "3px", marginBottom: 0, color: "#374151", fontSize: "11px" }}>
            {[data.contact.linkedIn, data.contact.website].filter(Boolean).join(" • ")}
          </p>
        )}
      </header>

      {/* =====================================================
          BLOCK: Professional Summary
      ===================================================== */}

      <section style={{ marginTop: "14px" }}>
        <h2 style={sectionTitleStyle}>Professional Summary</h2>
        <p style={{ margin: 0 }}>
          {cleanText(data.summary) || "Professional summary not added yet."}
        </p>
      </section>

      {/* =====================================================
          BLOCK: Work Experience
      ===================================================== */}

      <section style={{ marginTop: "14px" }}>
        <h2 style={sectionTitleStyle}>Work Experience</h2>

        <div style={{ display: "grid", gap: "11px" }}>
          {data.experience.map((item) => {
            console.log("CLASSIC TEMPLATE EXPERIENCE ITEM:", {
              id: item.id,
              role: item.role,
              company: item.company,
              location: item.location,
              startDate: item.startDate,
              endDate: item.endDate,
              bullets: item.bullets,
            })

            return (
              <div
                key={item.id}
                style={{
                  breakInside: "avoid",
                  pageBreakInside: "avoid",
                }}
              >
                {/* =====================================================
                    BLOCK: Experience Header
                ===================================================== */}

                <strong style={{ fontSize: "12px" }}>
                  {item.role || "Role"} {item.company ? `— ${item.company}` : ""}
                </strong>

                {/* =====================================================
                    BLOCK: Production Meta Line
                  ===================================================== */}

                    <p style={{ color: "#4b5563", marginTop: "2px", marginBottom: 0 }}>
                      {buildExperienceMetaLine(item)}
                    </p>

                {/* =====================================================
                    BLOCK: Experience Bullets
                ===================================================== */}

                <ul style={{ marginTop: "5px", marginBottom: 0, paddingLeft: "17px" }}>
                  {item.bullets.filter(Boolean).map((bullet, index) => (
                    <li
                      key={`${item.id}-classic-${index}`}
                      style={{
                        marginBottom: "2px",
                        breakInside: "avoid",
                        pageBreakInside: "avoid",
                      }}
                    >
                      {cleanText(bullet)}
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}
        </div>
      </section>

      {/* =====================================================
          BLOCK: Education
      ===================================================== */}

      <section style={{ marginTop: "14px" }}>
        <h2 style={sectionTitleStyle}>Education</h2>

        <div style={{ display: "grid", gap: "5px" }}>
          {data.education.map((item) => (
            <p
              key={item.id}
              style={{
                margin: 0,
                breakInside: "avoid",
                pageBreakInside: "avoid",
              }}
            >
              <strong>{item.degree || "Degree"}</strong>
              {item.field ? `, ${item.field}` : ""} — {item.school || "School"}
              {item.graduationDate ? ` • ${item.graduationDate}` : ""}
            </p>
          ))}
        </div>
      </section>

      {/* =====================================================
          BLOCK: Skills
      ===================================================== */}

      <section style={{ marginTop: "14px" }}>
        <h2 style={sectionTitleStyle}>Skills</h2>
        <p style={{ margin: 0, overflowWrap: "anywhere" }}>
          {data.skills.length ? data.skills.join(", ") : "Skills not added yet."}
        </p>
      </section>

      {/* =====================================================
          BLOCK: Certifications
      ===================================================== */}

      <section style={{ marginTop: "14px" }}>
        <h2 style={sectionTitleStyle}>Certifications</h2>
        <p style={{ margin: 0, overflowWrap: "anywhere" }}>
          {data.certifications.length
            ? data.certifications.join(", ")
            : "Certifications not added yet."}
        </p>
      </section>
    </article>
  )
}
