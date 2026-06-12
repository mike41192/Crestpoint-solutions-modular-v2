-- =====================================================
-- Crestpoint Solutions V2
-- AI Prompt Quality Scoring
-- =====================================================
--
-- Purpose:
-- Adds prompt guidance score fields so admins can see whether baseline and
-- learned guidance is producing strong, weak, or still-unproven results.
-- Scores are updated by the application whenever learning events are recorded.
-- =====================================================

alter table public.ai_prompt_improvement_suggestions
add column if not exists quality_score integer not null default 70,
add column if not exists strength_signal text not null default 'unproven',
add column if not exists positive_signal_count integer not null default 0,
add column if not exists negative_signal_count integer not null default 0,
add column if not exists total_signal_count integer not null default 0,
add column if not exists last_scored_at timestamptz;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'ai_prompt_suggestion_quality_score_check'
  ) then
    alter table public.ai_prompt_improvement_suggestions
    add constraint ai_prompt_suggestion_quality_score_check
    check (quality_score between 0 and 100);
  end if;

  if not exists (
    select 1
    from pg_constraint
    where conname = 'ai_prompt_suggestion_strength_signal_check'
  ) then
    alter table public.ai_prompt_improvement_suggestions
    add constraint ai_prompt_suggestion_strength_signal_check
    check (strength_signal in ('strong', 'healthy', 'watch', 'weak', 'unproven'));
  end if;
end $$;

create index if not exists ai_prompt_suggestions_quality_idx
on public.ai_prompt_improvement_suggestions (
  module_key,
  feature_key,
  quality_score desc,
  strength_signal,
  created_at desc
);

update public.ai_prompt_improvement_suggestions
set
  quality_score = 70,
  strength_signal = 'unproven',
  last_scored_at = coalesce(last_scored_at, now())
where last_scored_at is null;

notify pgrst, 'reload schema';
