// =====================================================
// BLOCK: Logout Button Component
// =====================================================

export function LogoutButton() {
  return (
    <a
      href="/auth/logout"
      className="rounded-2xl border border-red-200 bg-red-50 px-4 py-2 text-sm font-black text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
    >
      Log out
    </a>
  )
}
