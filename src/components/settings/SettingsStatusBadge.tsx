// =====================================================
// BLOCK: Settings Status Badge
// =====================================================

type SettingsStatusBadgeProps = {
  status: string
}

export function SettingsStatusBadge({
  status,
}: SettingsStatusBadgeProps) {
  return (
    <span
      className="
      rounded-full
      bg-slate-100
      px-2.5
      py-1
      text-xs
      font-black
      text-slate-600
      "
    >
      {status}
    </span>
  )
}