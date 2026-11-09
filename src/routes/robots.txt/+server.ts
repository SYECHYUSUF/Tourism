import type { RequestHandler } from './$types';

export const GET: RequestHandler = ({ url }) => {
	const body = [
		'User-agent: *',
		'Disallow: /admin',
		'Disallow: /api/',
		'Disallow: /login',
		'Disallow: /reset-password',
		'Disallow: /wishlist',
		'Disallow: /home',
		'',
		`Sitemap: ${url.origin}/sitemap.xml`
	].join('\n');
	return new Response(body, { headers: { 'content-type': 'text/plain' } });
};
