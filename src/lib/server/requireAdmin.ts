import { error } from '@sveltejs/kit';
import type { AppUser } from '$lib/types';

/** Pertahanan berlapis: dipanggil di setiap form action admin. */
export function requireAdmin(user: AppUser | null): AppUser {
	if (!user || user.role !== 'admin') throw error(403, 'Akses ditolak. Area ini khusus administrator.');
	return user;
}
