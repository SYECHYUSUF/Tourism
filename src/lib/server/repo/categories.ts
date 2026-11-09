import { error as kitError } from '@sveltejs/kit';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database, CategoryRow } from '$lib/database.types';

export async function listCategories(supabase: SupabaseClient<any, any, any>): Promise<CategoryRow[]> {
	const { data, error } = await (supabase as any)
		.from('categories')
		.select('*')
		.order('id', { ascending: true });

	if (error) {
		console.error('Supabase error in listCategories:', error);
		throw kitError(500, 'Terjadi kendala saat memuat data kategori.');
	}

	return (data as CategoryRow[]) ?? [];
}
