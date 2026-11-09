import { error, redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import { listPlaces } from '$lib/server/repo/places';
import { listCategories } from '$lib/server/repo/categories';

export const load: LayoutServerLoad = async ({ locals }) => {
	// Defense-in-depth: Re-verify admin role at layout level
	if (!locals.user) {
		throw redirect(303, '/login?redirectTo=/admin');
	}

	if (locals.user.role !== 'admin') {
		throw error(403, 'Forbidden: Akses ditolak. Area ini khusus untuk administrator.');
	}

	const [places, categories] = await Promise.all([
		listPlaces(locals.supabase),
		listCategories(locals.supabase)
	]);

	return {
		user: locals.user,
		places,
		categories: categories.map((c) => c.name),
		categoryRows: categories
	};
};
