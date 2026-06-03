import type { ResumeBuilderFormData } from "@/modules/resume-builder"

type ModernTemplateProps = {
  data: ResumeBuilderFormData
}

// =====================================================
// BLOCK: Text Helpers
// =====================================================

function stripHtml(value: string) {
  return value.replace(/<[^>]+>/g, "").trim()
}

function cleanText(value?: string) {
  return stripHtml(value || "").replace(/\s+/g, " ").trim()
}

function cleanList(values: string[]) {
  return values.map((value) => cleanText(value)).filter(Boolean)
}

// =====================================================
// BLOCK: Shared Styles
// =====================================================

const sectionTitleStyle = {
  fontSize: "13px",
  fontWeight: 900,
  textTransform: "uppercase" as const,
  letterSpacing: "0.08em",
  margin: 0,
  breakAfter: "avoid" as const,
  pageBreakAfter: "avoid" as const,
}

const sectionDividerStyle = {
  height: "2px",
  width: "100%",
  background: "#2563eb",
  marginTop: "5px",
  marginBottom: "8px",
}

const sidebarSectionStyle = {
  minWidth: 0,
  overflow: "visible",
  breakInside: "avoid" as const,
  pageBreakInside: "avoid" as const,
}

const sidebarTextStyle = {
  marginTop: "7px",
  marginBottom: 0,
  color: "#334155",
  fontSize: "10.5px",
  lineHeight: 1.35,
  overflowWrap: "anywhere" as const,
  wordBreak: "normal" as const,
  whiteSpace: "normal" as const,
}

// =====================================================
// BLOCK: Modern Resume Template
// =====================================================

export function ModernTemplate({ data }: ModernTemplateProps) {
  const skills = cleanList(data.skills)
  const certifications = cleanList(data.certifications)

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
          breakInside: "avoid",
          pageBreakInside: "avoid",
        }}
      >
        <h1
          style={{
            fontSize: "28px",
            fontWeight: 900,
            lineHeight: 1.05,
            margin: 0,
            overflowWrap: "anywhere",
          }}
        >
          {cleanText(data.contact.fullName) || "Your Name"}
        </h1>

        <p
          style={{
            marginTop: "6px",
            marginBottom: 0,
            color: "#cbd5e1",
            fontSize: "10.5px",
            overflowWrap: "anywhere",
          }}
        >
          {[data.contact.email, data.contact.phone, data.contact.location]
            .map((item) => cleanText(item))
            .filter(Boolean)
            .join(" • ")}
        </p>

        {[data.contact.linkedIn, data.contact.website].filter(Boolean).length >
          0 && (
          <p
            style={{
              marginTop: "3px",
              marginBottom: 0,
              color: "#cbd5e1",
              fontSize: "10.5px",
              overflowWrap: "anywhere",
            }}
          >
            {[data.contact.linkedIn, data.contact.website]
              .map((item) => cleanText(item))
              .filter(Boolean)
              .join(" • ")}
          </p>
        )}
      </header>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(150px, 0.34fr) minmax(0, 0.66fr)",
          gap: "22px",
          alignItems: "start",
          padding: "20px 26px",
        }}
      >
        <aside
          style={{
            minWidth: 0,
            display: "grid",
            alignContent: "start",
            gap: "14px",
            overflow: "visible",
          }}
        >
          <section style={sidebarSectionStyle}>
            <h2 style={sectionTitleStyle}>Skills</h2>
            <div style={sectionDividerStyle} />

            <p style={sidebarTextStyle}>
              {skills.length ? skills.join(", ") : "Skills not added yet."}
            </p>
          </section>

          <section style={sidebarSectionStyle}>
            <h2 style={sectionTitleStyle}>Certifications</h2>
            <div style={sectionDividerStyle} />

            <p style={sidebarTextStyle}>
              {certifications.length
                ? certifications.join(", ")
                : "Certifications not added yet."}
            </p>
          </section>

          <section style={sidebarSectionStyle}>
            <h2 style={sectionTitleStyle}>Education</h2>
            <div style={sectionDividerStyle} />

            <div
              style={{
                display: "grid",
                gap: "7px",
                marginTop: "7px",
              }}
            >
              {data.education.length ? (
                data.education.map((item) => (
                  <p
                    key={item.id}
                    style={{
                      margin: 0,
                      color: "#334155",
                      fontSize: "10.5px",
                      lineHeight: 1.35,
                      overflowWrap: "anywhere",
                    }}
                  >
                    <strong>{cleanText(item.degree) || "Degree"}</strong>
                    {item.field ? `, ${cleanText(item.field)}` : ""}
                    <br />
                    {cleanText(item.school) || "School"}
                    {item.graduationDate
                      ? ` • ${cleanText(item.graduationDate)}`
                      : ""}
                  </p>
                ))
              ) : (
                <p style={sidebarTextStyle}>Education not added yet.</p>
              )}
            </div>
          </section>
        </aside>

        <main
          style={{
            minWidth: 0,
            overflow: "visible",
          }}
        >
          <section
            style={{
              breakInside: "avoid",
              pageBreakInside: "avoid",
            }}
          >
            <h2 style={sectionTitleStyle}>Professional Summary</h2>
            <div style={sectionDividerStyle} />

            <p
              style={{
                marginTop: "7px",
                marginBottom: 0,
                color: "#334155",
                overflowWrap: "anywhere",
              }}
            >
              {cleanText(data.summary) || "Professional summary not added yet."}
            </p>
          </section>

          <section style={{ marginTop: "16px" }}>
            <h2 style={sectionTitleStyle}>Work Experience</h2>
            <div style={sectionDividerStyle} />

            <div style={{ marginTop: "9px", display: "grid", gap: "11px" }}>
              {data.experience.length ? (
                data.experience.map((item) => {
                  const bullets = item.bullets
                    .map((bullet) => cleanText(bullet))
                    .filter(Boolean)

                  return (
                    <div
                      key={item.id}
                      style={{
                        minWidth: 0,
                        breakInside: "avoid",
                        pageBreakInside: "avoid",
                      }}
                    >
                      <strong
                        style={{
                          display: "block",
                          fontSize: "12px",
                          overflowWrap: "anywhere",
                        }}
                      >
                        {cleanText(item.role) || "Role"}
                        {item.company ? ` — ${cleanText(item.company)}` : ""}
                      </strong>

                      <p
                        style={{
                          color: "#64748b",
                          marginTop: "2px",
                          marginBottom: 0,
                          overflowWrap: "anywhere",
                        }}
                      >
                        {[item.location, item.startDate, item.endDate]
                          .map((value) => cleanText(value))
                          .filter(Boolean)
                          .join(" • ")}
                      </p>

                      {bullets.length > 0 && (
                        <ul
                          style={{
                            marginTop: "5px",
                            marginBottom: 0,
                            paddingLeft: "17px",
                          }}
                        >
                          {bullets.map((bullet, index) => (
                            <li
                              key={`${item.id}-modern-${index}`}
                              style={{
                                marginBottom: "2px",
                                overflowWrap: "anywhere",
                              }}
                            >
                              {bullet}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  )
                })
              ) : (
                <p style={{ margin: 0, color: "#64748b" }}>
                  Work experience not added yet.
                </p>
              )}
            </div>
          </section>
        </main>
      </div>
    </article>
  )
}
