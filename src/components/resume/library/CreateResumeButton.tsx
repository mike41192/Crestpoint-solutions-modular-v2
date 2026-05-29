type CreateResumeButtonProps = {
  onCreate: () => void
}

export function CreateResumeButton({ onCreate }: CreateResumeButtonProps) {
  return (
    <button
      type="button"
      onClick={onCreate}
      style={{
        border: "1px dashed #93c5fd",
        borderRadius: "18px",
        padding: "18px",
        background: "#eff6ff",
        color: "#1d4ed8",
        fontWeight: 900,
        cursor: "pointer",
        textAlign: "left",
      }}
    >
      + Create New Resume
    </button>
  )
}