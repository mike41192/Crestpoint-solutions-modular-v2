-- =====================================================
-- Crestpoint Solutions V2
-- General AI Learning Feedback Loop
-- =====================================================
--
-- Purpose:
-- Stores AI quality events across modules and creates reviewable
-- prompt-improvement suggestions. The app can automatically reuse
-- approved/applied guidance in future prompts, while unreviewed feedback
-- remains evidence instead of silently changing production behavior.
-- =====================================================

create table if not exists public.ai_learning_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  module_key text not null,
  feature_key text not null,
  event_type text not null,
  prompt_version text,
  rubric_version text,
  model text,
  input_summary text,
  output_summary text,
  score integer,
  user_rating integer,
  user_feedback text,
  severity text not null default 'info',
  improvement_tags text[] not null default '{}'::text[],
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  constraint ai_learning_score_check check (
    score is null or (score >= 0 and score <= 100)
  ),
  constraint ai_learning_rating_check check (
    user_rating is null or (user_rating >= 1 and user_rating <= 5)
  ),
  constraint ai_learning_severity_check check (
    severity in ('info', 'positive', 'needs_review', 'critical')
  )
);

create table if not exists public.ai_prompt_improvement_suggestions (
  id uuid primary key default gen_random_uuid(),
  module_key text not null,
  feature_key text not null,
  source_event_id uuid references public.ai_learning_events(id) on delete set null,
  status text not null default 'pending',
  priority integer not null default 2,
  suggestion_type text not null,
  title text not null,
  rationale text not null,
  prompt_guidance text not null,
  evidence jsonb not null default '{}'::jsonb,
  reviewer_note text,
  reviewed_at timestamptz,
  applied_at timestamptz,
  created_at timestamptz not null default now(),
  constraint ai_prompt_suggestion_status_check check (
    status in ('pending', 'approved', 'rejected', 'applied')
  ),
  constraint ai_prompt_suggestion_priority_check check (
    priority between 1 and 5
  )
);

alter table public.ai_learning_events enable row level security;
alter table public.ai_prompt_improvement_suggestions enable row level security;

create index if not exists ai_learning_events_module_idx
on public.ai_learning_events (module_key, feature_key, created_at desc);

create index if not exists ai_learning_events_review_idx
on public.ai_learning_events (severity, created_at desc);

create index if not exists ai_prompt_suggestions_status_idx
on public.ai_prompt_improvement_suggestions (status, module_key, feature_key, created_at desc);

grant select, insert on public.ai_learning_events to authenticated;
grant select, insert, update, delete on public.ai_learning_events to service_role;
grant select on public.ai_prompt_improvement_suggestions to authenticated;
grant select, insert, update, delete on public.ai_prompt_improvement_suggestions to service_role;

drop policy if exists "ai_learning_events_user_select" on public.ai_learning_events;
drop policy if exists "ai_learning_events_user_insert" on public.ai_learning_events;
drop policy if exists "ai_prompt_suggestions_authenticated_select" on public.ai_prompt_improvement_suggestions;

create policy "ai_learning_events_user_select"
on public.ai_learning_events
for select
to authenticated
using (auth.uid() = user_id);

create policy "ai_learning_events_user_insert"
on public.ai_learning_events
for insert
to authenticated
with check (auth.uid() = user_id);

create policy "ai_prompt_suggestions_authenticated_select"
on public.ai_prompt_improvement_suggestions
for select
to authenticated
using (status in ('approved', 'applied'));

notify pgrst, 'reload schema';
