"use client"

import { useEffect, useMemo, useState } from "react"
import {
  Building2,
  CheckCircle2,
  Crown,
  Loader2,
  Plus,
  RefreshCw,
  Search,
  ShieldCheck,
  Trash2,
  UserCog,
  UserPlus,
  Users,
} from "lucide-react"

type Organization = {
  id: string
  name: string
  slug: string
  status: string
  tier: string
  seatLimit: number
  activeSeatCount: number
  createdAt: string
}

type AccessUser = {
  organizationId: string
  userId: string | null
  email: string
  fullName: string
  accessRole: "owner" | "admin" | "member"
  accessStatus: "invited" | "active" | "suspended" | "removed"
  tier: "free" | "starter" | "pro" | "premium" | "business" | "admin"
  membershipStatus: string
  invitedAt: string | null
  joinedAt: string | null
  hasLogin: boolean
}

type AccessPayload = {
  status: string
  scope: "owner" | "organization"
  organizations: Organization[]
  users: AccessUser[]
  tiers: AccessUser["tier"][]
  roles: AccessUser["accessRole"][]
  statuses: AccessUser["accessStatus"][]
  message?: string
}

const emptyPayload: AccessPayload = {
  status: "idle",
  scope: "organization",
  organizations: [],
  users: [],
  tiers: ["free", "starter", "pro", "premium", "business", "admin"],
  roles: ["owner", "admin", "member"],
  statuses: ["invited", "active", "suspended", "removed"],
}

const statusStyles: Record<AccessUser["accessStatus"], string> = {
  active: "border-emerald-200 bg-emerald-50 text-emerald-700",
  invited: "border-blue-200 bg-blue-50 text-blue-700",
  suspended: "border-amber-200 bg-amber-50 text-amber-700",
  removed: "border-slate-200 bg-slate-100 text-slate-500",
}

function titleCase(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1)
}

function formatDate(value: string | null) {
  if (!value) {
    return "Pending"
  }

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value))
}

export default function UsersSettingsPage() {
  const [payload, setPayload] = useState<AccessPayload>(emptyPayload)
  const [selectedOrgId, setSelectedOrgId] = useState("")
  const [query, setQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState("")
  const [inviteForm, setInviteForm] = useState({
    email: "",
    fullName: "",
    role: "member",
    tier: "business",
    createLogin: true,
    temporaryPassword: "",
  })
  const [orgForm, setOrgForm] = useState({
    name: "",
    slug: "",
    tier: "business",
    seatLimit: 25,
  })

  const selectedOrg = useMemo(
    () =>
      payload.organizations.find((organization) => organization.id === selectedOrgId) ||
      payload.organizations[0],
    [payload.organizations, selectedOrgId],
  )

  const visibleUsers = useMemo(() => {
    return payload.users
      .filter((user) => user.organizationId === selectedOrg?.id)
      .filter((user) => {
        if (statusFilter === "all") {
          return true
        }

        return user.accessStatus === statusFilter
      })
      .filter((user) => {
        const normalizedQuery = query.trim().toLowerCase()

        if (!normalizedQuery) {
          return true
        }

        return `${user.email} ${user.fullName} ${user.accessRole} ${user.tier}`
          .toLowerCase()
          .includes(normalizedQuery)
      })
  }, [payload.users, query, selectedOrg?.id, statusFilter])

  const activeAdmins = visibleUsers.filter(
    (user) =>
      user.accessStatus === "active" &&
      (user.accessRole === "owner" || user.accessRole === "admin"),
  ).length

  const pendingInvites = visibleUsers.filter(
    (user) => user.accessStatus === "invited",
  ).length

  async function loadAccessLists() {
    setLoading(true)
    setMessage("")

    try {
      const response = await fetch("/api/admin/access-users", {
        cache: "no-store",
      })
      const result = (await response.json()) as AccessPayload

      if (!response.ok) {
        throw new Error(result.message || "Access lists could not be loaded.")
      }

      setPayload(result)
      setSelectedOrgId((current) => current || result.organizations[0]?.id || "")
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Access lists could not be loaded.",
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
      await loadAccessLists()
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Access update failed.")
    } finally {
      setSaving(false)
    }
  }

  useEffect(() => {
    loadAccessLists()
  }, [])

  return (
    <main className="min-h-screen bg-slate-100 px-5 py-6 lg:px-8">
      <div className="mx-auto grid max-w-[1400px] gap-6">
        <section className="rounded-[28px] border border-slate-200 bg-slate-950 p-6 text-white shadow-sm">
          <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-end">
            <div>
              <div className="mb-4 flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-blue-100">
                <UserCog size={14} />
                Access Console
              </div>

              <h1 className="text-3xl font-black tracking-tight">
                User, tier, and admin management
              </h1>

              <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-300">
                Manage company access lists, assign tiers, promote local admins,
                and remove users from one operational dashboard.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <MetricCard label="Seats" value={String(selectedOrg?.activeSeatCount || 0)} />
              <MetricCard label="Admins" value={String(activeAdmins)} />
              <MetricCard label="Invites" value={String(pendingInvites)} />
            </div>
          </div>
        </section>

        {message ? (
          <div className="rounded-2xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm font-bold text-blue-800">
            {message}
          </div>
        ) : null}

        <section className="grid gap-5 xl:grid-cols-[310px_minmax(0,1fr)]">
          <aside className="grid gap-5">
            <div className="rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.16em] text-blue-600">
                    Organizations
                  </p>
                  <h2 className="mt-1 text-lg font-black text-slate-950">
                    Access lists
                  </h2>
                </div>

                <button
                  type="button"
                  onClick={loadAccessLists}
                  className="rounded-2xl border border-slate-200 p-2 text-slate-600 hover:bg-slate-50"
                  aria-label="Refresh access lists"
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
                    className={`rounded-2xl border p-3 text-left transition ${
                      selectedOrg?.id === organization.id
                        ? "border-blue-300 bg-blue-50"
                        : "border-slate-200 bg-white hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="rounded-xl bg-slate-950 p-2 text-white">
                        <Building2 size={16} />
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-black text-slate-950">
                          {organization.name}
                        </p>
                        <p className="mt-1 text-xs font-bold text-slate-500">
                          {organization.activeSeatCount}
                          {organization.seatLimit >= 0 ? `/${organization.seatLimit}` : ""} seats
                        </p>
                      </div>
                    </div>
                  </button>
                ))}

                {!loading && payload.organizations.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-slate-300 p-4 text-sm font-bold text-slate-500">
                    No organizations yet.
                  </div>
                ) : null}
              </div>
            </div>

            {payload.scope === "owner" ? (
              <form
                className="rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm"
                onSubmit={(event) => {
                  event.preventDefault()
                  runAction({
                    action: "create_org",
                    ...orgForm,
                  })
                  setOrgForm({
                    name: "",
                    slug: "",
                    tier: "business",
                    seatLimit: 25,
                  })
                }}
              >
                <div className="mb-4 flex items-center gap-3">
                  <div className="rounded-2xl bg-blue-50 p-3 text-blue-700">
                    <Plus size={18} />
                  </div>
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.16em] text-blue-600">
                      New Company
                    </p>
                    <h2 className="text-lg font-black text-slate-950">
                      Create list
                    </h2>
                  </div>
                </div>

                <div className="grid gap-3">
                  <input
                    value={orgForm.name}
                    onChange={(event) =>
                      setOrgForm((current) => ({
                        ...current,
                        name: event.target.value,
                      }))
                    }
                    placeholder="Company name"
                    className="rounded-2xl border border-slate-200 px-3 py-2 text-sm font-bold text-slate-900 outline-none focus:border-blue-400"
                  />
                  <input
                    value={orgForm.slug}
                    onChange={(event) =>
                      setOrgForm((current) => ({
                        ...current,
                        slug: event.target.value,
                      }))
                    }
                    placeholder="company-slug"
                    className="rounded-2xl border border-slate-200 px-3 py-2 text-sm font-bold text-slate-900 outline-none focus:border-blue-400"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <select
                      value={orgForm.tier}
                      onChange={(event) =>
                        setOrgForm((current) => ({
                          ...current,
                          tier: event.target.value,
                        }))
                      }
                      className="rounded-2xl border border-slate-200 px-3 py-2 text-sm font-bold text-slate-900 outline-none focus:border-blue-400"
                    >
                      {payload.tiers.map((tier) => (
                        <option key={tier} value={tier}>
                          {titleCase(tier)}
                        </option>
                      ))}
                    </select>
                    <input
                      type="number"
                      value={orgForm.seatLimit}
                      onChange={(event) =>
                        setOrgForm((current) => ({
                          ...current,
                          seatLimit: Number(event.target.value),
                        }))
                      }
                      className="rounded-2xl border border-slate-200 px-3 py-2 text-sm font-bold text-slate-900 outline-none focus:border-blue-400"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={saving}
                    className="rounded-2xl bg-slate-950 px-4 py-3 text-sm font-black text-white hover:bg-slate-800 disabled:opacity-60"
                  >
                    Create organization
                  </button>
                </div>
              </form>
            ) : null}
          </aside>

          <section className="grid gap-5">
            <div className="rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm">
              <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.16em] text-blue-600">
                    {selectedOrg ? selectedOrg.slug : "No organization"}
                  </p>
                  <h2 className="mt-1 text-2xl font-black text-slate-950">
                    {selectedOrg?.name || "Select an access list"}
                  </h2>
                  <p className="mt-2 text-sm font-bold text-slate-500">
                    {selectedOrg
                      ? `${titleCase(selectedOrg.tier)} tier · ${titleCase(selectedOrg.status)} · Created ${formatDate(selectedOrg.createdAt)}`
                      : "Create or select a company to manage its users."}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {["all", "active", "invited", "suspended", "removed"].map((status) => (
                    <button
                      key={status}
                      type="button"
                      onClick={() => setStatusFilter(status)}
                      className={`rounded-2xl border px-3 py-2 text-xs font-black uppercase tracking-[0.12em] ${
                        statusFilter === status
                          ? "border-slate-950 bg-slate-950 text-white"
                          : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {selectedOrg ? (
              <form
                className="rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm"
                onSubmit={(event) => {
                  event.preventDefault()
                  runAction({
                    action: "invite_user",
                    organizationId: selectedOrg.id,
                    ...inviteForm,
                  })
                  setInviteForm({
                    email: "",
                    fullName: "",
                    role: "member",
                    tier: selectedOrg.tier,
                    createLogin: true,
                    temporaryPassword: "",
                  })
                }}
              >
                <div className="mb-4 flex items-center gap-3">
                  <div className="rounded-2xl bg-emerald-50 p-3 text-emerald-700">
                    <UserPlus size={18} />
                  </div>
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.16em] text-emerald-600">
                      Add User
                    </p>
                    <h3 className="text-lg font-black text-slate-950">
                      Invite or create a login
                    </h3>
                  </div>
                </div>

                <div className="grid gap-3 lg:grid-cols-[1fr_1fr_150px_150px_180px]">
                  <input
                    type="email"
                    value={inviteForm.email}
                    onChange={(event) =>
                      setInviteForm((current) => ({
                        ...current,
                        email: event.target.value,
                      }))
                    }
                    placeholder="email@company.com"
                    className="rounded-2xl border border-slate-200 px-3 py-2 text-sm font-bold text-slate-900 outline-none focus:border-blue-400"
                    required
                  />
                  <input
                    value={inviteForm.fullName}
                    onChange={(event) =>
                      setInviteForm((current) => ({
                        ...current,
                        fullName: event.target.value,
                      }))
                    }
                    placeholder="Full name"
                    className="rounded-2xl border border-slate-200 px-3 py-2 text-sm font-bold text-slate-900 outline-none focus:border-blue-400"
                  />
                  <select
                    value={inviteForm.role}
                    onChange={(event) =>
                      setInviteForm((current) => ({
                        ...current,
                        role: event.target.value,
                      }))
                    }
                    className="rounded-2xl border border-slate-200 px-3 py-2 text-sm font-bold text-slate-900 outline-none focus:border-blue-400"
                  >
                    {payload.roles.map((role) => (
                      <option key={role} value={role}>
                        {titleCase(role)}
                      </option>
                    ))}
                  </select>
                  <select
                    value={inviteForm.tier}
                    onChange={(event) =>
                      setInviteForm((current) => ({
                        ...current,
                        tier: event.target.value,
                      }))
                    }
                    className="rounded-2xl border border-slate-200 px-3 py-2 text-sm font-bold text-slate-900 outline-none focus:border-blue-400"
                  >
                    {payload.tiers.map((tier) => (
                      <option key={tier} value={tier}>
                        {titleCase(tier)}
                      </option>
                    ))}
                  </select>
                  <button
                    type="submit"
                    disabled={saving}
                    className="rounded-2xl bg-emerald-600 px-4 py-2 text-sm font-black text-white hover:bg-emerald-700 disabled:opacity-60"
                  >
                    Add access
                  </button>
                </div>

                <div className="mt-3 grid gap-3 lg:grid-cols-[auto_280px] lg:items-center">
                  <label className="flex items-center gap-2 text-sm font-bold text-slate-600">
                    <input
                      type="checkbox"
                      checked={inviteForm.createLogin}
                      onChange={(event) =>
                        setInviteForm((current) => ({
                          ...current,
                          createLogin: event.target.checked,
                        }))
                      }
                    />
                    Create Supabase login now
                  </label>
                  <input
                    value={inviteForm.temporaryPassword}
                    onChange={(event) =>
                      setInviteForm((current) => ({
                        ...current,
                        temporaryPassword: event.target.value,
                      }))
                    }
                    placeholder="Temporary password"
                    className="rounded-2xl border border-slate-200 px-3 py-2 text-sm font-bold text-slate-900 outline-none focus:border-blue-400"
                  />
                </div>
              </form>
            ) : null}

            <div className="rounded-[24px] border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-200 p-4">
                <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-center">
                  <div className="flex items-center gap-3">
                    <div className="rounded-2xl bg-blue-50 p-3 text-blue-700">
                      <Users size={18} />
                    </div>
                    <div>
                      <p className="text-xs font-black uppercase tracking-[0.16em] text-blue-600">
                        Members
                      </p>
                      <h3 className="text-lg font-black text-slate-950">
                        Access roster
                      </h3>
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
                    Loading access lists
                  </div>
                ) : null}

                {!loading && visibleUsers.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-slate-300 p-8 text-center">
                    <UserPlus className="mx-auto text-slate-400" size={28} />
                    <p className="mt-3 text-sm font-black text-slate-700">
                      No users match this view.
                    </p>
                  </div>
                ) : null}

                {visibleUsers.map((user) => (
                  <UserAccessRow
                    key={`${user.organizationId}-${user.email}`}
                    user={user}
                    tiers={payload.tiers}
                    roles={payload.roles}
                    statuses={payload.statuses}
                    disabled={saving}
                    onUpdate={(updates) =>
                      runAction({
                        action: "update_user",
                        organizationId: user.organizationId,
                        userId: user.userId,
                        email: user.email,
                        ...updates,
                      })
                    }
                    onDelete={(deleteLogin) =>
                      runAction({
                        action: "delete_user",
                        organizationId: user.organizationId,
                        userId: user.userId,
                        email: user.email,
                        deleteLogin,
                      })
                    }
                  />
                ))}
              </div>
            </div>
          </section>
        </section>
      </div>
    </main>
  )
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/15 bg-white/10 p-4">
      <p className="text-xs font-black uppercase tracking-[0.14em] text-blue-100">
        {label}
      </p>
      <p className="mt-2 text-2xl font-black text-white">{value}</p>
    </div>
  )
}

function UserAccessRow({
  user,
  tiers,
  roles,
  statuses,
  disabled,
  onUpdate,
  onDelete,
}: {
  user: AccessUser
  tiers: AccessUser["tier"][]
  roles: AccessUser["accessRole"][]
  statuses: AccessUser["accessStatus"][]
  disabled: boolean
  onUpdate: (updates: {
    tier: string
    role: string
    accessStatus: string
  }) => void
  onDelete: (deleteLogin: boolean) => void
}) {
  const [tier, setTier] = useState(user.tier)
  const [role, setRole] = useState(user.accessRole)
  const [accessStatus, setAccessStatus] = useState(user.accessStatus)

  useEffect(() => {
    setTier(user.tier)
    setRole(user.accessRole)
    setAccessStatus(user.accessStatus)
  }, [user.accessRole, user.accessStatus, user.tier])

  const hasChanges =
    tier !== user.tier ||
    role !== user.accessRole ||
    accessStatus !== user.accessStatus

  return (
    <article className="rounded-[22px] border border-slate-200 bg-slate-50 p-4">
      <div className="grid gap-4 xl:grid-cols-[minmax(260px,1fr)_460px_auto] xl:items-center">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h4 className="truncate text-base font-black text-slate-950">
              {user.fullName || user.email}
            </h4>
            {role === "owner" ? (
              <Badge icon={Crown} label="Owner" tone="amber" />
            ) : null}
            {role === "admin" ? (
              <Badge icon={ShieldCheck} label="Admin" tone="blue" />
            ) : null}
            {user.hasLogin ? (
              <Badge icon={CheckCircle2} label="Login" tone="emerald" />
            ) : null}
          </div>

          <p className="mt-1 truncate text-sm font-bold text-slate-500">
            {user.email}
          </p>
          <p className="mt-2 text-xs font-bold text-slate-400">
            Joined: {formatDate(user.joinedAt)} · Invited: {formatDate(user.invitedAt)}
          </p>
        </div>

        <div className="grid gap-2 sm:grid-cols-3">
          <label className="grid gap-1">
            <span className="text-xs font-black uppercase tracking-[0.12em] text-slate-500">
              Tier
            </span>
            <select
              value={tier}
              onChange={(event) => setTier(event.target.value as AccessUser["tier"])}
              className="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm font-bold text-slate-900"
            >
              {tiers.map((item) => (
                <option key={item} value={item}>
                  {titleCase(item)}
                </option>
              ))}
            </select>
          </label>

          <label className="grid gap-1">
            <span className="text-xs font-black uppercase tracking-[0.12em] text-slate-500">
              Role
            </span>
            <select
              value={role}
              onChange={(event) => setRole(event.target.value as AccessUser["accessRole"])}
              className="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm font-bold text-slate-900"
            >
              {roles.map((item) => (
                <option key={item} value={item}>
                  {titleCase(item)}
                </option>
              ))}
            </select>
          </label>

          <label className="grid gap-1">
            <span className="text-xs font-black uppercase tracking-[0.12em] text-slate-500">
              Status
            </span>
            <select
              value={accessStatus}
              onChange={(event) =>
                setAccessStatus(event.target.value as AccessUser["accessStatus"])
              }
              className={`rounded-2xl border px-3 py-2 text-sm font-bold ${statusStyles[accessStatus]}`}
            >
              {statuses.map((item) => (
                <option key={item} value={item}>
                  {titleCase(item)}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="flex flex-wrap justify-end gap-2">
          <button
            type="button"
            disabled={disabled || !hasChanges}
            onClick={() =>
              onUpdate({
                tier,
                role,
                accessStatus,
              })
            }
            className="rounded-2xl bg-slate-950 px-4 py-2 text-sm font-black text-white hover:bg-slate-800 disabled:opacity-40"
          >
            Save
          </button>
          <button
            type="button"
            disabled={disabled}
            onClick={() => onDelete(false)}
            className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-black text-slate-600 hover:bg-slate-100 disabled:opacity-40"
          >
            Remove
          </button>
          <button
            type="button"
            disabled={disabled || !user.userId}
            onClick={() => onDelete(true)}
            className="rounded-2xl border border-rose-200 bg-rose-50 p-2 text-rose-700 hover:bg-rose-100 disabled:opacity-40"
            aria-label={`Delete login for ${user.email}`}
          >
            <Trash2 size={17} />
          </button>
        </div>
      </div>
    </article>
  )
}

function Badge({
  icon: Icon,
  label,
  tone,
}: {
  icon: React.ComponentType<{ size?: number; className?: string }>
  label: string
  tone: "amber" | "blue" | "emerald"
}) {
  const toneClass = {
    amber: "border-amber-200 bg-amber-50 text-amber-700",
    blue: "border-blue-200 bg-blue-50 text-blue-700",
    emerald: "border-emerald-200 bg-emerald-50 text-emerald-700",
  }[tone]

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2 py-1 text-[11px] font-black uppercase tracking-[0.12em] ${toneClass}`}
    >
      <Icon size={12} />
      {label}
    </span>
  )
}
