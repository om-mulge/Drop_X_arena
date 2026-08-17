create extension if not exists pgcrypto;

create table if not exists public.admin (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  full_name text,
  password_hash text not null,
  is_active boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create or replace function public.set_admin_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

drop trigger if exists admin_set_updated_at on public.admin;

create trigger admin_set_updated_at
before update on public.admin
for each row
execute function public.set_admin_updated_at();

create index if not exists admin_email_idx on public.admin (email);
