import type { ResumeBuilderFormData } from "@/modules/resume-builder"

type ClassicTemplateProps = {
  data: ResumeBuilderFormData
}

function stripHtml(value: string) {
  return value.replace(/<[^>]+>/g, "").trim()
}

export function ClassicTemplate({ data }: ClassicTemplateProps) {
  return (
    <article
      style={{
        background: "#ffffff",
        color: "#111827",
        padding: "32px",
        border: "1px solid #e5e7eb",
        borderRadius: "14px",
        lineHeight: 1.55,
      }}
    >
      <header style={{ textAlign: "center", borderBottom: "2px solid #111827", paddingBottom: "14px" }}>
        <h1 style={{ fontSize: "30px", fontWeight: 800 }}>
          {data.contact.fullName || "Your Name"}
        </h1>

        <p style={{ marginTop: "8px", color: "#374151" }}>
          {[data.contact.email, data.contact.phone, data.contact.location]
            .filter(Boolean)
            .join(" • ")}
        </p>

        <p style={{ marginTop: "4px", color: "#374151" }}>
          {[data.contact.linkedIn, data.contact.website].filter(Boolean).join(" • ")}
        </p>
      </header>

      <section style={{ marginTop: "22px" }}>
        <h2 style={{ fontSize: "16px", fontWeight: 800, textTransform: "uppercase" }}>
          Professional Summary
        </h2>
        <p style={{ marginTop: "8px" }}>
          {stripHtml(data.summary) || "Professional summary not added yet."}
        </p>
      </section>

      <section style={{ marginTop: "22px" }}>
        <h2 style={{ fontSize: "16px", fontWeight: 800, textTransform: "uppercase" }}>
          Work Experience
        </h2>

        <div style={{ display: "grid", gap: "16px", marginTop: "10px" }}>
          {data.experience.map((item) => (
            <div key={item.id}>
              <strong>
                {item.role || "Role"} {item.company ? `— ${item.company}` : ""}
              </strong>

              <p style={{ color: "#4b5563", marginTop: "4px" }}>
                {[item.location, item.startDate, item.endDate].filter(Boolean).join(" • ")}
              </p>

              <ul style={{ marginTop: "8px", paddingLeft: "20px" }}>
                {item.bullets.filter(Boolean).map((bullet, index) => (
                  <li key={`${item.id}-classic-${index}`}>{stripHtml(bullet)}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section style={{ marginTop: "22px" }}>
        <h2 style={{ fontSize: "16px", fontWeight: 800, textTransform: "uppercase" }}>
          Education
        </h2>

        {data.education.map((item) => (
          <p key={item.id} style={{ marginTop: "8px" }}>
            <strong>{item.degree || "Degree"}</strong>
            {item.field ? `, ${item.field}` : ""} — {item.school || "School"}
            {item.graduationDate ? ` • ${item.graduationDate}` : ""}
          </p>
        ))}
      </section>

      <section style={{ marginTop: "22px" }}>
        <h2 style={{ fontSize: "16px", fontWeight: 800, textTransform: "uppercase" }}>
          Skills
        </h2>
        <p style={{ marginTop: "8px" }}>
          {data.skills.length ? data.skills.join(", ") : "Skills not added yet."}
        </p>
      </section>

      <section style={{ marginTop: "22px" }}>
        <h2 style={{ fontSize: "16px", fontWeight: 800, textTransform: "uppercase" }}>
          Certifications
        </h2>
        <p style={{ marginTop: "8px" }}>
          {data.certifications.length
            ? data.certifications.join(", ")
            : "Certifications not added yet."}
        </p>
      </section>
    </article>
  )
}