-- =============================================================================
-- Jelajah — Initial Database Schema
-- Migration : 20261109000001_init.sql
-- Run in    : Supabase SQL Editor (or via `supabase db push`)
-- =============================================================================

-- ---------------------------------------------------------------------------
-- 0. Extensions
-- ---------------------------------------------------------------------------
create extension if not exists "uuid-ossp";


-- =============================================================================
-- 1. HELPER FUNCTION  public.is_admin()
--    Security-definer so it always runs as the function owner (postgres),
--    not the caller — prevents privilege-escalation via search_path tricks.
--    Declared STABLE so the planner may cache it within a single statement.
-- =============================================================================
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from   public.profiles
    where  id   = auth.uid()
    and    role = 'admin'
  );
$$;


-- =============================================================================
-- 2. TABLES
-- =============================================================================

-- ---------------------------------------------------------------------------
-- 2a. profiles
--     One row per auth user.  role is ALWAYS set to 'user' by the trigger
--     on signup; only a DBA/superuser can promote to 'admin'.
-- ---------------------------------------------------------------------------
create table if not exists public.profiles (
  id          uuid primary key references auth.users (id) on delete cascade,
  name        text        not null default '',
  role        text        not null default 'user'
                check (role in ('user', 'admin')),
  created_at  timestamptz not null default now()
);

comment on table  public.profiles            is 'Public user profile, one row per auth.users row.';
comment on column public.profiles.role       is 'Application role; set only via trusted server-side code or direct DBA action.';

-- ---------------------------------------------------------------------------
-- 2b. categories
--     Internal `name` must match the values used in scoring.ts and data.ts
--     (Culinary, Cafe, Nature, Culture, Beach, Resort) so the scoring
--     algorithm keeps working without code changes.
-- ---------------------------------------------------------------------------
create table if not exists public.categories (
  id        serial primary key,
  name      text not null unique,       -- e.g. "Culinary"  — used by code
  label_id  text not null default '',   -- Bahasa Indonesia display label
  label_en  text not null default '',   -- English display label
  icon      text not null default ''    -- lucide icon name, e.g. "UtensilsCrossed"
);

comment on table  public.categories      is 'Place categories; name must stay in sync with scoring.ts WEIGHTS keys.';
comment on column public.categories.name is 'Internal key used in TypeScript – do not rename without updating scoring.ts.';

-- ---------------------------------------------------------------------------
-- 2c. places
--     slug `id` (text) is intentional — matches existing SEED_PLACES ids
--     and all in-app routing (/places/[id]).
--     rating and review_count are COMPUTED by trigger; do not update manually.
-- ---------------------------------------------------------------------------
create table if not exists public.places (
  id           text        primary key,          -- slug, e.g. "warung-nusantara"
  category_id  int         references public.categories (id) on delete set null,
  category     text        not null default '',  -- denormalised copy for fast reads
  name         text        not null,
  area         text        not null default '',
  address      text        not null default '',
  lat          numeric(9,6)  not null,
  lng          numeric(9,6)  not null,
  price_min    int         not null default 0 check (price_min >= 0),
  price_max    int         not null default 0 check (price_max >= price_min),
  rating       numeric(3,2) not null default 0
                check (rating >= 0 and rating <= 5),
  review_count int         not null default 0 check (review_count >= 0),
  image        text        not null default '',
  gallery      text[]      not null default '{}',
  blurb        text        not null default '',
  hours        text        not null default '',
  tags         text[]      not null default '{}',
  facilities   text[]      not null default '{}',
  highlights   text[]      not null default '{}',
  phone        text,
  instagram    text,
  gmaps_url    text,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

comment on table  public.places              is 'Tourist and culinary places in Bali.';
comment on column public.places.rating       is 'Computed by trigger from non-hidden reviews; do not update directly.';
comment on column public.places.review_count is 'Computed by trigger from non-hidden reviews; do not update directly.';
comment on column public.places.category     is 'Denormalised from categories.name for fast reads without a join.';

-- ---------------------------------------------------------------------------
-- 2d. reviews
--     unique(place_id, user_id) → one review per user per place.
-- ---------------------------------------------------------------------------
create table if not exists public.reviews (
  id             uuid        primary key default gen_random_uuid(),
  place_id       text        not null references public.places (id) on delete cascade,
  user_id        uuid        not null references auth.users (id) on delete cascade,
  reviewer_name  text        not null default '',
  rating         int         not null check (rating between 1 and 5),
  review_text    text        not null default '',
  photo_url      text,
  hidden         boolean     not null default false,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now(),
  unique (place_id, user_id)
);

comment on table  public.reviews        is 'User reviews for places; rating aggregates are maintained by trigger.';
comment on column public.reviews.hidden is 'Admin-controlled; hidden reviews are excluded from public views and rating aggregation.';

-- ---------------------------------------------------------------------------
-- 2e. wishlists
-- ---------------------------------------------------------------------------
create table if not exists public.wishlists (
  user_id    uuid        not null references auth.users (id) on delete cascade,
  place_id   text        not null references public.places (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, place_id)
);

-- ---------------------------------------------------------------------------
-- 2f. preferences
--     One row per user (user_id unique).
-- ---------------------------------------------------------------------------
create table if not exists public.preferences (
  id          uuid        primary key default gen_random_uuid(),
  user_id     uuid        not null unique references auth.users (id) on delete cascade,
  categories  text[]      not null default '{}',
  min_budget  int         not null default 0,
  max_budget  int         not null default 500000,
  radius      int         not null default 20,
  priority    text        not null default 'balanced'
                check (priority in ('balanced','category','budget','distance','rating')),
  origin      text        not null default 'Seminyak',
  coords      numeric[]            default null,  -- nullable [lat, lng]
  updated_at  timestamptz not null default now()
);

comment on column public.preferences.coords is 'Optional [lat, lng] when user picks GPS instead of a named origin.';

-- ---------------------------------------------------------------------------
-- 2g. search_logs  (analytics; write-only for regular users)
-- ---------------------------------------------------------------------------
create table if not exists public.search_logs (
  id          uuid        primary key default gen_random_uuid(),
  user_id     uuid        references auth.users (id) on delete set null,  -- nullable: anon searches
  categories  text[]      not null default '{}',
  priority    text        not null default 'balanced',
  origin      text        not null default '',
  created_at  timestamptz not null default now()
);

comment on table public.search_logs is 'Append-only analytics log; select only for admins.';


-- =============================================================================
-- 3. INDEXES
--    Cover the most common query patterns: place list by category, reviews
--    by place and visibility, FK traversal.
-- =============================================================================
create index if not exists idx_places_category_id    on public.places     (category_id);
create index if not exists idx_places_category       on public.places     (category);
create index if not exists idx_reviews_place_id      on public.reviews    (place_id);
create index if not exists idx_reviews_hidden        on public.reviews    (hidden)   where hidden = false;
create index if not exists idx_reviews_user_id       on public.reviews    (user_id);
create index if not exists idx_wishlists_user_id     on public.wishlists  (user_id);
create index if not exists idx_wishlists_place_id    on public.wishlists  (place_id);
create index if not exists idx_prefs_user_id         on public.preferences(user_id);
create index if not exists idx_search_logs_user_id   on public.search_logs(user_id);
create index if not exists idx_search_logs_created   on public.search_logs(created_at desc);


-- =============================================================================
-- 4. TRIGGERS
-- =============================================================================

-- ---------------------------------------------------------------------------
-- 4a. Auto-create profile row on new signup
--     Role is ALWAYS 'user'; never read from metadata to prevent injection.
-- ---------------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, name, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', ''),
    'user'   -- never trust metadata for role assignment
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

-- Drop first so we can recreate safely on re-runs
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ---------------------------------------------------------------------------
-- 4b. Generic updated_at stamper
-- ---------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists trg_places_updated_at      on public.places;
create trigger trg_places_updated_at
  before update on public.places
  for each row execute procedure public.set_updated_at();

drop trigger if exists trg_reviews_updated_at     on public.reviews;
create trigger trg_reviews_updated_at
  before update on public.reviews
  for each row execute procedure public.set_updated_at();

drop trigger if exists trg_preferences_updated_at on public.preferences;
create trigger trg_preferences_updated_at
  before update on public.preferences
  for each row execute procedure public.set_updated_at();

-- ---------------------------------------------------------------------------
-- 4c. Recompute places.rating and places.review_count
--     Fires AFTER insert / update / delete on reviews.
--     Only counts reviews where hidden = false.
-- ---------------------------------------------------------------------------
create or replace function public.refresh_place_rating()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  target_place_id text;
begin
  -- Determine which place_id to recompute
  if (tg_op = 'DELETE') then
    target_place_id := old.place_id;
  else
    target_place_id := new.place_id;
  end if;

  update public.places
  set
    rating       = coalesce(
                     (select round(avg(r.rating)::numeric, 2)
                      from   public.reviews r
                      where  r.place_id = target_place_id
                      and    r.hidden   = false),
                     rating   -- keep existing value if no reviews yet
                   ),
    review_count = (
                     select count(*)
                     from   public.reviews r
                     where  r.place_id = target_place_id
                     and    r.hidden   = false
                   )
  where id = target_place_id;

  return null;  -- AFTER trigger; return value is ignored
end;
$$;

drop trigger if exists trg_reviews_rating on public.reviews;
create trigger trg_reviews_rating
  after insert or update or delete on public.reviews
  for each row execute procedure public.refresh_place_rating();

-- ---------------------------------------------------------------------------
-- 4d. Prevent non-admin users from changing their own role via profiles update
--     (Belt-and-suspenders: RLS already denies role change, but this trigger
--     makes it impossible even from within a flawed RLS policy or future
--     policy changes.)
-- ---------------------------------------------------------------------------
create or replace function public.prevent_role_self_escalation()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  -- Allow if the authenticated user IS already an admin (they can manage roles)
  if public.is_admin() then
    return new;
  end if;

  -- Reject any attempt to change the role column
  if new.role <> old.role then
    raise exception 'You are not permitted to change the role field.'
      using errcode = 'insufficient_privilege';
  end if;

  return new;
end;
$$;

drop trigger if exists trg_profiles_no_role_self_escalation on public.profiles;
create trigger trg_profiles_no_role_self_escalation
  before update on public.profiles
  for each row execute procedure public.prevent_role_self_escalation();


-- =============================================================================
-- 5. ROW LEVEL SECURITY
-- =============================================================================
alter table public.profiles    enable row level security;
alter table public.categories  enable row level security;
alter table public.places      enable row level security;
alter table public.reviews     enable row level security;
alter table public.wishlists   enable row level security;
alter table public.preferences enable row level security;
alter table public.search_logs enable row level security;


-- ---------------------------------------------------------------------------
-- 5a. profiles
-- ---------------------------------------------------------------------------
-- Users can read their own profile; admins can read all
create policy "profiles_select_own_or_admin"
  on public.profiles for select
  using (id = auth.uid() or public.is_admin());

-- Users can update their own profile row (role change blocked by trigger)
create policy "profiles_update_own"
  on public.profiles for update
  using (id = auth.uid())
  with check (id = auth.uid());

-- Only admins can delete profiles (edge case; normally handled by cascade)
create policy "profiles_delete_admin"
  on public.profiles for delete
  using (public.is_admin());

-- insert is handled exclusively by the trigger; no direct insert from clients
create policy "profiles_insert_trigger_only"
  on public.profiles for insert
  with check (false);  -- the trigger runs as security definer, bypassing RLS


-- ---------------------------------------------------------------------------
-- 5b. categories  — read-public, write-admin
-- ---------------------------------------------------------------------------
create policy "categories_select_all"
  on public.categories for select
  using (true);

create policy "categories_insert_admin"
  on public.categories for insert
  with check (public.is_admin());

create policy "categories_update_admin"
  on public.categories for update
  using (public.is_admin());

create policy "categories_delete_admin"
  on public.categories for delete
  using (public.is_admin());


-- ---------------------------------------------------------------------------
-- 5c. places  — read-public, write-admin
-- ---------------------------------------------------------------------------
create policy "places_select_all"
  on public.places for select
  using (true);

create policy "places_insert_admin"
  on public.places for insert
  with check (public.is_admin());

create policy "places_update_admin"
  on public.places for update
  using (public.is_admin());

create policy "places_delete_admin"
  on public.places for delete
  using (public.is_admin());


-- ---------------------------------------------------------------------------
-- 5d. reviews
-- ---------------------------------------------------------------------------
-- Public may see visible reviews; owners see their own (even hidden); admins see all
create policy "reviews_select"
  on public.reviews for select
  using (
    hidden = false
    or user_id = auth.uid()
    or public.is_admin()
  );

-- Authenticated users may insert their own review
create policy "reviews_insert_own"
  on public.reviews for insert
  with check (
    auth.uid() is not null
    and user_id = auth.uid()
  );

-- Users may update/delete only their own reviews
create policy "reviews_update_own"
  on public.reviews for update
  using (user_id = auth.uid() or public.is_admin())
  with check (user_id = auth.uid() or public.is_admin());

create policy "reviews_delete_own_or_admin"
  on public.reviews for delete
  using (user_id = auth.uid() or public.is_admin());


-- ---------------------------------------------------------------------------
-- 5e. wishlists  — owner only
-- ---------------------------------------------------------------------------
create policy "wishlists_all_own"
  on public.wishlists for all
  using  (user_id = auth.uid())
  with check (user_id = auth.uid());


-- ---------------------------------------------------------------------------
-- 5f. preferences  — owner only
-- ---------------------------------------------------------------------------
create policy "preferences_all_own"
  on public.preferences for all
  using  (user_id = auth.uid())
  with check (user_id = auth.uid());


-- ---------------------------------------------------------------------------
-- 5g. search_logs  — anyone can insert; only admins can read
-- ---------------------------------------------------------------------------
create policy "search_logs_insert_all"
  on public.search_logs for insert
  with check (true);

create policy "search_logs_select_admin"
  on public.search_logs for select
  using (public.is_admin());


-- =============================================================================
-- 6. STORAGE  buckets + policies
--    Run after the migration; bucket creation must be done via the
--    Supabase Dashboard or the Management API if not using the CLI.
--    The SQL below creates the policies assuming the buckets exist.
-- =============================================================================

-- Create buckets (idempotent via upsert into storage.buckets)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  (
    'review-photos',
    'review-photos',
    true,
    5242880,  -- 5 MB
    array['image/jpeg','image/png','image/webp','image/gif']
  ),
  (
    'place-images',
    'place-images',
    true,
    10485760, -- 10 MB
    array['image/jpeg','image/png','image/webp']
  )
on conflict (id) do nothing;


-- ---- review-photos policies ------------------------------------------------

-- Anyone may read (bucket is public, but explicit policy for clarity)
create policy "review_photos_read_all"
  on storage.objects for select
  using (bucket_id = 'review-photos');

-- Authenticated users may upload only into their own folder: <uid>/...
create policy "review_photos_insert_own"
  on storage.objects for insert
  with check (
    bucket_id = 'review-photos'
    and auth.uid() is not null
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- Users may delete only their own uploads
create policy "review_photos_delete_own"
  on storage.objects for delete
  using (
    bucket_id = 'review-photos'
    and auth.uid() is not null
    and (storage.foldername(name))[1] = auth.uid()::text
  );


-- ---- place-images policies -------------------------------------------------

-- Anyone may read
create policy "place_images_read_all"
  on storage.objects for select
  using (bucket_id = 'place-images');

-- Only admins may upload place images
create policy "place_images_insert_admin"
  on storage.objects for insert
  with check (
    bucket_id = 'place-images'
    and public.is_admin()
  );

-- Only admins may delete place images
create policy "place_images_delete_admin"
  on storage.objects for delete
  using (
    bucket_id = 'place-images'
    and public.is_admin()
  );

