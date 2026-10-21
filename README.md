# Jelajah — Tourism & Culinary Recommendation System

## Stack
- **SvelteKit** + TypeScript (SSR enabled)
- **Tailwind CSS v3** — mobile-first, custom design tokens
- **Supabase** — PostgreSQL · Auth (JWT) · Storage
- **Leaflet.js** + OpenStreetMap — interactive maps

## Project Structure
```
src/
├── lib/
│   ├── server/          # Server-only: Supabase admin client, DB helpers
│   ├── supabaseClient.ts # Public Supabase client (browser + SSR)
│   ├── types.ts          # Shared TypeScript types
│   ├── scoring.ts        # Weighted-scoring algorithm (pure, testable)
│   ├── prefs.ts          # Preference load/save (sessionStorage)
│   └── data.ts           # Seed data & localStorage helpers (dev/demo)
├── components/
│   ├── Navbar.svelte
│   ├── Footer.svelte
│   ├── PlaceCard.svelte
│   ├── MapComponent.svelte
│   ├── Stars.svelte
│   └── WishlistButton.svelte
└── routes/
    ├── +layout.svelte       # Root layout (Navbar + Footer)
    ├── +layout.server.ts    # Session hydration via Supabase Auth
    ├── +page.svelte          # Landing
    ├── find/+page.svelte     # Preference wizard
    ├── results/+page.svelte  # Recommendation grid
    ├── places/[id]/+page.svelte  # Place detail + map + reviews
    ├── login/+page.svelte    # Login / register
    ├── home/+page.svelte     # Authenticated home
    ├── wishlist/+page.svelte # Saved places
    └── admin/
        ├── +layout.svelte    # Admin sidebar layout
        └── +page.svelte      # Admin dashboard (CRUD tables)
```

## Database Schema (Supabase / PostgreSQL)
```sql
-- users table is managed by Supabase Auth (auth.users)
-- public.users mirrors role info
create table public.users (
  id uuid references auth.users primary key,
  role text not null default 'user' check (role in ('user','admin')),
  name text
);

create table public.categories (
  id serial primary key,
  category_name text not null unique
);

create table public.places (
  id text primary key,
  category_id int references public.categories(id),
  name text not null,
  area text,
  address text,
  lat numeric,
  lng numeric,
  price_min int default 0,
  price_max int default 0,
  rating numeric(3,2) default 0,
  review_count int default 0,
  image_url text,
  blurb text,
  hours text,
  tags text[],
  created_at timestamptz default now()
);

create table public.preferences (
  id serial primary key,
  user_id uuid references public.users(id),
  categories text[],
  min_price int,
  max_price int,
  radius int,
  priority text,
  origin text,
  created_at timestamptz default now()
);

create table public.reviews (
  id uuid primary key default gen_random_uuid(),
  place_id text references public.places(id),
  user_id uuid references public.users(id),
  reviewer_name text,
  rating int check (rating between 1 and 5),
  review_text text,
  photo_url text,
  hidden boolean default false,
  created_at timestamptz default now()
);
```

## Getting Started
```bash
cp .env.example .env
# Fill in PUBLIC_SUPABASE_URL and PUBLIC_SUPABASE_ANON_KEY
npm install
npm run dev
```

## Weighted Scoring Algorithm
| Signal   | Balanced | Category-first | Budget-first | Nearest-first | Top-rated |
|----------|----------|----------------|--------------|---------------|-----------|
| Category | 30%      | 50%            | 20%          | 20%           | 20%       |
| Budget   | 25%      | 20%            | 45%          | 20%           | 20%       |
| Location | 25%      | 15%            | 20%          | 45%           | 20%       |
| Rating   | 20%      | 15%            | 15%          | 15%           | 40%       |
