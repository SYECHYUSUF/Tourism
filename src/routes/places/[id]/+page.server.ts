import { error, fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { getPlaceById, listPlaces } from '$lib/server/repo/places';
import type { Review } from '$lib/types';

const PAGE_SIZE = 10;
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_PHOTO_BYTES = 2 * 1024 * 1024; // 2 MB

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

async function deletePhotoFromStorage(supabase: any, photoUrl: string | null | undefined) {
	if (!photoUrl) return;
	try {
		const parts = photoUrl.split('/review-photos/');
		if (parts.length > 1) {
			const filePath = decodeURIComponent(parts[1]);
			await supabase.storage.from('review-photos').remove([filePath]);
		}
	} catch (err) {
		console.error('Failed to remove photo from storage:', err);
	}
}

export const load: PageServerLoad = async ({ params, locals, url, setHeaders }) => {
	const { supabase, user } = locals;

	// Set public cache header if visitor is not logged in
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

	// 3. Pagination setup
	const pageParam = parseInt(url.searchParams.get('page') || '1', 10);
	const page = isNaN(pageParam) || pageParam < 1 ? 1 : pageParam;
	const from = (page - 1) * PAGE_SIZE;
	const to = from + PAGE_SIZE - 1;

	// 4. Fetch visible reviews for this place (hidden = false, ordered by newest)
	const { data: dbReviewsData, count, error: reviewsError } = await (supabase as any)
		.from('reviews')
		.select('*', { count: 'exact' })
		.eq('place_id', params.id)
		.eq('hidden', false)
		.order('created_at', { ascending: false })
		.range(from, to);

	if (reviewsError) {
		console.error(`Supabase error fetching reviews for place "${params.id}":`, reviewsError);
	}

	const reviews: Review[] = ((dbReviewsData as any[]) ?? []).map(mapReviewRow);
	const totalReviews = count ?? 0;
	const totalPages = Math.max(1, Math.ceil(totalReviews / PAGE_SIZE));

	// 5. Fetch logged-in user's own review if present (so they can view/edit it)
	let userReview: Review | null = null;
	if (user) {
		const { data: userReviewData } = await (supabase as any)
			.from('reviews')
			.select('*')
			.eq('place_id', params.id)
			.eq('user_id', user.id)
			.maybeSingle();

		if (userReviewData) {
			userReview = mapReviewRow(userReviewData);
		}
	}

	return {
		place,
		similarPlaces,
		all: similarPlaces,
		reviews,
		totalReviews,
		page,
		totalPages,
		userReview,
		user
	};
};

export interface ReviewFormErrors {
	rating?: string;
	reviewText?: string;
	photo?: string;
}

export const actions: Actions = {
	review: async ({ request, params, locals: { supabase, user } }) => {
		if (!user) {
			return fail(401, {
				reviewError: true,
				message: 'Silakan masuk terlebih dahulu untuk mengirim ulasan.'
			});
		}

		const formData = await request.formData();
		const rawRating = Number(formData.get('rating'));
		const reviewText = String(formData.get('reviewText') || '').trim();
		const photo = formData.get('photo') as File | null;
		const removePhoto = formData.get('removePhoto') === 'true';

		const errors: ReviewFormErrors = {};

		// Rating validation: integer between 1 and 5
		if (!Number.isInteger(rawRating) || rawRating < 1 || rawRating > 5) {
			errors.rating = 'Rating bintang harus berupa bilangan bulat antara 1 sampai 5.';
		}

		// Text validation: 10 to 1000 characters
		if (reviewText.length < 10 || reviewText.length > 1000) {
			errors.reviewText = 'Teks ulasan harus berisi antara 10 hingga 1000 karakter.';
		}

		// Photo validation if file provided
		const hasPhotoFile = photo && photo instanceof File && photo.size > 0 && photo.name !== '';
		if (hasPhotoFile) {
			if (!ALLOWED_MIME_TYPES.includes(photo.type)) {
				errors.photo = 'Format foto harus berupa JPEG, PNG, atau WebP.';
			} else if (photo.size > MAX_PHOTO_BYTES) {
				errors.photo = 'Ukuran berkas foto maksimal 2 MB.';
			}
		}

		if (Object.keys(errors).length > 0) {
			return fail(400, {
				reviewError: true,
				errors,
				values: {
					rating: rawRating,
					reviewText
				}
			});
		}

		// Fetch existing user review to handle old photo cleanup
		const { data: existingData } = await (supabase as any)
			.from('reviews')
			.select('id, photo_url')
			.eq('place_id', params.id)
			.eq('user_id', user.id)
			.maybeSingle();

		let photoUrl: string | null | undefined = undefined;

		// If user explicitly requested to remove the existing photo
		if (removePhoto && existingData?.photo_url) {
			await deletePhotoFromStorage(supabase, existingData.photo_url);
			photoUrl = null;
		}

		// If new photo file uploaded
		if (hasPhotoFile) {
			if (existingData?.photo_url) {
				await deletePhotoFromStorage(supabase, existingData.photo_url);
			}

			const ext = photo.type === 'image/png' ? 'png' : photo.type === 'image/webp' ? 'webp' : 'jpg';
			const filePath = `${user.id}/${crypto.randomUUID()}.${ext}`;

			const { error: uploadError } = await supabase.storage
				.from('review-photos')
				.upload(filePath, photo, {
					contentType: photo.type,
					upsert: false
				});

			if (uploadError) {
				console.error('Storage upload error in review action:', uploadError);
				const photoErrors: ReviewFormErrors = {
					photo: 'Gagal mengunggah foto ulasan ke penyimpanan.'
				};
				return fail(500, {
					reviewError: true,
					errors: photoErrors,
					values: {
						rating: rawRating,
						reviewText
					}
				});
			}

			const { data: publicUrlData } = supabase.storage
				.from('review-photos')
				.getPublicUrl(filePath);

			photoUrl = publicUrlData.publicUrl;
		}

		// Build upsert payload. user_id & reviewer_name MUST come from locals.user
		const upsertPayload: Record<string, any> = {
			place_id: params.id,
			user_id: user.id,
			reviewer_name: user.name,
			rating: rawRating,
			review_text: reviewText,
			hidden: false
		};

		if (photoUrl !== undefined) {
			upsertPayload.photo_url = photoUrl;
		}

		// Upsert on (place_id, user_id) to prevent duplicates and support editing
		const { error: upsertError } = await (supabase as any)
			.from('reviews')
			.upsert(upsertPayload, { onConflict: 'place_id,user_id' });

		if (upsertError) {
			console.error('Supabase error upserting review:', upsertError);
			return fail(500, {
				reviewError: true,
				message: upsertError.message || 'Gagal menyimpan ulasan.'
			});
		}

		return {
			reviewSuccess: true,
			message: existingData ? 'Ulasan Anda berhasil diperbarui!' : 'Ulasan Anda berhasil dikirim!'
		};
	},

	deleteReview: async ({ params, locals: { supabase, user } }) => {
		if (!user) {
			return fail(401, {
				deleteError: true,
				message: 'Silakan masuk terlebih dahulu.'
			});
		}

		// Find user's own review
		const { data: existingData } = await (supabase as any)
			.from('reviews')
			.select('id, photo_url')
			.eq('place_id', params.id)
			.eq('user_id', user.id)
			.maybeSingle();

		if (!existingData) {
			return fail(404, {
				deleteError: true,
				message: 'Ulasan tidak ditemukan.'
			});
		}

		// Delete photo from storage bucket if present
		if (existingData.photo_url) {
			await deletePhotoFromStorage(supabase, existingData.photo_url);
		}

		// Delete review from DB (RLS reviews_delete_own_or_admin enforces user_id = auth.uid())
		const { error: deleteError } = await (supabase as any)
			.from('reviews')
			.delete()
			.eq('place_id', params.id)
			.eq('user_id', user.id);

		if (deleteError) {
			console.error('Supabase error deleting review:', deleteError);
			return fail(500, {
				deleteError: true,
				message: deleteError.message || 'Gagal menghapus ulasan.'
			});
		}

		return {
			deleteSuccess: true,
			message: 'Ulasan Anda berhasil dihapus.'
		};
	}
};
