import {
  Globe,
  BriefcaseBusiness,
  Mail,
  MapPin,
  Phone,
  User,
} from "lucide-react"
import type { ResumeBuilderFormData } from "@/modules/resume-builder"

type ContactSectionProps = {
  contact: ResumeBuilderFormData["contact"]
  onChange: (
    field: keyof ResumeBuilderFormData["contact"],
    value: string
  ) => void
}

const fields = [
  {
    label: "Full Name",
    field: "fullName",
    placeholder: "Jane Doe",
    icon: User,
  },
  {
    label: "Email",
    field: "email",
    placeholder: "jane@email.com",
    icon: Mail,
  },
  {
    label: "Phone",
    field: "phone",
    placeholder: "555-555-5555",
    icon: Phone,
  },
  {
    label: "Location",
    field: "location",
    placeholder: "Chicago, IL",
    icon: MapPin,
  },
  {
    label: "LinkedIn",
    field: "linkedIn",
    placeholder: "https://linkedin.com/in/yourname",
    icon: BriefcaseBusiness,
  },
  {
    label: "Website",
    field: "website",
    placeholder: "https://yourwebsite.com",
    icon: Globe,
  },
] as const

export function ContactSection({ contact, onChange }: ContactSectionProps) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-5 flex items-start gap-3 border-b border-slate-100 pb-4">
        <div className="rounded-2xl bg-blue-50 p-2 text-blue-700">
          <User size={18} />
        </div>

        <div>
          <h3 className="text-lg font-black text-slate-950">
            Contact Information
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            This information appears at the top of your resume.
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {fields.map(({ label, field, placeholder, icon: Icon }) => (
          <label key={field} className="block">
            <span className="mb-2 block text-sm font-extrabold text-slate-700">
              {label}
            </span>

            <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 transition focus-within:border-blue-500 focus-within:bg-white focus-within:ring-4 focus-within:ring-blue-100">
              <Icon size={17} className="shrink-0 text-slate-400" />

              <input
                className="w-full min-w-0 bg-transparent text-sm font-semibold text-slate-900 outline-none placeholder:text-slate-400"
                value={contact[field as keyof typeof contact] || ""}
                onChange={(event) =>
                  onChange(
                    field as keyof ResumeBuilderFormData["contact"],
                    event.target.value
                  )
                }
                placeholder={placeholder}
              />
            </div>
          </label>
        ))}
      </div>
    </section>
  )
}
