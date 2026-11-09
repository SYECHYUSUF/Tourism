import { error, redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import { listPlaces } from '$lib/server/repo/places';
import { listCategories } from '$lib/server/repo/categories';
import type { Review } from '$lib/types';

function mapReviewRow(row: any): Review {
	return {
		id: String(row.id),
		placeId: String(row.place_id),
		userId: row.user_id ? String(row.user_id) : undefined,
		reviewerName: String(row.reviewer_name || 'Anonymous'),
		rating: Number(row.rating || 5),
		reviewText: String(row.review_text || ''),
		photoUrl: row.photo_url ?? undefined,
		hidden: Boolean(row.hidden),
		createdAt: row.created_at ? String(row.created_at).slice(0, 10) : new Date().toISOString().slice(0, 10)
	};
}

export const load: LayoutServerLoad = async ({ locals }) => {
	// Defense-in-depth: Re-verify admin role at layout level
	if (!locals.user) {
		throw redirect(303, '/login?redirectTo=/admin');
	}

	if (locals.user.role !== 'admin') {
		throw error(403, 'Forbidden: Akses ditolak. Area ini khusus untuk administrator.');
	}

	const [places, categories, reviewsRes] = await Promise.all([
		listPlaces(locals.supabase),
		listCategories(locals.supabase),
		(locals.supabase as any)
			.from('reviews')
			.select('*')
			.order('created_at', { ascending: false })
	]);

	const reviews: Review[] = ((reviewsRes.data as any[]) ?? []).map(mapReviewRow);

	return {
		user: locals.user,
		places,
		categories: categories.map((c) => c.name),
		categoryRows: categories,
		reviews
	};
};
