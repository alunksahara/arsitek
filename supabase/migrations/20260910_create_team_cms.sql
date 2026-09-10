create table if not exists public.team_members (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  photo_url text,
  position text not null,
  bio text not null default '',
  skills jsonb not null default '[]'::jsonb,
  sort_order integer not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.team_members enable row level security;

create index if not exists team_members_sort_idx
  on public.team_members(sort_order, created_at desc);

create index if not exists team_members_published_idx
  on public.team_members(published, sort_order);

drop policy if exists team_public_read on public.team_members;
create policy team_public_read
  on public.team_members
  for select
  to anon, authenticated
  using (published = true or public.is_staff());

drop policy if exists team_staff_insert on public.team_members;
create policy team_staff_insert
  on public.team_members
  for insert
  to authenticated
  with check (public.is_staff());

drop policy if exists team_staff_update on public.team_members;
create policy team_staff_update
  on public.team_members
  for update
  to authenticated
  using (public.is_staff())
  with check (public.is_staff());

drop policy if exists team_admin_delete on public.team_members;
create policy team_admin_delete
  on public.team_members
  for delete
  to authenticated
  using (public.is_admin());

create or replace function public.set_team_members_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists team_members_updated_at on public.team_members;
create trigger team_members_updated_at
before update on public.team_members
for each row execute function public.set_team_members_updated_at();

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'team',
  'team',
  true,
  5242880,
  array['image/jpeg','image/png','image/webp','image/avif']
)
on conflict (id) do update set
  public = true,
  file_size_limit = 5242880,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists team_public_storage_read on storage.objects;
create policy team_public_storage_read
  on storage.objects
  for select
  to public
  using (bucket_id = 'team');

drop policy if exists team_staff_storage_insert on storage.objects;
create policy team_staff_storage_insert
  on storage.objects
  for insert
  to authenticated
  with check (
    bucket_id = 'team'
    and public.is_staff()
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists team_staff_storage_update on storage.objects;
create policy team_staff_storage_update
  on storage.objects
  for update
  to authenticated
  using (
    bucket_id = 'team'
    and public.is_staff()
    and (storage.foldername(name))[1] = auth.uid()::text
  )
  with check (
    bucket_id = 'team'
    and public.is_staff()
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists team_staff_storage_delete on storage.objects;
create policy team_staff_storage_delete
  on storage.objects
  for delete
  to authenticated
  using (
    bucket_id = 'team'
    and public.is_staff()
    and (storage.foldername(name))[1] = auth.uid()::text
  );
