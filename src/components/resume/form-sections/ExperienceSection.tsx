"use client"

import { BriefcaseBusiness, MapPin, Plus, Trash2 } from "lucide-react"
import { RichTextEditor } from "@/components/resume/editor/RichTextEditor"
import type { ResumeExperienceItem } from "@/modules/resume-builder"

type ExperienceSectionProps = {
  experience: ResumeExperienceItem[]
  onFieldChange: (
    id: string,
    field: keyof Omit<ResumeExperienceItem, "id" | "bullets">,
    value: string
  ) => void
  onBulletChange: (id: string, index: number, value: string) => void
  onAddBullet: (id: string) => void
  onRemoveBullet: (id: string, index: number) => void
  onAddExperience: () => void
  onRemoveExperience: (id: string) => void
}

function bulletsToHtml(bullets: string[]) {
  const safeBullets = bullets.filter(Boolean)

  if (safeBullets.length === 0) {
    return "<ul><li></li></ul>"
  }

  return `<ul>${safeBullets.map((bullet) => `<li>${bullet}</li>`).join("")}</ul>`
}

function htmlToBullets(html: string) {
  if (!html.trim()) return [""]

  if (typeof window === "undefined") return [html]

  const parser = new DOMParser()
  const document = parser.parseFromString(html, "text/html")

  const listItems = Array.from(document.querySelectorAll("li"))
    .map((item) => item.textContent?.trim() || "")
    .filter(Boolean)

  if (listItems.length > 0) return listItems

  const paragraphs = Array.from(document.querySelectorAll("p"))
    .map((item) => item.textContent?.trim() || "")
    .filter(Boolean)

  return paragraphs.length > 0 ? paragraphs : [""]
}

export function ExperienceSection({
  experience,
  onFieldChange,
  onBulletChange,
  onAddExperience,
  onRemoveExperience,
}: ExperienceSectionProps) {
  function updateResponsibilities(id: string, html: string) {
    const bullets = htmlToBullets(html)

    bullets.forEach((bullet, index) => {
      onBulletChange(id, index, bullet)
    })
  }

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-5 flex flex-col gap-4 border-b border-slate-100 pb-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-3">
          <div className="rounded-2xl bg-blue-50 p-2 text-blue-700">
            <BriefcaseBusiness size={18} />
          </div>

          <div>
            <h3 className="text-lg font-black text-slate-950">
              Work Experience
            </h3>

            <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-500">
              Add each role once, then write responsibilities and achievements
              as clean resume bullets.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onAddExperience}
          className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-blue-600 px-4 py-2.5 text-sm font-extrabold text-white shadow-sm transition hover:bg-blue-700 sm:w-auto"
        >
          <Plus size={16} />
          Add Experience
        </button>
      </div>

      <div className="grid gap-5">
        {experience.map((item, index) => (
          <article
            key={item.id}
            className="rounded-3xl border border-slate-200 bg-slate-50 p-4 transition hover:border-blue-200 hover:bg-white hover:shadow-sm sm:p-5"
          >
            <div className="mb-5 flex flex-col gap-3 border-b border-slate-200 pb-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <p className="text-xs font-black uppercase tracking-[0.16em] text-blue-600">
                  Experience {index + 1}
                </p>

                <h4 className="mt-1 truncate text-lg font-black text-slate-950">
                  {item.role || "Untitled role"}
                </h4>

                <p className="mt-1 text-sm font-semibold text-slate-500">
                  {item.company || "Company not added"}
                </p>
              </div>

              <button
                type="button"
                onClick={() => onRemoveExperience(item.id)}
                className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-red-200 bg-red-50 px-4 py-2 text-sm font-extrabold text-red-700 transition hover:bg-red-100 sm:w-auto"
              >
                <Trash2 size={15} />
                Remove
              </button>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
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
                icon={MapPin}
                onChange={(value) => onFieldChange(item.id, "location", value)}
              />

              <Field
                label="Dates"
                value={item.startDate}
                placeholder="Jan 2020 - Present"
                onChange={(value) => onFieldChange(item.id, "startDate", value)}
              />
            </div>

            <div className="mt-5">
              <div className="mb-2 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
                <label className="text-sm font-extrabold text-slate-700">
                  Responsibilities & Achievements
                </label>

                <p className="text-xs text-slate-500">
                  Use bullets with measurable outcomes when possible.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-3 transition focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-100">
                <RichTextEditor
                  value={bulletsToHtml(item.bullets)}
                  minHeight="180px"
                  placeholder="Add responsibilities, achievements, and measurable results..."
                  onChange={(html) => updateResponsibilities(item.id, html)}
                />
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

type FieldProps = {
  label: string
  value: string
  placeholder: string
  onChange: (value: string) => void
  icon?: React.ComponentType<{ size?: number; className?: string }>
}

function Field({
  label,
  value,
  placeholder,
  onChange,
  icon: Icon,
}: FieldProps) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-extrabold text-slate-700">
        {label}
      </span>

      <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 transition focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-100">
        {Icon ? <Icon size={17} className="shrink-0 text-slate-400" /> : null}

        <input
          className="w-full min-w-0 bg-transparent text-sm font-semibold text-slate-900 outline-none placeholder:text-slate-400"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
        />
      </div>
    </label>
  )
}
