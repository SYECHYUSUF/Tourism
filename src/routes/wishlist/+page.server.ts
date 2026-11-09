import type { PageServerLoad } from './$types';
import { listPlaces } from '$lib/server/repo/places';

export const load: PageServerLoad = async ({ locals }) => {
	const { supabase, user } = locals;

	const places = await listPlaces(supabase);

	return {
		user,
		places
	};
};

