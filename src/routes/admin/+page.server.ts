import type { PageServerLoad } from './$types';
import { supabaseAdmin } from '$lib/server/supabaseAdmin';

const DAYS = 30;

export const load: PageServerLoad = async ({ locals }) => {
	const supabase = locals.supabase;
	const since = new Date(Date.now() - DAYS * 24 * 60 * 60 * 1000);
	since.setUTCHours(0, 0, 0, 0);
	const sinceIso = since.toISOString();

	const [placesCount, reviewsCount, hiddenCount, usersCount, logs, topPlaces, latest] = await Promise.all([
		supabase.from('places').select('id', { count: 'exact', head: true }),
		supabase.from('reviews').select('id', { count: 'exact', head: true }),
		supabase.from('reviews').select('id', { count: 'exact', head: true }).eq('hidden', true),
		supabaseAdmin.from('profiles').select('id', { count: 'exact', head: true }),
		supabase.from('search_logs').select('categories, created_at').gte('created_at', sinceIso).limit(10000),
		supabase.from('places').select('id, name, review_count, rating').order('review_count', { ascending: false }).limit(5),
		supabase
			.from('reviews')
			.select('id, reviewer_name, rating, review_text, hidden, created_at, place_id, places(name)')
			.order('created_at', { ascending: false })
			.limit(5)
	]);

	for (const r of [placesCount, reviewsCount, hiddenCount, usersCount, logs, topPlaces, latest]) {
		if (r.error) console.error('admin dashboard load:', r.error);
	}

	// Agregasi pencarian 30 hari terakhir
	const logRows = (logs.data as { categories: string[]; created_at: string }[]) ?? [];
	const catCounts = new Map<string, number>();
	const perDay = new Map<string, number>();
	for (let i = 0; i < DAYS; i++) {
		const d = new Date(since.getTime() + (i + 1) * 24 * 60 * 60 * 1000);
		perDay.set(d.toISOString().slice(0, 10), 0);
	}
	for (const row of logRows) {
		for (const c of row.categories ?? []) catCounts.set(c, (catCounts.get(c) ?? 0) + 1);
		const day = row.created_at.slice(0, 10);
		if (perDay.has(day)) perDay.set(day, (perDay.get(day) ?? 0) + 1);
	}

	return {
		stats: {
			places: placesCount.count ?? 0,
			reviews: reviewsCount.count ?? 0,
			hiddenReviews: hiddenCount.count ?? 0,
			users: usersCount.count ?? 0,
			searches: logRows.length
		},
		topCategories: [...catCounts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 6),
		searchesPerDay: [...perDay.entries()],
		topPlaces: ((topPlaces.data as { id: string; name: string; review_count: number; rating: number }[]) ?? []).map(
			(p) => ({ id: p.id, name: p.name, reviewCount: p.review_count, rating: Number(p.rating) })
		),
		latestReviews: ((latest.data as any[]) ?? []).map((r) => ({
			id: String(r.id),
			reviewerName: String(r.reviewer_name || 'Anonim'),
			rating: Number(r.rating),
			reviewText: String(r.review_text || ''),
			hidden: Boolean(r.hidden),
			createdAt: String(r.created_at).slice(0, 10),
			placeId: String(r.place_id),
			placeName: r.places?.name ?? '—'
		}))
	};
};
