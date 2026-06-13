create table if not exists public.brand_settings (
  id text primary key default 'global',
  brand_name text not null default 'Crestpoint Solutions',
  short_name text not null default 'Crestpoint',
  tagline text not null default 'Career OS',
  logo_url text,
  favicon_url text,
  primary_color text not null default '#2563eb',
  updated_by text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint brand_settings_singleton check (id = 'global'),
  constraint brand_settings_primary_color_hex check (
    primary_color ~ '^#[0-9A-Fa-f]{6}$'
  )
);

alter table public.brand_settings enable row level security;

grant usage on schema public to service_role;
grant select, insert, update on table public.brand_settings to service_role;

insert into public.brand_settings (
  id,
  brand_name,
  short_name,
  tagline,
  primary_color
)
values (
  'global',
  'Crestpoint Solutions',
  'Crestpoint',
  'Career OS',
  '#2563eb'
)
on conflict (id) do nothing;
