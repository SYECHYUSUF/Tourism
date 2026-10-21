import { error } from '@sveltejs/kit';
import { getPlaces } from '$lib/data';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params }) => {
	const all = getPlaces();
	const place = all.find((p) => p.id === params.id);
	if (!place) {
		throw error(404, 'Place not found');
	}
	return { place, all };
};
