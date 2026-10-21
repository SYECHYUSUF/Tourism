/**
 * scoring.ts — Pure weighted-scoring algorithm.
 * No side-effects. Fully unit-testable.
 *
 * Weights by priority:
 *   balanced : category 30% / budget 25% / location 25% / rating 20%
 *   category : 50 / 20 / 15 / 15
 *   budget   : 20 / 45 / 20 / 15
 *   distance : 20 / 20 / 45 / 15
 *   rating   : 20 / 20 / 20 / 40
 */

import type { Place, Prefs, Priority } from './types';

export const WEIGHTS: Record<Priority, [number, number, number, number]> = {
	balanced: [0.3, 0.25, 0.25, 0.2],
	category: [0.5, 0.2, 0.15, 0.15],
	budget: [0.2, 0.45, 0.2, 0.15],
	distance: [0.2, 0.2, 0.45, 0.15],
	rating: [0.2, 0.2, 0.2, 0.4]
};

export const ORIGINS: Record<string, [number, number]> = {
	Ubud: [-8.5069, 115.2625],
	Seminyak: [-8.6913, 115.1682],
	Canggu: [-8.6478, 115.1385],
	'Nusa Dua': [-8.8003, 115.2316],
	Uluwatu: [-8.8291, 115.0849],
	Denpasar: [-8.6705, 115.2126]
};

/** Haversine distance in km between two lat/lng pairs. */
export function distanceKm(
	place: Pick<Place, 'lat' | 'lng'>,
	origin: [number, number]
): number {
	const [la, lo] = origin;
	const R = 6371;
	const rad = Math.PI / 180;
	const dLa = (place.lat - la) * rad;
	const dLo = (place.lng - lo) * rad;
	const a =
		Math.sin(dLa / 2) ** 2 +
		Math.cos(la * rad) * Math.cos(place.lat * rad) * Math.sin(dLo / 2) ** 2;
	return Math.round(2 * R * Math.asin(Math.sqrt(a)) * 10) / 10;
}

/** Resolve the user's chosen origin coordinates. */
export function originCoords(prefs: Prefs): [number, number] {
	return prefs.coords ?? ORIGINS[prefs.origin] ?? ORIGINS['Seminyak'];
}

/** Compute a 0–100 match score for a place against user preferences. */
export function matchScore(place: Place, prefs: Prefs): number {
	const [wc, wb, wl, wr] = WEIGHTS[prefs.priority];

	// Category signal (1 = match, 0.15 = no preference or mismatch)
	const c =
		prefs.categories.length === 0 || prefs.categories.includes(place.category) ? 1 : 0.15;

	// Budget signal (1 = inside range, tapers off outside)
	const mid = (place.priceMin + place.priceMax) / 2;
	const b =
		mid >= prefs.min && mid <= prefs.max
			? 1
			: Math.max(
					0,
					1 -
						Math.abs(mid < prefs.min ? prefs.min - mid : mid - prefs.max) /
							Math.max(prefs.max, 1)
				);

	// Location signal (1 = at origin, 0 = at edge of 1.5× radius)
	const dist = distanceKm(place, originCoords(prefs));
	const l = Math.max(0, 1 - dist / (prefs.radius * 1.5));

	// Rating signal (normalised to 0–1)
	const r = place.rating / 5;

	return Math.round((c * wc + b * wb + l * wl + r * wr) * 100);
}

/** Format price into Rupiah (Rp). */
export const money = (n: number, isEn = false): string => {
	if (n === 0) return isEn ? 'Free' : 'Gratis';
	return `Rp ${n.toLocaleString('id-ID')}`;
};

export const priceRange = (p: Pick<Place, 'priceMin' | 'priceMax'>, isEn = false): string =>
	`${money(p.priceMin, isEn)} – ${money(p.priceMax, isEn)}`;
