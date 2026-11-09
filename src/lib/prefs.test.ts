import { describe, expect, it } from 'vitest';
import { DEFAULT_PREFS, MY_LOCATION, prefsFromQuery, prefsToQuery, sanitizePrefs } from './prefs';

describe('sanitizePrefs', () => {
	it('input kosong menghasilkan default', () => {
		expect(sanitizePrefs(undefined)).toEqual(DEFAULT_PREFS);
	});

	it('menukar min dan max bila terbalik', () => {
		const p = sanitizePrefs({ min: 500000, max: 100000 });
		expect(p.min).toBe(100000);
		expect(p.max).toBe(500000);
	});

	it('angka negatif menjadi 0 dan radius dibatasi 1–100', () => {
		const p = sanitizePrefs({ min: -5, max: -1, radius: 999 });
		expect(p.min).toBe(0);
		expect(p.max).toBe(0);
		expect(p.radius).toBe(100);
		expect(sanitizePrefs({ radius: 0 }).radius).toBe(1);
	});

	it('priority tidak dikenal menjadi balanced', () => {
		expect(sanitizePrefs({ priority: 'hack' }).priority).toBe('balanced');
		expect(sanitizePrefs({ priority: 'rating' }).priority).toBe('rating');
	});

	it('hanya kategori yang diizinkan, tanpa duplikat', () => {
		const p = sanitizePrefs({ categories: ['Cafe', 'Cafe', 'Mars', 5] }, ['Cafe', 'Beach']);
		expect(p.categories).toEqual(['Cafe']);
	});

	it('origin tidak dikenal kembali ke Seminyak', () => {
		expect(sanitizePrefs({ origin: 'Jakarta' }).origin).toBe('Seminyak');
		expect(sanitizePrefs({ origin: 'Ubud' }).origin).toBe('Ubud');
	});

	it('My location wajib punya koordinat valid', () => {
		const ok = sanitizePrefs({ origin: MY_LOCATION, coords: [-8.6, 115.2] });
		expect(ok.origin).toBe(MY_LOCATION);
		expect(ok.coords).toEqual([-8.6, 115.2]);

		const lost = sanitizePrefs({ origin: MY_LOCATION });
		expect(lost.origin).toBe('Seminyak');
		expect(lost.coords).toBeUndefined();

		expect(sanitizePrefs({ origin: MY_LOCATION, coords: [999, 1] }).origin).toBe('Seminyak');
	});

	it('menerima angka berbentuk string (dari URL)', () => {
		const p = sanitizePrefs({ min: '10000', max: '200000', radius: '15' });
		expect(p).toMatchObject({ min: 10000, max: 200000, radius: 15 });
	});
});

describe('prefsToQuery / prefsFromQuery', () => {
	it('bolak-balik tanpa kehilangan data', () => {
		const p = sanitizePrefs({ categories: ['Cafe', 'Beach'], min: 1, max: 2, radius: 3, priority: 'distance', origin: 'Ubud' });
		const back = sanitizePrefs(prefsFromQuery(prefsToQuery(p)));
		expect(back).toEqual(p);
	});

	it('koordinat GPS tidak pernah masuk URL', () => {
		const q = prefsToQuery(sanitizePrefs({ origin: MY_LOCATION, coords: [-8.6, 115.2] }));
		expect(q.toString()).not.toContain('115.2');
		expect(q.get('o')).toBe(MY_LOCATION);
	});

	it('null bila URL tidak membawa preferensi', () => {
		expect(prefsFromQuery(new URLSearchParams('q=kopi'))).toBeNull();
	});
});
