import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	// Strictly guard admin route on server
	if (!locals.user || locals.user.role !== 'admin') {
		throw redirect(303, '/login?redirectTo=/admin');
	}

	return {
		user: locals.user
	};
};

