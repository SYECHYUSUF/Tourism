import type { PageServerLoad } from './$types';
import { listCategories } from '$lib/server/repo/categories';

export const load: PageServerLoad = async ({ locals, setHeaders }) => {
	const { supabase, user } = locals;

	if (!user) {
		setHeaders({
			'cache-control': 'public, max-age=60'
		});
	}

	const categories = await listCategories(supabase);

	return {
		categories: categories.map((c) => c.name),
		categoryRows: categories
	};
};

