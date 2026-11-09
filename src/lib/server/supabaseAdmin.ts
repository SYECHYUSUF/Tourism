import { createClient } from '@supabase/supabase-js';
import { PUBLIC_SUPABASE_URL } from '$env/static/public';
import { SUPABASE_SERVICE_ROLE_KEY } from '$env/static/private';
import type { Database } from '$lib/database.types';

/**
 * Server-only Supabase client initialized with the SERVICE_ROLE_KEY.
 * Bypasses Row Level Security (RLS).
 *
 * CAUTION: Use ONLY inside server endpoints (e.g., hooks, +page.server.ts, +server.ts)
 * for administrative actions such as role assignment. Never expose to client-side code.
 */
export const supabaseAdmin = createClient<Database>(PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
	auth: {
		autoRefreshToken: false,
		persistSession: false
	}
});

