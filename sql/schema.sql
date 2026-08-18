-- Reallogic — Database Schema
-- Run this against your Supabase project's SQL editor

-- listings
create table if not exists listings (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  location text,
  size_sqft integer,
  rent_ksh_per_sqft numeric,
  service_charge_ksh_per_sqft numeric,
  tier text default 'sample',
  realsee_work_id text,
  created_at timestamptz default now()
);

-- hotspots
create table if not exists hotspots (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid references listings(id) on delete cascade,
  category text not null,
  position jsonb not null,
  label text not null,
  values jsonb not null,
  created_at timestamptz default now()
);

-- equipment_models
create table if not exists equipment_models (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  glb_url text not null,
  dimensions_m jsonb not null,
  created_at timestamptz default now()
);

-- capture_verification
create table if not exists capture_verification (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid references listings(id) on delete cascade,
  operator_id text,
  capture_type text,
  captured_at timestamptz,
  created_at timestamptz default now()
);

-- Enable Row Level Security (open for demo — restrict in production)
alter table listings enable row level security;
alter table hotspots enable row level security;
alter table equipment_models enable row level security;
alter table capture_verification enable row level security;

-- Allow public read access for demo
create policy "Public read listings" on listings for select using (true);
create policy "Public read hotspots" on hotspots for select using (true);
create policy "Public read equipment" on equipment_models for select using (true);
create policy "Public read verification" on capture_verification for select using (true);
