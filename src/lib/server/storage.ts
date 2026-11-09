/**
 * storage.ts — Helper Supabase Storage (upload gambar + hapus berdasarkan public URL).
 */
import type { SupabaseClient } from '@supabase/supabase-js';

export const IMAGE_TYPES: Record<string, string> = {
	'image/jpeg': 'jpg',
	'image/png': 'png',
	'image/webp': 'webp'
};

export function isUploadedFile(v: FormDataEntryValue | null): v is File {
	return typeof v === 'object' && v !== null && 'size' in v && (v as File).size > 0;
}

/** Validasi file gambar. Mengembalikan pesan error atau null jika valid. */
export function checkImage(file: File, maxBytes: number): string | null {
	if (!IMAGE_TYPES[file.type]) return 'Format gambar harus JPG, PNG, atau WEBP.';
	if (file.size > maxBytes) return `Ukuran gambar maksimal ${Math.round(maxBytes / 1024 / 1024)} MB.`;
	return null;
}

export async function uploadImage(
	supabase: SupabaseClient<any, any, any>,
	bucket: string,
	folder: string,
	file: File
): Promise<string> {
	const ext = IMAGE_TYPES[file.type] ?? 'jpg';
	const path = `${folder}/${crypto.randomUUID()}.${ext}`;
	const { error } = await supabase.storage.from(bucket).upload(path, file, {
		contentType: file.type,
		upsert: false
	});
	if (error) throw error;
	return supabase.storage.from(bucket).getPublicUrl(path).data.publicUrl;
}

/** Mengambil path objek dari public URL Supabase Storage untuk bucket tertentu. */
export function pathFromPublicUrl(url: string | null | undefined, bucket: string): string | null {
	if (!url) return null;
	const marker = `/storage/v1/object/public/${bucket}/`;
	const i = url.indexOf(marker);
	if (i === -1) return null;
	return decodeURIComponent(url.slice(i + marker.length).split('?')[0]);
}

/** Menghapus file-file milik bucket (URL dari luar bucket diabaikan). Error hanya di-log. */
export async function removeByUrls(
	supabase: SupabaseClient<any, any, any>,
	bucket: string,
	urls: (string | null | undefined)[]
): Promise<void> {
	const paths = urls.map((u) => pathFromPublicUrl(u, bucket)).filter((p): p is string => !!p);
	if (paths.length === 0) return;
	const { error } = await supabase.storage.from(bucket).remove(paths);
	if (error) console.error(`storage remove (${bucket}):`, error);
}
