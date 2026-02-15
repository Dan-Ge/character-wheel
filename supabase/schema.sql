-- ═══════════════════════════════════════════════
-- CHARACTER WHEEL — Supabase Database Schema
-- ═══════════════════════════════════════════════
-- Run this SQL in your Supabase SQL Editor to set up all required tables.

-- ─── Enable UUID extension ───
create extension if not exists "uuid-ossp";

-- ═══════════════════════════════════════════════
-- PROFILES — One per registered user
-- ═══════════════════════════════════════════════
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique not null,
  avatar_url text,
  total_runs integer default 0,
  total_characters integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Allow users to read all profiles (leaderboard) but only update their own
alter table profiles enable row level security;

create policy "Public read" on profiles for select using (true);
create policy "Own update" on profiles for update using (auth.uid() = id);
create policy "Own insert" on profiles for insert with check (auth.uid() = id);

-- ═══════════════════════════════════════════════
-- SAVED CHARACTERS — All wheel builds & story state
-- ═══════════════════════════════════════════════
create table if not exists saved_characters (
  id uuid primary key default uuid_generate_v4(),
  player_id uuid not null references profiles(id) on delete cascade,

  -- Build data (the CharacterBuild JSON from the wheel run)
  build_data jsonb not null,

  -- Story state (the StoryCharacter JSON — null if never entered story)
  story_data jsonb,

  -- Denormalized fields for filtering & display
  name text not null,
  status text not null default 'alive',  -- alive | dead | ascended | retired | legendary | ...
  level integer default 1,
  score integer default 0,
  power_tier text default 'novice',

  -- Timestamps
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table saved_characters enable row level security;

-- Players can read their own characters
create policy "Own read" on saved_characters for select using (auth.uid() = player_id);
-- Players can insert their own characters
create policy "Own insert" on saved_characters for insert with check (auth.uid() = player_id);
-- Players can update their own characters
create policy "Own update" on saved_characters for update using (auth.uid() = player_id);
-- Players can delete their own characters
create policy "Own delete" on saved_characters for delete using (auth.uid() = player_id);

-- Index for fast lookups
create index if not exists idx_characters_player on saved_characters(player_id);
create index if not exists idx_characters_status on saved_characters(player_id, status);

-- ═══════════════════════════════════════════════
-- AUTO-UPDATE timestamps
-- ═══════════════════════════════════════════════
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger profiles_updated_at
  before update on profiles
  for each row execute function update_updated_at();

create trigger characters_updated_at
  before update on saved_characters
  for each row execute function update_updated_at();

-- ═══════════════════════════════════════════════
-- AUTO-CREATE profile on user sign-up
-- ═══════════════════════════════════════════════
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into profiles (id, username)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'username', 'Spieler_' || left(new.id::text, 8))
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();
