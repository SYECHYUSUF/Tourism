import type { PageServerLoad } from './$types';
import { listPlaces } from '$lib/server/repo/places';
import { listCategories } from '$lib/server/repo/categories';

export const load: PageServerLoad = async ({ locals }) => {
	const { supabase, user } = locals;

	const [places, categories, mostVisited, topRated] = await Promise.all([
		listPlaces(supabase),
		listCategories(supabase),
		listPlaces(supabase, { orderBy: 'review_count', orderAsc: false, limit: 5 }),
		listPlaces(supabase, { orderBy: 'rating', orderAsc: false, limit: 5 })
	]);

	return {
		user,
		places,
		categories: categories.map((c) => c.name),
		categoryRows: categories,
		mostVisited,
		topRated
	};
};

