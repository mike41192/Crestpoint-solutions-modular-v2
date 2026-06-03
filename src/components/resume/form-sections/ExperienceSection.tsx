"use client"

// =====================================================
// BLOCK: Icon Imports
// =====================================================

import { BriefcaseBusiness } from "lucide-react"

// =====================================================
// BLOCK: Component Imports
// =====================================================

import { RichTextEditor } from "@/components/resume/editor/RichTextEditor"

// =====================================================
// BLOCK: Type Imports
// =====================================================

import type { ResumeExperienceItem } from "@/modules/resume-builder"

// =====================================================
// BLOCK: Component Props
// =====================================================

type ExperienceSectionProps = {
  experience: ResumeExperienceItem[]
  onFieldChange: (
    id: string,
    field: keyof Omit<ResumeExperienceItem, "id" | "bullets">,
    value: string,
  ) => void
  onBulletChange: (id: string, index: number, value: string) => void
  onAddBullet: (id: string) => void
  onRemoveBullet: (id: string, index: number) => void
  onAddExperience: () => void
  onRemoveExperience: (id: string) => void
}

// =====================================================
// BLOCK: Bullet Conversion Helpers
// =====================================================

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
}

function bulletsToHtml(bullets: string[]) {
  const safeBullets = bullets.map((bullet) => bullet.trim()).filter(Boolean)

  if (safeBullets.length === 0) {
    return "<ul><li></li></ul>"
  }

  return `<ul>${safeBullets
    .map((bullet) => `<li>${escapeHtml(bullet)}</li>`)
    .join("")}</ul>`
}

function splitPlainTextIntoBullets(value: string) {
  return value
    .split(/\n+/)
    .map((line) => line.replace(/^[-•*]\s*/, "").trim())
    .filter(Boolean)
}

function htmlToBullets(html: string) {
  if (!html.trim()) return [""]

  if (typeof window === "undefined") {
    return splitPlainTextIntoBullets(html)
  }

  const parser = new DOMParser()
  const document = parser.parseFromString(html, "text/html")

  const listItems = Array.from(document.querySelectorAll("li"))
    .map((item) => item.textContent?.trim() || "")
    .flatMap((value) => splitPlainTextIntoBullets(value))
    .filter(Boolean)

  if (listItems.length > 0) {
    return listItems
  }

  const paragraphs = Array.from(document.querySelectorAll("p"))
    .map((item) => item.textContent?.trim() || "")
    .flatMap((value) => splitPlainTextIntoBullets(value))
    .filter(Boolean)

  if (paragraphs.length > 0) {
    return paragraphs
  }

  const fallbackText = document.body.textContent || ""
  const fallbackBullets = splitPlainTextIntoBullets(fallbackText)

  return fallbackBullets.length > 0 ? fallbackBullets : [""]
}

// =====================================================
// BLOCK: Experience Section Component
// =====================================================

export function ExperienceSection({
  experience,
  onFieldChange,
  onBulletChange,
  onAddBullet,
  onRemoveBullet,
  onAddExperience,
  onRemoveExperience,
}: ExperienceSectionProps) {
  // =====================================================
  // BLOCK: Responsibilities Update Handler
  // =====================================================

  function updateResponsibilities(
    id: string,
    existingBullets: string[],
    html: string,
  ) {
    const nextBullets = htmlToBullets(html)
    const maxLength = Math.max(existingBullets.length, nextBullets.length)

    for (let index = 0; index < maxLength; index += 1) {
      const nextValue = nextBullets[index] || ""

      if (index < existingBullets.length) {
        onBulletChange(id, index, nextValue)
      } else {
        onAddBullet(id)
        onBulletChange(id, index, nextValue)
      }
    }

    if (nextBullets.length < existingBullets.length) {
      for (
        let index = existingBullets.length - 1;
        index >= nextBullets.length;
        index -= 1
      ) {
        onRemoveBullet(id, index)
      }
    }
  }

  // =====================================================
  // BLOCK: Main Render
  // =====================================================

  return (
    <section className="w-full min-w-0 max-w-full overflow-hidden rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      {/* =====================================================
          BLOCK: Section Header
      ===================================================== */}

      <div className="mb-5 flex min-w-0 flex-col gap-4 border-b border-slate-100 pb-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 items-start gap-3">
          <div className="shrink-0 rounded-2xl bg-blue-50 p-2 text-blue-700">
            <BriefcaseBusiness size={18} />
          </div>

          <div className="min-w-0">
            <h3 className="break-words text-lg font-black text-slate-950">
              Work Experience
            </h3>

            <p className="mt-1 break-words text-sm leading-6 text-slate-500">
              Add each role once, then write responsibilities and achievements
              in one clean editor.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onAddExperience}
          className="w-full rounded-2xl bg-blue-600 px-4 py-3 text-sm font-black text-white shadow-lg shadow-blue-100 transition hover:-translate-y-0.5 hover:bg-blue-700 sm:w-auto"
        >
          Add Experience
        </button>
      </div>

      {/* =====================================================
          BLOCK: Experience Cards
      ===================================================== */}

      <div className="grid w-full min-w-0 max-w-full gap-5">
        {experience.map((item, index) => (
          <ExperienceCard
            key={item.id}
            item={item}
            index={index}
            onFieldChange={onFieldChange}
            onRemoveExperience={onRemoveExperience}
            onUpdateResponsibilities={updateResponsibilities}
          />
        ))}
      </div>
    </section>
  )
}

// =====================================================
// BLOCK: Experience Card Component
// =====================================================

type ExperienceCardProps = {
  item: ResumeExperienceItem
  index: number
  onFieldChange: ExperienceSectionProps["onFieldChange"]
  onRemoveExperience: (id: string) => void
  onUpdateResponsibilities: (
    id: string,
    existingBullets: string[],
    html: string,
  ) => void
}

function ExperienceCard({
  item,
  index,
  onFieldChange,
  onRemoveExperience,
  onUpdateResponsibilities,
}: ExperienceCardProps) {
  return (
    <article className="w-full min-w-0 max-w-full overflow-hidden rounded-3xl border border-slate-200 bg-slate-50 p-4">
      {/* =====================================================
          BLOCK: Experience Card Header
      ===================================================== */}

      <div className="mb-4 flex min-w-0 flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-blue-600">
            Experience {index + 1}
          </p>

          <h4 className="mt-1 break-words text-xl font-black text-slate-950">
            {item.role || "Untitled role"}
          </h4>

          <p className="mt-1 break-words text-sm font-semibold text-slate-500">
            {item.company || "Company not added yet"}
          </p>
        </div>

        <button
          type="button"
          onClick={() => onRemoveExperience(item.id)}
          className="w-full rounded-2xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-black text-red-700 transition hover:bg-red-100 sm:w-auto"
        >
          Remove
        </button>
      </div>

      {/* =====================================================
          BLOCK: Experience Identity Fields
      ===================================================== */}

      <div className="grid w-full min-w-0 max-w-full grid-cols-1 gap-4">
        <Field
          label="Role"
          value={item.role}
          placeholder="Maintenance Technician"
          onChange={(value) => onFieldChange(item.id, "role", value)}
        />

        <Field
          label="Company"
          value={item.company}
          placeholder="Company Name"
          onChange={(value) => onFieldChange(item.id, "company", value)}
        />

        <Field
          label="Location"
          value={item.location || ""}
          placeholder="Chicago, IL"
          onChange={(value) => onFieldChange(item.id, "location", value)}
        />
      </div>

      {/* =====================================================
          BLOCK: Experience Date Fields
      ===================================================== */}

      <div className="mt-4 grid w-full min-w-0 max-w-full grid-cols-1 gap-4 sm:grid-cols-2">
        <Field
          label="Start Date"
          value={item.startDate || ""}
          placeholder="Apr 2025"
          onChange={(value) => onFieldChange(item.id, "startDate", value)}
        />

        <Field
          label="End Date"
          value={item.endDate || ""}
          placeholder="September 2025 or Present"
          onChange={(value) => onFieldChange(item.id, "endDate", value)}
        />
      </div>

      {/* =====================================================
          BLOCK: Responsibilities Editor
      ===================================================== */}

      <div className="mt-5 w-full min-w-0 max-w-full overflow-hidden">
        <label className="mb-2 block text-sm font-extrabold text-slate-700">
          Responsibilities & Achievements
        </label>

        <p className="mb-3 break-words text-sm leading-6 text-slate-500">
          Use bullets in one editor instead of separate boxes.
        </p>

        <RichTextEditor
          value={bulletsToHtml(item.bullets)}
          minHeight="180px"
          placeholder="Add responsibilities, achievements, and measurable results..."
          onChange={(html) =>
            onUpdateResponsibilities(item.id, item.bullets, html)
          }
        />
      </div>
    </article>
  )
}

// =====================================================
// BLOCK: Reusable Field Component
// =====================================================

type FieldProps = {
  label: string
  value: string
  placeholder: string
  onChange: (value: string) => void
}

function Field({ label, value, placeholder, onChange }: FieldProps) {
  return (
    <label className="block min-w-0 max-w-full">
      <span className="mb-2 block break-words text-sm font-extrabold text-slate-700">
        {label}
      </span>

      <input
        className="block w-full min-w-0 max-w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-900 outline-none placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
        value={value || ""}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
      />
    </label>
  )
}