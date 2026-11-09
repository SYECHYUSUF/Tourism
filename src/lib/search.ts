/**
 * search.ts — Alur kirim pencarian dari klien (dipakai /find dan /home).
 * Menyimpan preferensi ke sessionStorage, mencatat pencarian + menyimpan
 * preferensi akun (jika login) lewat /api/search, lalu mengembalikan URL hasil.
 */
import { prefsToQuery, sanitizePrefs, savePrefs } from './prefs';
import type { Prefs } from './types';

export function submitSearch(p: Prefs): string {
	const clean = sanitizePrefs(p);
	savePrefs(clean);
	try {
		// Tidak ditunggu: pencatatan tidak boleh memperlambat navigasi.
		void fetch('/api/search', {
			method: 'POST',
			headers: { 'content-type': 'application/json' },
			body: JSON.stringify(clean),
			keepalive: true
		}).catch(() => {});
	} catch {
		/* abaikan */
	}
	return `/results?${prefsToQuery(clean).toString()}`;
}
