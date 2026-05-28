"use client"

import { RichTextEditor } from "@/components/resume/editor/RichTextEditor"
import { labelStyle } from "./sharedStyles"

type SummarySectionProps = {
  summary: string
  onChange: (value: string) => void
}

export function SummarySection({ summary, onChange }: SummarySectionProps) {
  return (
    <div>
      <label style={labelStyle}>Professional Summary</label>

      <div style={{ marginTop: "8px" }}>
        <RichTextEditor
          value={summary}
          minHeight="140px"
          placeholder="Write a strong professional summary..."
          onChange={onChange}
        />
      </div>
    </div>
  )
}
