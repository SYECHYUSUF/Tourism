import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url, locals: { supabase } }) => {
	const code = url.searchParams.get('code');
	const next = url.searchParams.get('next') ?? '/home';

	if (code) {
		const { error } = await supabase.auth.exchangeCodeForSession(code);
		if (!error) {
			const safeNext = next.startsWith('/') && !next.startsWith('//') ? next : '/home';
			throw redirect(303, safeNext);
		}
	}

	throw redirect(303, '/login?error=auth_callback_failed');
};

