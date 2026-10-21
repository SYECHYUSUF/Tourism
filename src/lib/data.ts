/**
 * data.ts — Seed data + localStorage helpers for demo/dev mode.
 * In production these are replaced by Supabase queries.
 */

import type { Place, Review } from './types';

const u = (id: string, w = 900) =>
	`https://images.unsplash.com/photo-${id}?w=${w}&fit=crop&auto=format&q=80`;

export const SEED_PLACES: Place[] = [
	{
		id: 'warung-nusantara',
		category: 'Culinary',
		name: 'Warung Nusantara',
		area: 'Ubud Center',
		priceMin: 6,
		priceMax: 18,
		address: 'Jl. Monkey Forest No. 18, Ubud',
		lat: -8.5069,
		lng: 115.2625,
		rating: 4.8,
		reviewCount: 842,
		image: u('1539755530862-00f623c00f52'),
		blurb: 'Family-run kitchen serving slow-cooked rendang, sambal matah and a rotating table of regional Indonesian plates.',
		hours: '08:00 – 22:00',
		tags: ['Halal friendly', 'Family', 'Local']
	},
	{
		id: 'kopi-lamplight',
		category: 'Cafe',
		name: 'Lamplight Coffee House',
		area: 'Seminyak',
		priceMin: 3,
		priceMax: 12,
		address: 'Jl. Kayu Aya No. 42, Seminyak',
		lat: -8.6913,
		lng: 115.1682,
		rating: 4.6,
		reviewCount: 531,
		image: u('1511081692775-05d0f180a065'),
		blurb: 'Single-origin pour-overs and warm pastries under hanging Edison bulbs. A calm place to work or wait out the rain.',
		hours: '07:00 – 21:00',
		tags: ['Wi-Fi', 'Vegan options', 'Quiet']
	},
	{
		id: 'pantai-biru',
		category: 'Beach',
		name: 'Pantai Biru Beach Club',
		area: 'Uluwatu',
		priceMin: 15,
		priceMax: 55,
		address: 'Jl. Labuansait, Pecatu, Uluwatu',
		lat: -8.8291,
		lng: 115.0849,
		rating: 4.7,
		reviewCount: 1204,
		image: u('1605538108568-7f0d77a214c1'),
		blurb: 'White sand, clear water and a shaded sunset deck with grilled seafood straight from the morning catch.',
		hours: '09:00 – 23:00',
		tags: ['Sunset', 'Seafood', 'Swimming']
	},
	{
		id: 'pura-giri',
		category: 'Culture',
		name: 'Pura Giri Hilltop Temple',
		area: 'Kintamani',
		priceMin: 0,
		priceMax: 5,
		address: 'Desa Batur, Kintamani',
		lat: -8.242,
		lng: 115.335,
		rating: 4.9,
		reviewCount: 2310,
		image: u('1609770836167-7a74ed99bfad'),
		blurb: 'A hilltop temple above the clouds, best reached at dawn when the volcano ridge turns gold.',
		hours: '06:00 – 18:00',
		tags: ['Sunrise', 'Heritage', 'Hiking']
	},
	{
		id: 'ridge-lodge',
		category: 'Nature',
		name: 'Ridgeline Forest Lodge',
		area: 'Munduk',
		priceMin: 40,
		priceMax: 120,
		address: 'Jl. Raya Munduk, Buleleng',
		lat: -8.273,
		lng: 115.068,
		rating: 4.5,
		reviewCount: 388,
		image: u('1637201813231-e7e824db5485'),
		blurb: 'Timber cabins on a misty ridge with waterfall trails, a farm kitchen and unhurried mornings.',
		hours: 'Check-in 14:00',
		tags: ['Trekking', 'Stay', 'Cool climate']
	},
	{
		id: 'laut-resort',
		category: 'Resort',
		name: 'Laut Lagoon Resort',
		area: 'Nusa Dua',
		priceMin: 90,
		priceMax: 260,
		address: 'Kawasan ITDC, Nusa Dua',
		lat: -8.8003,
		lng: 115.2316,
		rating: 4.4,
		reviewCount: 712,
		image: u('1605581813258-076a6654a37f'),
		blurb: 'Low-rise villas around a turquoise lagoon pool with spa, kids club and private beach access.',
		hours: 'Open 24 hours',
		tags: ['Pool', 'Spa', 'Family']
	},
	{
		id: 'meja-panjang',
		category: 'Culinary',
		name: 'Meja Panjang',
		area: 'Canggu',
		priceMin: 12,
		priceMax: 34,
		address: 'Jl. Pantai Batu Bolong No. 7, Canggu',
		lat: -8.6478,
		lng: 115.1385,
		rating: 4.7,
		reviewCount: 467,
		image: u('1682139710677-cb02f6bc4211'),
		blurb: 'One long communal table, a shared-plate menu and a wood-fired kitchen that changes with the market.',
		hours: '11:00 – 23:00',
		tags: ['Shared plates', 'Date night', 'Wood-fired']
	},
	{
		id: 'sawah-cafe',
		category: 'Cafe',
		name: 'Sawah Terrace Cafe',
		area: 'Tegallalang',
		priceMin: 4,
		priceMax: 14,
		address: 'Jl. Raya Tegallalang, Gianyar',
		lat: -8.4312,
		lng: 115.2793,
		rating: 4.3,
		reviewCount: 329,
		image: u('1521017432531-fbd92d768814'),
		blurb: 'Breakfast bowls and iced kopi with a front-row view of the rice terraces.',
		hours: '08:00 – 18:00',
		tags: ['Views', 'Breakfast', 'Photo spot']
	}
];

export const DEFAULT_CATEGORIES = ['Culinary', 'Cafe', 'Nature', 'Culture', 'Beach', 'Resort'];

// ─── LocalStorage helpers (demo/dev only) ────────────────────────────────────

const read = <T>(k: string, d: T): T => {
	if (typeof localStorage === 'undefined') return d;
	try {
		const v = localStorage.getItem(k);
		return v ? (JSON.parse(v) as T) : d;
	} catch {
		return d;
	}
};
const write = (k: string, v: unknown) => {
	if (typeof localStorage === 'undefined') return;
	try {
		localStorage.setItem(k, JSON.stringify(v));
	} catch {
		/* quota */
	}
};

export const getPlaces = (): Place[] => read<Place[]>('places', SEED_PLACES);
export const savePlaces = (v: Place[]) => write('places', v);
export const getCategories = (): string[] => read<string[]>('categories', DEFAULT_CATEGORIES);
export const saveCategories = (v: string[]) => write('categories', v);

// Seed reviews
const SEED_TEXT: [string, number, string][] = [
	['Dewi Anggraini', 5, 'Worth the trip. Staff were warm and everything felt considered. Go early to beat the crowd.'],
	['Marcus Hall', 4, 'Great value for what you get. Parking is a bit tight on weekends.'],
	['Sari Wulandari', 5, 'Our favourite find of the whole trip. Would happily come back.']
];

export function getReviews(): Review[] {
	const r = read<Review[] | null>('reviews', null);
	if (r) return r;
	const seeded = SEED_PLACES.flatMap((p) =>
		SEED_TEXT.map(([name, rating, text], i) => ({
			id: `${p.id}-${i}`,
			placeId: p.id,
			reviewerName: name,
			rating,
			reviewText: text,
			hidden: false,
			createdAt: ['2026-09-24', '2026-09-02', '2026-08-11'][i]
		}))
	);
	write('reviews', seeded);
	return seeded;
}
export const saveReviews = (v: Review[]) => write('reviews', v);

export const getWishlist = (email: string): string[] =>
	read<string[]>(`wish:${email}`, []);

export function toggleWishlist(email: string, id: string): boolean {
	const w = getWishlist(email);
	const next = w.includes(id) ? w.filter((x) => x !== id) : [...w, id];
	write(`wish:${email}`, next);
	return next.includes(id);
}
