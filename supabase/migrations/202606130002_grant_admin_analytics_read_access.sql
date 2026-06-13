grant usage on schema public to service_role;

do $$
declare
  analytics_table text;
  analytics_tables text[] := array[
    'profiles',
    'memberships',
    'organizations',
    'organization_members',
    'user_usage',
    'resumes',
    'resume_ats_reports',
    'job_applications',
    'career_contacts',
    'job_descriptions',
    'ai_learning_events',
    'ai_prompt_improvement_suggestions'
  ];
begin
  foreach analytics_table in array analytics_tables loop
    if to_regclass(format('public.%I', analytics_table)) is not null then
      execute format(
        'grant select on table public.%I to service_role',
        analytics_table
      );
    end if;
  end loop;
end $$;
