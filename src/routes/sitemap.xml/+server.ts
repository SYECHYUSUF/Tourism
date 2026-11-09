import type { RequestHandler } from './$types';

/** Sitemap dinamis: halaman publik + semua tempat dari database. */
export const GET: RequestHandler = async ({ locals, url }) => {
	const origin = url.origin;
	const { data } = await locals.supabase.from('places').select('id, updated_at');
	const places = (data as { id: string; updated_at: string }[] | null) ?? [];

	const staticPaths = ['/', '/find', '/results'];
	const urls = [
		...staticPaths.map((p) => `<url><loc>${origin}${p}</loc></url>`),
		...places.map(
			(p) =>
				`<url><loc>${origin}/places/${encodeURIComponent(p.id)}</loc><lastmod>${p.updated_at.slice(0, 10)}</lastmod></url>`
		)
	];

	const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.join('')}</urlset>`;
	return new Response(xml, {
		headers: { 'content-type': 'application/xml', 'cache-control': 'public, max-age=3600' }
	});
};
