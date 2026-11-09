import type { SupabaseClient } from '@supabase/supabase-js';
import { sanitizePrefs } from '$lib/prefs';
import type { Prefs } from '$lib/types';

/** Preferensi tersimpan milik user (tabel preferences), atau null. */
export async function getSavedPrefs(
	supabase: SupabaseClient<any, any, any>,
	userId: string
): Promise<Prefs | null> {
	const { data, error } = await supabase
		.from('preferences')
		.select('categories, min_budget, max_budget, radius, priority, origin, coords')
		.eq('user_id', userId)
		.maybeSingle();
	if (error) {
		console.error('getSavedPrefs:', error);
		return null;
	}
	if (!data) return null;
	const row = data as {
		categories: string[];
		min_budget: number;
		max_budget: number;
		radius: number;
		priority: string;
		origin: string;
		coords: number[] | null;
	};
	return sanitizePrefs({
		categories: row.categories,
		min: row.min_budget,
		max: row.max_budget,
		radius: row.radius,
		priority: row.priority,
		origin: row.origin,
		coords: row.coords ? row.coords.map(Number) : undefined
	});
}
