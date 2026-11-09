import { error, fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { requireAdmin } from '$lib/server/requireAdmin';
import { supabaseAdmin } from '$lib/server/supabaseAdmin';
import { str } from '$lib/server/validation';

const PER_PAGE = 50;

export interface AdminUserRow {
	id: string;
	email: string;
	name: string;
	role: 'admin' | 'user';
	createdAt: string;
	lastSignIn: string | null;
}

async function countAdmins(): Promise<number> {
	const { count } = await supabaseAdmin
		.from('profiles')
		.select('id', { count: 'exact', head: true })
		.eq('role', 'admin');
	return count ?? 0;
}

export const load: PageServerLoad = async ({ url }) => {
	const page = Math.max(1, Number(url.searchParams.get('page')) || 1);
	const q = (url.searchParams.get('q') ?? '').trim().toLowerCase();

	const { data, error: authError } = await supabaseAdmin.auth.admin.listUsers({ page, perPage: PER_PAGE });
	if (authError) {
		console.error('admin users listUsers:', authError);
		throw error(500, 'Gagal memuat daftar pengguna. Periksa SUPABASE_SERVICE_ROLE_KEY.');
	}

	const authUsers = data.users ?? [];
	const ids = authUsers.map((u) => u.id);
	const { data: profiles } = ids.length
		? await supabaseAdmin.from('profiles').select('id, name, role').in('id', ids)
		: { data: [] };
	const byId = new Map(((profiles as { id: string; name: string; role: string }[]) ?? []).map((p) => [p.id, p]));

	let users: AdminUserRow[] = authUsers.map((u) => {
		const p = byId.get(u.id);
		return {
			id: u.id,
			email: u.email ?? '',
			name: p?.name || u.email?.split('@')[0] || '—',
			role: p?.role === 'admin' ? 'admin' : 'user',
			createdAt: (u.created_at ?? '').slice(0, 10),
			lastSignIn: u.last_sign_in_at ? u.last_sign_in_at.slice(0, 10) : null
		};
	});
	if (q) users = users.filter((u) => (u.name + ' ' + u.email).toLowerCase().includes(q));

	return {
		users,
		page,
		hasNext: authUsers.length === PER_PAGE,
		q
	};
};

export const actions: Actions = {
	setRole: async ({ request, locals }) => {
		const me = requireAdmin(locals.user);
		const form = await request.formData();
		const id = str(form, 'id', 64);
		const role = str(form, 'role', 10);
		if (!id || (role !== 'admin' && role !== 'user')) {
			return fail(400, { errors: { form: 'Data tidak valid.' } });
		}
		if (id === me.id) {
			return fail(400, { errors: { form: 'Anda tidak dapat mengubah peran akun Anda sendiri.' } });
		}
		if (role === 'user') {
			const { data: target } = await supabaseAdmin.from('profiles').select('role').eq('id', id).maybeSingle();
			if ((target as { role: string } | null)?.role === 'admin' && (await countAdmins()) <= 1) {
				return fail(400, { errors: { form: 'Tidak bisa menurunkan admin terakhir.' } });
			}
		}

		const { error: dbError } = await (supabaseAdmin as any).from('profiles').update({ role }).eq('id', id);
		if (dbError) {
			console.error('admin users setRole:', dbError);
			return fail(500, {
				errors: { form: 'Gagal mengubah peran. Pastikan migrasi 20261110000001_admin_fixes.sql sudah dijalankan.' }
			});
		}
		return { success: true };
	},

	delete: async ({ request, locals }) => {
		const me = requireAdmin(locals.user);
		const form = await request.formData();
		const id = str(form, 'id', 64);
		if (!id) return fail(400, { errors: { form: 'Data tidak valid.' } });
		if (id === me.id) return fail(400, { errors: { form: 'Anda tidak dapat menghapus akun Anda sendiri.' } });

		const { data: target } = await supabaseAdmin.from('profiles').select('role').eq('id', id).maybeSingle();
		if ((target as { role: string } | null)?.role === 'admin' && (await countAdmins()) <= 1) {
			return fail(400, { errors: { form: 'Tidak bisa menghapus admin terakhir.' } });
		}

		// Bersihkan foto ulasan milik pengguna (folder <user_id>/ di bucket review-photos)
		const { data: files } = await supabaseAdmin.storage.from('review-photos').list(id, { limit: 1000 });
		if (files && files.length > 0) {
			await supabaseAdmin.storage.from('review-photos').remove(files.map((f) => `${id}/${f.name}`));
		}

		// profiles, reviews, wishlists, preferences ikut terhapus (on delete cascade)
		const { error: delError } = await supabaseAdmin.auth.admin.deleteUser(id);
		if (delError) {
			console.error('admin users delete:', delError);
			return fail(500, { errors: { form: 'Gagal menghapus pengguna.' } });
		}
		return { success: true };
	}
};
