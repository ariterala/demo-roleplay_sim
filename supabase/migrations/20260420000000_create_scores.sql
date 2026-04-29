-- Create scores table to record student practice session results

create table if not exists public.scores (
  id           uuid        primary key default gen_random_uuid(),
  student_id   uuid        not null references auth.users(id) on delete cascade,
  student_name text        not null,
  score        integer     not null check (score >= 0),
  scenario     text        not null,
  created_at   timestamptz not null default now()
);

alter table public.scores enable row level security;

-- Leaderboard is public — anyone can read all scores
create policy "scores_select_anon"
  on public.scores for select to anon
  using (true);

create policy "scores_select_authenticated"
  on public.scores for select to authenticated
  using (true);

-- Students may only insert their own scores
create policy "scores_insert_authenticated"
  on public.scores for insert to authenticated
  with check (student_id = auth.uid());

-- Index used by the insert RLS check and aggregation queries
create index if not exists scores_student_id_idx on public.scores (student_id);

-- Index used for time-filtered leaderboard periods
create index if not exists scores_created_at_idx on public.scores (created_at);

-- ---------------------------------------------------------------------------
-- get_leaderboard(period)
-- Returns students ranked by total score for the given time window.
-- period: 'all_time' | 'this_week' | 'today'
-- ---------------------------------------------------------------------------
create or replace function public.get_leaderboard(period text default 'all_time')
returns table (
  rank                bigint,
  student_id          uuid,
  student_name        text,
  total_score         bigint,
  scenarios_completed bigint,
  top_scenario        text
)
language sql
security definer
stable
as $$
  with filtered as (
    select *
    from public.scores
    where case period
      when 'today'     then created_at >= current_date
      when 'this_week' then created_at >= date_trunc('week', now())
      else true
    end
  ),
  per_student as (
    select
      student_id,
      max(student_name)  as student_name,
      sum(score)         as total_score,
      count(*)           as scenarios_completed
    from filtered
    group by student_id
  ),
  top_scenario_per_student as (
    select distinct on (student_id)
      student_id,
      scenario
    from (
      select student_id, scenario, sum(score) as scenario_score
      from filtered
      group by student_id, scenario
    ) ranked
    order by student_id, scenario_score desc
  )
  select
    rank() over (order by ps.total_score desc) as rank,
    ps.student_id,
    ps.student_name,
    ps.total_score,
    ps.scenarios_completed,
    ts.scenario as top_scenario
  from per_student ps
  join top_scenario_per_student ts using (student_id)
  order by rank
  limit 50;
$$;
