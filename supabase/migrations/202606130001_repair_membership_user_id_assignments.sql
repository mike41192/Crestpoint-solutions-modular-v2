with ranked_memberships as (
  select
    ctid as row_id,
    row_number() over (
      partition by user_id
      order by
        case status
          when 'active' then 1
          when 'trialing' then 2
          when 'paused' then 3
          else 4
        end,
        assigned_at desc nulls last
    ) as duplicate_rank
  from public.memberships
  where user_id is not null
)
delete from public.memberships memberships
using ranked_memberships
where memberships.ctid = ranked_memberships.row_id
  and ranked_memberships.duplicate_rank > 1;

create unique index if not exists memberships_user_id_unique_idx
on public.memberships (user_id);

notify pgrst, 'reload schema';
