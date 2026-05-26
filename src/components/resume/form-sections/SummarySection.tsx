import { inputStyle, labelStyle } from "./sharedStyles"

type SummarySectionProps = {
  summary: string
  onChange: (value: string) => void
}

export function SummarySection({ summary, onChange }: SummarySectionProps) {
  return (
    <div>
      <label style={labelStyle}>
        Professional Summary
        <textarea
          style={{
            ...inputStyle,
            minHeight: "120px",
            resize: "vertical",
          }}
          value={summary}
          onChange={(event) => onChange(event.target.value)}
          placeholder="Write a short professional summary..."
        />
      </label>
    </div>
  )
}