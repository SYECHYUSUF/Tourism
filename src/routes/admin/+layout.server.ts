import { error, redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals }) => {
	// Defense-in-depth: Re-verify admin role at layout level
	if (!locals.user) {
		throw redirect(303, '/login?redirectTo=/admin');
	}

	if (locals.user.role !== 'admin') {
		throw error(403, 'Forbidden: Akses ditolak. Area ini khusus untuk administrator.');
	}

	return {
		user: locals.user
	};
};

