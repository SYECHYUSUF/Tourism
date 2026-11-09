import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { toPlace } from '$lib/server/repo/places';
import type { Place } from '$lib/types';

export const load: PageServerLoad = async ({ locals, depends }) => {
	depends('app:wishlist');
	const { supabase, user } = locals;
	if (!user) return { places: [] as Place[] };

	const { data, error: dbError } = await supabase
		.from('wishlists')
		.select('created_at, places(*, categories(name, label_id, label_en, icon))')
		.eq('user_id', user.id)
		.order('created_at', { ascending: false });

	if (dbError) {
		console.error('wishlist load:', dbError);
		throw error(500, 'Gagal memuat wishlist.');
	}

	const places: Place[] = ((data as any[]) ?? [])
		.map((row) => row.places)
		.filter(Boolean)
		.map(toPlace);

	return { places };
};
