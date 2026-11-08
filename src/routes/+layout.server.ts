import { createServerClient } from '@supabase/ssr';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ cookies }) => {
	// 1. Check local session cookie first for instant SSR hydration
	const sessionCookie = cookies.get('session');
	if (sessionCookie) {
		try {
			const parsed = JSON.parse(decodeURIComponent(sessionCookie));
			if (parsed?.email) {
				return {
					session: { user: parsed } as any,
					user: {
						id: parsed.id || 'local-user',
						email: parsed.email,
						name: parsed.name || parsed.email,
						role: (parsed.role ?? 'user') as 'admin' | 'user'
					}
				};
			}
		} catch {}
	}

	// 2. Fallback to Supabase SSR session
	try {
		const supabase = createServerClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
			cookies: {
				get: (key: string) => cookies.get(key),
				set: (key: string, value: string, options: any) => cookies.set(key, value, { ...options, path: '/' }),
				remove: (key: string, options: any) => cookies.delete(key, { ...options, path: '/' })
			}
		});

		const {
			data: { session }
		} = await supabase.auth.getSession();

		const user = session?.user
			? {
					id: session.user.id,
					email: session.user.email ?? '',
					name: session.user.user_metadata?.name ?? session.user.email ?? '',
					role: (session.user.user_metadata?.role ?? 'user') as 'admin' | 'user'
				}
			: null;

		return { session, user };
	} catch {
		return { session: null, user: null };
	}
};
