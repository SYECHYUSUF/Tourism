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
		priceMin: 25000,
		priceMax: 75000,
		address: 'Jl. Monkey Forest No. 18, Ubud',
		lat: -8.5069,
		lng: 115.2625,
		rating: 4.8,
		reviewCount: 842,
		image: u('1539755530862-00f623c00f52'),
		blurb: 'Dapur keluarga yang menyajikan rendang empuk, sambal matah segar, dan aneka hidangan regional Indonesia.',
		hours: '08:00 – 22:00',
		tags: ['Halal friendly', 'Keluarga', 'Lokal']
	},
	{
		id: 'kopi-lamplight',
		category: 'Cafe',
		name: 'Lamplight Coffee House',
		area: 'Seminyak',
		priceMin: 20000,
		priceMax: 55000,
		address: 'Jl. Kayu Aya No. 42, Seminyak',
		lat: -8.6913,
		lng: 115.1682,
		rating: 4.6,
		reviewCount: 531,
		image: u('1511081692775-05d0f180a065'),
		blurb: 'Kopi seduh manual single-origin dan roti hangat di bawah cahaya lampu temaram. Tempat tenang untuk bekerja.',
		hours: '07:00 – 21:00',
		tags: ['Wi-Fi', 'Menu Vegan', 'Tenang']
	},
	{
		id: 'pantai-biru',
		category: 'Beach',
		name: 'Pantai Biru Beach Club',
		area: 'Uluwatu',
		priceMin: 100000,
		priceMax: 350000,
		address: 'Jl. Labuansait, Pecatu, Uluwatu',
		lat: -8.8291,
		lng: 115.0849,
		rating: 4.7,
		reviewCount: 1204,
		image: u('1605538108568-7f0d77a214c1'),
		blurb: 'Pasir putih, air jernih, dan area dek teduh untuk menikmati matahari terbenam dengan hidangan laut segar.',
		hours: '09:00 – 23:00',
		tags: ['Sunset', 'Seafood', 'Berenang']
	},
	{
		id: 'pura-giri',
		category: 'Culture',
		name: 'Pura Giri Hilltop Temple',
		area: 'Kintamani',
		priceMin: 0,
		priceMax: 30000,
		address: 'Desa Batur, Kintamani',
		lat: -8.242,
		lng: 115.335,
		rating: 4.9,
		reviewCount: 2310,
		image: u('1609770836167-7a74ed99bfad'),
		blurb: 'Pura megah di puncak bukit di atas awan, memesona saat fajar ketika puncak gunung berapi keemasan.',
		hours: '06:00 – 18:00',
		tags: ['Sunrise', 'Budaya', 'Trekking']
	},
	{
		id: 'ridge-lodge',
		category: 'Nature',
		name: 'Ridgeline Forest Lodge',
		area: 'Munduk',
		priceMin: 350000,
		priceMax: 950000,
		address: 'Jl. Raya Munduk, Buleleng',
		lat: -8.273,
		lng: 115.068,
		rating: 4.5,
		reviewCount: 388,
		image: u('1637201813231-e7e824db5485'),
		blurb: 'Kabin kayu di punggung bukit berkabut dengan jalur air terjun alami, dapur kebun, dan suasana sejuk.',
		hours: 'Check-in 14:00',
		tags: ['Wisata Alam', 'Penginapan', 'Udara Sejuk']
	},
	{
		id: 'laut-resort',
		category: 'Resort',
		name: 'Laut Lagoon Resort',
		area: 'Nusa Dua',
		priceMin: 850000,
		priceMax: 2200000,
		address: 'Kawasan ITDC, Nusa Dua',
		lat: -8.8003,
		lng: 115.2316,
		rating: 4.4,
		reviewCount: 712,
		image: u('1605581813258-076a6654a37f'),
		blurb: 'Vila tepi laguna pirus dengan fasilitas spa mewah, klub anak-anak, dan akses pantai privat.',
		hours: 'Buka 24 jam',
		tags: ['Kolam Renang', 'Spa', 'Keluarga']
	},
	{
		id: 'meja-panjang',
		category: 'Culinary',
		name: 'Meja Panjang',
		area: 'Canggu',
		priceMin: 65000,
		priceMax: 200000,
		address: 'Jl. Pantai Batu Bolong No. 7, Canggu',
		lat: -8.6478,
		lng: 115.1385,
		rating: 4.7,
		reviewCount: 467,
		image: u('1682139710677-cb02f6bc4211'),
		blurb: 'Meja komunal panjang yang menyajikan menu santap bersama dari dapur kayu bakar yang selalu segar.',
		hours: '11:00 – 23:00',
		tags: ['Santap Bersama', 'Romantis', 'Wood-fired']
	},
	{
		id: 'sawah-cafe',
		category: 'Cafe',
		name: 'Sawah Terrace Cafe',
		area: 'Tegallalang',
		priceMin: 25000,
		priceMax: 85000,
		address: 'Jl. Raya Tegallalang, Gianyar',
		lat: -8.4312,
		lng: 115.2793,
		rating: 4.3,
		reviewCount: 329,
		image: u('1521017432531-fbd92d768814'),
		blurb: 'Semangkuk sarapan sehat dan es kopi segar dengan panorama terasering sawah yang memukau.',
		hours: '08:00 – 18:00',
		tags: ['Pemandangan', 'Sarapan', 'Spot Foto']
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
