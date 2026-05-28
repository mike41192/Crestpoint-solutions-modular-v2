import type { ResumeBuilderFormData } from "@/modules/resume-builder"

type ResumeEditorPreviewProps = {
  data: ResumeBuilderFormData
}

function stripHtml(value: string) {
  return value.replace(/<[^>]+>/g, "").trim()
}

export function ResumeEditorPreview({ data }: ResumeEditorPreviewProps) {
  return (
    <div style={{ display: "grid", gap: "12px" }}>
      <div>
        <strong>Name</strong>
        <p style={{ color: "#64748b" }}>
          {data.contact.fullName || "Not added yet"}
        </p>
      </div>

      <div>
        <strong>Email</strong>
        <p style={{ color: "#64748b" }}>
          {data.contact.email || "Not added yet"}
        </p>
      </div>

      <div>
        <strong>Phone</strong>
        <p style={{ color: "#64748b" }}>
          {data.contact.phone || "Not added yet"}
        </p>
      </div>

      <div>
        <strong>Location</strong>
        <p style={{ color: "#64748b" }}>
          {data.contact.location || "Not added yet"}
        </p>
      </div>

      <div>
        <strong>Professional Summary</strong>
        <p style={{ color: "#64748b" }}>
          {stripHtml(data.summary) || "Not added yet"}
        </p>
      </div>

      <div>
        <strong>Work Experience</strong>

        {data.experience.length > 0 ? (
          <div style={{ marginTop: "8px", display: "grid", gap: "10px" }}>
            {data.experience.map((item, experienceIndex) => (
              <div key={`${item.id}-${experienceIndex}`}>
                <p style={{ color: "#334155", fontWeight: 700 }}>
                  {item.role || "Role not added"}{" "}
                  {item.company ? `at ${item.company}` : ""}
                </p>

                <p style={{ color: "#64748b" }}>
                  {[item.location, item.startDate, item.endDate]
                    .filter(Boolean)
                    .join(" • ") || "Dates/location not added"}
                </p>

                <ul style={{ marginTop: "6px", paddingLeft: "20px" }}>
                  {item.bullets.filter(Boolean).length > 0 ? (
                    item.bullets
                      .filter(Boolean)
                      .map((bullet, bulletIndex) => (
                        <li
                          key={`${item.id}-bullet-${bulletIndex}-${bullet.slice(
                            0,
                            20
                          )}`}
                          style={{ color: "#64748b" }}
                        >
                          {stripHtml(bullet)}
                        </li>
                      ))
                  ) : (
                    <li style={{ color: "#64748b" }}>
                      No bullet added yet
                    </li>
                  )}
                </ul>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ color: "#64748b" }}>Not added yet</p>
        )}
      </div>

      <div>
        <strong>Education</strong>

        {data.education.length > 0 ? (
          <div style={{ marginTop: "8px", display: "grid", gap: "10px" }}>
            {data.education.map((item, educationIndex) => (
              <div key={`${item.id}-${educationIndex}`}>
                <p style={{ color: "#334155", fontWeight: 700 }}>
                  {item.degree || "Degree not added"}
                  {item.field ? `, ${item.field}` : ""}
                </p>

                <p style={{ color: "#64748b" }}>
                  {[item.school, item.graduationDate]
                    .filter(Boolean)
                    .join(" • ") || "School/date not added"}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ color: "#64748b" }}>Not added yet</p>
        )}
      </div>

      <div>
        <strong>Skills</strong>
        <p style={{ color: "#64748b" }}>
          {data.skills.length > 0 ? data.skills.join(", ") : "Not added yet"}
        </p>
      </div>

      <div>
        <strong>Certifications</strong>
        <p style={{ color: "#64748b" }}>
          {data.certifications.length > 0
            ? data.certifications.join(", ")
            : "Not added yet"}
        </p>
      </div>
    </div>
  )
}