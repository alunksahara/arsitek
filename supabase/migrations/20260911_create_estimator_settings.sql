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
