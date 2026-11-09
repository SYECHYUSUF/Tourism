/**
 * data.ts — LocalStorage helpers for wishlist fallback.
 * Places, Categories, and Reviews are now loaded from Supabase via server repositories.
 * Seed data lives in supabase/seed.sql.
 */

const read = <T>(k: string, d: T): T => {
	if (typeof localStorage === 'undefined') return d;
	try {
		const v = localStorage.getItem(k);
		return v ? (JSON.parse(v) as T) : d;
	} catch {
		return d;
	}
};

const write = (k: string, v: unknown) => {
	if (typeof localStorage === 'undefined') return;
	try {
		localStorage.setItem(k, JSON.stringify(v));
	} catch {
		/* quota */
	}
};

// ─── Wishlist helpers (demo/fallback) ─────────────────────────────────────────

export const getWishlist = (email: string): string[] =>
	read<string[]>(`wish:${email}`, []);

export function toggleWishlist(email: string, id: string): boolean {
	const w = getWishlist(email);
	const next = w.includes(id) ? w.filter((x) => x !== id) : [...w, id];
	write(`wish:${email}`, next);
	return next.includes(id);
}
