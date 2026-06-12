"use client"

import { useEffect, useMemo, useState } from "react"
import {
  Building2,
  CheckCircle2,
  Loader2,
  RefreshCw,
  Search,
  ShieldAlert,
  UserMinus,
  UserPlus,
  Users,
} from "lucide-react"

type Organization = {
  id: string
  name: string
  slug: string
  status: string
  tier: "free" | "starter" | "pro" | "premium" | "business" | "admin"
  seatLimit: number
  activeSeatCount: number
  canCompanyManage: boolean
}

type AccessUser = {
  organizationId: string
  userId: string | null
  email: string
  fullName: string
  accessRole: "owner" | "admin" | "member"
  accessStatus: "invited" | "active" | "suspended" | "removed"
  tier: Organization["tier"]
  hasLogin: boolean
}

type AccessPayload = {
  status: string
  scope: "owner" | "organization"
  organizations: Organization[]
  users: AccessUser[]
  message?: string
}

const emptyPayload: AccessPayload = {
  status: "idle",
  scope: "organization",
  organizations: [],
  users: [],
}

function titleCase(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1)
}

export default function CompanyAccessPage() {
  const [payload, setPayload] = useState<AccessPayload>(emptyPayload)
  const [selectedOrgId, setSelectedOrgId] = useState("")
  const [query, setQuery] = useState("")
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState("")
  const [form, setForm] = useState({
    email: "",
    fullName: "",
    temporaryPassword: "",
    createLogin: true,
  })

  const selectedOrg = useMemo(
    () =>
      payload.organizations.find((organization) => organization.id === selectedOrgId) ||
      payload.organizations[0],
    [payload.organizations, selectedOrgId],
  )

  const users = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()

    return payload.users
      .filter((user) => user.organizationId === selectedOrg?.id)
      .filter((user) => user.accessStatus !== "removed")
      .filter((user) => {
        if (!normalizedQuery) {
          return true
        }

        return `${user.email} ${user.fullName} ${user.accessStatus}`
          .toLowerCase()
          .includes(normalizedQuery)
      })
  }, [payload.users, query, selectedOrg?.id])

  const remainingSeats = selectedOrg
    ? selectedOrg.seatLimit < 0
      ? "Unlimited"
      : String(Math.max(0, selectedOrg.seatLimit - selectedOrg.activeSeatCount))
    : "0"

  async function loadAccess() {
    setLoading(true)
    setMessage("")

    try {
      const response = await fetch("/api/admin/access-users", {
        cache: "no-store",
      })
      const result = (await response.json()) as AccessPayload

      if (!response.ok) {
        throw new Error(result.message || "Company access could not be loaded.")
      }

      setPayload(result)
      setSelectedOrgId((current) => current || result.organizations[0]?.id || "")
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Company access could not be loaded.",
      )
    } finally {
      setLoading(false)
    }
  }

  async function runAction(body: Record<string, unknown>) {
    setSaving(true)
    setMessage("")

    try {
      const response = await fetch("/api/admin/access-users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      })
      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || "Access update failed.")
      }

      setMessage(result.message || "Access updated.")
      await loadAccess()
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Access update failed.")
    } finally {
      setSaving(false)
    }
  }

  useEffect(() => {
    loadAccess()
  }, [])

  return (
    <main className="min-h-screen bg-slate-100 px-5 py-6 lg:px-8">
      <div className="mx-auto grid max-w-[1280px] gap-6">
        <section className="rounded-[28px] border border-slate-200 bg-slate-950 p-6 text-white shadow-sm">
          <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-end">
            <div>
              <div className="mb-4 flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-blue-100">
                <Building2 size={14} />
                Company Admin
              </div>
              <h1 className="text-3xl font-black tracking-tight">
                Team access list
              </h1>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-300">
                Add and remove team seats within the allowance set by the
                platform administrator.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <Metric label="Seats" value={String(selectedOrg?.activeSeatCount || 0)} />
              <Metric label="Open" value={remainingSeats} />
              <Metric label="Tier" value={selectedOrg ? titleCase(selectedOrg.tier) : "-"} />
            </div>
          </div>
        </section>

        {message ? (
          <div className="rounded-2xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm font-bold text-blue-800">
            {message}
          </div>
        ) : null}

        {selectedOrg && !selectedOrg.canCompanyManage ? (
          <div className="rounded-[24px] border border-amber-200 bg-amber-50 p-5 text-amber-900">
            <div className="flex gap-3">
              <ShieldAlert size={22} className="shrink-0" />
              <div>
                <h2 className="font-black">Company access is paused</h2>
                <p className="mt-1 text-sm font-bold leading-6">
                  The platform administrator has paused or revoked this company.
                  Roster changes are disabled until access is restored.
                </p>
              </div>
            </div>
          </div>
        ) : null}

        <section className="grid gap-5 lg:grid-cols-[280px_minmax(0,1fr)]">
          <aside className="rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.16em] text-blue-600">
                  Company
                </p>
                <h2 className="text-lg font-black text-slate-950">Lists</h2>
              </div>
              <button
                type="button"
                onClick={loadAccess}
                className="rounded-2xl border border-slate-200 p-2 text-slate-600 hover:bg-slate-50"
                aria-label="Refresh"
              >
                {loading ? <Loader2 size={17} className="animate-spin" /> : <RefreshCw size={17} />}
              </button>
            </div>

            <div className="grid gap-2">
              {payload.organizations.map((organization) => (
                <button
                  key={organization.id}
                  type="button"
                  onClick={() => setSelectedOrgId(organization.id)}
                  className={`rounded-2xl border p-3 text-left ${
                    selectedOrg?.id === organization.id
                      ? "border-blue-300 bg-blue-50"
                      : "border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  <p className="truncate text-sm font-black text-slate-950">
                    {organization.name}
                  </p>
                  <p className="mt-1 text-xs font-bold text-slate-500">
                    {organization.seatLimit < 0
                      ? `${organization.activeSeatCount} seats`
                      : `${organization.activeSeatCount}/${organization.seatLimit} seats`}
                  </p>
                </button>
              ))}
            </div>
          </aside>

          <section className="grid gap-5">
            {selectedOrg ? (
              <form
                className="rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm"
                onSubmit={(event) => {
                  event.preventDefault()
                  runAction({
                    action: "invite_user",
                    organizationId: selectedOrg.id,
                    email: form.email,
                    fullName: form.fullName,
                    role: "member",
                    tier: selectedOrg.tier,
                    createLogin: form.createLogin,
                    temporaryPassword: form.temporaryPassword,
                  })
                  setForm({
                    email: "",
                    fullName: "",
                    temporaryPassword: "",
                    createLogin: true,
                  })
                }}
              >
                <div className="mb-4 flex items-center gap-3">
                  <div className="rounded-2xl bg-emerald-50 p-3 text-emerald-700">
                    <UserPlus size={18} />
                  </div>
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.16em] text-emerald-600">
                      Add Seat
                    </p>
                    <h2 className="text-lg font-black text-slate-950">
                      Add a company member
                    </h2>
                  </div>
                </div>

                <div className="grid gap-3 lg:grid-cols-[1fr_1fr_260px_140px]">
                  <input
                    type="email"
                    value={form.email}
                    onChange={(event) =>
                      setForm((current) => ({ ...current, email: event.target.value }))
                    }
                    placeholder="email@company.com"
                    className="rounded-2xl border border-slate-200 px-3 py-2 text-sm font-bold text-slate-900 outline-none focus:border-blue-400"
                    required
                    disabled={!selectedOrg.canCompanyManage}
                  />
                  <input
                    value={form.fullName}
                    onChange={(event) =>
                      setForm((current) => ({ ...current, fullName: event.target.value }))
                    }
                    placeholder="Full name"
                    className="rounded-2xl border border-slate-200 px-3 py-2 text-sm font-bold text-slate-900 outline-none focus:border-blue-400"
                    disabled={!selectedOrg.canCompanyManage}
                  />
                  <input
                    value={form.temporaryPassword}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        temporaryPassword: event.target.value,
                      }))
                    }
                    placeholder="Temporary password"
                    className="rounded-2xl border border-slate-200 px-3 py-2 text-sm font-bold text-slate-900 outline-none focus:border-blue-400"
                    disabled={!selectedOrg.canCompanyManage}
                  />
                  <button
                    type="submit"
                    disabled={saving || !selectedOrg.canCompanyManage}
                    className="rounded-2xl bg-emerald-600 px-4 py-2 text-sm font-black text-white hover:bg-emerald-700 disabled:opacity-50"
                  >
                    Add
                  </button>
                </div>
              </form>
            ) : null}

            <div className="rounded-[24px] border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-200 p-4">
                <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_300px] lg:items-center">
                  <div className="flex items-center gap-3">
                    <div className="rounded-2xl bg-blue-50 p-3 text-blue-700">
                      <Users size={18} />
                    </div>
                    <div>
                      <p className="text-xs font-black uppercase tracking-[0.16em] text-blue-600">
                        Roster
                      </p>
                      <h2 className="text-lg font-black text-slate-950">
                        Company members
                      </h2>
                    </div>
                  </div>

                  <div className="relative">
                    <Search
                      size={16}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                    <input
                      value={query}
                      onChange={(event) => setQuery(event.target.value)}
                      placeholder="Search people"
                      className="w-full rounded-2xl border border-slate-200 py-2 pl-9 pr-3 text-sm font-bold text-slate-900 outline-none focus:border-blue-400"
                    />
                  </div>
                </div>
              </div>

              <div className="grid gap-3 p-4">
                {loading ? (
                  <div className="flex items-center justify-center gap-2 rounded-2xl border border-slate-200 p-8 text-sm font-black text-slate-500">
                    <Loader2 size={18} className="animate-spin" />
                    Loading roster
                  </div>
                ) : null}

                {!loading && users.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-slate-300 p-8 text-center text-sm font-black text-slate-500">
                    No members found.
                  </div>
                ) : null}

                {users.map((user) => (
                  <article
                    key={`${user.organizationId}-${user.email}`}
                    className="rounded-[22px] border border-slate-200 bg-slate-50 p-4"
                  >
                    <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="truncate text-base font-black text-slate-950">
                            {user.fullName || user.email}
                          </h3>
                          {user.hasLogin ? (
                            <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2 py-1 text-[11px] font-black uppercase tracking-[0.12em] text-emerald-700">
                              <CheckCircle2 size={12} />
                              Login
                            </span>
                          ) : null}
                        </div>
                        <p className="mt-1 truncate text-sm font-bold text-slate-500">
                          {user.email}
                        </p>
                        <p className="mt-2 text-xs font-black uppercase tracking-[0.12em] text-slate-400">
                          {titleCase(user.accessStatus)} · {titleCase(user.accessRole)}
                        </p>
                      </div>

                      <div className="flex flex-wrap justify-end gap-2">
                        <button
                          type="button"
                          disabled={saving || !selectedOrg?.canCompanyManage}
                          onClick={() =>
                            runAction({
                              action: "update_user",
                              organizationId: user.organizationId,
                              userId: user.userId,
                              email: user.email,
                              role: "member",
                              tier: selectedOrg?.tier,
                              accessStatus:
                                user.accessStatus === "suspended"
                                  ? "active"
                                  : "suspended",
                            })
                          }
                          className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-black text-slate-600 hover:bg-slate-100 disabled:opacity-50"
                        >
                          {user.accessStatus === "suspended" ? "Restore" : "Suspend"}
                        </button>
                        <button
                          type="button"
                          disabled={saving || !selectedOrg?.canCompanyManage}
                          onClick={() =>
                            runAction({
                              action: "delete_user",
                              organizationId: user.organizationId,
                              userId: user.userId,
                              email: user.email,
                              deleteLogin: false,
                            })
                          }
                          className="inline-flex items-center gap-2 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-black text-rose-700 hover:bg-rose-100 disabled:opacity-50"
                        >
                          <UserMinus size={16} />
                          Remove seat
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>
        </section>
      </div>
    </main>
  )
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/15 bg-white/10 p-4">
      <p className="text-xs font-black uppercase tracking-[0.14em] text-blue-100">
        {label}
      </p>
      <p className="mt-2 truncate text-xl font-black text-white">{value}</p>
    </div>
  )
}
