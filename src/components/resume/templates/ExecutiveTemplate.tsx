import type { ResumeBuilderFormData } from "@/modules/resume-builder"

type ExecutiveTemplateProps = {
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
  color: "#111827",
  textTransform: "uppercase" as const,
  letterSpacing: "0.08em",
  borderBottom: "1.5px solid #111827",
  paddingBottom: "4px",
  margin: 0,
  breakAfter: "avoid" as const,
  pageBreakAfter: "avoid" as const,
}

const sidebarTitleStyle = {
  fontSize: "12.5px",
  fontWeight: 900,
  color: "#111827",
  textTransform: "uppercase" as const,
  letterSpacing: "0.08em",
  borderBottom: "1.5px solid #9a3412",
  paddingBottom: "4px",
  margin: 0,
  breakAfter: "avoid" as const,
  pageBreakAfter: "avoid" as const,
}

const sidebarTextStyle = {
  marginTop: "7px",
  marginBottom: 0,
  color: "#374151",
  fontSize: "10.5px",
  lineHeight: 1.35,
  overflowWrap: "anywhere" as const,
  wordBreak: "normal" as const,
  whiteSpace: "normal" as const,
}

// =====================================================
// BLOCK: Executive Resume Template
// =====================================================

export function ExecutiveTemplate({ data }: ExecutiveTemplateProps) {
  const skills = cleanList(data.skills)
  const certifications = cleanList(data.certifications)

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
          borderBottom: "4px solid #9a3412",
          breakInside: "avoid",
          pageBreakInside: "avoid",
        }}
      >
        <h1
          style={{
            fontSize: "29px",
            fontWeight: 900,
            letterSpacing: "0.3px",
            lineHeight: 1.05,
            margin: 0,
            overflowWrap: "anywhere",
          }}
        >
          {cleanText(data.contact.fullName) || "Executive Candidate"}
        </h1>

        <p
          style={{
            marginTop: "7px",
            marginBottom: 0,
            color: "#d1d5db",
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
              color: "#d1d5db",
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
          gridTemplateColumns: "minmax(155px, 0.34fr) minmax(0, 0.66fr)",
          gap: "24px",
          alignItems: "start",
          padding: "22px 30px",
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
          <section
            style={{
              minWidth: 0,
              overflow: "visible",
              breakInside: "avoid",
              pageBreakInside: "avoid",
            }}
          >
            <h2 style={sidebarTitleStyle}>Leadership Areas</h2>

            <p style={sidebarTextStyle}>
              {skills.length ? skills.join(", ") : "Skills not added yet."}
            </p>
          </section>

          <section
            style={{
              minWidth: 0,
              overflow: "visible",
              breakInside: "avoid",
              pageBreakInside: "avoid",
            }}
          >
            <h2 style={sidebarTitleStyle}>Credentials</h2>

            <p style={sidebarTextStyle}>
              {certifications.length
                ? certifications.join(", ")
                : "Certifications not added yet."}
            </p>
          </section>

          <section
            style={{
              minWidth: 0,
              overflow: "visible",
              breakInside: "avoid",
              pageBreakInside: "avoid",
            }}
          >
            <h2 style={sidebarTitleStyle}>Education</h2>

            <div
              style={{
                display: "grid",
                gap: "7px",
                marginTop: "7px",
              }}
            >
              {data.education.length ? (
                data.education.map((item) => (
                  <div
                    key={item.id}
                    style={{
                      minWidth: 0,
                      breakInside: "avoid",
                      pageBreakInside: "avoid",
                    }}
                  >
                    <p
                      style={{
                        margin: 0,
                        color: "#111827",
                        fontSize: "10.5px",
                        lineHeight: 1.35,
                        fontWeight: 800,
                        overflowWrap: "anywhere",
                      }}
                    >
                      {cleanText(item.degree) || "Degree"}
                      {item.field ? `, ${cleanText(item.field)}` : ""}
                    </p>

                    <p
                      style={{
                        marginTop: "2px",
                        marginBottom: 0,
                        color: "#4b5563",
                        fontSize: "10.5px",
                        lineHeight: 1.35,
                        overflowWrap: "anywhere",
                      }}
                    >
                      {cleanText(item.school) || "School"}
                      {item.graduationDate
                        ? ` • ${cleanText(item.graduationDate)}`
                        : ""}
                    </p>
                  </div>
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
              marginTop: 0,
              breakInside: "avoid",
              pageBreakInside: "avoid",
            }}
          >
            <h2 style={sectionTitleStyle}>Executive Profile</h2>

            <p
              style={{
                marginTop: "8px",
                marginBottom: 0,
                color: "#374151",
                overflowWrap: "anywhere",
              }}
            >
              {cleanText(data.summary) || "Executive summary not added yet."}
            </p>
          </section>

          <section style={{ marginTop: "16px" }}>
            <h2 style={sectionTitleStyle}>Professional Experience</h2>

            <div style={{ marginTop: "10px", display: "grid", gap: "11px" }}>
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
                      <h3
                        style={{
                          fontSize: "13px",
                          fontWeight: 900,
                          margin: 0,
                          color: "#111827",
                          overflowWrap: "anywhere",
                        }}
                      >
                        {cleanText(item.role) || "Position"}
                      </h3>

                      <p
                        style={{
                          marginTop: "3px",
                          marginBottom: 0,
                          color: "#9a3412",
                          fontWeight: 800,
                          overflowWrap: "anywhere",
                        }}
                      >
                        {cleanText(item.company) || "Company"}
                      </p>

                      <p
                        style={{
                          marginTop: "2px",
                          marginBottom: 0,
                          color: "#6b7280",
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
                              key={`${item.id}-executive-${index}`}
                              style={{
                                marginBottom: "2px",
                                color: "#374151",
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
                <p style={{ margin: 0, color: "#6b7280" }}>
                  Professional experience not added yet.
                </p>
              )}
            </div>
          </section>
        </main>
      </div>
    </article>
  )
}