import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { env } from '$env/dynamic/public';
import type { Profile } from '$lib/database.types';

function isValidEmail(email: string): boolean {
	return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function getSafeRedirect(target: string | null): string {
	if (!target) return '/home';
	// Only allow relative internal paths starting with a single '/'
	if (target.startsWith('/') && !target.startsWith('//') && !target.includes('\\')) {
		return target;
	}
	return '/home';
}

export const load: PageServerLoad = async ({ locals, url }) => {
	// If already authenticated, redirect to appropriate destination
	if (locals.user) {
		if (locals.user.role === 'admin') {
			throw redirect(303, '/admin');
		}
		throw redirect(303, getSafeRedirect(url.searchParams.get('redirectTo')));
	}

	return {
		demoMode: env.PUBLIC_DEMO_MODE === 'true'
	};
};

export const actions: Actions = {
	login: async ({ request, locals: { supabase }, url }) => {
		const formData = await request.formData();
		const email = String(formData.get('email') || '').trim().toLowerCase();
		const password = String(formData.get('password') || '');

		// Server validation
		if (!email || !isValidEmail(email) || password.length < 8) {
			return fail(400, {
				loginError: true,
				email,
				message: 'Email atau kata sandi tidak valid. Kata sandi minimal 8 karakter.'
			});
		}

		const { data, error } = await supabase.auth.signInWithPassword({
			email,
			password
		});

		// Generic error message to prevent account enumeration
		if (error || !data.user) {
			return fail(400, {
				loginError: true,
				email,
				message: 'Email atau kata sandi salah.'
			});
		}

		// Verify role from profiles table (server truth)
		const { data: profileData } = await supabase
			.from('profiles')
			.select('role')
			.eq('id', data.user.id)
			.maybeSingle();

		// Cast to Pick<Profile, 'role'> due to @supabase/ssr v0.5 generic signature
		const profile = profileData as Pick<Profile, 'role'> | null;

		if (profile?.role === 'admin') {
			throw redirect(303, '/admin');
		}

		const redirectTo = getSafeRedirect(url.searchParams.get('redirectTo'));
		throw redirect(303, redirectTo);
	},

	register: async ({ request, locals: { supabase }, url }) => {
		const formData = await request.formData();
		const name = String(formData.get('name') || '').trim();
		const email = String(formData.get('email') || '').trim().toLowerCase();
		const password = String(formData.get('password') || '');

		// Server validation
		if (name.length < 2 || name.length > 60) {
			return fail(400, {
				registerError: true,
				name,
				email,
				message: 'Nama harus memiliki panjang antara 2 hingga 60 karakter.'
			});
		}

		if (!email || !isValidEmail(email)) {
			return fail(400, {
				registerError: true,
				name,
				email,
				message: 'Alamat email tidak valid.'
			});
		}

		const hasLetter = /[a-zA-Z]/.test(password);
		const hasNumber = /[0-9]/.test(password);
		if (password.length < 8 || !hasLetter || !hasNumber) {
			return fail(400, {
				registerError: true,
				name,
				email,
				message: 'Kata sandi minimal 8 karakter dan harus mengandung kombinasi huruf serta angka.'
			});
		}

		// Register via Supabase Auth with name ONLY (role is never trusted from client metadata)
		const emailRedirectTo = `${url.origin}/auth/callback`;
		const { data, error } = await supabase.auth.signUp({
			email,
			password,
			options: {
				data: {
					name
				},
				emailRedirectTo
			}
		});

		if (error) {
			return fail(400, {
				registerError: true,
				name,
				email,
				message: error.message || 'Terjadi kesalahan saat pendaftaran akun.'
			});
		}

		// If email confirmation is disabled on Supabase, user is instantly logged in
		if (data.session) {
			throw redirect(303, '/home');
		}

		// If email confirmation is enabled, prompt user to check their email
		return {
			registerSuccess: true,
			message: 'Pendaftaran berhasil! Silakan periksa email Anda untuk mengonfirmasi akun.'
		};
	},

	forgot: async ({ request, locals: { supabase }, url }) => {
		const formData = await request.formData();
		const email = String(formData.get('email') || '').trim().toLowerCase();

		if (!email || !isValidEmail(email)) {
			return fail(400, {
				forgotError: true,
				email,
				message: 'Alamat email tidak valid.'
			});
		}

		const redirectTo = `${url.origin}/reset-password`;
		await supabase.auth.resetPasswordForEmail(email, {
			redirectTo
		});

		// Always return generic success to avoid disclosing whether an email exists
		return {
			forgotSuccess: true,
			message: 'Jika email terdaftar, tautan pengaturan ulang kata sandi telah dikirim ke kotak masuk Anda.'
		};
	}
};
