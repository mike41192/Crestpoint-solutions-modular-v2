import { GraduationCap, Plus, Trash2 } from "lucide-react"
import type { ResumeEducationItem } from "@/modules/resume-builder"

type EducationSectionProps = {
  education: ResumeEducationItem[]
  onFieldChange: (
    id: string,
    field: keyof Omit<ResumeEducationItem, "id">,
    value: string
  ) => void
  onAddEducation: () => void
  onRemoveEducation: (id: string) => void
}

const fields = [
  ["School", "school", "University or School Name"],
  ["Degree", "degree", "Bachelor's, Associate, Certification"],
  ["Field of Study", "field", "Business, IT, Healthcare"],
  ["Graduation Date", "graduationDate", "May 2024"],
] as const

export function EducationSection({
  education,
  onFieldChange,
  onAddEducation,
  onRemoveEducation,
}: EducationSectionProps) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-5 flex flex-col gap-4 border-b border-slate-100 pb-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-3">
          <div className="rounded-2xl bg-blue-50 p-2 text-blue-700">
            <GraduationCap size={18} />
          </div>

          <div>
            <h3 className="text-lg font-black text-slate-950">Education</h3>
            <p className="mt-1 text-sm leading-6 text-slate-500">
              Add schools, certifications, training programs, or degrees that support your target role.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onAddEducation}
          className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-blue-600 px-4 py-2.5 text-sm font-extrabold text-white shadow-sm transition hover:bg-blue-700 sm:w-auto"
        >
          <Plus size={16} />
          Add Education
        </button>
      </div>

      <div className="grid gap-5">
        {education.map((item, index) => (
          <article
            key={item.id}
            className="rounded-3xl border border-slate-200 bg-slate-50 p-4 transition hover:border-blue-200 hover:bg-white hover:shadow-sm sm:p-5"
          >
            <div className="mb-5 flex flex-col gap-3 border-b border-slate-200 pb-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <p className="text-xs font-black uppercase tracking-[0.16em] text-blue-600">
                  Education {index + 1}
                </p>

                <h4 className="mt-1 truncate text-lg font-black text-slate-950">
                  {item.school || "School not added"}
                </h4>

                <p className="mt-1 text-sm font-semibold text-slate-500">
                  {item.degree || "Degree or program not added"}
                </p>
              </div>

              <button
                type="button"
                onClick={() => onRemoveEducation(item.id)}
                className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-red-200 bg-red-50 px-4 py-2 text-sm font-extrabold text-red-700 transition hover:bg-red-100 sm:w-auto"
              >
                <Trash2 size={15} />
                Remove
              </button>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {fields.map(([label, field, placeholder]) => (
                <label key={field} className="block">
                  <span className="mb-2 block text-sm font-extrabold text-slate-700">
                    {label}
                  </span>

                  <input
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                    value={item[field] || ""}
                    onChange={(event) =>
                      onFieldChange(item.id, field, event.target.value)
                    }
                    placeholder={placeholder}
                  />
                </label>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
