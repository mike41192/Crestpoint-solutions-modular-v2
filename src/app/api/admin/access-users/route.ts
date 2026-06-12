import {
  requireAccessManager,
  type AccessManagerScope,
} from "@/lib/security/access-manager-auth"
import { createSupabaseAdminClient } from "@/lib/supabase/admin"
import { membershipTiers } from "@/lib/config/tiers.config"
import { normalizeMembershipTier } from "@/lib/config/limits.config"
import type { MembershipTier } from "@/types/modules"

const NO_STORE_HEADERS = {
  "Cache-Control": "no-store, max-age=0",
}

const MEMBER_ROLES = ["owner", "admin", "member"] as const
const MEMBER_STATUSES = ["invited", "active", "suspended", "removed"] as const

type AccessAction =
  | "create_org"
  | "update_org"
  | "invite_user"
  | "update_user"
  | "delete_user"
type MemberRole = (typeof MEMBER_ROLES)[number]
type MemberStatus = (typeof MEMBER_STATUSES)[number]

type OrganizationRow = {
  id: string
  name: string
  slug: string
  status: string
  tier: string
  seat_limit: number | null
  created_at: string
}

type ProfileRow = {
  id: string
  email: string | null
  full_name: string | null
  role: string | null
  organization_id: string | null
}

type MembershipRow = {
  user_id: string
  plan_name: string | null
  status: string | null
  organization_id: string | null
  assigned_at: string | null
}

type OrganizationMemberRow = {
  organization_id: string
  user_id: string | null
  email: string
  role: MemberRole
  status: MemberStatus
  invited_at: string | null
  joined_at: string | null
}

function cleanText(value: unknown) {
  return typeof value === "string" ? value.trim() : ""
}

function cleanEmail(value: unknown) {
  return cleanText(value).toLowerCase()
}

function cleanSlug(value: unknown, fallback: string) {
  const base = cleanText(value || fallback)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")

  return base || "organization"
}

function isMembershipTier(value: unknown): value is MembershipTier {
  return (
    typeof value === "string" &&
    membershipTiers.includes(value as MembershipTier)
  )
}

function cleanTier(value: unknown): MembershipTier {
  return isMembershipTier(value) ? value : normalizeMembershipTier(String(value || "business"))
}

function cleanRole(value: unknown): MemberRole {
  return MEMBER_ROLES.includes(value as MemberRole)
    ? (value as MemberRole)
    : "member"
}

function cleanStatus(value: unknown): MemberStatus {
  return MEMBER_STATUSES.includes(value as MemberStatus)
    ? (value as MemberStatus)
    : "active"
}

function canManageOrganization(scope: AccessManagerScope, organizationId: string) {
  return (
    scope.kind === "owner" ||
    scope.organizationIds.includes(organizationId)
  )
}

function isPlatformOwner(scope: AccessManagerScope) {
  return scope.kind === "owner"
}

function isCompanyScope(scope: AccessManagerScope) {
  return scope.kind === "organization"
}

function cleanOrganizationStatus(value: unknown) {
  const status = cleanText(value).toLowerCase()

  if (status === "active" || status === "paused" || status === "archived") {
    return status
  }

  return "active"
}

function getActiveSeatCount(members: OrganizationMemberRow[]) {
  return members.filter((member) => member.status !== "removed").length
}

function ensureCompanyCanManageOrganization(organization: OrganizationRow | null) {
  if (!organization) {
    return "Organization could not be loaded."
  }

  if (organization.status !== "active") {
    return "This company access list is paused or revoked by the platform owner."
  }

  return null
}

async function writeAudit({
  action,
  actorUserId,
  actorEmail,
  organizationId,
  targetUserId,
  targetEmail,
  details,
}: {
  action: AccessAction
  actorUserId: string
  actorEmail: string | null
  organizationId: string | null
  targetUserId?: string | null
  targetEmail?: string | null
  details?: Record<string, unknown>
}) {
  const supabase = createSupabaseAdminClient()

  await supabase.from("access_management_audit").insert({
    action,
    actor_user_id: actorUserId,
    actor_email: actorEmail,
    organization_id: organizationId,
    target_user_id: targetUserId || null,
    target_email: targetEmail || null,
    details: details || {},
  })
}

async function loadOrganizations(scope: AccessManagerScope) {
  const supabase = createSupabaseAdminClient()
  let query = supabase
    .from("organizations")
    .select("id, name, slug, status, tier, seat_limit, created_at")
    .order("name", { ascending: true })

  if (scope.kind === "organization") {
    query = query.in("id", scope.organizationIds)
  }

  const { data, error } = await query

  if (error) {
    throw new Error(error.message)
  }

  return (data || []) as OrganizationRow[]
}

async function loadMembers(organizationIds: string[]) {
  if (organizationIds.length === 0) {
    return []
  }

  const supabase = createSupabaseAdminClient()
  const { data, error } = await supabase
    .from("organization_members")
    .select("organization_id, user_id, email, role, status, invited_at, joined_at")
    .in("organization_id", organizationIds)
    .order("invited_at", { ascending: false })

  if (error) {
    throw new Error(error.message)
  }

  return (data || []) as OrganizationMemberRow[]
}

async function loadOrganization(organizationId: string) {
  const supabase = createSupabaseAdminClient()
  const { data, error } = await supabase
    .from("organizations")
    .select("id, name, slug, status, tier, seat_limit, created_at")
    .eq("id", organizationId)
    .maybeSingle()

  if (error) {
    throw new Error(error.message)
  }

  return data as OrganizationRow | null
}

async function loadOrganizationMembers(organizationId: string) {
  return loadMembers([organizationId])
}

async function loadProfiles(userIds: string[]) {
  if (userIds.length === 0) {
    return []
  }

  const supabase = createSupabaseAdminClient()
  const { data, error } = await supabase
    .from("profiles")
    .select("id, email, full_name, role, organization_id")
    .in("id", userIds)

  if (error) {
    throw new Error(error.message)
  }

  return (data || []) as ProfileRow[]
}

async function loadMemberships(userIds: string[]) {
  if (userIds.length === 0) {
    return []
  }

  const supabase = createSupabaseAdminClient()
  const { data, error } = await supabase
    .from("memberships")
    .select("user_id, plan_name, status, organization_id, assigned_at")
    .in("user_id", userIds)

  if (error) {
    throw new Error(error.message)
  }

  return (data || []) as MembershipRow[]
}

async function findAuthUserByEmail(email: string) {
  const supabase = createSupabaseAdminClient()
  const { data, error } = await supabase.auth.admin.listUsers({
    page: 1,
    perPage: 1000,
  })

  if (error) {
    throw new Error(error.message)
  }

  return (data.users || []).find(
    (user) => user.email?.toLowerCase() === email,
  )
}

export async function GET() {
  const manager = await requireAccessManager()

  if (!manager.ok) {
    return manager.response
  }

  try {
    const organizations = await loadOrganizations(manager.scope)
    const organizationIds = organizations.map((org) => org.id)
    const members = await loadMembers(organizationIds)
    const userIds = members
      .map((member) => member.user_id)
      .filter((value): value is string => Boolean(value))

    const [profiles, memberships] = await Promise.all([
      loadProfiles(userIds),
      loadMemberships(userIds),
    ])

    const profileById = new Map(profiles.map((profile) => [profile.id, profile]))
    const membershipByUserId = new Map(
      memberships.map((membership) => [membership.user_id, membership]),
    )

      const organizationSummaries = organizations.map((organization) => {
      const activeSeatCount = members.filter(
        (member) =>
          member.organization_id === organization.id &&
          member.status !== "removed",
      ).length

      return {
        id: organization.id,
        name: organization.name,
        slug: organization.slug,
        status: organization.status,
        tier: organization.tier,
        seatLimit: Number(organization.seat_limit ?? 0),
        activeSeatCount,
        createdAt: organization.created_at,
        canCompanyManage: organization.status === "active",
      }
    })

    const users = members.map((member) => {
      const profile = member.user_id ? profileById.get(member.user_id) : null
      const membership = member.user_id
        ? membershipByUserId.get(member.user_id)
        : null

      return {
        organizationId: member.organization_id,
        userId: member.user_id,
        email: member.email,
        fullName: profile?.full_name || "",
        accessRole: member.role,
        accessStatus: member.status,
        tier: normalizeMembershipTier(membership?.plan_name),
        membershipStatus: membership?.status || "active",
        invitedAt: member.invited_at,
        joinedAt: member.joined_at,
        hasLogin: Boolean(member.user_id),
      }
    })

    return Response.json(
      {
        status: "success",
        scope: manager.scope.kind,
        organizations: organizationSummaries,
        users,
        tiers: membershipTiers,
        roles: MEMBER_ROLES,
        statuses: MEMBER_STATUSES,
        companyPortalHref: "/company-admin/access",
      },
      { headers: NO_STORE_HEADERS },
    )
  } catch (error) {
    return Response.json(
      {
        status: "error",
        message:
          error instanceof Error ? error.message : "Access list load failed.",
      },
      { status: 500, headers: NO_STORE_HEADERS },
    )
  }
}

export async function POST(request: Request) {
  const manager = await requireAccessManager()

  if (!manager.ok) {
    return manager.response
  }

  try {
    const body = await request.json().catch(() => ({}))
    const action = cleanText(body?.action) as AccessAction
    const supabase = createSupabaseAdminClient()

    if (action === "create_org") {
      if (manager.scope.kind !== "owner") {
        return Response.json(
          {
            status: "error",
            message: "Only platform owners can create organizations.",
          },
          { status: 403, headers: NO_STORE_HEADERS },
        )
      }

      const name = cleanText(body?.name)

      if (!name) {
        return Response.json(
          {
            status: "error",
            message: "Organization name is required.",
          },
          { status: 400, headers: NO_STORE_HEADERS },
        )
      }

      const slug = cleanSlug(body?.slug, name)
      const tier = cleanTier(body?.tier)
      const seatLimit = Math.max(-1, Math.trunc(Number(body?.seatLimit ?? 25)))

      const { data, error } = await supabase
        .from("organizations")
        .insert({
          name,
          slug,
          tier,
          seat_limit: seatLimit,
          created_by: manager.userId,
        })
        .select("id")
        .maybeSingle()

      if (error) {
        return Response.json(
          {
            status: "error",
            message: error.message,
          },
          { status: 500, headers: NO_STORE_HEADERS },
        )
      }

      await writeAudit({
        action,
        actorUserId: manager.userId,
        actorEmail: manager.email,
        organizationId: data?.id || null,
        details: { name, slug, tier, seatLimit },
      })

      return Response.json(
        {
          status: "success",
          message: "Organization created.",
        },
        { headers: NO_STORE_HEADERS },
      )
    }

    if (action === "update_org") {
      if (!isPlatformOwner(manager.scope)) {
        return Response.json(
          {
            status: "error",
            message: "Only platform owners can change company access settings.",
          },
          { status: 403, headers: NO_STORE_HEADERS },
        )
      }

      const organizationId = cleanText(body?.organizationId)
      const tier = cleanTier(body?.tier)
      const organizationStatus = cleanOrganizationStatus(body?.organizationStatus)
      const seatLimit = Math.max(-1, Math.trunc(Number(body?.seatLimit ?? 25)))

      if (!organizationId) {
        return Response.json(
          {
            status: "error",
            message: "Organization id is required.",
          },
          { status: 400, headers: NO_STORE_HEADERS },
        )
      }

      const { error } = await supabase
        .from("organizations")
        .update({
          tier,
          status: organizationStatus,
          seat_limit: seatLimit,
          updated_at: new Date().toISOString(),
        })
        .eq("id", organizationId)

      if (error) {
        return Response.json(
          {
            status: "error",
            message: error.message,
          },
          { status: 500, headers: NO_STORE_HEADERS },
        )
      }

      if (organizationStatus !== "active") {
        const { data: members, error: memberLoadError } = await supabase
          .from("organization_members")
          .select("user_id, email")
          .eq("organization_id", organizationId)
          .neq("status", "removed")

        if (memberLoadError) {
          return Response.json(
            {
              status: "error",
              message: memberLoadError.message,
            },
            { status: 500, headers: NO_STORE_HEADERS },
          )
        }

        const userIds = (members || [])
          .map((member) => member.user_id)
          .filter((value): value is string => Boolean(value))

        await supabase
          .from("organization_members")
          .update({
            status: "suspended",
            updated_at: new Date().toISOString(),
          })
          .eq("organization_id", organizationId)
          .neq("status", "removed")

        if (userIds.length > 0) {
          await supabase
            .from("memberships")
            .update({
              plan_name: "free",
              status: "paused",
              assigned_by: manager.userId,
              assigned_at: new Date().toISOString(),
            })
            .in("user_id", userIds)
        }
      }

      await writeAudit({
        action,
        actorUserId: manager.userId,
        actorEmail: manager.email,
        organizationId,
        details: { tier, organizationStatus, seatLimit },
      })

      return Response.json(
        {
          status: "success",
          message:
            organizationStatus === "active"
              ? "Company access settings updated."
              : "Company access revoked and member accounts were suspended.",
        },
        { headers: NO_STORE_HEADERS },
      )
    }

    if (action === "invite_user") {
      const organizationId = cleanText(body?.organizationId)
      const email = cleanEmail(body?.email)
      const fullName = cleanText(body?.fullName)
      const tier = cleanTier(body?.tier)
      const role = cleanRole(body?.role)
      const createLogin = Boolean(body?.createLogin)
      const temporaryPassword = cleanText(body?.temporaryPassword)

      if (!organizationId || !canManageOrganization(manager.scope, organizationId)) {
        return Response.json(
          {
            status: "error",
            message: "You cannot manage that organization.",
          },
          { status: 403, headers: NO_STORE_HEADERS },
        )
      }

      if (!email) {
        return Response.json(
          {
            status: "error",
            message: "Email is required.",
          },
          { status: 400, headers: NO_STORE_HEADERS },
        )
      }

      const organization = await loadOrganization(organizationId)

      if (isCompanyScope(manager.scope)) {
        const organizationError = ensureCompanyCanManageOrganization(organization)

        if (organizationError) {
          return Response.json(
            {
              status: "error",
              message: organizationError,
            },
            { status: 403, headers: NO_STORE_HEADERS },
          )
        }

        if (role !== "member") {
          return Response.json(
            {
              status: "error",
              message: "Company admins can only add member seats.",
            },
            { status: 403, headers: NO_STORE_HEADERS },
          )
        }

        const existingMembers = await loadOrganizationMembers(organizationId)
        const existingMember = existingMembers.find(
          (member) => member.email.toLowerCase() === email,
        )

        if (existingMember && existingMember.role !== "member") {
          return Response.json(
            {
              status: "error",
              message: "Company admins cannot modify owner or admin seats.",
            },
            { status: 403, headers: NO_STORE_HEADERS },
          )
        }

        const seatLimit = Number(organization?.seat_limit ?? 0)
        const seatCount = getActiveSeatCount(existingMembers)

        if (!existingMember || existingMember.status === "removed") {
          if (seatLimit >= 0 && seatCount >= seatLimit) {
            return Response.json(
              {
                status: "error",
                message: "Seat limit reached. Ask the platform admin to increase this company's seat allowance.",
              },
              { status: 403, headers: NO_STORE_HEADERS },
            )
          }
        }
      }

      let authUser = await findAuthUserByEmail(email)

      if (!authUser && createLogin) {
        const { data, error } = await supabase.auth.admin.createUser({
          email,
          password: temporaryPassword || undefined,
          email_confirm: true,
          user_metadata: {
            full_name: fullName || undefined,
          },
        })

        if (error) {
          return Response.json(
            {
              status: "error",
              message: error.message,
            },
            { status: 500, headers: NO_STORE_HEADERS },
          )
        }

        authUser = data.user
      }

      const userId = authUser?.id || null
      const assignedTier = isCompanyScope(manager.scope)
        ? cleanTier(organization?.tier)
        : tier

      const { error: memberError } = await supabase
        .from("organization_members")
        .upsert(
          {
            organization_id: organizationId,
            user_id: userId,
            email,
            role: isCompanyScope(manager.scope) ? "member" : role,
            status: userId ? "active" : "invited",
            invited_by: manager.userId,
            joined_at: userId ? new Date().toISOString() : null,
          },
          { onConflict: "organization_id,email" },
        )

      if (memberError) {
        return Response.json(
          {
            status: "error",
            message: memberError.message,
          },
          { status: 500, headers: NO_STORE_HEADERS },
        )
      }

      if (userId) {
        await supabase.from("profiles").upsert({
          id: userId,
          email,
          full_name: fullName || authUser?.user_metadata?.full_name || null,
          role,
          organization_id: organizationId,
          updated_at: new Date().toISOString(),
        })

        await supabase.from("memberships").upsert(
          {
            user_id: userId,
            plan_name: assignedTier,
            status: "active",
            organization_id: organizationId,
            assigned_by: manager.userId,
            assigned_at: new Date().toISOString(),
          },
          { onConflict: "user_id" },
        )
      }

      await writeAudit({
        action,
        actorUserId: manager.userId,
        actorEmail: manager.email,
        organizationId,
        targetUserId: userId,
        targetEmail: email,
        details: { tier, role, createLogin },
      })

      return Response.json(
        {
          status: "success",
          message: userId ? "User added." : "Invite placeholder added.",
        },
        { headers: NO_STORE_HEADERS },
      )
    }

    if (action === "update_user") {
      const organizationId = cleanText(body?.organizationId)
      const userId = cleanText(body?.userId)
      const email = cleanEmail(body?.email)
      const tier = cleanTier(body?.tier)
      const role = cleanRole(body?.role)
      const status = cleanStatus(body?.accessStatus)

      if (!organizationId || !canManageOrganization(manager.scope, organizationId)) {
        return Response.json(
          {
            status: "error",
            message: "You cannot manage that organization.",
          },
          { status: 403, headers: NO_STORE_HEADERS },
        )
      }

      if (!email) {
        return Response.json(
          {
            status: "error",
            message: "Email is required.",
          },
          { status: 400, headers: NO_STORE_HEADERS },
        )
      }

      const organization = await loadOrganization(organizationId)

      if (isCompanyScope(manager.scope)) {
        const organizationError = ensureCompanyCanManageOrganization(organization)

        if (organizationError) {
          return Response.json(
            {
              status: "error",
              message: organizationError,
            },
            { status: 403, headers: NO_STORE_HEADERS },
          )
        }

        if (role !== "member") {
          return Response.json(
            {
              status: "error",
              message: "Company admins cannot promote users to admin or owner.",
            },
            { status: 403, headers: NO_STORE_HEADERS },
          )
        }

        if (tier !== cleanTier(organization?.tier)) {
          return Response.json(
            {
              status: "error",
              message: "Company admins cannot change membership tiers.",
            },
            { status: 403, headers: NO_STORE_HEADERS },
          )
        }

        const existingMembers = await loadOrganizationMembers(organizationId)
        const existingMember = existingMembers.find(
          (member) => member.email.toLowerCase() === email,
        )

        if (existingMember && existingMember.role !== "member") {
          return Response.json(
            {
              status: "error",
              message: "Company admins cannot modify owner or admin seats.",
            },
            { status: 403, headers: NO_STORE_HEADERS },
          )
        }
      }

      const { error: memberError } = await supabase
        .from("organization_members")
        .update({
          role,
          status,
          updated_at: new Date().toISOString(),
        })
        .eq("organization_id", organizationId)
        .eq("email", email)

      if (memberError) {
        return Response.json(
          {
            status: "error",
            message: memberError.message,
          },
          { status: 500, headers: NO_STORE_HEADERS },
        )
      }

      if (userId) {
        await supabase
          .from("profiles")
          .update({
            role,
            organization_id: organizationId,
            updated_at: new Date().toISOString(),
          })
          .eq("id", userId)

        await supabase.from("memberships").upsert(
          {
            user_id: userId,
            plan_name: isCompanyScope(manager.scope)
              ? cleanTier(organization?.tier)
              : tier,
            status: status === "suspended" ? "paused" : "active",
            organization_id: organizationId,
            assigned_by: manager.userId,
            assigned_at: new Date().toISOString(),
          },
          { onConflict: "user_id" },
        )
      }

      await writeAudit({
        action,
        actorUserId: manager.userId,
        actorEmail: manager.email,
        organizationId,
        targetUserId: userId || null,
        targetEmail: email,
        details: { tier, role, status },
      })

      return Response.json(
        {
          status: "success",
          message: "User access updated.",
        },
        { headers: NO_STORE_HEADERS },
      )
    }

    if (action === "delete_user") {
      const organizationId = cleanText(body?.organizationId)
      const userId = cleanText(body?.userId)
      const email = cleanEmail(body?.email)
      const deleteLogin = Boolean(body?.deleteLogin)

      if (!organizationId || !canManageOrganization(manager.scope, organizationId)) {
        return Response.json(
          {
            status: "error",
            message: "You cannot manage that organization.",
          },
          { status: 403, headers: NO_STORE_HEADERS },
        )
      }

      if (!email) {
        return Response.json(
          {
            status: "error",
            message: "Email is required.",
          },
          { status: 400, headers: NO_STORE_HEADERS },
        )
      }

      const organization = await loadOrganization(organizationId)

      if (isCompanyScope(manager.scope)) {
        const organizationError = ensureCompanyCanManageOrganization(organization)

        if (organizationError) {
          return Response.json(
            {
              status: "error",
              message: organizationError,
            },
            { status: 403, headers: NO_STORE_HEADERS },
          )
        }

        if (deleteLogin) {
          return Response.json(
            {
              status: "error",
              message: "Company admins can remove seats, but only platform admins can delete login accounts.",
            },
            { status: 403, headers: NO_STORE_HEADERS },
          )
        }

        const existingMembers = await loadOrganizationMembers(organizationId)
        const existingMember = existingMembers.find(
          (member) => member.email.toLowerCase() === email,
        )

        if (existingMember && existingMember.role !== "member") {
          return Response.json(
            {
              status: "error",
              message: "Company admins cannot remove owner or admin seats.",
            },
            { status: 403, headers: NO_STORE_HEADERS },
          )
        }
      }

      const { error: memberError } = await supabase
        .from("organization_members")
        .update({
          status: "removed",
          updated_at: new Date().toISOString(),
        })
        .eq("organization_id", organizationId)
        .eq("email", email)

      if (memberError) {
        return Response.json(
          {
            status: "error",
            message: memberError.message,
          },
          { status: 500, headers: NO_STORE_HEADERS },
        )
      }

      if (userId) {
        await supabase
          .from("memberships")
          .update({
            status: "removed",
            assigned_by: manager.userId,
            assigned_at: new Date().toISOString(),
          })
          .eq("user_id", userId)

        if (deleteLogin) {
          const { error } = await supabase.auth.admin.deleteUser(userId)

          if (error) {
            return Response.json(
              {
                status: "error",
                message: error.message,
              },
              { status: 500, headers: NO_STORE_HEADERS },
            )
          }
        }
      }

      await writeAudit({
        action,
        actorUserId: manager.userId,
        actorEmail: manager.email,
        organizationId,
        targetUserId: userId || null,
        targetEmail: email,
        details: { deleteLogin },
      })

      return Response.json(
        {
          status: "success",
          message: deleteLogin ? "User removed and login deleted." : "User removed from access list.",
        },
        { headers: NO_STORE_HEADERS },
      )
    }

    return Response.json(
      {
        status: "error",
        message: "Unsupported access management action.",
      },
      { status: 400, headers: NO_STORE_HEADERS },
    )
  } catch (error) {
    return Response.json(
      {
        status: "error",
        message:
          error instanceof Error
            ? error.message
            : "Access management request failed.",
      },
      { status: 500, headers: NO_STORE_HEADERS },
    )
  }
}
