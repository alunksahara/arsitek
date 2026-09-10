-- Team & User Management hardening
alter table public.profiles
  add column if not exists updated_at timestamptz not null default now();

create unique index if not exists profiles_email_unique_idx
  on public.profiles (lower(email))
  where email is not null;

create index if not exists profiles_role_active_idx
  on public.profiles(role, active);

-- Keep updated_at current whenever a profile changes.
create or replace function public.set_profiles_updated_at()
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

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_profiles_updated_at();
