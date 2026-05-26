import type { ResumeBuilderFormData } from "@/modules/resume-builder"

type ResumeExportPreviewProps = {
  data: ResumeBuilderFormData
}

export function ResumeExportPreview({ data }: ResumeExportPreviewProps) {
  return (
    <article
      style={{
        border: "1px solid #e2e8f0",
        borderRadius: "16px",
        padding: "28px",
        background: "#ffffff",
        color: "#0f172a",
        lineHeight: 1.5,
      }}
    >
      <header style={{ borderBottom: "1px solid #e2e8f0", paddingBottom: "16px" }}>
        <h1 style={{ fontSize: "30px", fontWeight: 800 }}>
          {data.contact.fullName || "Your Name"}
        </h1>

        <p style={{ marginTop: "8px", color: "#475569" }}>
          {[data.contact.email, data.contact.phone, data.contact.location]
            .filter(Boolean)
            .join(" • ") || "Email • Phone • Location"}
        </p>

        <p style={{ marginTop: "4px", color: "#475569" }}>
          {[data.contact.linkedIn, data.contact.website]
            .filter(Boolean)
            .join(" • ")}
        </p>
      </header>

      <section style={{ marginTop: "20px" }}>
        <h2 style={{ fontSize: "18px", fontWeight: 800 }}>Professional Summary</h2>
        <p style={{ marginTop: "8px", color: "#334155" }}>
          {data.summary || "Your professional summary will appear here."}
        </p>
      </section>

      <section style={{ marginTop: "20px" }}>
        <h2 style={{ fontSize: "18px", fontWeight: 800 }}>Work Experience</h2>

        <div style={{ marginTop: "10px", display: "grid", gap: "16px" }}>
          {data.experience.map((item) => (
            <div key={item.id}>
              <strong>
                {item.role || "Role"} {item.company ? `| ${item.company}` : ""}
              </strong>

              <p style={{ color: "#64748b", marginTop: "4px" }}>
                {[item.location, item.startDate, item.endDate]
                  .filter(Boolean)
                  .join(" • ")}
              </p>

              <ul style={{ marginTop: "8px", paddingLeft: "20px" }}>
                {item.bullets.filter(Boolean).length > 0 ? (
                  item.bullets
                    .filter(Boolean)
                    .map((bullet) => <li key={bullet}>{bullet}</li>)
                ) : (
                  <li>Achievement bullet will appear here.</li>
                )}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section style={{ marginTop: "20px" }}>
        <h2 style={{ fontSize: "18px", fontWeight: 800 }}>Education</h2>

        <div style={{ marginTop: "10px", display: "grid", gap: "10px" }}>
          {data.education.map((item) => (
            <div key={item.id}>
              <strong>
                {item.degree || "Degree"} {item.field ? `in ${item.field}` : ""}
              </strong>

              <p style={{ color: "#64748b", marginTop: "4px" }}>
                {[item.school, item.graduationDate].filter(Boolean).join(" • ")}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section style={{ marginTop: "20px" }}>
        <h2 style={{ fontSize: "18px", fontWeight: 800 }}>Skills</h2>
        <p style={{ marginTop: "8px" }}>
          {data.skills.length > 0 ? data.skills.join(", ") : "Skills will appear here."}
        </p>
      </section>

      <section style={{ marginTop: "20px" }}>
        <h2 style={{ fontSize: "18px", fontWeight: 800 }}>Certifications</h2>
        <p style={{ marginTop: "8px" }}>
          {data.certifications.length > 0
            ? data.certifications.join(", ")
            : "Certifications will appear here."}
        </p>
      </section>
    </article>
  )
}