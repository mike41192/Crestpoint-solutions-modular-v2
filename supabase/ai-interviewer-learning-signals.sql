-- =====================================================
-- Crestpoint Solutions V2
-- AI Interviewer Learning Signals
-- =====================================================
--
-- Purpose:
-- Stores AI Interviewer question, evaluation, and user-feedback signals
-- so the module can be improved through reviewed examples, prompt versions,
-- rubric versions, and future admin quality workflows.
--
-- Run this in the Supabase SQL editor when enabling persistent
-- AI Interviewer learning analytics.
-- =====================================================

create table if not exists public.ai_interviewer_learning_signals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  event_type text not null,
  prompt_version text not null,
  rubric_version text not null,
  source text,
  role_title text,
  company_name text,
  category text,
  difficulty text,
  competency text,
  question_text text,
  answer_text text,
  score integer,
  feedback_rating integer,
  feedback_note text,
  reviewed_at timestamptz,
  reviewer_note text,
  approved_for_training boolean default false,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz default now(),
  constraint ai_interviewer_learning_event_check check (
    event_type in ('question_generated', 'answer_evaluated', 'user_feedback')
  ),
  constraint ai_interviewer_learning_source_check check (
    source is null or source in ('taxonomy', 'openai', 'rubric')
  ),
  constraint ai_interviewer_learning_score_check check (
    score is null or (score >= 0 and score <= 100)
  ),
  constraint ai_interviewer_learning_feedback_check check (
    feedback_rating is null or (feedback_rating >= 1 and feedback_rating <= 5)
  )
);

alter table public.ai_interviewer_learning_signals enable row level security;

create index if not exists ai_interviewer_learning_user_idx
on public.ai_interviewer_learning_signals (user_id, created_at desc);

create index if not exists ai_interviewer_learning_review_idx
on public.ai_interviewer_learning_signals (approved_for_training, reviewed_at);

grant select, insert on public.ai_interviewer_learning_signals to authenticated;
grant select, insert, update, delete on public.ai_interviewer_learning_signals to service_role;

drop policy if exists "ai_interviewer_learning_user_select" on public.ai_interviewer_learning_signals;
drop policy if exists "ai_interviewer_learning_user_insert" on public.ai_interviewer_learning_signals;

create policy "ai_interviewer_learning_user_select"
on public.ai_interviewer_learning_signals
for select
to authenticated
using (auth.uid() = user_id);

create policy "ai_interviewer_learning_user_insert"
on public.ai_interviewer_learning_signals
for insert
to authenticated
with check (auth.uid() = user_id);

notify pgrst, 'reload schema';
