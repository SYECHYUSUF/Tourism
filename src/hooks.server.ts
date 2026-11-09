import { createServerClient } from '@supabase/ssr';
import { error, redirect, type Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';
import type { Database, Profile } from '$lib/database.types';

const supabaseHandle: Handle = async ({ event, resolve }) => {
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
			error: getUserError
		} = await event.locals.supabase.auth.getUser();
		if (getUserError || !user) {
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

	const cookieLocale = event.cookies.get('locale');
	event.locals.locale = cookieLocale === 'en' ? 'en' : 'id';

	const response = await resolve(event, {
		filterSerializedResponseHeaders(name) {
			return name === 'content-range' || name === 'x-supabase-api-version';
		},
		transformPageChunk: ({ html }) => html.replace('%lang%', event.locals.locale)
	});

	// Header keamanan dasar
	response.headers.set('X-Frame-Options', 'DENY');
	response.headers.set('X-Content-Type-Options', 'nosniff');
	response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
	response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=(self)');
	return response;
};

const authGuard: Handle = async ({ event, resolve }) => {
	const { pathname } = event.url;

	// Protected routes that strictly require authentication
	const protectedPrefixes = ['/home', '/wishlist', '/admin', '/reset-password'];
	const isProtected = protectedPrefixes.some(
		(prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
	);

	if (isProtected && !event.locals.user) {
		const fullPath = `${pathname}${event.url.search}`;
		throw redirect(303, `/login?redirectTo=${encodeURIComponent(fullPath)}`);
	}

	// Admin route and all its subroutes strictly require 'admin' role
	if (pathname === '/admin' || pathname.startsWith('/admin/')) {
		if (event.locals.user?.role !== 'admin') {
			throw error(403, 'Forbidden: Akses ditolak. Area ini khusus untuk administrator.');
		}
	}

	return resolve(event);
};

export const handle: Handle = sequence(supabaseHandle, authGuard);
