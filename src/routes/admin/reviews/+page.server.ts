import { error, fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { requireAdmin } from '$lib/server/requireAdmin';
import { supabaseAdmin } from '$lib/server/supabaseAdmin';
import { removeByUrls } from '$lib/server/storage';
import { str } from '$lib/server/validation';

const PAGE_SIZE = 20;

export interface AdminReviewRow {
	id: string;
	placeId: string;
	placeName: string;
	reviewerName: string;
	rating: number;
	reviewText: string;
	photoUrl: string | null;
	hidden: boolean;
	createdAt: string;
}

export const load: PageServerLoad = async ({ locals, url }) => {
	const place = (url.searchParams.get('place') ?? '').trim();
	const status = url.searchParams.get('status') ?? 'all';
	const page = Math.max(1, Number(url.searchParams.get('page')) || 1);
	const from = (page - 1) * PAGE_SIZE;

	let query = locals.supabase
		.from('reviews')
		.select('id, place_id, reviewer_name, rating, review_text, photo_url, hidden, created_at, places(name)', {
			count: 'exact'
		})
		.order('created_at', { ascending: false })
		.range(from, from + PAGE_SIZE - 1);

	if (place) query = query.eq('place_id', place);
	if (status === 'hidden') query = query.eq('hidden', true);
	if (status === 'visible') query = query.eq('hidden', false);

	const [{ data, count, error: dbError }, { data: places }] = await Promise.all([
		query,
		locals.supabase.from('places').select('id, name').order('name')
	]);

	if (dbError) {
		console.error('admin reviews load:', dbError);
		throw error(500, 'Gagal memuat ulasan.');
	}

	const reviews: AdminReviewRow[] = ((data as any[]) ?? []).map((r) => ({
		id: String(r.id),
		placeId: String(r.place_id),
		placeName: r.places?.name ?? '—',
		reviewerName: String(r.reviewer_name || 'Anonim'),
		rating: Number(r.rating),
		reviewText: String(r.review_text || ''),
		photoUrl: r.photo_url ?? null,
		hidden: Boolean(r.hidden),
		createdAt: String(r.created_at).slice(0, 10)
	}));

	return {
		reviews,
		total: count ?? 0,
		page,
		pageSize: PAGE_SIZE,
		place,
		status,
		places: (places as { id: string; name: string }[]) ?? []
	};
};

export const actions: Actions = {
	toggle: async ({ request, locals }) => {
		requireAdmin(locals.user);
		const form = await request.formData();
		const id = str(form, 'id', 64);
		const hidden = str(form, 'hidden', 5) === 'true';
		if (!id) return fail(400, { errors: { form: 'ID tidak valid.' } });

		// Trigger refresh_place_rating otomatis menghitung ulang rating tempat.
		const { error: dbError } = await (locals.supabase as any).from('reviews').update({ hidden }).eq('id', id);
		if (dbError) {
			console.error('admin reviews toggle:', dbError);
			return fail(500, { errors: { form: 'Gagal mengubah status ulasan.' } });
		}
		return { success: true };
	},

	delete: async ({ request, locals }) => {
		requireAdmin(locals.user);
		const form = await request.formData();
		const id = str(form, 'id', 64);
		if (!id) return fail(400, { errors: { form: 'ID tidak valid.' } });

		const { data: review } = await locals.supabase.from('reviews').select('photo_url').eq('id', id).maybeSingle();
		const { error: dbError } = await locals.supabase.from('reviews').delete().eq('id', id);
		if (dbError) {
			console.error('admin reviews delete:', dbError);
			return fail(500, { errors: { form: 'Gagal menghapus ulasan.' } });
		}
		// Foto milik pengguna lain: dihapus memakai service role.
		await removeByUrls(supabaseAdmin, 'review-photos', [(review as { photo_url: string | null } | null)?.photo_url]);
		return { success: true };
	}
};
