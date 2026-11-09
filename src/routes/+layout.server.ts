import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals, depends }) => {
	depends('app:wishlist');

	let wishlistIds: string[] = [];
	if (locals.user) {
		const { data, error } = await locals.supabase
			.from('wishlists')
			.select('place_id')
			.eq('user_id', locals.user.id);
		if (error) console.error('layout wishlist load:', error);
		wishlistIds = ((data as { place_id: string }[] | null) ?? []).map((r) => r.place_id);
	}

	return {
		user: locals.user,
		wishlistIds,
		locale: locals.locale
	};
};
