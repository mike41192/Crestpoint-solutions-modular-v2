-- =====================================================
-- Crestpoint Solutions V2
-- Stripe Membership Billing Columns
-- =====================================================
--
-- Purpose:
-- Adds the Stripe customer/subscription fields needed for checkout,
-- customer portal access, and webhook-driven membership updates.
--
-- Run this in the Supabase SQL editor before enabling the live
-- billing portal.
-- =====================================================

alter table public.memberships
add column if not exists stripe_customer_id text,
add column if not exists stripe_subscription_id text,
add column if not exists stripe_price_id text,
add column if not exists stripe_product_id text,
add column if not exists billing_interval text,
add column if not exists current_period_end timestamptz,
add column if not exists cancel_at_period_end boolean default false;

create index if not exists memberships_stripe_customer_id_idx
on public.memberships (stripe_customer_id);

create index if not exists memberships_stripe_subscription_id_idx
on public.memberships (stripe_subscription_id);

grant select, insert, update, delete on public.memberships to service_role;

notify pgrst, 'reload schema';
