import type { ResumeBuilderFormData, ResumeTemplateType } from "@/modules/resume-builder"

function stripHtml(value: string) {
  return value.replace(/<[^>]+>/g, "").trim()
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;")
}

function clean(value: string | undefined | null) {
  return escapeHtml(stripHtml(value || ""))
}

function renderContact(data: ResumeBuilderFormData) {
  return [
    data.contact.email,
    data.contact.phone,
    data.contact.location,
    data.contact.linkedIn,
    data.contact.website,
  ]
    .filter(Boolean)
    .map((item) => clean(item))
    .join(" • ")
}

function renderExperience(data: ResumeBuilderFormData) {
  return data.experience
    .map((item) => {
      const heading = `${clean(item.role || "Role")}${
        item.company ? ` — ${clean(item.company)}` : ""
      }`

      const meta = [item.location, item.startDate, item.endDate]
        .filter(Boolean)
        .map((value) => clean(value))
        .join(" • ")

      const bullets = item.bullets
        .filter(Boolean)
        .map((bullet) => `<li>${clean(bullet)}</li>`)
        .join("")

      return `
        <div class="experience-item">
          <strong>${heading}</strong>
          ${meta ? `<p class="muted">${meta}</p>` : ""}
          ${bullets ? `<ul>${bullets}</ul>` : ""}
        </div>
      `
    })
    .join("")
}

function renderEducation(data: ResumeBuilderFormData) {
  return data.education
    .map((item) => {
      const heading = `${clean(item.degree || "Degree")}${
        item.field ? `, ${clean(item.field)}` : ""
      }`

      const meta = [item.school, item.graduationDate]
        .filter(Boolean)
        .map((value) => clean(value))
        .join(" • ")

      return `
        <div class="education-item">
          <strong>${heading}</strong>
          ${meta ? `<p class="muted">${meta}</p>` : ""}
        </div>
      `
    })
    .join("")
}

export function buildResumeHtml(
  data: ResumeBuilderFormData,
  template: ResumeTemplateType = "classic"
) {
  const contact = renderContact(data)
  const summary = clean(data.summary)
  const skills = data.skills.map((skill) => clean(skill)).join(", ")
  const certifications = data.certifications
    .map((certification) => clean(certification))
    .join(", ")

  return `<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <title>${clean(data.contact.fullName || "Resume")}</title>
  <style>
    @page {
      size: Letter;
      margin: 0.5in;
    }

    body {
      font-family: Arial, sans-serif;
      color: #111827;
      line-height: 1.45;
      margin: 0;
      background: #ffffff;
      font-size: 12px;
    }

    .resume {
      width: 100%;
    }

    header {
      text-align: center;
      border-bottom: 2px solid #111827;
      padding-bottom: 12px;
      margin-bottom: 18px;
      break-inside: avoid;
      page-break-inside: avoid;
    }

    h1 {
      font-size: 24px;
      margin: 0;
      font-weight: 800;
    }

    h2 {
      font-size: 13px;
      text-transform: uppercase;
      margin: 18px 0 8px;
      font-weight: 800;
      border-bottom: 1px solid #d1d5db;
      padding-bottom: 4px;
      break-after: avoid;
      page-break-after: avoid;
    }

    p {
      margin: 0 0 6px;
    }

    ul {
      margin: 6px 0 0;
      padding-left: 18px;
    }

    li {
      margin-bottom: 4px;
      break-inside: avoid;
      page-break-inside: avoid;
    }

    .muted {
      color: #4b5563;
      margin-top: 3px;
    }

    .experience-item,
    .education-item {
      margin-bottom: 12px;
      break-inside: avoid;
      page-break-inside: avoid;
    }

    .modern header {
      background: #111827;
      color: #ffffff;
      padding: 18px;
      border-bottom: none;
      margin-bottom: 18px;
    }

    .executive h1 {
      font-size: 28px;
      letter-spacing: .4px;
    }

    .executive h2 {
      border-bottom: 2px solid #111827;
    }
  </style>
</head>
<body>
  <main class="resume ${template}">
    <header>
      <h1>${clean(data.contact.fullName || "Your Name")}</h1>
      ${contact ? `<p>${contact}</p>` : ""}
    </header>

    <section>
      <h2>${template === "executive" ? "Executive Summary" : "Professional Summary"}</h2>
      <p>${summary || "Professional summary not added yet."}</p>
    </section>

    <section>
      <h2>${template === "executive" ? "Professional Experience" : "Work Experience"}</h2>
      ${renderExperience(data)}
    </section>

    <section>
      <h2>Education</h2>
      ${renderEducation(data)}
    </section>

    <section>
      <h2>Skills</h2>
      <p>${skills || "Skills not added yet."}</p>
    </section>

    <section>
      <h2>Certifications</h2>
      <p>${certifications || "Certifications not added yet."}</p>
    </section>
  </main>
</body>
</html>`
}
