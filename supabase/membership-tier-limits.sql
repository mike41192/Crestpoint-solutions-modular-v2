create table if not exists public.membership_tier_limits (
  tier text primary key,
  ai_credits_per_month integer not null default 0,
  resume_uploads_per_month integer not null default 0,
  resume_exports_per_month integer not null default 0,
  ats_scans_per_month integer not null default 0,
  mock_interviews_per_month integer not null default 0,
  tracked_jobs integer not null default 0,
  updated_by text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint membership_tier_limits_tier_check check (
    tier in ('free', 'starter', 'pro', 'premium', 'business', 'admin')
  ),
  constraint membership_tier_limits_ai_check check (ai_credits_per_month >= -1),
  constraint membership_tier_limits_upload_check check (resume_uploads_per_month >= -1),
  constraint membership_tier_limits_export_check check (resume_exports_per_month >= -1),
  constraint membership_tier_limits_ats_check check (ats_scans_per_month >= -1),
  constraint membership_tier_limits_mock_check check (mock_interviews_per_month >= -1),
  constraint membership_tier_limits_jobs_check check (tracked_jobs >= -1)
);

alter table public.membership_tier_limits enable row level security;

grant usage on schema public to service_role;
grant select, insert, update, delete on public.membership_tier_limits to service_role;

drop policy if exists "membership_tier_limits_service_role_all" on public.membership_tier_limits;

create policy "membership_tier_limits_service_role_all"
on public.membership_tier_limits
for all
to service_role
using (true)
with check (true);

insert into public.membership_tier_limits (
  tier,
  ai_credits_per_month,
  resume_uploads_per_month,
  resume_exports_per_month,
  ats_scans_per_month,
  mock_interviews_per_month,
  tracked_jobs
)
values
  ('free', 10, 1, 1, 1, 0, 5),
  ('starter', 100, 10, 10, 20, 2, 25),
  ('pro', 500, 50, 50, 100, 20, 100),
  ('premium', 1500, 150, 150, 300, 100, 500),
  ('business', 5000, 500, 500, 1000, 300, 2500),
  ('admin', -1, -1, -1, -1, -1, -1)
on conflict (tier) do nothing;
