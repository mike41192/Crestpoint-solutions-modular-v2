create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  role text not null default 'user',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.resumes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null default 'Primary Resume',
  status text not null default 'draft',
  selected_template text not null default 'classic',
  resume_data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.resume_versions (
  id uuid primary key default gen_random_uuid(),
  resume_id uuid not null references public.resumes(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  version_label text not null default 'Manual Save',
  resume_data jsonb not null default '{}'::jsonb,
  selected_template text not null default 'classic',
  created_at timestamptz not null default now()
);

create table if not exists public.resume_ai_suggestions (
  id uuid primary key default gen_random_uuid(),
  resume_id uuid references public.resumes(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  category text not null default 'general',
  title text not null,
  recommendation text not null,
  suggested_text text,
  applied boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.resume_ats_reports (
  id uuid primary key default gen_random_uuid(),
  resume_id uuid references public.resumes(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  job_description text not null,
  score integer not null default 0,
  matched_keywords jsonb not null default '[]'::jsonb,
  missing_keywords jsonb not null default '[]'::jsonb,
  recommendations jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.resumes enable row level security;
alter table public.resume_versions enable row level security;
alter table public.resume_ai_suggestions enable row level security;
alter table public.resume_ats_reports enable row level security;

drop policy if exists "Users can read their own profile" on public.profiles;
drop policy if exists "Users can update their own profile" on public.profiles;
drop policy if exists "Users can insert their own profile" on public.profiles;

create policy "Users can read their own profile"
on public.profiles
for select
using (auth.uid() = id);

create policy "Users can insert their own profile"
on public.profiles
for insert
with check (auth.uid() = id);

create policy "Users can update their own profile"
on public.profiles
for update
using (auth.uid() = id)
with check (auth.uid() = id);

drop policy if exists "Users can read their own resumes" on public.resumes;
drop policy if exists "Users can insert their own resumes" on public.resumes;
drop policy if exists "Users can update their own resumes" on public.resumes;
drop policy if exists "Users can delete their own resumes" on public.resumes;

create policy "Users can read their own resumes"
on public.resumes
for select
using (auth.uid() = user_id);

create policy "Users can insert their own resumes"
on public.resumes
for insert
with check (auth.uid() = user_id);

create policy "Users can update their own resumes"
on public.resumes
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users can delete their own resumes"
on public.resumes
for delete
using (auth.uid() = user_id);

drop policy if exists "Users can read their own resume versions" on public.resume_versions;
drop policy if exists "Users can insert their own resume versions" on public.resume_versions;
drop policy if exists "Users can delete their own resume versions" on public.resume_versions;

create policy "Users can read their own resume versions"
on public.resume_versions
for select
using (auth.uid() = user_id);

create policy "Users can insert their own resume versions"
on public.resume_versions
for insert
with check (auth.uid() = user_id);

create policy "Users can delete their own resume versions"
on public.resume_versions
for delete
using (auth.uid() = user_id);

drop policy if exists "Users can read their own AI suggestions" on public.resume_ai_suggestions;
drop policy if exists "Users can insert their own AI suggestions" on public.resume_ai_suggestions;
drop policy if exists "Users can update their own AI suggestions" on public.resume_ai_suggestions;
drop policy if exists "Users can delete their own AI suggestions" on public.resume_ai_suggestions;

create policy "Users can read their own AI suggestions"
on public.resume_ai_suggestions
for select
using (auth.uid() = user_id);

create policy "Users can insert their own AI suggestions"
on public.resume_ai_suggestions
for insert
with check (auth.uid() = user_id);

create policy "Users can update their own AI suggestions"
on public.resume_ai_suggestions
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users can delete their own AI suggestions"
on public.resume_ai_suggestions
for delete
using (auth.uid() = user_id);

drop policy if exists "Users can read their own ATS reports" on public.resume_ats_reports;
drop policy if exists "Users can insert their own ATS reports" on public.resume_ats_reports;
drop policy if exists "Users can delete their own ATS reports" on public.resume_ats_reports;

create policy "Users can read their own ATS reports"
on public.resume_ats_reports
for select
using (auth.uid() = user_id);

create policy "Users can insert their own ATS reports"
on public.resume_ats_reports
for insert
with check (auth.uid() = user_id);

create policy "Users can delete their own ATS reports"
on public.resume_ats_reports
for delete
using (auth.uid() = user_id);

create index if not exists resumes_user_id_idx
on public.resumes(user_id);

create index if not exists resumes_updated_at_idx
on public.resumes(updated_at desc);

create index if not exists resume_versions_resume_id_idx
on public.resume_versions(resume_id);

create index if not exists resume_ai_suggestions_resume_id_idx
on public.resume_ai_suggestions(resume_id);

create index if not exists resume_ats_reports_resume_id_idx
on public.resume_ats_reports(resume_id);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at
before update on public.profiles
for each row
execute function public.set_updated_at();

drop trigger if exists set_resumes_updated_at on public.resumes;
create trigger set_resumes_updated_at
before update on public.resumes
for each row
execute function public.set_updated_at();
