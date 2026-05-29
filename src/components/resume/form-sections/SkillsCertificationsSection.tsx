"use client"

import { useEffect, useMemo, useState } from "react"
import { Award, Sparkles, X } from "lucide-react"

type SkillsCertificationsSectionProps = {
  skills: string[]
  certifications: string[]
  onSkillsChange: (value: string) => void
  onCertificationsChange: (value: string) => void
}

function toText(items: string[]) {
  return items.filter(Boolean).join(", ")
}

function splitItems(value: string) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean)
}

export function SkillsCertificationsSection({
  skills,
  certifications,
  onSkillsChange,
  onCertificationsChange,
}: SkillsCertificationsSectionProps) {
  const [skillsText, setSkillsText] = useState(toText(skills))
  const [certificationsText, setCertificationsText] = useState(
    toText(certifications)
  )

  const skillItems = useMemo(() => splitItems(skillsText), [skillsText])
  const certificationItems = useMemo(
    () => splitItems(certificationsText),
    [certificationsText]
  )

  useEffect(() => {
    setSkillsText(toText(skills))
  }, [skills])

  useEffect(() => {
    setCertificationsText(toText(certifications))
  }, [certifications])

  function removeSkill(itemToRemove: string) {
    const next = skillItems.filter((item) => item !== itemToRemove).join(", ")
    setSkillsText(next)
    onSkillsChange(next)
  }

  function removeCertification(itemToRemove: string) {
    const next = certificationItems
      .filter((item) => item !== itemToRemove)
      .join(", ")

    setCertificationsText(next)
    onCertificationsChange(next)
  }

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-5 flex items-start gap-3 border-b border-slate-100 pb-4">
        <div className="rounded-2xl bg-blue-50 p-2 text-blue-700">
          <Sparkles size={18} />
        </div>

        <div>
          <h3 className="text-lg font-black text-slate-950">
            Skills & Certifications
          </h3>
          <p className="mt-1 text-sm leading-6 text-slate-500">
            Add searchable skills and credentials that improve resume matching.
          </p>
        </div>
      </div>

      <div className="grid gap-5">
        <SkillInput
          title="Skills"
          helper="Separate skills with commas. These are converted into clean resume tags."
          placeholder="Preventive maintenance, Hydraulics, PLC troubleshooting, Leadership"
          value={skillsText}
          items={skillItems}
          icon={Sparkles}
          onChange={setSkillsText}
          onCommit={onSkillsChange}
          onRemove={removeSkill}
        />

        <SkillInput
          title="Certifications"
          helper="Separate certifications with commas. Include licenses, safety training, and credentials."
          placeholder="OSHA 30, CPR, PMP, Google Analytics"
          value={certificationsText}
          items={certificationItems}
          icon={Award}
          onChange={setCertificationsText}
          onCommit={onCertificationsChange}
          onRemove={removeCertification}
        />
      </div>
    </section>
  )
}

type SkillInputProps = {
  title: string
  helper: string
  placeholder: string
  value: string
  items: string[]
  icon: React.ComponentType<{ size?: number }>
  onChange: (value: string) => void
  onCommit: (value: string) => void
  onRemove: (item: string) => void
}

function SkillInput({
  title,
  helper,
  placeholder,
  value,
  items,
  icon: Icon,
  onChange,
  onCommit,
  onRemove,
}: SkillInputProps) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
      <div className="mb-3 flex items-start gap-3">
        <div className="rounded-2xl bg-white p-2 text-blue-700 shadow-sm">
          <Icon size={17} />
        </div>

        <div>
          <h4 className="font-black text-slate-950">{title}</h4>
          <p className="mt-1 text-sm leading-6 text-slate-500">{helper}</p>
        </div>
      </div>

      <input
        className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onBlur={(event) => onCommit(event.target.value)}
        placeholder={placeholder}
      />

      {items.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {items.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => onRemove(item)}
              className="inline-flex items-center gap-1 rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5 text-xs font-extrabold text-blue-700 transition hover:bg-blue-100"
            >
              {item}
              <X size={12} />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
