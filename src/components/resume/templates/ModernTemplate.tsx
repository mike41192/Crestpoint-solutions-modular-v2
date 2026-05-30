import type { ResumeBuilderFormData } from "@/modules/resume-builder"

type ModernTemplateProps = {
  data: ResumeBuilderFormData
}

function stripHtml(value: string) {
  return value.replace(/<[^>]+>/g, "").trim()
}

function cleanText(value?: string) {
  return stripHtml(value || "").replace(/\s+/g, " ").trim()
}

const sectionTitleStyle = {
  fontSize: "13px",
  fontWeight: 900,
  textTransform: "uppercase" as const,
  letterSpacing: "0.08em",
  margin: 0,
  breakAfter: "avoid" as const,
  pageBreakAfter: "avoid" as const,
}

export function ModernTemplate({ data }: ModernTemplateProps) {
  return (
    <article
      style={{
        background: "#ffffff",
        color: "#0f172a",
        border: "1px solid #e2e8f0",
        borderRadius: "16px",
        overflow: "hidden",
        fontSize: "11.5px",
        lineHeight: 1.35,
      }}
    >
      <header
        style={{
          padding: "22px 26px",
          background: "#0f172a",
          color: "#ffffff",
        }}
      >
        <h1 style={{ fontSize: "28px", fontWeight: 900, lineHeight: 1.05, margin: 0 }}>
          {data.contact.fullName || "Your Name"}
        </h1>

        <p style={{ marginTop: "6px", marginBottom: 0, color: "#cbd5e1", fontSize: "10.5px" }}>
          {[data.contact.email, data.contact.phone, data.contact.location].filter(Boolean).join(" • ")}
        </p>

        {[data.contact.linkedIn, data.contact.website].filter(Boolean).length > 0 && (
          <p style={{ marginTop: "3px", marginBottom: 0, color: "#cbd5e1", fontSize: "10.5px" }}>
            {[data.contact.linkedIn, data.contact.website].filter(Boolean).join(" • ")}
          </p>
        )}
      </header>

      <div style={{ padding: "20px 26px" }}>
        <section>
          <h2 style={sectionTitleStyle}>Professional Summary</h2>
          <p style={{ marginTop: "7px", marginBottom: 0, color: "#334155" }}>
            {cleanText(data.summary) || "Professional summary not added yet."}
          </p>
        </section>

        <section style={{ marginTop: "16px" }}>
          <h2 style={sectionTitleStyle}>Work Experience</h2>

          <div style={{ marginTop: "9px", display: "grid", gap: "11px" }}>
            {data.experience.map((item) => (
              <div key={item.id}>
                <strong style={{ fontSize: "12px" }}>
                  {item.role || "Role"}
                  {item.company ? ` — ${item.company}` : ""}
                </strong>

                <p style={{ color: "#64748b", marginTop: "2px", marginBottom: 0 }}>
                  {[item.location, item.startDate, item.endDate].filter(Boolean).join(" • ")}
                </p>

                <ul style={{ marginTop: "5px", marginBottom: 0, paddingLeft: "17px" }}>
                  {item.bullets.filter(Boolean).map((bullet, index) => (
                    <li key={`${item.id}-modern-${index}`} style={{ marginBottom: "2px" }}>
                      {cleanText(bullet)}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section style={{ marginTop: "16px" }}>
          <h2 style={sectionTitleStyle}>Education</h2>

          <div style={{ marginTop: "8px", display: "grid", gap: "6px" }}>
            {data.education.map((item) => (
              <p key={item.id} style={{ margin: 0 }}>
                <strong>{item.degree || "Degree"}</strong>
                {item.field ? `, ${item.field}` : ""} — {item.school || "School"}
                {item.graduationDate ? ` • ${item.graduationDate}` : ""}
              </p>
            ))}
          </div>
        </section>

        <section
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "18px",
            marginTop: "16px",
          }}
        >
          <div>
            <h2 style={sectionTitleStyle}>Skills</h2>
            <p style={{ marginTop: "8px", marginBottom: 0, overflowWrap: "anywhere" }}>
              {data.skills.length ? data.skills.join(", ") : "Skills not added yet."}
            </p>
          </div>

          <div>
            <h2 style={sectionTitleStyle}>Certifications</h2>
            <p style={{ marginTop: "8px", marginBottom: 0, overflowWrap: "anywhere" }}>
              {data.certifications.length
                ? data.certifications.join(", ")
                : "Certifications not added yet."}
            </p>
          </div>
        </section>
      </div>
    </article>
  )
}
