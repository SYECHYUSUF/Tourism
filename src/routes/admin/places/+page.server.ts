import { error, fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { toPlace } from '$lib/server/repo/places';
import { listCategories } from '$lib/server/repo/categories';
import { requireAdmin } from '$lib/server/requireAdmin';
import { supabaseAdmin } from '$lib/server/supabaseAdmin';
import {
	BALI_BOUNDS,
	inBali,
	isHttpUrl,
	list,
	num,
	slugify,
	str,
	type FieldErrors
} from '$lib/server/validation';
import { checkImage, isUploadedFile, removeByUrls, uploadImage } from '$lib/server/storage';

const PAGE_SIZE = 20;
const MAX_IMAGE = 3 * 1024 * 1024;
const BUCKET = 'place-images';

export const load: PageServerLoad = async ({ locals, url }) => {
	const q = (url.searchParams.get('q') ?? '').trim().slice(0, 80);
	const cat = (url.searchParams.get('cat') ?? '').trim();
	const page = Math.max(1, Number(url.searchParams.get('page')) || 1);
	const from = (page - 1) * PAGE_SIZE;

	let query = locals.supabase
		.from('places')
		.select('*, categories(name, label_id, label_en, icon)', { count: 'exact' })
		.order('created_at', { ascending: false })
		.range(from, from + PAGE_SIZE - 1);

	if (q) {
		const safe = q.replace(/[%,()]/g, ' ');
		query = query.or(`name.ilike.%${safe}%,area.ilike.%${safe}%`);
	}
	if (cat) query = query.eq('category', cat);

	const [{ data, count, error: dbError }, categories] = await Promise.all([
		query,
		listCategories(locals.supabase)
	]);

	if (dbError) {
		console.error('admin places load:', dbError);
		throw error(500, 'Gagal memuat data tempat.');
	}

	return {
		places: ((data as any[]) ?? []).map(toPlace),
		total: count ?? 0,
		page,
		pageSize: PAGE_SIZE,
		q,
		cat,
		categoryRows: categories
	};
};

async function uniqueSlug(supabase: App.Locals['supabase'], base: string): Promise<string> {
	const { data } = await supabase.from('places').select('id').like('id', `${base}%`);
	const taken = new Set(((data as { id: string }[]) ?? []).map((r) => r.id));
	if (!taken.has(base)) return base;
	let i = 2;
	while (taken.has(`${base}-${i}`)) i++;
	return `${base}-${i}`;
}

export const actions: Actions = {
	save: async ({ request, locals }) => {
		requireAdmin(locals.user);
		const supabase = locals.supabase;
		const form = await request.formData();

		const id = str(form, 'id', 120);
		const values = {
			name: str(form, 'name', 150),
			categoryId: num(form, 'category_id'),
			area: str(form, 'area', 100),
			address: str(form, 'address', 300),
			lat: num(form, 'lat'),
			lng: num(form, 'lng'),
			priceMin: num(form, 'price_min'),
			priceMax: num(form, 'price_max'),
			hours: str(form, 'hours', 100),
			blurb: str(form, 'blurb', 2000),
			phone: str(form, 'phone', 40),
			instagram: str(form, 'instagram', 80),
			gmapsUrl: str(form, 'gmaps_url', 500),
			imageUrl: str(form, 'image_url', 500),
			tags: list(form, 'tags'),
			facilities: list(form, 'facilities'),
			highlights: list(form, 'highlights'),
			keepGallery: list(form, 'keep_gallery', 30, 500)
		};

		const errors: FieldErrors = {};
		if (values.name.length < 2) errors.name = 'Nama minimal 2 karakter.';
		if (values.categoryId === null) errors.category_id = 'Pilih kategori.';
		if (values.lat === null || values.lng === null || !inBali(values.lat, values.lng)) {
			errors.lat = `Koordinat harus di wilayah Bali (lat ${BALI_BOUNDS.latMin}…${BALI_BOUNDS.latMax}, lng ${BALI_BOUNDS.lngMin}…${BALI_BOUNDS.lngMax}).`;
		}
		if (values.priceMin === null || values.priceMin < 0) errors.price_min = 'Harga minimum tidak boleh negatif.';
		if (values.priceMax === null || values.priceMax < 0) errors.price_max = 'Harga maksimum tidak boleh negatif.';
		if (
			values.priceMin !== null &&
			values.priceMax !== null &&
			values.priceMin > values.priceMax
		) {
			errors.price_max = 'Harga maksimum harus ≥ harga minimum.';
		}
		if (values.gmapsUrl && !isHttpUrl(values.gmapsUrl)) errors.gmaps_url = 'URL Google Maps tidak valid.';
		if (values.imageUrl && !isHttpUrl(values.imageUrl)) errors.image_url = 'URL gambar tidak valid.';

		const imageFile = form.get('image_file');
		const galleryFiles = form.getAll('gallery_files').filter(isUploadedFile);
		if (isUploadedFile(imageFile)) {
			const msg = checkImage(imageFile, MAX_IMAGE);
			if (msg) errors.image_file = msg;
		}
		for (const f of galleryFiles) {
			const msg = checkImage(f, MAX_IMAGE);
			if (msg) errors.gallery_files = msg;
		}
		if (galleryFiles.length > 8) errors.gallery_files = 'Maksimal 8 foto galeri per simpan.';

		const category = (
			values.categoryId !== null
				? (await supabase.from('categories').select('id, name').eq('id', values.categoryId).maybeSingle()).data
				: null
		) as unknown as { id: number; name: string } | null;
		if (values.categoryId !== null && !category) errors.category_id = 'Kategori tidak ditemukan.';

		// Data lama (untuk edit)
		type Existing = { id: string; image: string; gallery: string[] };
		let existing: Existing | null = null as Existing | null;
		if (id) {
			const { data } = await supabase.from('places').select('id, image, gallery').eq('id', id).maybeSingle();
			existing = (data as unknown as Existing | null) ?? null;
			if (!existing) errors.form = 'Tempat yang diedit tidak ditemukan.';
		}

		if (!existing && !isUploadedFile(imageFile) && !values.imageUrl) {
			errors.image_file = 'Unggah gambar utama atau isi URL gambar.';
		}

		if (Object.keys(errors).length > 0) {
			return fail(400, { action: 'save', errors, id });
		}

		const placeId = existing?.id ?? (await uniqueSlug(supabase, slugify(values.name)));
		const toRemove: string[] = [];

		try {
			// Gambar utama
			let image = existing?.image ?? '';
			if (isUploadedFile(imageFile)) {
				if (existing?.image) toRemove.push(existing.image);
				image = await uploadImage(supabase, BUCKET, `places/${placeId}`, imageFile);
			} else if (values.imageUrl && values.imageUrl !== image) {
				if (existing?.image) toRemove.push(existing.image);
				image = values.imageUrl;
			}

			// Galeri: pertahankan yang dicentang + tambah yang baru
			const oldGallery = existing?.gallery ?? [];
			const kept = existing ? oldGallery.filter((u) => values.keepGallery.includes(u)) : [];
			toRemove.push(...oldGallery.filter((u) => !kept.includes(u) && u !== image));
			const added: string[] = [];
			for (const f of galleryFiles) {
				added.push(await uploadImage(supabase, BUCKET, `places/${placeId}`, f));
			}
			const gallery = [...kept, ...added];

			const row = {
				name: values.name,
				category_id: values.categoryId,
				category: category!.name,
				area: values.area,
				address: values.address,
				lat: values.lat,
				lng: values.lng,
				price_min: Math.round(values.priceMin!),
				price_max: Math.round(values.priceMax!),
				hours: values.hours,
				blurb: values.blurb,
				phone: values.phone || null,
				instagram: values.instagram || null,
				gmaps_url: values.gmapsUrl || null,
				image,
				gallery: gallery.length > 0 ? gallery : [image],
				tags: values.tags,
				facilities: values.facilities,
				highlights: values.highlights
			};
			// rating & review_count sengaja TIDAK disertakan: dihitung trigger.

			const { error: dbError } = existing
				? await (supabase as any).from('places').update(row).eq('id', placeId)
				: await (supabase as any).from('places').insert({ id: placeId, ...row });
			if (dbError) throw dbError;
		} catch (e) {
			console.error('admin places save:', e);
			return fail(500, { action: 'save', errors: { form: 'Gagal menyimpan tempat. Coba lagi.' }, id });
		}

		await removeByUrls(supabase, BUCKET, toRemove);
		return { action: 'save', success: true, savedId: placeId };
	},

	delete: async ({ request, locals }) => {
		requireAdmin(locals.user);
		const supabase = locals.supabase;
		const form = await request.formData();
		const id = str(form, 'id', 120);
		if (!id) return fail(400, { action: 'delete', errors: { form: 'ID tidak valid.' } });

		const { data: place } = await supabase.from('places').select('image, gallery').eq('id', id).maybeSingle();
		if (!place) return fail(404, { action: 'delete', errors: { form: 'Tempat tidak ditemukan.' } });

		// Foto ulasan milik tempat ini (dihapus via service role karena bukan milik admin)
		const { data: reviewPhotos } = await supabase
			.from('reviews')
			.select('photo_url')
			.eq('place_id', id)
			.not('photo_url', 'is', null);

		const { error: dbError } = await supabase.from('places').delete().eq('id', id);
		if (dbError) {
			console.error('admin places delete:', dbError);
			return fail(500, { action: 'delete', errors: { form: 'Gagal menghapus tempat.' } });
		}

		const p = place as { image: string; gallery: string[] };
		await removeByUrls(supabase, BUCKET, [p.image, ...(p.gallery ?? [])]);
		await removeByUrls(
			supabaseAdmin,
			'review-photos',
			((reviewPhotos as unknown as { photo_url: string }[] | null) ?? []).map((r) => r.photo_url)
		);
		return { action: 'delete', success: true };
	}
};
