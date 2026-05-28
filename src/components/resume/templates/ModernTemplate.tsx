import type { ResumeBuilderFormData } from "@/modules/resume-builder"

type ModernTemplateProps = {
  data: ResumeBuilderFormData
}

function stripHtml(value: string) {
  return value.replace(/<[^>]+>/g, "").trim()
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
      }}
    >
      <header
        style={{
          padding: "28px",
          background: "#0f172a",
          color: "#ffffff",
        }}
      >
        <h1 style={{ fontSize: "32px", fontWeight: 800 }}>
          {data.contact.fullName || "Your Name"}
        </h1>

        <p style={{ marginTop: "8px", color: "#cbd5e1" }}>
          {[data.contact.email, data.contact.phone, data.contact.location]
            .filter(Boolean)
            .join(" • ")}
        </p>

        <p style={{ marginTop: "4px", color: "#cbd5e1" }}>
          {[data.contact.linkedIn, data.contact.website]
            .filter(Boolean)
            .join(" • ")}
        </p>
      </header>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(220px, 0.8fr) minmax(320px, 2fr)",
        }}
      >
        <aside
          style={{
            padding: "24px",
            background: "#f8fafc",
            borderRight: "1px solid #e2e8f0",
          }}
        >
          <section>
            <h2 style={{ fontSize: "15px", fontWeight: 800 }}>
              Skills
            </h2>

            <div style={{ marginTop: "10px", display: "grid", gap: "8px" }}>
              {data.skills.length > 0 ? (
                data.skills.map((skill, index) => (
                  <span
                    key={`${skill}-${index}`}
                    style={{
                      padding: "7px 10px",
                      borderRadius: "999px",
                      background: "#e0f2fe",
                      color: "#075985",
                      fontWeight: 700,
                      fontSize: "13px",
                    }}
                  >
                    {skill}
                  </span>
                ))
              ) : (
                <p style={{ color: "#64748b" }}>Skills not added yet.</p>
              )}
            </div>
          </section>

          <section style={{ marginTop: "24px" }}>
            <h2 style={{ fontSize: "15px", fontWeight: 800 }}>
              Certifications
            </h2>

            <ul style={{ marginTop: "10px", paddingLeft: "18px" }}>
              {data.certifications.length > 0 ? (
                data.certifications.map((certification, index) => (
                  <li key={`${certification}-${index}`}>
                    {certification}
                  </li>
                ))
              ) : (
                <li style={{ color: "#64748b" }}>Not added yet.</li>
              )}
            </ul>
          </section>

          <section style={{ marginTop: "24px" }}>
            <h2 style={{ fontSize: "15px", fontWeight: 800 }}>
              Education
            </h2>

            <div style={{ marginTop: "10px", display: "grid", gap: "10px" }}>
              {data.education.map((item) => (
                <div key={item.id}>
                  <strong>{item.degree || "Degree"}</strong>

                  <p style={{ color: "#64748b", marginTop: "4px" }}>
                    {item.school || "School"}
                  </p>

                  {item.graduationDate && (
                    <p style={{ color: "#64748b", marginTop: "2px" }}>
                      {item.graduationDate}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        </aside>

        <main style={{ padding: "24px" }}>
          <section>
            <h2 style={{ fontSize: "18px", fontWeight: 800 }}>
              Professional Summary
            </h2>

            <p style={{ marginTop: "8px", color: "#334155", lineHeight: 1.6 }}>
              {stripHtml(data.summary) || "Professional summary not added yet."}
            </p>
          </section>

          <section style={{ marginTop: "24px" }}>
            <h2 style={{ fontSize: "18px", fontWeight: 800 }}>
              Work Experience
            </h2>

            <div style={{ marginTop: "12px", display: "grid", gap: "18px" }}>
              {data.experience.map((item) => (
                <div key={item.id}>
                  <strong style={{ fontSize: "16px" }}>
                    {item.role || "Role"}
                    {item.company ? ` — ${item.company}` : ""}
                  </strong>

                  <p style={{ color: "#64748b", marginTop: "4px" }}>
                    {[item.location, item.startDate, item.endDate]
                      .filter(Boolean)
                      .join(" • ")}
                  </p>

                  <ul style={{ marginTop: "8px", paddingLeft: "20px" }}>
                    {item.bullets.filter(Boolean).map((bullet, index) => (
                      <li key={`${item.id}-modern-${index}`}>
                        {stripHtml(bullet)}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        </main>
      </div>
    </article>
  )
}