-- CityLawConnect: Lawyer dashboard & RBAC foundation
-- Apply these changes in Supabase SQL Editor.

-- 1) Roles on profiles
alter table if exists public.profiles
  add column if not exists role text not null default 'user';

-- Optional: keep role constrained
do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'profiles_role_check'
  ) then
    alter table public.profiles
      add constraint profiles_role_check check (role in ('user','lawyer','admin'));
  end if;
end $$;

-- 2) Lawyers table (minimal fields for dashboard + public profile)
create table if not exists public.lawyers (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  location text,
  specializations text[] default '{}',
  years_experience int,
  consultation_fee numeric default 0,
  profile_photo_url text,
  availability jsonb default '{}'::jsonb,
  verified_status text not null default 'pending', -- pending/approved/rejected
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'lawyers_verified_status_check'
  ) then
    alter table public.lawyers
      add constraint lawyers_verified_status_check check (verified_status in ('pending','approved','rejected'));
  end if;
end $$;

-- 3) Verification requests (documents stored in Supabase Storage, path stored here)
create table if not exists public.lawyer_verification_requests (
  id uuid primary key default gen_random_uuid(),
  lawyer_id uuid not null references public.lawyers(id) on delete cascade,
  document_path text not null,
  status text not null default 'pending',
  admin_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'lawyer_verification_requests_status_check'
  ) then
    alter table public.lawyer_verification_requests
      add constraint lawyer_verification_requests_status_check check (status in ('pending','approved','rejected'));
  end if;
end $$;

-- 4) Lawyer portfolio
create table if not exists public.lawyer_case_portfolio (
  id uuid primary key default gen_random_uuid(),
  lawyer_id uuid not null references public.lawyers(id) on delete cascade,
  case_type text not null,
  success_rate int,
  description text,
  outcome text,
  is_public boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 5) Notifications
create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  recipient_id uuid not null references auth.users(id) on delete cascade,
  type text not null,
  title text not null,
  body text,
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);

-- Notes:
-- - RLS policies are not included here yet; add them based on your security model.
-- - For verification documents, create a Storage bucket like: `lawyer-verification-docs`.

