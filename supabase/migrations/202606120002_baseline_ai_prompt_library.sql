-- =====================================================
-- Crestpoint Solutions V2
-- Baseline AI Prompt Guidance Library
-- =====================================================
--
-- Purpose:
-- Seeds approved baseline prompt guidance so AI modules start with a
-- consistent quality standard before user-specific learning data accumulates.
-- These rows are intentionally stored as applied guidance and can be reviewed
-- in the AI Quality Center alongside future learned suggestions.
-- =====================================================

with baseline_guidance (
  module_key,
  feature_key,
  priority,
  title,
  rationale,
  prompt_guidance
) as (
  values
    (
      'ai_interviewer',
      'question_generation',
      3,
      'Baseline: interview question generation',
      'Start interview practice with realistic, role-specific questions grounded in customer context.',
      'Generate one focused interview question at a time. Use the saved job description, resume strengths, target role, seniority, and application stage when available. Avoid generic questions unless no context exists. Prefer realistic behavioral, situational, technical, and role-readiness questions that a hiring manager would actually ask. Include a clear intent, difficulty level, and answer guidance without revealing a full script.'
    ),
    (
      'ai_interviewer',
      'answer_evaluation',
      3,
      'Baseline: interview answer evaluation',
      'Keep feedback practical, specific, and tied to interview readiness.',
      'Evaluate interview answers against the question, role context, and STAR structure. Identify what was strong, what was missing, and the highest-leverage next improvement. Do not overpraise weak answers. Make feedback specific, concise, and action-oriented. Highlight unsupported claims, missing metrics, unclear ownership, and weak endings. Always provide a stronger revised answer direction without inventing details.'
    ),
    (
      'ai_interviewer',
      'user_feedback',
      3,
      'Baseline: interviewer feedback learning',
      'Normalize user feedback into useful improvement signals.',
      'When user feedback is captured, classify whether the issue is specificity, accuracy, tone, length, relevance, or completeness. Preserve the user concern as evidence. Convert negative feedback into a small prompt improvement suggestion, not a broad behavioral rewrite.'
    ),
    (
      'cover_letter',
      'generation',
      3,
      'Baseline: cover letter generation',
      'Cover letters should feel tailored and credible rather than templated.',
      'Create concise cover letters that connect the customer resume to the target job description. Lead with role fit, then prove it with two or three concrete strengths. Avoid exaggeration, filler, and generic enthusiasm. Use a professional human tone, mention company or role context only when provided, and end with a confident close.'
    ),
    (
      'resume_feedback',
      'review',
      3,
      'Baseline: resume feedback review',
      'Resume feedback should prioritize changes that improve hiring signal.',
      'Review resumes for clarity, evidence, relevance, ATS alignment, and measurable impact. Prioritize the top three changes that would most improve interview conversion. Flag vague responsibilities, missing outcomes, weak summaries, keyword gaps, and inconsistent formatting. Give rewrite examples only from the customer provided experience.'
    ),
    (
      'ats_score',
      'score_explanation',
      3,
      'Baseline: ATS score explanation',
      'ATS explanations should be useful without creating false certainty.',
      'Explain ATS scores as directional guidance, not a guaranteed hiring outcome. Tie recommendations to the job description, resume evidence, missing skills, section quality, and keyword coverage. Avoid keyword stuffing. Recommend natural language improvements that preserve truthfulness and readability.'
    ),
    (
      'linkedin_optimizer',
      'headline',
      3,
      'Baseline: LinkedIn headline optimization',
      'LinkedIn headlines need clear positioning and searchable keywords.',
      'Write LinkedIn headlines that combine target role, core specialty, industry keywords, and measurable positioning where supported. Avoid buzzwords, inflated claims, and crowded punctuation. Make each option searchable, concise, and credible for the customer target market.'
    ),
    (
      'linkedin_optimizer',
      'about_section',
      3,
      'Baseline: LinkedIn about section',
      'About sections should read like professional positioning, not a resume dump.',
      'Write LinkedIn about sections with a strong opening positioning statement, two or three proof points, relevant keywords, and a clear career direction. Keep the tone warm, confident, and specific. Do not invent metrics, employers, certifications, or outcomes.'
    ),
    (
      'linkedin_optimizer',
      'profile_polish',
      3,
      'Baseline: LinkedIn profile polish',
      'Profile recommendations should help customers improve discoverability and trust.',
      'Review LinkedIn profile content for recruiter search keywords, role alignment, credibility, and scanability. Recommend practical updates to headline, about section, experience bullets, skills, and featured content. Keep advice tied to the customer target roles and resume evidence.'
    ),
    (
      'networking_outreach',
      'recruiter_outreach',
      3,
      'Baseline: recruiter outreach',
      'Recruiter messages should be brief, relevant, and easy to answer.',
      'Draft recruiter outreach that names the target role or job family, gives a one-sentence fit summary, and asks a simple next-step question. Keep messages short enough for LinkedIn or email. Avoid sounding desperate, overly formal, or mass-sent.'
    ),
    (
      'networking_outreach',
      'referral_request',
      3,
      'Baseline: referral request',
      'Referral requests should be respectful and low-friction.',
      'Draft referral requests that explain why the role is relevant, provide a short credibility summary, and make it easy for the contact to say yes, ask for more context, or decline. Include optional resume/job link placeholders when needed. Do not pressure the recipient.'
    ),
    (
      'networking_outreach',
      'follow_up',
      3,
      'Baseline: networking follow-up',
      'Follow-ups should maintain momentum without feeling pushy.',
      'Draft follow-up messages that reference the prior conversation or request, add one useful context point, and ask for a clear next step. Use timing-sensitive language only when appropriate. Keep tone courteous, direct, and professional.'
    ),
    (
      'networking_outreach',
      'check_in',
      3,
      'Baseline: networking check-in',
      'Check-ins should preserve relationship quality while creating an opening.',
      'Draft networking check-ins that feel human, specific, and light. Reference shared context when available, offer a useful update, and ask a low-pressure question. Avoid generic "just checking in" messages unless no other context exists.'
    ),
    (
      'job_followup_ai',
      'follow_up',
      3,
      'Baseline: job application follow-up',
      'Application follow-ups should be timely, confident, and concise.',
      'Draft job application follow-ups based on application stage, days since last contact, company context, and target role. Confirm continued interest, restate fit briefly, and ask about timeline or next steps. Avoid guilt, urgency pressure, and excessive detail.'
    ),
    (
      'ai_rewriter',
      'bullet_rewrite',
      3,
      'Baseline: resume bullet rewrite',
      'Resume bullets should turn responsibilities into evidence.',
      'Rewrite resume bullets with action, scope, tools or methods, and measurable outcome when provided. Preserve truthfulness and do not fabricate numbers. Prefer concise achievement language over task lists. Keep bullets aligned to the target role and ATS keywords.'
    ),
    (
      'career_coach',
      'general_coaching',
      3,
      'Baseline: career coaching',
      'Career coaching should reduce ambiguity and give customers a next action.',
      'Give career guidance that is practical, empathetic, and specific to the customer goal. Separate diagnosis from next steps. Avoid vague motivation. Recommend one to three concrete actions, explain why they matter, and tailor advice to career stage, target role, and current job-search data.'
    )
)
insert into public.ai_prompt_improvement_suggestions (
  module_key,
  feature_key,
  source_event_id,
  status,
  priority,
  suggestion_type,
  title,
  rationale,
  prompt_guidance,
  evidence,
  reviewer_note,
  reviewed_at,
  applied_at
)
select
  baseline_guidance.module_key,
  baseline_guidance.feature_key,
  null,
  'applied',
  baseline_guidance.priority,
  'baseline_prompt_guidance',
  baseline_guidance.title,
  baseline_guidance.rationale,
  baseline_guidance.prompt_guidance,
  jsonb_build_object(
    'source', 'crestpoint_baseline_prompt_library',
    'version', '2026-06-12',
    'scope', 'initial_quality_standard'
  ),
  'Seeded baseline guidance',
  now(),
  now()
from baseline_guidance
where not exists (
  select 1
  from public.ai_prompt_improvement_suggestions existing
  where existing.module_key = baseline_guidance.module_key
    and existing.feature_key = baseline_guidance.feature_key
    and existing.suggestion_type = 'baseline_prompt_guidance'
    and existing.title = baseline_guidance.title
);
