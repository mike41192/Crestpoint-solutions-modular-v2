"use client"

// =====================================================
// BLOCK: Component Types
// Crestpoint Solutions V2
// Version: 1.8.5
// =====================================================

type ResumeJobDescriptionInputProps = {
  value: string
  onChange: (value: string) => void
}

// =====================================================
// BLOCK: Resume Job Description Input Component
// =====================================================

export function ResumeJobDescriptionInput({
  value,
  onChange,
}: ResumeJobDescriptionInputProps) {
  return (
    <label className="block min-w-0 max-w-full text-sm font-black text-slate-700">
      Job Description

      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Paste job description here..."
        className="mt-2 min-h-[190px] w-full min-w-0 max-w-full resize-y rounded-2xl border border-violet-200 bg-white p-4 text-sm leading-6 text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-violet-500 focus:ring-4 focus:ring-violet-100"
      />
    </label>
  )
}
