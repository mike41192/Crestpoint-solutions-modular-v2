import type { ResumeBuilderFormData } from "@/modules/resume-builder"

type ExecutiveTemplateProps = {
  data: ResumeBuilderFormData
}

function stripHtml(value: string) {
  return value.replace(/<[^>]+>/g, "").trim()
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
      }}
    >
      <header
        style={{
          background: "#111827",
          color: "#ffffff",
          padding: "36px",
        }}
      >
        <h1
          style={{
            fontSize: "36px",
            fontWeight: 800,
            letterSpacing: "0.5px",
          }}
        >
          {data.contact.fullName || "Executive Candidate"}
        </h1>

        <p style={{ marginTop: "10px", color: "#d1d5db" }}>
          {[data.contact.email, data.contact.phone, data.contact.location]
            .filter(Boolean)
            .join(" • ")}
        </p>

        <p style={{ marginTop: "6px", color: "#d1d5db" }}>
          {[data.contact.linkedIn, data.contact.website]
            .filter(Boolean)
            .join(" • ")}
        </p>
      </header>

      <div style={{ padding: "32px" }}>
        <section>
          <h2
            style={{
              fontSize: "18px",
              fontWeight: 800,
              color: "#111827",
              borderBottom: "2px solid #111827",
              paddingBottom: "8px",
            }}
          >
            Executive Summary
          </h2>

          <p
            style={{
              marginTop: "12px",
              lineHeight: 1.8,
              color: "#374151",
            }}
          >
            {stripHtml(data.summary) ||
              "Executive summary not added yet."}
          </p>
        </section>

        <section style={{ marginTop: "28px" }}>
          <h2
            style={{
              fontSize: "18px",
              fontWeight: 800,
              color: "#111827",
              borderBottom: "2px solid #111827",
              paddingBottom: "8px",
            }}
          >
            Professional Experience
          </h2>

          <div
            style={{
              marginTop: "16px",
              display: "grid",
              gap: "24px",
            }}
          >
            {data.experience.map((item) => (
              <div key={item.id}>
                <h3
                  style={{
                    fontSize: "18px",
                    fontWeight: 700,
                  }}
                >
                  {item.role || "Position"}
                </h3>

                <p
                  style={{
                    marginTop: "4px",
                    color: "#4b5563",
                    fontWeight: 600,
                  }}
                >
                  {item.company || "Company"}
                </p>

                <p
                  style={{
                    marginTop: "4px",
                    color: "#6b7280",
                  }}
                >
                  {[item.location, item.startDate, item.endDate]
                    .filter(Boolean)
                    .join(" • ")}
                </p>

                <ul
                  style={{
                    marginTop: "10px",
                    paddingLeft: "22px",
                  }}
                >
                  {item.bullets.filter(Boolean).map((bullet, index) => (
                    <li
                      key={`${item.id}-executive-${index}`}
                      style={{
                        marginBottom: "6px",
                        color: "#374151",
                      }}
                    >
                      {stripHtml(bullet)}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section style={{ marginTop: "28px" }}>
          <h2
            style={{
              fontSize: "18px",
              fontWeight: 800,
              color: "#111827",
              borderBottom: "2px solid #111827",
              paddingBottom: "8px",
            }}
          >
            Education
          </h2>

          <div style={{ marginTop: "12px" }}>
            {data.education.map((item) => (
              <div key={item.id} style={{ marginBottom: "12px" }}>
                <strong>
                  {item.degree || "Degree"}
                  {item.field ? `, ${item.field}` : ""}
                </strong>

                <p style={{ color: "#4b5563" }}>
                  {item.school || "School"}
                  {item.graduationDate
                    ? ` • ${item.graduationDate}`
                    : ""}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "24px",
            marginTop: "28px",
          }}
        >
          <div>
            <h2
              style={{
                fontSize: "18px",
                fontWeight: 800,
                color: "#111827",
                borderBottom: "2px solid #111827",
                paddingBottom: "8px",
              }}
            >
              Skills
            </h2>

            <p style={{ marginTop: "12px" }}>
              {data.skills.length
                ? data.skills.join(", ")
                : "Skills not added yet."}
            </p>
          </div>

          <div>
            <h2
              style={{
                fontSize: "18px",
                fontWeight: 800,
                color: "#111827",
                borderBottom: "2px solid #111827",
                paddingBottom: "8px",
              }}
            >
              Certifications
            </h2>

            <p style={{ marginTop: "12px" }}>
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