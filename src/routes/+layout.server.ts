import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals, depends }) => {
	depends('app:wishlist');

	let wishlistIds: string[] = [];
	let hasSavedPrefs = false;

	if (locals.user) {
		const [wishlistRes, prefRes] = await Promise.all([
			locals.supabase.from('wishlists').select('place_id').eq('user_id', locals.user.id),
			locals.supabase.from('preferences').select('id').eq('user_id', locals.user.id).maybeSingle()
		]);
		if (wishlistRes.error) console.error('layout wishlist load:', wishlistRes.error);
		wishlistIds = ((wishlistRes.data as { place_id: string }[] | null) ?? []).map((r) => r.place_id);
		if (prefRes.data) {
			hasSavedPrefs = true;
		}
	}

	return {
		user: locals.user,
		wishlistIds,
		locale: locals.locale,
		hasSavedPrefs
	};
};
