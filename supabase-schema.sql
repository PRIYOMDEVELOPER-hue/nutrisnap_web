-- =============================================
-- NutriSnap Supabase Database Schema
-- Run this in your Supabase SQL Editor
-- =============================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- =============================================
-- PROFILES (extends Supabase auth.users)
-- =============================================
create table public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  name text,
  avatar_url text,
  goal_type text default 'lose_weight', -- lose_weight | maintain | build_muscle
  goal_calories integer default 2000,
  goal_protein integer default 150,
  goal_carbs integer default 250,
  goal_fat integer default 65,
  goal_weight numeric(6,2),
  current_weight numeric(6,2),
  height numeric(6,2),
  age integer,
  sex text default 'male',
  activity_level text default 'moderate',
  units text default 'imperial', -- imperial | metric
  onboarding_complete boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, name)
  values (new.id, new.raw_user_meta_data->>'name');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- RLS
alter table public.profiles enable row level security;
create policy "Users can view own profile" on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);

-- =============================================
-- FOOD LOG ENTRIES
-- =============================================
create table public.food_logs (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  log_date date not null default current_date,
  meal_type text not null, -- breakfast | lunch | dinner | snack
  name text not null,
  calories integer not null default 0,
  protein numeric(6,2) default 0,
  carbs numeric(6,2) default 0,
  fat numeric(6,2) default 0,
  fiber numeric(6,2) default 0,
  sugar numeric(6,2) default 0,
  sodium numeric(8,2) default 0,
  quantity numeric(8,2) default 1,
  unit text default 'serving',
  image_url text,
  log_method text default 'manual', -- manual | photo | barcode | voice | search
  logged_at time default current_time,
  created_at timestamptz default now()
);

alter table public.food_logs enable row level security;
create policy "Users can manage own logs" on public.food_logs
  for all using (auth.uid() = user_id);

create index food_logs_user_date on public.food_logs(user_id, log_date);

-- =============================================
-- WEIGHT ENTRIES
-- =============================================
create table public.weight_entries (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  weight numeric(6,2) not null,
  entry_date date not null default current_date,
  notes text,
  created_at timestamptz default now(),
  unique(user_id, entry_date)
);

alter table public.weight_entries enable row level security;
create policy "Users can manage own weight" on public.weight_entries
  for all using (auth.uid() = user_id);

-- =============================================
-- PROGRESS PHOTOS
-- =============================================
create table public.progress_photos (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  photo_url text not null,
  weight numeric(6,2),
  label text,
  photo_date date not null default current_date,
  created_at timestamptz default now()
);

alter table public.progress_photos enable row level security;
create policy "Users can manage own photos" on public.progress_photos
  for all using (auth.uid() = user_id);

-- =============================================
-- STREAKS
-- =============================================
create table public.streaks (
  user_id uuid references public.profiles(id) on delete cascade primary key,
  current_streak integer default 0,
  longest_streak integer default 0,
  last_logged_date date,
  updated_at timestamptz default now()
);

alter table public.streaks enable row level security;
create policy "Users can manage own streak" on public.streaks
  for all using (auth.uid() = user_id);

-- Auto-create streak row for new users
create or replace function public.handle_new_profile()
returns trigger as $$
begin
  insert into public.streaks (user_id) values (new.id);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_profile_created
  after insert on public.profiles
  for each row execute function public.handle_new_profile();

-- =============================================
-- BADGES / ACHIEVEMENTS
-- =============================================
create table public.user_badges (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  badge_id text not null,
  earned_at timestamptz default now(),
  unique(user_id, badge_id)
);

alter table public.user_badges enable row level security;
create policy "Users can manage own badges" on public.user_badges
  for all using (auth.uid() = user_id);

-- =============================================
-- WATER LOG
-- =============================================
create table public.water_logs (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  log_date date not null default current_date,
  amount_ml integer not null default 0,
  logged_at timestamptz default now(),
  unique(user_id, log_date)
);

alter table public.water_logs enable row level security;
create policy "Users can manage own water logs" on public.water_logs
  for all using (auth.uid() = user_id);

-- =============================================
-- USEFUL VIEWS
-- =============================================

-- Daily nutrition summary view
create or replace view public.daily_nutrition as
select
  user_id,
  log_date,
  sum(calories) as total_calories,
  sum(protein) as total_protein,
  sum(carbs) as total_carbs,
  sum(fat) as total_fat,
  count(*) as entry_count
from public.food_logs
group by user_id, log_date;

-- Grant access
grant select on public.daily_nutrition to authenticated;
