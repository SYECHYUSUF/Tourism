import { error as kitError } from '@sveltejs/kit';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '$lib/database.types';
import type { Place } from '$lib/types';

/**
 * Mapper function that transforms a raw database row (snake_case + joined categories)
 * into the domain Place type (camelCase).
 */
export function toPlace(row: any): Place {
	const categoryName = row.categories?.name || row.category || '';
	return {
		id: String(row.id),
		category_id: row.category_id !== null && row.category_id !== undefined ? Number(row.category_id) : undefined,
		category: categoryName,
		name: String(row.name || ''),
		area: String(row.area || ''),
		address: String(row.address || ''),
		lat: Number(row.lat || 0),
		lng: Number(row.lng || 0),
		priceMin: Number(row.price_min ?? 0),
		priceMax: Number(row.price_max ?? 0),
		rating: Number(row.rating ?? 0),
		reviewCount: Number(row.review_count ?? 0),
		image: String(row.image || ''),
		gallery: Array.isArray(row.gallery) && row.gallery.length > 0 ? row.gallery : [row.image || ''],
		blurb: String(row.blurb || ''),
		hours: String(row.hours || ''),
		tags: Array.isArray(row.tags) ? row.tags : [],
		facilities: Array.isArray(row.facilities) ? row.facilities : [],
		highlights: Array.isArray(row.highlights) ? row.highlights : [],
		phone: row.phone ?? undefined,
		instagram: row.instagram ?? undefined,
		gmapsUrl: row.gmaps_url ?? undefined
	};
}

export interface ListPlacesOptions {
	category?: string;
	excludeId?: string;
	limit?: number;
}

export async function listPlaces(
	supabase: SupabaseClient<any, any, any>,
	options?: ListPlacesOptions
): Promise<Place[]> {
	let query = (supabase as any)
		.from('places')
		.select('*, categories(name, label_id, label_en, icon)');

	if (options?.category) {
		query = query.eq('category', options.category);
	}

	if (options?.excludeId) {
		query = query.neq('id', options.excludeId);
	}

	if (options?.limit) {
		query = query.limit(options.limit);
	}

	const { data, error } = await query;

	if (error) {
		console.error('Supabase error in listPlaces:', error);
		throw kitError(500, 'Terjadi kendala saat memuat data tempat.');
	}

	return ((data as any[]) ?? []).map(toPlace);
}

export async function getPlaceById(
	supabase: SupabaseClient<any, any, any>,
	id: string
): Promise<Place | null> {
	const { data, error } = await (supabase as any)
		.from('places')
		.select('*, categories(name, label_id, label_en, icon)')
		.eq('id', id)
		.maybeSingle();

	if (error) {
		console.error(`Supabase error in getPlaceById for id "${id}":`, error);
		throw kitError(500, 'Terjadi kendala saat memuat data tempat.');
	}

	if (!data) {
		return null;
	}

	return toPlace(data);
}
