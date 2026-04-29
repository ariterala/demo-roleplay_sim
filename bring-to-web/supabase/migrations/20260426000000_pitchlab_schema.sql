-- PitchLab: sessions and messages tables
-- Stores simulation sessions and their conversation history for feedback history and leaderboard

create table if not exists sessions (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references auth.users(id) on delete cascade,
  scenario_id text not null,
  score       integer,
  verdict     text,
  feedback    jsonb,
  created_at  timestamptz not null default now(),
  ended_at    timestamptz
);

create table if not exists messages (
  id         uuid primary key default gen_random_uuid(),
  session_id uuid not null references sessions(id) on delete cascade,
  role       text not null check (role in ('user', 'assistant')),
  content    text not null,
  created_at timestamptz not null default now()
);

-- Indexes for RLS policy columns
create index if not exists sessions_user_id_idx on sessions(user_id);
create index if not exists messages_session_id_idx on messages(session_id);

-- Enable RLS
alter table sessions enable row level security;
alter table messages enable row level security;

-- Sessions policies
create policy "sessions_select_own"
  on sessions for select
  to authenticated
  using (user_id = auth.uid());

create policy "sessions_insert_own"
  on sessions for insert
  to authenticated
  with check (user_id = auth.uid());

create policy "sessions_update_own"
  on sessions for update
  to authenticated
  using (user_id = auth.uid());

create policy "sessions_delete_own"
  on sessions for delete
  to authenticated
  using (user_id = auth.uid());

-- Messages policies (access via session ownership)
create policy "messages_select_own"
  on messages for select
  to authenticated
  using (
    exists (
      select 1 from sessions s
      where s.id = messages.session_id
      and s.user_id = auth.uid()
    )
  );

create policy "messages_insert_own"
  on messages for insert
  to authenticated
  with check (
    exists (
      select 1 from sessions s
      where s.id = messages.session_id
      and s.user_id = auth.uid()
    )
  );

create policy "messages_delete_own"
  on messages for delete
  to authenticated
  using (
    exists (
      select 1 from sessions s
      where s.id = messages.session_id
      and s.user_id = auth.uid()
    )
  );
