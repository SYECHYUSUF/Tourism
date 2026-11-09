import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	// The user should have an active session established by the password recovery link
	const { session } = await locals.safeGetSession();
	return {
		hasSession: Boolean(session)
	};
};

export const actions: Actions = {
	default: async ({ request, locals: { supabase } }) => {
		const formData = await request.formData();
		const password = String(formData.get('password') || '');
		const confirmPassword = String(formData.get('confirmPassword') || '');

		if (password !== confirmPassword) {
			return fail(400, {
				error: true,
				message: 'Konfirmasi kata sandi tidak cocok.'
			});
		}

		const hasLetter = /[a-zA-Z]/.test(password);
		const hasNumber = /[0-9]/.test(password);
		if (password.length < 8 || !hasLetter || !hasNumber) {
			return fail(400, {
				error: true,
				message: 'Kata sandi minimal 8 karakter dan harus mengandung kombinasi huruf serta angka.'
			});
		}

		const { error } = await supabase.auth.updateUser({
			password
		});

		if (error) {
			return fail(400, {
				error: true,
				message: error.message || 'Gagal memperbarui kata sandi. Silakan minta tautan baru.'
			});
		}

		throw redirect(303, '/login?reset=success');
	}
};

