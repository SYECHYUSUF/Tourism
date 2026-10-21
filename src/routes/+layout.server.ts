import { createServerClient } from '@supabase/ssr';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ cookies }) => {
	const supabase = createServerClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
		cookies: {
			get: (key) => cookies.get(key),
			set: (key, value, options) => cookies.set(key, value, { ...options, path: '/' }),
			remove: (key, options) => cookies.delete(key, { ...options, path: '/' })
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
};
