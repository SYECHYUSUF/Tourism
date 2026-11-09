import type { PageServerLoad } from './$types';
import { listPlaces } from '$lib/server/repo/places';
import { listCategories } from '$lib/server/repo/categories';

export const load: PageServerLoad = async ({ locals, setHeaders }) => {
	const { supabase, user } = locals;

	if (!user) {
		setHeaders({
			'cache-control': 'public, max-age=60'
		});
	}

	const [places, categories] = await Promise.all([
		listPlaces(supabase),
		listCategories(supabase)
	]);

	return {
		places,
		categories: categories.map((c) => c.name),
		categoryRows: categories
	};
};

