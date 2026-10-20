create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text not null default '',
  last_stream text,
  last_grade smallint,
  last_subject text,
  last_unit text,
  last_video_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.watched_videos (
  student_id uuid not null references auth.users (id) on delete cascade,
  video_id text not null,
  watched_at timestamptz not null default now(),
  primary key (student_id, video_id)
);

alter table public.profiles enable row level security;
alter table public.watched_videos enable row level security;

revoke all on public.profiles from anon, authenticated;
revoke all on public.watched_videos from anon, authenticated;
grant select, update on public.profiles to authenticated;
grant select, insert, delete on public.watched_videos to authenticated;

-- PostgreSQL does not allow USING on an INSERT-only policy; FOR ALL lets
-- each owner-scoped policy express both USING and WITH CHECK together.
-- Table grants further restrict profile writes to UPDATE and watched-video
-- writes to INSERT/DELETE; profile creation is handled by the auth trigger.
create policy "Students access only their own profile"
  on public.profiles
  for all
  to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

create policy "Students access only their own watched videos"
  on public.watched_videos
  for all
  to authenticated
  using ((select auth.uid()) = student_id)
  with check ((select auth.uid()) = student_id);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'display_name', ''))
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
