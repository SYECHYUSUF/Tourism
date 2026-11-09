import type { PageServerLoad } from './$types';
import { listPlaces } from '$lib/server/repo/places';

export const load: PageServerLoad = async ({ locals, setHeaders }) => {
	const { supabase, user } = locals;

	if (!user) {
		setHeaders({
			'cache-control': 'public, max-age=60'
		});
	}

	const places = await listPlaces(supabase, { limit: 4 });

	return {
		places
	};
};

