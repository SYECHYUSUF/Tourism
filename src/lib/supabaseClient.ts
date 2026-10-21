import { createClient } from '@supabase/supabase-js';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';

/**
 * Public Supabase client — safe to use in both browser and SSR.
 * Uses PUBLIC_ env vars only (no service role key here).
 */
export const supabase = createClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY);
