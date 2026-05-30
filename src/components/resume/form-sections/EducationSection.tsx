import { GraduationCap } from "lucide-react"
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
    <section className="w-full min-w-0 max-w-full overflow-hidden rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <div className="mb-5 flex min-w-0 flex-col gap-4 border-b border-slate-100 pb-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 items-start gap-3">
          <div className="shrink-0 rounded-2xl bg-blue-50 p-2 text-blue-700">
            <GraduationCap size={18} />
          </div>

          <div className="min-w-0">
            <h3 className="break-words text-lg font-black text-slate-950">
              Education
            </h3>
            <p className="mt-1 break-words text-sm leading-6 text-slate-500">
              Add schools, degrees, certifications, or training.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onAddEducation}
          className="w-full rounded-2xl bg-blue-600 px-4 py-3 text-sm font-black text-white shadow-lg shadow-blue-100 transition hover:-translate-y-0.5 hover:bg-blue-700 sm:w-auto"
        >
          Add Education
        </button>
      </div>

      <div className="grid w-full min-w-0 max-w-full gap-5">
        {education.map((item, index) => (
          <article
            key={item.id}
            className="w-full min-w-0 max-w-full overflow-hidden rounded-3xl border border-slate-200 bg-slate-50 p-4"
          >
            <div className="mb-4 flex min-w-0 flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-blue-600">
                  Education {index + 1}
                </p>

                <h4 className="mt-1 break-words text-xl font-black text-slate-950">
                  {item.degree || "Education item"}
                </h4>

                <p className="mt-1 break-words text-sm font-semibold text-slate-500">
                  {item.school || "School not added yet"}
                </p>
              </div>

              <button
                type="button"
                onClick={() => onRemoveEducation(item.id)}
                className="w-full rounded-2xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-black text-red-700 transition hover:bg-red-100 sm:w-auto"
              >
                Remove
              </button>
            </div>

            <div className="grid w-full min-w-0 max-w-full grid-cols-1 gap-4">
              {fields.map(([label, field, placeholder]) => (
                <label key={field} className="block min-w-0 max-w-full">
                  <span className="mb-2 block break-words text-sm font-extrabold text-slate-700">
                    {label}
                  </span>

                  <input
                    className="block w-full min-w-0 max-w-full truncate rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-900 outline-none placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
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
