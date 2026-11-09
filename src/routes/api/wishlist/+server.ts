import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

/** GET /api/wishlist → daftar placeId milik user yang login. */
export const GET: RequestHandler = async ({ locals }) => {
	if (!locals.user) throw error(401, 'Silakan masuk terlebih dahulu.');

	const { data, error: dbError } = await locals.supabase
		.from('wishlists')
		.select('place_id')
		.eq('user_id', locals.user.id);

	if (dbError) {
		console.error('GET /api/wishlist:', dbError);
		throw error(500, 'Gagal memuat wishlist.');
	}

	return json({ placeIds: ((data as { place_id: string }[]) ?? []).map((r) => r.place_id) });
};

/** POST /api/wishlist { placeId } → toggle simpan/hapus. Mengembalikan { saved }. */
export const POST: RequestHandler = async ({ locals, request }) => {
	const user = locals.user;
	if (!user) throw error(401, 'Silakan masuk terlebih dahulu.');

	let placeId = '';
	try {
		const body = (await request.json()) as { placeId?: unknown };
		placeId = typeof body.placeId === 'string' ? body.placeId.trim() : '';
	} catch {
		throw error(400, 'Format permintaan tidak valid.');
	}
	if (!placeId || placeId.length > 120) throw error(400, 'placeId tidak valid.');

	const supabase = locals.supabase;

	const { data: place } = await supabase.from('places').select('id').eq('id', placeId).maybeSingle();
	if (!place) throw error(404, 'Tempat tidak ditemukan.');

	const { data: existing } = await supabase
		.from('wishlists')
		.select('place_id')
		.eq('user_id', user.id)
		.eq('place_id', placeId)
		.maybeSingle();

	if (existing) {
		const { error: delError } = await supabase
			.from('wishlists')
			.delete()
			.eq('user_id', user.id)
			.eq('place_id', placeId);
		if (delError) {
			console.error('POST /api/wishlist delete:', delError);
			throw error(500, 'Gagal menghapus dari wishlist.');
		}
		return json({ saved: false });
	}

	const { error: insError } = await (supabase as any)
		.from('wishlists')
		.insert({ user_id: user.id, place_id: placeId });
	if (insError) {
		console.error('POST /api/wishlist insert:', insError);
		throw error(500, 'Gagal menyimpan ke wishlist.');
	}
	return json({ saved: true });
};
