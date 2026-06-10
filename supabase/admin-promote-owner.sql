-- =====================================================
-- Crestpoint Solutions V2
-- Promote Owner Account To Admin / Unlimited Access
-- =====================================================
--
-- Usage:
-- 1. Replace owner@example.com with your Supabase Auth email.
-- 2. Run this in the Supabase SQL editor.
-- 3. Add the same email to ADMIN_EMAILS in your environment:
--    ADMIN_EMAILS=owner@example.com
-- 4. Restart the app, then sign out and sign back in.
--
-- Notes:
-- - ADMIN_EMAILS controls access to admin API routes.
-- - The memberships row controls feature limits and app-level access.
-- - A limit of -1 means unlimited in the current app logic.
-- =====================================================

do $$
declare
  owner_email text := 'owner@example.com';
  owner_user_id uuid;
begin
  select id
  into owner_user_id
  from auth.users
  where lower(email) = lower(owner_email)
  limit 1;

  if owner_user_id is null then
    raise exception 'No auth.users row found for email: %', owner_email;
  end if;

  update public.memberships
  set
    plan_name = 'admin',
    status = 'active',
    ats_limit = -1,
    rewrite_limit = -1,
    resume_limit = -1
  where user_id = owner_user_id;

  if not found then
    insert into public.memberships (
      user_id,
      plan_name,
      status,
      ats_limit,
      rewrite_limit,
      resume_limit
    )
    values (
      owner_user_id,
      'admin',
      'active',
      -1,
      -1,
      -1
    );
  end if;
end $$;
