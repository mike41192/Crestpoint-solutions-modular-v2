with ranked_members as (
  select
    id,
    row_number() over (
      partition by organization_id, lower(trim(email))
      order by
        case status
          when 'active' then 1
          when 'invited' then 2
          when 'suspended' then 3
          else 4
        end,
        joined_at desc nulls last,
        invited_at desc nulls last,
        updated_at desc nulls last
    ) as duplicate_rank
  from public.organization_members
)
delete from public.organization_members members
using ranked_members
where members.id = ranked_members.id
  and ranked_members.duplicate_rank > 1;

update public.organization_members
set email = lower(trim(email))
where email <> lower(trim(email));

create unique index if not exists organization_members_org_email_idx
on public.organization_members (organization_id, email);

notify pgrst, 'reload schema';
