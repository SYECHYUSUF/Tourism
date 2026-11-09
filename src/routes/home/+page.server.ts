import type { PageServerLoad } from './$types';
import { listPlaces } from '$lib/server/repo/places';
import { listCategories } from '$lib/server/repo/categories';

export const load: PageServerLoad = async ({ locals }) => {
	const { supabase, user } = locals;

	const [places, categories] = await Promise.all([
		listPlaces(supabase),
		listCategories(supabase)
	]);

	return {
		user,
		places,
		categories: categories.map((c) => c.name),
		categoryRows: categories
	};
};

