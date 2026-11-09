/**
 * database.types.ts
 *
 * Hand-written TypeScript types that mirror the Supabase schema defined in
 * supabase/migrations/20261109000001_init.sql.
 *
 * Format follows the shape produced by `supabase gen types typescript`.
 * Regenerate with:
 *   npx supabase gen types typescript --project-id <YOUR_PROJECT_ID> \
 *     > src/lib/database.types.ts
 *
 * Keep this file in sync with the migration whenever the schema changes.
 */

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

// ---------------------------------------------------------------------------
// Top-level Database type
// ---------------------------------------------------------------------------
export interface Database {
  public: {
    Tables: {
      profiles:     ProfilesTable;
      categories:   CategoriesTable;
      places:       PlacesTable;
      reviews:      ReviewsTable;
      wishlists:    WishlistsTable;
      preferences:  PreferencesTable;
      search_logs:  SearchLogsTable;
    };
    Views:    Record<string, never>;
    Functions: {
      is_admin: {
        Args:    Record<string, never>;
        Returns: boolean;
      };
    };
    Enums: Record<string, never>;
  };
}

// ---------------------------------------------------------------------------
// Helper: a table descriptor with Row / Insert / Update shapes
// ---------------------------------------------------------------------------
interface TableDef<Row, Insert = Partial<Row>, Update = Partial<Row>> {
  Row:    Row;
  Insert: Insert;
  Update: Update;
}

// ---------------------------------------------------------------------------
// profiles
// ---------------------------------------------------------------------------
export interface ProfileRow {
  id:         string;    // uuid — references auth.users
  name:       string;
  /** Application role. Only 'user' or 'admin'. Never trust client input for this. */
  role:       'user' | 'admin';
  created_at: string;    // timestamptz ISO string
}

type ProfilesTable = TableDef<
  ProfileRow,
  // Insert: id is required (set by trigger, but typed for completeness)
  { id: string; name?: string; role?: 'user' | 'admin'; created_at?: string },
  // Update: role intentionally omitted — only a DBA should change it directly
  { name?: string }
>;

// ---------------------------------------------------------------------------
// categories
// ---------------------------------------------------------------------------
export interface CategoryRow {
  id:       number;   // serial
  name:     string;   // internal key: Culinary | Cafe | Nature | Culture | Beach | Resort
  label_id: string;   // Bahasa Indonesia display label
  label_en: string;   // English display label
  icon:     string;   // lucide icon name
}

type CategoriesTable = TableDef<
  CategoryRow,
  { name: string; label_id?: string; label_en?: string; icon?: string },
  { name?: string; label_id?: string; label_en?: string; icon?: string }
>;

// ---------------------------------------------------------------------------
// places
// ---------------------------------------------------------------------------
export interface PlaceRow {
  id:           string;        // text slug, e.g. "warung-nusantara"
  category_id:  number | null;
  category:     string;        // denormalised category name
  name:         string;
  area:         string;
  address:      string;
  lat:          number;
  lng:          number;
  price_min:    number;
  price_max:    number;
  /** Computed by trigger from non-hidden reviews. Do not write directly. */
  rating:       number;
  /** Computed by trigger from non-hidden reviews. Do not write directly. */
  review_count: number;
  image:        string;
  gallery:      string[];
  blurb:        string;
  hours:        string;
  tags:         string[];
  facilities:   string[];
  highlights:   string[];
  phone:        string | null;
  instagram:    string | null;
  gmaps_url:    string | null;
  created_at:   string;
  updated_at:   string;
}

type PlacesTable = TableDef<
  PlaceRow,
  Omit<PlaceRow, 'rating' | 'review_count' | 'created_at' | 'updated_at'> & {
    rating?:       number;
    review_count?: number;
    created_at?:   string;
    updated_at?:   string;
  },
  Partial<Omit<PlaceRow, 'id' | 'rating' | 'review_count'>>
>;

// ---------------------------------------------------------------------------
// reviews
// ---------------------------------------------------------------------------
export interface ReviewRow {
  id:            string;   // uuid
  place_id:      string;   // → places.id
  user_id:       string;   // uuid → auth.users
  reviewer_name: string;
  rating:        number;   // 1–5
  review_text:   string;
  photo_url:     string | null;
  hidden:        boolean;
  created_at:    string;
  updated_at:    string;
}

type ReviewsTable = TableDef<
  ReviewRow,
  {
    id?:            string;
    place_id:       string;
    user_id:        string;
    reviewer_name?: string;
    rating:         number;
    review_text?:   string;
    photo_url?:     string | null;
    hidden?:        boolean;
    created_at?:    string;
    updated_at?:    string;
  },
  {
    reviewer_name?: string;
    rating?:        number;
    review_text?:   string;
    photo_url?:     string | null;
    hidden?:        boolean;
    updated_at?:    string;
  }
>;

// ---------------------------------------------------------------------------
// wishlists
// ---------------------------------------------------------------------------
export interface WishlistRow {
  user_id:    string;   // uuid → auth.users
  place_id:   string;   // → places.id
  created_at: string;
}

type WishlistsTable = TableDef<
  WishlistRow,
  { user_id: string; place_id: string; created_at?: string },
  never  // composite PK; no meaningful partial update
>;

// ---------------------------------------------------------------------------
// preferences
// ---------------------------------------------------------------------------
export type Priority = 'balanced' | 'category' | 'budget' | 'distance' | 'rating';

export interface PreferenceRow {
  id:         string;        // uuid
  user_id:    string;        // uuid → auth.users (unique)
  categories: string[];
  min_budget: number;
  max_budget: number;
  radius:     number;
  priority:   Priority;
  origin:     string;
  /** Optional [lat, lng] when user picks GPS. */
  coords:     number[] | null;
  updated_at: string;
}

type PreferencesTable = TableDef<
  PreferenceRow,
  Omit<PreferenceRow, 'id' | 'updated_at'> & { id?: string; updated_at?: string },
  Partial<Omit<PreferenceRow, 'id' | 'user_id'>>
>;

// ---------------------------------------------------------------------------
// search_logs
// ---------------------------------------------------------------------------
export interface SearchLogRow {
  id:         string;         // uuid
  user_id:    string | null;  // nullable — anonymous searches
  categories: string[];
  priority:   string;
  origin:     string;
  created_at: string;
}

type SearchLogsTable = TableDef<
  SearchLogRow,
  {
    id?:         string;
    user_id?:    string | null;
    categories?: string[];
    priority?:   string;
    origin?:     string;
    created_at?: string;
  },
  never  // append-only
>;

// ---------------------------------------------------------------------------
// Convenience re-exports for use in application code
// ---------------------------------------------------------------------------
export type {
  ProfileRow    as Profile,
  CategoryRow   as Category,
  PlaceRow      as PlaceDb,      // alias to avoid clash with src/lib/types.ts Place
  ReviewRow     as ReviewDb,
  WishlistRow   as Wishlist,
  PreferenceRow as Preference,
  SearchLogRow  as SearchLog,
};

