create extension if not exists pgcrypto;
create table if not exists public.profiles(id uuid primary key references auth.users(id) on delete cascade,email text,role text not null default 'admin' check(role in ('admin','editor')),active boolean not null default true,created_at timestamptz not null default now());
create table if not exists public.leads(id uuid primary key default gen_random_uuid(),name text not null,phone text not null,email text,project_type text,budget text,message text,status text not null default 'new' check(status in ('new','contacted','qualified','won','lost')),notes text,created_at timestamptz not null default now(),updated_at timestamptz not null default now());
create table if not exists public.portfolio_projects(id uuid primary key default gen_random_uuid(),title text not null,slug text not null unique,location text,category text,image_url text not null,description text,featured boolean not null default false,published boolean not null default true,sort_order integer not null default 0,created_at timestamptz not null default now(),updated_at timestamptz not null default now());
create table if not exists public.audit_logs(id uuid primary key default gen_random_uuid(),actor_id uuid references auth.users(id) on delete set null,action text not null,entity_type text not null,entity_id uuid,details jsonb not null default '{}'::jsonb,created_at timestamptz not null default now());

-- Safe migration for existing installations.
alter table public.leads add column if not exists project_type text;
alter table public.leads add column if not exists budget text;
alter table public.leads add column if not exists notes text;
alter table public.leads drop constraint if exists leads_status_check;
alter table public.leads add constraint leads_status_check check(status in ('new','contacted','qualified','won','lost'));

create index if not exists leads_status_idx on public.leads(status);create index if not exists leads_created_at_idx on public.leads(created_at desc);create index if not exists portfolio_sort_idx on public.portfolio_projects(sort_order,created_at desc);create index if not exists audit_created_at_idx on public.audit_logs(created_at desc);
create or replace function public.is_admin() returns boolean language sql security definer set search_path=public stable as $$ select exists(select 1 from public.profiles p where p.id=auth.uid() and p.role='admin' and p.active=true); $$;
create or replace function public.is_staff() returns boolean language sql security definer set search_path=public stable as $$ select exists(select 1 from public.profiles p where p.id=auth.uid() and p.active=true and p.role in ('admin','editor')); $$;
alter table public.profiles enable row level security;alter table public.leads enable row level security;alter table public.portfolio_projects enable row level security;alter table public.audit_logs enable row level security;
drop policy if exists profiles_self_read on public.profiles;create policy profiles_self_read on public.profiles for select to authenticated using(id=auth.uid() or public.is_admin());
drop policy if exists profiles_admin_update on public.profiles;create policy profiles_admin_update on public.profiles for update to authenticated using(public.is_admin()) with check(public.is_admin());
drop policy if exists leads_public_insert on public.leads;create policy leads_public_insert on public.leads for insert to anon,authenticated with check(true);
drop policy if exists leads_staff_read on public.leads;create policy leads_staff_read on public.leads for select to authenticated using(public.is_staff());
drop policy if exists leads_staff_update on public.leads;create policy leads_staff_update on public.leads for update to authenticated using(public.is_staff()) with check(public.is_staff());
drop policy if exists leads_admin_delete on public.leads;create policy leads_admin_delete on public.leads for delete to authenticated using(public.is_admin());
drop policy if exists portfolio_public_read on public.portfolio_projects;create policy portfolio_public_read on public.portfolio_projects for select to anon,authenticated using(published=true or public.is_staff());
drop policy if exists portfolio_staff_insert on public.portfolio_projects;create policy portfolio_staff_insert on public.portfolio_projects for insert to authenticated with check(public.is_staff());
drop policy if exists portfolio_staff_update on public.portfolio_projects;create policy portfolio_staff_update on public.portfolio_projects for update to authenticated using(public.is_staff()) with check(public.is_staff());
drop policy if exists portfolio_admin_delete on public.portfolio_projects;create policy portfolio_admin_delete on public.portfolio_projects for delete to authenticated using(public.is_admin());
drop policy if exists audit_admin_read on public.audit_logs;create policy audit_admin_read on public.audit_logs for select to authenticated using(public.is_admin());
drop policy if exists audit_staff_insert on public.audit_logs;create policy audit_staff_insert on public.audit_logs for insert to authenticated with check(public.is_staff());
-- Setelah membuat user di Authentication, tambahkan: insert into public.profiles(id,email,role,active) values ('USER_UUID','ADMIN_EMAIL','admin',true);

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('portfolio', 'portfolio', true, 5242880, array['image/jpeg','image/png','image/webp','image/avif'])
on conflict (id) do update set public=true, file_size_limit=5242880, allowed_mime_types=excluded.allowed_mime_types;

drop policy if exists portfolio_public_read on storage.objects;
create policy portfolio_public_read on storage.objects for select to public using(bucket_id='portfolio');
drop policy if exists portfolio_staff_insert on storage.objects;
create policy portfolio_staff_insert on storage.objects for insert to authenticated with check(bucket_id='portfolio' and public.is_staff() and (storage.foldername(name))[1] = auth.uid()::text);
drop policy if exists portfolio_staff_update on storage.objects;
create policy portfolio_staff_update on storage.objects for update to authenticated using(bucket_id='portfolio' and public.is_staff() and (storage.foldername(name))[1] = auth.uid()::text) with check(bucket_id='portfolio' and public.is_staff() and (storage.foldername(name))[1] = auth.uid()::text);
drop policy if exists portfolio_staff_delete on storage.objects;
create policy portfolio_staff_delete on storage.objects for delete to authenticated using(bucket_id='portfolio' and public.is_staff() and (storage.foldername(name))[1] = auth.uid()::text);

create table if not exists public.rate_limit_buckets(
  bucket_key text not null,
  window_start timestamptz not null,
  request_count integer not null default 0,
  primary key(bucket_key, window_start)
);
alter table public.rate_limit_buckets enable row level security;
revoke all on public.rate_limit_buckets from anon, authenticated;

create or replace function public.consume_rate_limit(p_key text, p_window_seconds integer, p_max_requests integer)
returns jsonb language plpgsql security definer set search_path=public as $$
declare v_start timestamptz; v_count integer;
begin
  v_start := to_timestamp(floor(extract(epoch from now()) / p_window_seconds) * p_window_seconds);
  insert into public.rate_limit_buckets(bucket_key, window_start, request_count) values(p_key, v_start, 1)
  on conflict(bucket_key, window_start) do update set request_count = rate_limit_buckets.request_count + 1
  returning request_count into v_count;
  delete from public.rate_limit_buckets where window_start < now() - interval '10 minutes';
  return jsonb_build_object('allowed', v_count <= p_max_requests, 'count', v_count, 'reset_at', v_start + make_interval(secs => p_window_seconds));
end;
$$;
revoke all on function public.consume_rate_limit(text, integer, integer) from public;
grant execute on function public.consume_rate_limit(text, integer, integer) to anon, authenticated;

-- Estimator configuration is part of the application data model.
-- Keep the baseline schema aligned with the production migration.
create table if not exists public.estimator_settings (
  id integer primary key default 1 check (id = 1),
  essential_rate numeric not null default 180000,
  signature_rate numeric not null default 300000,
  premium_rate numeric not null default 450000,
  rumah_baru_multiplier numeric not null default 1,
  renovasi_multiplier numeric not null default 1.15,
  villa_multiplier numeric not null default 1.2,
  commercial_multiplier numeric not null default 1.3,
  min_range_multiplier numeric not null default 0.85,
  max_range_multiplier numeric not null default 1.25,
  min_area numeric not null default 20,
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users(id) on delete set null
);
insert into public.estimator_settings (id)
values (1)
on conflict (id) do nothing;
alter table public.estimator_settings enable row level security;
revoke all on public.estimator_settings from anon, authenticated;
create index if not exists estimator_settings_updated_at_idx
  on public.estimator_settings(updated_at desc);
