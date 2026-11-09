import { error, fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { getPlaceById, listPlaces } from '$lib/server/repo/places';
import type { Review } from '$lib/types';

function mapReviewRow(row: any): Review {
	return {
		id: String(row.id),
		placeId: String(row.place_id),
		userId: row.user_id ? String(row.user_id) : undefined,
		reviewerName: String(row.reviewer_name || 'Anonymous'),
		rating: Number(row.rating || 5),
		reviewText: String(row.review_text || ''),
		photoUrl: row.photo_url ?? undefined,
		hidden: Boolean(row.hidden),
		createdAt: row.created_at ? String(row.created_at).slice(0, 10) : new Date().toISOString().slice(0, 10)
	};
}

export const load: PageServerLoad = async ({ params, locals, setHeaders }) => {
	const { supabase, user } = locals;

	// Set public cache header if not logged in
	if (!user) {
		setHeaders({
			'cache-control': 'public, max-age=60'
		});
	}

	// 1. Fetch place by ID
	const place = await getPlaceById(supabase, params.id);
	if (!place) {
		throw error(404, 'Tempat tidak ditemukan / Place not found');
	}

	// 2. Fetch up to 6 similar places from the same category
	const similarPlaces = await listPlaces(supabase, {
		category: place.category,
		excludeId: place.id,
		limit: 6
	});

	// 3. Fetch reviews from Supabase reviews table
	const { data: dbReviewsData, error: reviewsError } = await (supabase as any)
		.from('reviews')
		.select('*')
		.eq('place_id', params.id)
		.eq('hidden', false)
		.order('created_at', { ascending: false });

	if (reviewsError) {
		console.error(`Supabase error fetching reviews for place "${params.id}":`, reviewsError);
	}

	const reviews: Review[] = ((dbReviewsData as any[]) ?? []).map(mapReviewRow);

	return {
		place,
		similarPlaces,
		all: similarPlaces,
		reviews,
		user
	};
};

export const actions: Actions = {
	review: async ({ request, params, locals: { supabase, user } }) => {
		if (!user) {
			return fail(401, {
				reviewError: true,
				message: 'Silakan masuk terlebih dahulu untuk mengirim ulasan.'
			});
		}

		const formData = await request.formData();
		const rating = Number(formData.get('rating'));
		const reviewText = String(formData.get('reviewText') || '').trim();
		const photoUrl = String(formData.get('photo') || '').trim();

		if (!rating || rating < 1 || rating > 5) {
			return fail(400, {
				reviewError: true,
				message: 'Rating bintang harus antara 1 sampai 5.'
			});
		}

		if (!reviewText) {
			return fail(400, {
				reviewError: true,
				message: 'Teks ulasan tidak boleh kosong.'
			});
		}

		// Insert or update review (one review per user per place enforced by unique(place_id, user_id))
		const { error: insertError } = await (supabase as any).from('reviews').upsert(
			{
				place_id: params.id,
				user_id: user.id,
				reviewer_name: user.name,
				rating,
				review_text: reviewText,
				photo_url: photoUrl || null,
				hidden: false
			},
			{ onConflict: 'place_id,user_id' }
		);

		if (insertError) {
			console.error('Supabase error inserting review:', insertError);
			return fail(400, {
				reviewError: true,
				message: insertError.message || 'Gagal menyimpan ulasan.'
			});
		}

		return {
			reviewSuccess: true,
			message: 'Ulasan Anda berhasil dikirim!'
		};
	}
};
