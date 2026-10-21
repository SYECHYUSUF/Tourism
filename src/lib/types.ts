// ─── Domain Types ────────────────────────────────────────────────────────────

export type Role = 'admin' | 'user';

export interface UserProfile {
	id: string;
	email: string;
	name: string;
	role: Role;
}

export interface Category {
	id: number;
	category_name: string;
}

export interface Place {
	id: string;
	category_id?: number;
	category: string; // denormalised for convenience
	name: string;
	area: string;
	address: string;
	lat: number;
	lng: number;
	priceMin: number;
	priceMax: number;
	rating: number;
	reviewCount: number;
	image: string;
	blurb: string;
	hours: string;
	tags: string[];
}

export interface Review {
	id: string;
	placeId: string;
	userId?: string;
	reviewerName: string;
	rating: number;
	reviewText: string;
	photoUrl?: string;
	hidden: boolean;
	createdAt: string;
}

// ─── Preference Types ─────────────────────────────────────────────────────────

export type Priority = 'balanced' | 'category' | 'budget' | 'distance' | 'rating';

export interface Prefs {
	categories: string[];
	min: number;
	max: number;
	radius: number;
	priority: Priority;
	origin: string;
	coords?: [number, number];
}
