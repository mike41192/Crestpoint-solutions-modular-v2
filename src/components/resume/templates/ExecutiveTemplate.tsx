import type { ResumeBuilderFormData } from "@/modules/resume-builder"

type ExecutiveTemplateProps = {
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
  color: "#111827",
  textTransform: "uppercase" as const,
  letterSpacing: "0.08em",
  borderBottom: "1.5px solid #111827",
  paddingBottom: "4px",
  margin: 0,
  breakAfter: "avoid" as const,
  pageBreakAfter: "avoid" as const,
}

export function ExecutiveTemplate({ data }: ExecutiveTemplateProps) {
  return (
    <article
      style={{
        background: "#ffffff",
        border: "1px solid #d1d5db",
        borderRadius: "18px",
        overflow: "hidden",
        boxShadow: "0 8px 24px rgba(0,0,0,0.05)",
        fontSize: "11.5px",
        lineHeight: 1.35,
        color: "#111827",
      }}
    >
      <header
        style={{
          background: "#111827",
          color: "#ffffff",
          padding: "24px 30px",
        }}
      >
        <h1
          style={{
            fontSize: "29px",
            fontWeight: 900,
            letterSpacing: "0.3px",
            lineHeight: 1.05,
            margin: 0,
          }}
        >
          {data.contact.fullName || "Executive Candidate"}
        </h1>

        <p style={{ marginTop: "7px", marginBottom: 0, color: "#d1d5db", fontSize: "10.5px" }}>
          {[data.contact.email, data.contact.phone, data.contact.location].filter(Boolean).join(" • ")}
        </p>

        {[data.contact.linkedIn, data.contact.website].filter(Boolean).length > 0 && (
          <p style={{ marginTop: "3px", marginBottom: 0, color: "#d1d5db", fontSize: "10.5px" }}>
            {[data.contact.linkedIn, data.contact.website].filter(Boolean).join(" • ")}
          </p>
        )}
      </header>

      <div style={{ padding: "22px 30px" }}>
        <section style={{ marginTop: 0 }}>
          <h2 style={sectionTitleStyle}>Executive Summary</h2>

          <p style={{ marginTop: "8px", marginBottom: 0, color: "#374151" }}>
            {cleanText(data.summary) || "Executive summary not added yet."}
          </p>
        </section>

        <section style={{ marginTop: "16px" }}>
          <h2 style={sectionTitleStyle}>Professional Experience</h2>

          <div style={{ marginTop: "10px", display: "grid", gap: "11px" }}>
            {data.experience.map((item) => (
              <div
                key={item.id}
                style={{
                  breakInside: "avoid",
                  pageBreakInside: "avoid",
                }}
              >
                <h3
                  style={{
                    fontSize: "13px",
                    fontWeight: 900,
                    margin: 0,
                    color: "#111827",
                  }}
                >
                  {item.role || "Position"}
                </h3>

                <p
                  style={{
                    marginTop: "3px",
                    marginBottom: 0,
                    color: "#4b5563",
                    fontWeight: 700,
                  }}
                >
                  {item.company || "Company"}
                </p>

                <p
                  style={{
                    marginTop: "2px",
                    marginBottom: 0,
                    color: "#6b7280",
                  }}
                >
                  {[item.location, item.startDate, item.endDate].filter(Boolean).join(" • ")}
                </p>

                <ul style={{ marginTop: "5px", marginBottom: 0, paddingLeft: "17px" }}>
                  {item.bullets.filter(Boolean).map((bullet, index) => (
                    <li
                      key={`${item.id}-executive-${index}`}
                      style={{
                        marginBottom: "2px",
                        color: "#374151",
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

        <section style={{ marginTop: "16px" }}>
          <h2 style={sectionTitleStyle}>Education</h2>

          <div style={{ marginTop: "8px", display: "grid", gap: "6px" }}>
            {data.education.map((item) => (
              <div
                key={item.id}
                style={{
                  breakInside: "avoid",
                  pageBreakInside: "avoid",
                }}
              >
                <strong>
                  {item.degree || "Degree"}
                  {item.field ? `, ${item.field}` : ""}
                </strong>

                <p style={{ marginTop: "2px", marginBottom: 0, color: "#4b5563" }}>
                  {item.school || "School"}
                  {item.graduationDate ? ` • ${item.graduationDate}` : ""}
                </p>
              </div>
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