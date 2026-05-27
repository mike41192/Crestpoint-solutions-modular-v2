create table if not exists public.resumes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null default 'Primary Resume',
  status text not null default 'draft',
  resume_data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(user_id, title)
);

alter table public.resumes enable row level security;

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