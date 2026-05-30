"use client"

import { useEffect, useState } from "react"
import { Award, Sparkles } from "lucide-react"

type SkillsCertificationsSectionProps = {
  skills: string[]
  certifications: string[]
  onSkillsChange: (value: string) => void
  onCertificationsChange: (value: string) => void
}

export function SkillsCertificationsSection({
  skills,
  certifications,
  onSkillsChange,
  onCertificationsChange,
}: SkillsCertificationsSectionProps) {
  const [skillsText, setSkillsText] = useState(skills.join(", "))
  const [certificationsText, setCertificationsText] = useState(
    certifications.join(", ")
  )

  useEffect(() => {
    setSkillsText(skills.join(", "))
  }, [skills])

  useEffect(() => {
    setCertificationsText(certifications.join(", "))
  }, [certifications])

  return (
    <section className="w-full min-w-0 max-w-full overflow-hidden rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <div className="mb-5 flex min-w-0 items-start gap-3 border-b border-slate-100 pb-4">
        <div className="shrink-0 rounded-2xl bg-blue-50 p-2 text-blue-700">
          <Sparkles size={18} />
        </div>

        <div className="min-w-0">
          <h3 className="break-words text-lg font-black text-slate-950">
            Skills & Certifications
          </h3>
          <p className="mt-1 break-words text-sm leading-6 text-slate-500">
            Add searchable skills and credentials.
          </p>
        </div>
      </div>

      <div className="grid w-full min-w-0 max-w-full gap-5">
        <TagEditor
          title="Skills"
          description="Separate skills with commas. These help ATS matching and recruiter search."
          icon={Sparkles}
          value={skillsText}
          tags={skills}
          placeholder="Leadership, Sales, Operations, Customer Service"
          onChange={setSkillsText}
          onCommit={onSkillsChange}
        />

        <TagEditor
          title="Certifications"
          description="Separate certifications with commas."
          icon={Award}
          value={certificationsText}
          tags={certifications}
          placeholder="OSHA 30, CPR, PMP, Google Analytics"
          onChange={setCertificationsText}
          onCommit={onCertificationsChange}
        />
      </div>
    </section>
  )
}

function TagEditor({
  title,
  description,
  icon: Icon,
  value,
  tags,
  placeholder,
  onChange,
  onCommit,
}: {
  title: string
  description: string
  icon: React.ComponentType<{ size?: number }>
  value: string
  tags: string[]
  placeholder: string
  onChange: (value: string) => void
  onCommit: (value: string) => void
}) {
  return (
    <div className="w-full min-w-0 max-w-full overflow-hidden rounded-3xl border border-slate-200 bg-slate-50 p-4">
      <div className="mb-4 flex min-w-0 items-start gap-3">
        <div className="shrink-0 rounded-2xl bg-white p-2 text-blue-700">
          <Icon size={17} />
        </div>

        <div className="min-w-0">
          <h4 className="break-words text-base font-black text-slate-950">
            {title}
          </h4>
          <p className="mt-1 break-words text-sm leading-6 text-slate-500">
            {description}
          </p>
        </div>
      </div>

      <input
        className="block w-full min-w-0 max-w-full truncate rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-900 outline-none placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onBlur={(event) => onCommit(event.target.value)}
        placeholder={placeholder}
      />

      {tags.length > 0 && (
        <div className="mt-4 flex w-full min-w-0 max-w-full flex-wrap gap-2 overflow-hidden">
          {tags.map((tag) => (
            <span
              key={tag}
              className="max-w-full break-words rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5 text-xs font-extrabold leading-5 text-blue-700"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
