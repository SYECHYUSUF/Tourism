import { derived } from 'svelte/store';
import { page } from '$app/stores';
import type { AppUser } from './types';

export interface UserSession {
	id?: string;
	name: string;
	email: string;
	role: 'admin' | 'user' | string;
}

/**
 * userStore is a read-only store derived from SvelteKit's $page.data.user.
 * It NEVER reads or writes to localStorage or document.cookie.
 * Session state is managed exclusively through verified Supabase SSR cookies.
 */
export const userStore = {
	subscribe: derived(page, ($page) => ($page.data?.user as AppUser | null) ?? null).subscribe,

	/** @deprecated No-op: user session is handled by Supabase SSR. */
	init(_initialUser?: unknown): void {
		// No-op
	},

	/** @deprecated No-op: login is handled by supabase.auth.signInWithPassword. */
	login(_u: unknown): void {
		// No-op
	},

	/** @deprecated No-op: sign out is handled by supabase.auth.signOut. */
	logout(): void {
		// No-op
	}
};
