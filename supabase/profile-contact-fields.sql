alter table public.profiles
add column if not exists phone text,
add column if not exists location text,
add column if not exists linkedin_url text,
add column if not exists website_url text;

grant select, insert, update on public.profiles to authenticated;
grant select, insert, update, delete on public.profiles to service_role;

notify pgrst, 'reload schema';
