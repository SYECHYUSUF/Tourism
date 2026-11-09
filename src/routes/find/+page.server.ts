import type { PageServerLoad } from './$types';
import { listCategories } from '$lib/server/repo/categories';
import { getSavedPrefs } from '$lib/server/repo/preferences';

export const load: PageServerLoad = async ({ locals, setHeaders }) => {
	const { supabase, user } = locals;

	if (!user) {
		setHeaders({ 'cache-control': 'public, max-age=60' });
	}

	const [categories, savedPrefs] = await Promise.all([
		listCategories(supabase),
		user ? getSavedPrefs(supabase, user.id) : Promise.resolve(null)
	]);

	return {
		categories: categories.map((c) => c.name),
		categoryRows: categories,
		savedPrefs
	};
};
