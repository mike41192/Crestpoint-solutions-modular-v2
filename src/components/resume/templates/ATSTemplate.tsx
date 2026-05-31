import type { ResumeBuilderFormData } from "@/modules/resume-builder"

type ATSTemplateProps = {
  data: ResumeBuilderFormData
}

function stripHtml(value: string) {
  return value.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim()
}

function cleanText(value?: string) {
  return stripHtml(value || "")
}

function joinText(values: Array<string | undefined>) {
  return values.filter(Boolean).join(" | ")
}

const sectionStyle = {
  marginTop: "18px",
}

const sectionTitleStyle = {
  fontSize: "13px",
  fontWeight: 900,
  textTransform: "uppercase" as const,
  letterSpacing: "0.06em",
  borderBottom: "1px solid #111827",
  paddingBottom: "4px",
  marginBottom: "8px",
}

export function ATSTemplate({ data }: ATSTemplateProps) {
  return (
    <article
      style={{
        background: "#ffffff",
        color: "#111827",
        padding: "34px 42px",
        border: "1px solid #e5e7eb",
        borderRadius: "8px",
        fontFamily: "Arial, Helvetica, sans-serif",
        fontSize: "12px",
        lineHeight: 1.45,
      }}
    >
      <header style={{ textAlign: "center" }}>
        <h1
          style={{
            fontSize: "24px",
            fontWeight: 900,
            margin: 0,
            textTransform: "uppercase",
            letterSpacing: "0.04em",
          }}
        >
          {data.contact.fullName || "Your Name"}
        </h1>

        <p style={{ marginTop: "8px", marginBottom: 0 }}>
          {joinText([
            data.contact.email,
            data.contact.phone,
            data.contact.location,
            data.contact.linkedIn,
            data.contact.website,
          ])}
        </p>
      </header>

      <section style={sectionStyle}>
        <h2 style={sectionTitleStyle}>Professional Summary</h2>
        <p style={{ margin: 0 }}>
          {cleanText(data.summary) || "Professional summary not added yet."}
        </p>
      </section>

      <section style={sectionStyle}>
        <h2 style={sectionTitleStyle}>Core Skills</h2>
        <p style={{ margin: 0 }}>
          {data.skills.length ? data.skills.join(", ") : "Skills not added yet."}
        </p>
      </section>

      <section style={sectionStyle}>
        <h2 style={sectionTitleStyle}>Professional Experience</h2>

        <div style={{ display: "grid", gap: "14px" }}>
          {data.experience.map((item) => (
            <div key={item.id}>
              <p style={{ margin: 0, fontWeight: 900 }}>
                {item.role || "Role"}
                {item.company ? ` — ${item.company}` : ""}
              </p>

              <p style={{ marginTop: "3px", marginBottom: 0 }}>
                {joinText([item.location, item.startDate, item.endDate])}
              </p>

              <ul style={{ marginTop: "6px", marginBottom: 0, paddingLeft: "20px" }}>
                {item.bullets.filter(Boolean).map((bullet, index) => (
                  <li key={`${item.id}-ats-${index}`}>
                    {cleanText(bullet)}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section style={sectionStyle}>
        <h2 style={sectionTitleStyle}>Education</h2>

        {data.education.map((item) => (
          <p key={item.id} style={{ marginTop: "6px", marginBottom: 0 }}>
            <strong>{item.degree || "Degree"}</strong>
            {item.field ? `, ${item.field}` : ""} — {item.school || "School"}
            {item.graduationDate ? ` | ${item.graduationDate}` : ""}
          </p>
        ))}
      </section>

      <section style={sectionStyle}>
        <h2 style={sectionTitleStyle}>Certifications</h2>
        <p style={{ margin: 0 }}>
          {data.certifications.length
            ? data.certifications.join(", ")
            : "Certifications not added yet."}
        </p>
      </section>
    </article>
  )
}
