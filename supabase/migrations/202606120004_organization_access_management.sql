create extension if not exists "pgcrypto";

create table if not exists public.organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  status text not null default 'active',
  tier text not null default 'business',
  seat_limit integer not null default 25,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint organizations_status_check check (status in ('active', 'paused', 'archived')),
  constraint organizations_tier_check check (tier in ('free', 'starter', 'pro', 'premium', 'business', 'admin')),
  constraint organizations_seat_limit_check check (seat_limit >= -1)
);

create table if not exists public.organization_members (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,
  email text not null,
  role text not null default 'member',
  status text not null default 'active',
  invited_by uuid references auth.users(id) on delete set null,
  invited_at timestamptz not null default now(),
  joined_at timestamptz,
  updated_at timestamptz not null default now(),
  constraint organization_members_role_check check (role in ('owner', 'admin', 'member')),
  constraint organization_members_status_check check (status in ('invited', 'active', 'suspended', 'removed')),
  constraint organization_members_email_check check (position('@' in email) > 1)
);

create unique index if not exists organization_members_org_email_idx
on public.organization_members (organization_id, email);

create index if not exists organization_members_user_id_idx
on public.organization_members (user_id);

create index if not exists organization_members_org_status_idx
on public.organization_members (organization_id, status);

alter table public.profiles
add column if not exists organization_id uuid references public.organizations(id) on delete set null;

alter table public.memberships
add column if not exists organization_id uuid references public.organizations(id) on delete set null,
add column if not exists assigned_by uuid references auth.users(id) on delete set null,
add column if not exists assigned_at timestamptz;

create index if not exists profiles_organization_id_idx
on public.profiles (organization_id);

create index if not exists memberships_organization_id_idx
on public.memberships (organization_id);

create table if not exists public.access_management_audit (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references public.organizations(id) on delete set null,
  target_user_id uuid references auth.users(id) on delete set null,
  target_email text,
  action text not null,
  actor_user_id uuid references auth.users(id) on delete set null,
  actor_email text,
  details jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists access_management_audit_org_created_idx
on public.access_management_audit (organization_id, created_at desc);

alter table public.organizations enable row level security;
alter table public.organization_members enable row level security;
alter table public.access_management_audit enable row level security;

grant select, insert, update, delete on public.organizations to service_role;
grant select, insert, update, delete on public.organization_members to service_role;
grant select, insert, update, delete on public.access_management_audit to service_role;
grant select, update on public.profiles to service_role;
grant select, insert, update, delete on public.memberships to service_role;

drop policy if exists "organizations_service_role_all" on public.organizations;
create policy "organizations_service_role_all"
on public.organizations
for all
to service_role
using (true)
with check (true);

drop policy if exists "organization_members_service_role_all" on public.organization_members;
create policy "organization_members_service_role_all"
on public.organization_members
for all
to service_role
using (true)
with check (true);

drop policy if exists "access_management_audit_service_role_all" on public.access_management_audit;
create policy "access_management_audit_service_role_all"
on public.access_management_audit
for all
to service_role
using (true)
with check (true);

drop trigger if exists set_organizations_updated_at on public.organizations;
create trigger set_organizations_updated_at
before update on public.organizations
for each row
execute function public.set_updated_at();

drop trigger if exists set_organization_members_updated_at on public.organization_members;
create trigger set_organization_members_updated_at
before update on public.organization_members
for each row
execute function public.set_updated_at();

notify pgrst, 'reload schema';
