import type { PageServerLoad } from './$types';
import { listPlaces } from '$lib/server/repo/places';

export const load: PageServerLoad = async ({ locals, setHeaders }) => {
	const { supabase, user } = locals;

	if (!user) {
		setHeaders({
			'cache-control': 'public, max-age=60'
		});
	}

	const [mostVisited, topRated] = await Promise.all([
		listPlaces(supabase, { orderBy: 'review_count', orderAsc: false, limit: 5 }),
		listPlaces(supabase, { orderBy: 'rating', orderAsc: false, limit: 5 })
	]);

	return {
		mostVisited,
		topRated,
		places: mostVisited
	};
};

