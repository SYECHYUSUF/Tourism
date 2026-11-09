import { describe, expect, it } from 'vitest';
import { ORIGINS, WEIGHTS, distanceKm, matchScore, money, originCoords, priceRange } from './scoring';
import type { Place, Prefs } from './types';

const base: Place = {
	id: 'test',
	category: 'Culinary',
	name: 'Tes',
	area: 'Seminyak',
	address: '',
	lat: ORIGINS.Seminyak[0],
	lng: ORIGINS.Seminyak[1],
	priceMin: 50000,
	priceMax: 100000,
	rating: 5,
	reviewCount: 0,
	image: '',
	blurb: '',
	hours: '',
	tags: []
};

const prefs: Prefs = {
	categories: ['Culinary'],
	min: 25000,
	max: 500000,
	radius: 20,
	priority: 'balanced',
	origin: 'Seminyak'
};

describe('WEIGHTS', () => {
	it('setiap mode prioritas berjumlah 100%', () => {
		for (const [mode, w] of Object.entries(WEIGHTS)) {
			expect(w.reduce((a, b) => a + b, 0), mode).toBeCloseTo(1, 10);
		}
	});
});

describe('distanceKm (Haversine)', () => {
	it('0 km untuk titik yang sama', () => {
		expect(distanceKm(base, ORIGINS.Seminyak)).toBe(0);
	});

	it('Seminyak → Ubud sekitar 21 km', () => {
		const d = distanceKm({ lat: ORIGINS.Ubud[0], lng: ORIGINS.Ubud[1] }, ORIGINS.Seminyak);
		expect(d).toBeGreaterThan(19);
		expect(d).toBeLessThan(24);
	});

	it('dibulatkan ke 1 angka desimal', () => {
		const d = distanceKm({ lat: -8.7, lng: 115.17 }, ORIGINS.Seminyak);
		expect(Math.round(d * 10) / 10).toBe(d);
	});
});

describe('originCoords', () => {
	it('memakai koordinat GPS bila ada', () => {
		expect(originCoords({ ...prefs, coords: [-8.1, 115.1] })).toEqual([-8.1, 115.1]);
	});
	it('fallback ke Seminyak untuk origin tak dikenal', () => {
		expect(originCoords({ ...prefs, origin: 'Atlantis' })).toEqual(ORIGINS.Seminyak);
	});
});

describe('matchScore', () => {
	it('100 untuk tempat ideal (kategori cocok, budget masuk, jarak 0, rating 5)', () => {
		for (const priority of Object.keys(WEIGHTS) as Prefs['priority'][]) {
			expect(matchScore(base, { ...prefs, priority }), priority).toBe(100);
		}
	});

	it('kategori tidak cocok memakai sinyal 0,15', () => {
		const s = matchScore({ ...base, category: 'Beach' }, prefs);
		// 0.30*0.15 + 0.25 + 0.25 + 0.20 = 0.745 → ×100 = 74.4999… (floating point) → 74
		expect(s).toBe(74);
	});

	it('tanpa pilihan kategori dianggap cocok', () => {
		expect(matchScore({ ...base, category: 'Beach' }, { ...prefs, categories: [] })).toBe(100);
	});

	it('budget di luar rentang menurunkan skor secara bertahap', () => {
		const pricey = matchScore({ ...base, priceMin: 900000, priceMax: 1100000 }, prefs);
		const veryPricey = matchScore({ ...base, priceMin: 5000000, priceMax: 6000000 }, prefs);
		expect(pricey).toBeLessThan(100);
		expect(veryPricey).toBeLessThanOrEqual(pricey);
		expect(veryPricey).toBeGreaterThanOrEqual(0);
	});

	it('sinyal lokasi 0 bila jarak ≥ 1,5 × radius', () => {
		const far = { ...base, lat: ORIGINS.Ubud[0], lng: ORIGINS.Ubud[1] };
		// Seminyak→Ubud ±21 km; radius 5 → batas 7,5 km → sinyal lokasi 0
		expect(matchScore(far, { ...prefs, radius: 5 })).toBe(75);
	});

	it('prioritas mengubah urutan: budget-first memihak tempat murah', () => {
		const cheapFar = { ...base, lat: ORIGINS.Ubud[0], lng: ORIGINS.Ubud[1] };
		const nearPricey = { ...base, priceMin: 800000, priceMax: 1200000 };
		const p = { ...prefs, radius: 10 };
		expect(matchScore(cheapFar, { ...p, priority: 'budget' })).toBeGreaterThan(
			matchScore(nearPricey, { ...p, priority: 'budget' }) - 20
		);
		expect(matchScore(nearPricey, { ...p, priority: 'distance' })).toBeGreaterThan(
			matchScore(cheapFar, { ...p, priority: 'distance' })
		);
	});

	it('skor selalu di rentang 0–100', () => {
		const worst = { ...base, category: 'X', priceMin: 9e8, priceMax: 9e8, rating: 0, lat: -8.0, lng: 114.4 };
		const s = matchScore(worst, { ...prefs, radius: 1 });
		expect(s).toBeGreaterThanOrEqual(0);
		expect(s).toBeLessThanOrEqual(100);
	});
});

describe('money / priceRange', () => {
	it('0 ditulis Gratis / Free', () => {
		expect(money(0)).toBe('Gratis');
		expect(money(0, true)).toBe('Free');
	});
	it('format Rupiah', () => {
		expect(money(25000)).toBe('Rp 25.000');
		expect(priceRange({ priceMin: 25000, priceMax: 75000 })).toBe('Rp 25.000 – Rp 75.000');
	});
});
