import { error, redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals, url }) => {
	// Pertahanan berlapis: hooks.server.ts sudah memeriksa, ini memeriksa ulang.
	if (!locals.user) {
		throw redirect(303, `/login?redirectTo=${encodeURIComponent(url.pathname)}`);
	}
	if (locals.user.role !== 'admin') {
		throw error(403, 'Forbidden: Akses ditolak. Area ini khusus untuk administrator.');
	}
	return { user: locals.user };
};
