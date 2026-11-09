import { createServerClient } from '@supabase/ssr';
import type { Handle } from '@sveltejs/kit';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';
import type { Database, Profile } from '$lib/database.types';

export const handle: Handle = async ({ event, resolve }) => {
	event.locals.supabase = createServerClient<Database>(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
		cookies: {
			getAll: () => event.cookies.getAll(),
			setAll: (cookiesToSet: Array<{ name: string; value: string; options?: Parameters<typeof event.cookies.set>[2] }>) => {
				cookiesToSet.forEach(({ name, value, options }) => {
					event.cookies.set(name, value, { ...options, path: '/' });
				});
			}
		}
	});

	/**
	 * Verifies the Supabase session token by calling auth.getUser() to guarantee
	 * it is authenticated by the server rather than trusting auth.getSession() alone.
	 */
	event.locals.safeGetSession = async () => {
		const {
			data: { session }
		} = await event.locals.supabase.auth.getSession();
		if (!session) {
			return { session: null, user: null };
		}

		const {
			data: { user },
			error
		} = await event.locals.supabase.auth.getUser();
		if (error || !user) {
			return { session: null, user: null };
		}

		return { session, user };
	};

	const { user: authUser } = await event.locals.safeGetSession();

	if (authUser) {
		// Fetch verified role and name from profiles table (NEVER from user_metadata)
		const { data } = await event.locals.supabase
			.from('profiles')
			.select('name, role')
			.eq('id', authUser.id)
			.maybeSingle();

		// Cast to Pick<Profile, 'name' | 'role'> due to @supabase/ssr v0.5 generic signature
		// passing 3 type params while @supabase/supabase-js v2.118 expects 5 type params.
		const profile = data as Pick<Profile, 'name' | 'role'> | null;

		event.locals.user = {
			id: authUser.id,
			email: authUser.email ?? '',
			name: profile?.name || authUser.email?.split('@')[0] || 'User',
			role: profile?.role === 'admin' ? 'admin' : 'user'
		};
	} else {
		event.locals.user = null;
	}

	return resolve(event, {
		filterSerializedResponseHeaders(name) {
			return name === 'content-range' || name === 'x-supabase-api-version';
		}
	});
};
