import type { ResumeBuilderFormData } from "@/modules/resume-builder"

type ClassicTemplateProps = {
  data: ResumeBuilderFormData
}

function stripHtml(value: string) {
  return value.replace(/<[^>]+>/g, "").trim()
}

function cleanText(value?: string) {
  return stripHtml(value || "").replace(/\s+/g, " ").trim()
}

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

export function ClassicTemplate({ data }: ClassicTemplateProps) {
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
          {[data.contact.email, data.contact.phone, data.contact.location].filter(Boolean).join(" • ")}
        </p>

        {[data.contact.linkedIn, data.contact.website].filter(Boolean).length > 0 && (
          <p style={{ marginTop: "3px", marginBottom: 0, color: "#374151", fontSize: "11px" }}>
            {[data.contact.linkedIn, data.contact.website].filter(Boolean).join(" • ")}
          </p>
        )}
      </header>

      <section style={{ marginTop: "14px" }}>
        <h2 style={sectionTitleStyle}>Professional Summary</h2>
        <p style={{ margin: 0 }}>
          {cleanText(data.summary) || "Professional summary not added yet."}
        </p>
      </section>

      <section style={{ marginTop: "14px" }}>
        <h2 style={sectionTitleStyle}>Work Experience</h2>

        <div style={{ display: "grid", gap: "11px" }}>
          {data.experience.map((item) => (
            <div
              key={item.id}
              style={{
                breakInside: "avoid",
                pageBreakInside: "avoid",
              }}
            >
              <strong style={{ fontSize: "12px" }}>
                {item.role || "Role"} {item.company ? `— ${item.company}` : ""}
              </strong>

              <p style={{ color: "#4b5563", marginTop: "2px", marginBottom: 0 }}>
                {[item.location, item.startDate, item.endDate].filter(Boolean).join(" • ")}
              </p>

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
          ))}
        </div>
      </section>

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

      <section style={{ marginTop: "14px" }}>
        <h2 style={sectionTitleStyle}>Skills</h2>
        <p style={{ margin: 0, overflowWrap: "anywhere" }}>
          {data.skills.length ? data.skills.join(", ") : "Skills not added yet."}
        </p>
      </section>

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
