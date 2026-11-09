/**
 * prefs.ts — Preferensi pengguna: nilai default, validasi (sanitize),
 * penyimpanan sessionStorage, dan konversi ke/dari query string URL.
 * Fungsi murni (kecuali load/save) sehingga mudah diuji.
 */

import type { Prefs, Priority } from './types';
import { ORIGINS } from './scoring';

export const DEFAULT_PREFS: Prefs = {
	categories: ['Culinary', 'Beach'],
	min: 25000,
	max: 500000,
	radius: 20,
	priority: 'balanced',
	origin: 'Seminyak'
};

export const PRIORITIES: Priority[] = ['balanced', 'category', 'budget', 'distance', 'rating'];
export const MY_LOCATION = 'My location';
export const MAX_BUDGET = 100_000_000;
export const RADIUS_MIN = 1;
export const RADIUS_MAX = 100;

const STORAGE_KEY = 'prefs';

function toInt(v: unknown, fallback: number): number {
	const n = typeof v === 'string' && v.trim() !== '' ? Number(v) : typeof v === 'number' ? v : NaN;
	return Number.isFinite(n) ? Math.round(n) : fallback;
}

function clamp(n: number, min: number, max: number): number {
	return Math.min(max, Math.max(min, n));
}

export function isValidCoords(c: unknown): c is [number, number] {
	return (
		Array.isArray(c) &&
		c.length === 2 &&
		typeof c[0] === 'number' &&
		typeof c[1] === 'number' &&
		Number.isFinite(c[0]) &&
		Number.isFinite(c[1]) &&
		Math.abs(c[0]) <= 90 &&
		Math.abs(c[1]) <= 180
	);
}

/**
 * Memastikan preferensi selalu valid: min ≤ max, angka tidak negatif,
 * radius 1–100, priority dikenal, kategori hanya yang tersedia,
 * dan origin dikenal (atau 'My location' dengan koordinat valid).
 */
export function sanitizePrefs(input: unknown, allowedCategories?: string[]): Prefs {
	const raw = (input && typeof input === 'object' ? input : {}) as Record<string, unknown>;

	let categories = Array.isArray(raw.categories)
		? raw.categories.filter((c): c is string => typeof c === 'string' && c.trim() !== '').map((c) => c.trim())
		: [...DEFAULT_PREFS.categories];
	if (allowedCategories) categories = categories.filter((c) => allowedCategories.includes(c));
	categories = [...new Set(categories)].slice(0, 10);

	let min = clamp(toInt(raw.min, DEFAULT_PREFS.min), 0, MAX_BUDGET);
	let max = clamp(toInt(raw.max, DEFAULT_PREFS.max), 0, MAX_BUDGET);
	if (min > max) [min, max] = [max, min];

	const radius = clamp(toInt(raw.radius, DEFAULT_PREFS.radius), RADIUS_MIN, RADIUS_MAX);
	const priority = PRIORITIES.includes(raw.priority as Priority) ? (raw.priority as Priority) : 'balanced';

	const prefs: Prefs = { categories, min, max, radius, priority, origin: DEFAULT_PREFS.origin };

	if (raw.origin === MY_LOCATION && isValidCoords(raw.coords)) {
		prefs.origin = MY_LOCATION;
		prefs.coords = [raw.coords[0], raw.coords[1]];
	} else if (typeof raw.origin === 'string' && raw.origin in ORIGINS) {
		prefs.origin = raw.origin;
	}

	return prefs;
}

export function hasStoredPrefs(): boolean {
	if (typeof sessionStorage === 'undefined') return false;
	return sessionStorage.getItem(STORAGE_KEY) !== null;
}

export function loadPrefs(): Prefs {
	if (typeof sessionStorage === 'undefined') return { ...DEFAULT_PREFS };
	try {
		return sanitizePrefs(JSON.parse(sessionStorage.getItem(STORAGE_KEY) || '{}'));
	} catch {
		return { ...DEFAULT_PREFS };
	}
}

export function savePrefs(p: Prefs): void {
	if (typeof sessionStorage === 'undefined') return;
	sessionStorage.setItem(STORAGE_KEY, JSON.stringify(sanitizePrefs(p)));
}

/** Preferensi → query string yang bisa dibagikan. Koordinat GPS sengaja TIDAK disertakan (privasi). */
export function prefsToQuery(p: Prefs): URLSearchParams {
	const q = new URLSearchParams();
	q.set('cat', p.categories.join(','));
	q.set('min', String(p.min));
	q.set('max', String(p.max));
	q.set('r', String(p.radius));
	q.set('p', p.priority);
	q.set('o', p.origin);
	return q;
}

/** Query string → preferensi mentah (belum di-sanitize). null jika URL tidak membawa preferensi. */
export function prefsFromQuery(q: URLSearchParams): Record<string, unknown> | null {
	if (!q.has('p') && !q.has('cat')) return null;
	const cat = q.get('cat');
	return {
		categories: cat ? cat.split(',').filter(Boolean) : [],
		min: q.get('min') ?? undefined,
		max: q.get('max') ?? undefined,
		radius: q.get('r') ?? undefined,
		priority: q.get('p') ?? undefined,
		origin: q.get('o') ?? undefined
	};
}
