/**
 * validation.ts — Helper validasi input form di sisi server (tanpa dependensi tambahan).
 */

export type FieldErrors = Record<string, string>;

export function str(form: FormData, key: string, max = 2000): string {
	const v = form.get(key);
	return typeof v === 'string' ? v.trim().slice(0, max) : '';
}

export function num(form: FormData, key: string): number | null {
	const raw = str(form, key, 50);
	if (raw === '') return null;
	const n = Number(raw);
	return Number.isFinite(n) ? n : null;
}

/** Memecah textarea/daftar (pisah koma atau baris baru) menjadi array bersih tanpa duplikat. */
export function list(form: FormData, key: string, maxItems = 20, maxLen = 80): string[] {
	const raw = str(form, key, 5000);
	if (!raw) return [];
	const items = raw
		.split(/[\n,]/)
		.map((s) => s.trim().slice(0, maxLen))
		.filter(Boolean);
	return [...new Set(items)].slice(0, maxItems);
}

export function isHttpUrl(v: string): boolean {
	try {
		const u = new URL(v);
		return u.protocol === 'https:' || u.protocol === 'http:';
	} catch {
		return false;
	}
}

/** Membuat slug URL-safe dari teks bebas. */
export function slugify(input: string): string {
	return (
		input
			.normalize('NFKD')
			.replace(/[\u0300-\u036f]/g, '')
			.toLowerCase()
			.replace(/[^a-z0-9]+/g, '-')
			.replace(/^-+|-+$/g, '')
			.slice(0, 60) || 'tempat'
	);
}

/** Batas kira-kira wilayah Bali untuk validasi koordinat. */
export const BALI_BOUNDS = { latMin: -9.0, latMax: -8.0, lngMin: 114.4, lngMax: 115.8 };

export function inBali(lat: number, lng: number): boolean {
	return (
		lat >= BALI_BOUNDS.latMin &&
		lat <= BALI_BOUNDS.latMax &&
		lng >= BALI_BOUNDS.lngMin &&
		lng <= BALI_BOUNDS.lngMax
	);
}

export function clampInt(n: number, min: number, max: number): number {
	return Math.min(max, Math.max(min, Math.round(n)));
}
