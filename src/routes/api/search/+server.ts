import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { listCategories } from '$lib/server/repo/categories';
import { MY_LOCATION, sanitizePrefs } from '$lib/prefs';

/**
 * POST /api/search — mencatat pencarian ke search_logs (untuk analitik admin)
 * dan, bila user login, menyimpan preferensinya ke tabel preferences.
 */
export const POST: RequestHandler = async ({ request, locals }) => {
	let body: unknown;
	try {
		body = await request.json();
	} catch {
		throw error(400, 'Format permintaan tidak valid.');
	}

	const categories = (await listCategories(locals.supabase)).map((c) => c.name);
	const prefs = sanitizePrefs(body, categories);
	const user = locals.user;

	// Privasi: koordinat GPS tidak pernah dicatat di search_logs.
	const { error: logError } = await (locals.supabase as any).from('search_logs').insert({
		user_id: user?.id ?? null,
		categories: prefs.categories,
		priority: prefs.priority,
		origin: prefs.origin
	});
	if (logError) console.error('search_logs insert:', logError);

	if (user) {
		const { error: prefError } = await (locals.supabase as any).from('preferences').upsert(
			{
				user_id: user.id,
				categories: prefs.categories,
				min_budget: prefs.min,
				max_budget: prefs.max,
				radius: prefs.radius,
				priority: prefs.priority,
				origin: prefs.origin,
				// Disimpan dibulatkan (~100 m) dan hanya bisa dibaca pemiliknya (RLS).
				coords:
					prefs.origin === MY_LOCATION && prefs.coords
						? prefs.coords.map((n) => Math.round(n * 1000) / 1000)
						: null
			},
			{ onConflict: 'user_id' }
		);
		if (prefError) console.error('preferences upsert:', prefError);
	}

	return json({ ok: true });
};
