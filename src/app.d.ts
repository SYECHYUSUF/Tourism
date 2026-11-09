// See https://kit.svelte.dev/docs/types#app
import type { Session, User } from '@supabase/supabase-js';
import type { createServerClient } from '@supabase/ssr';
import type { Database } from '$lib/database.types';
import type { AppUser } from '$lib/types';

type TypedSupabaseClient = ReturnType<typeof createServerClient<Database>>;

declare global {
	namespace App {
		interface Locals {
			supabase: TypedSupabaseClient;
			safeGetSession(): Promise<{ session: Session | null; user: User | null }>;
			user: AppUser | null;
		}
		interface PageData {
			user: AppUser | null;
			session?: Session | null;
			supabase?: TypedSupabaseClient;
		}
	}
}

export {};
