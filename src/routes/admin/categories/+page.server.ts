import { error, fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { listCategories } from '$lib/server/repo/categories';
import { requireAdmin } from '$lib/server/requireAdmin';
import { num, str, type FieldErrors } from '$lib/server/validation';

export const load: PageServerLoad = async ({ locals }) => {
	const [categories, { data, error: dbError }] = await Promise.all([
		listCategories(locals.supabase),
		locals.supabase.from('places').select('category_id')
	]);
	if (dbError) {
		console.error('admin categories load:', dbError);
		throw error(500, 'Gagal memuat kategori.');
	}

	const counts = new Map<number, number>();
	for (const r of (data as { category_id: number | null }[]) ?? []) {
		if (r.category_id != null) counts.set(r.category_id, (counts.get(r.category_id) ?? 0) + 1);
	}

	return {
		categories: categories.map((c) => ({ ...c, placeCount: counts.get(c.id) ?? 0 }))
	};
};

export const actions: Actions = {
	create: async ({ request, locals }) => {
		requireAdmin(locals.user);
		const form = await request.formData();
		const name = str(form, 'name', 40);
		const labelId = str(form, 'label_id', 60) || name;
		const labelEn = str(form, 'label_en', 60) || name;

		const errors: FieldErrors = {};
		if (!/^[A-Za-z][A-Za-z0-9 &-]{1,39}$/.test(name)) {
			errors.name = 'Nama kategori 2–40 karakter, diawali huruf (huruf, angka, spasi, &, -).';
		}
		if (Object.keys(errors).length) return fail(400, { action: 'create', errors });

		const { data: dupe } = await locals.supabase.from('categories').select('id').ilike('name', name).maybeSingle();
		if (dupe) return fail(400, { action: 'create', errors: { name: 'Kategori dengan nama ini sudah ada.' } });

		const { error: dbError } = await (locals.supabase as any)
			.from('categories')
			.insert({ name, label_id: labelId, label_en: labelEn, icon: '' });
		if (dbError) {
			console.error('admin categories create:', dbError);
			return fail(500, { action: 'create', errors: { form: 'Gagal menambah kategori.' } });
		}
		return { action: 'create', success: true };
	},

	update: async ({ request, locals }) => {
		requireAdmin(locals.user);
		const form = await request.formData();
		const id = num(form, 'id');
		const labelId = str(form, 'label_id', 60);
		const labelEn = str(form, 'label_en', 60);
		if (id === null) return fail(400, { action: 'update', errors: { form: 'ID tidak valid.' } });
		if (!labelId || !labelEn) {
			return fail(400, { action: 'update', id, errors: { label: 'Label Indonesia dan Inggris wajib diisi.' } });
		}

		// Kolom `name` sengaja tidak bisa diubah: dipakai sebagai kunci oleh algoritma skor & ikon.
		const { error: dbError } = await (locals.supabase as any)
			.from('categories')
			.update({ label_id: labelId, label_en: labelEn })
			.eq('id', id);
		if (dbError) {
			console.error('admin categories update:', dbError);
			return fail(500, { action: 'update', errors: { form: 'Gagal memperbarui kategori.' } });
		}
		return { action: 'update', success: true };
	},

	delete: async ({ request, locals }) => {
		requireAdmin(locals.user);
		const form = await request.formData();
		const id = num(form, 'id');
		if (id === null) return fail(400, { action: 'delete', errors: { form: 'ID tidak valid.' } });

		const { count } = await locals.supabase
			.from('places')
			.select('id', { count: 'exact', head: true })
			.eq('category_id', id);
		if ((count ?? 0) > 0) {
			return fail(400, {
				action: 'delete',
				errors: { form: `Kategori masih dipakai oleh ${count} tempat. Pindahkan atau hapus tempat tersebut dahulu.` }
			});
		}

		const { error: dbError } = await locals.supabase.from('categories').delete().eq('id', id);
		if (dbError) {
			console.error('admin categories delete:', dbError);
			return fail(500, { action: 'delete', errors: { form: 'Gagal menghapus kategori.' } });
		}
		return { action: 'delete', success: true };
	}
};
