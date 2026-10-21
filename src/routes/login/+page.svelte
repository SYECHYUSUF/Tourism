<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { Compass } from 'lucide-svelte';

	let mode: 'in' | 'up' = 'in';
	let name = '';
	let email = '';
	let password = '';
	let err = '';
	let loading = false;

	onMount(() => {
		if ($page.url.searchParams.get('mode') === 'register') {
			mode = 'up';
		}
	});

	async function handleSubmit() {
		err = '';
		loading = true;

		try {
			const { supabase } = await import('$lib/supabaseClient');

			// Check demo accounts first for instantaneous login without requiring email verification
			if (email.toLowerCase() === 'admin@jelajah.id' && password === 'admin123') {
				const user = { name: 'Admin Jelajah', email, role: 'admin' };
				localStorage.setItem('session', JSON.stringify(user));
				goto('/admin');
				return;
			}

			if (email.toLowerCase() === 'user@jelajah.id' && password === 'user123') {
				const user = { name: 'Rani Putri', email, role: 'user' };
				localStorage.setItem('session', JSON.stringify(user));
				goto('/home');
				return;
			}

			if (mode === 'in') {
				const { data, error } = await supabase.auth.signInWithPassword({
					email: email.trim(),
					password
				});

				if (error) {
					// Fallback demo account check in localStorage
					const stored = JSON.parse(localStorage.getItem('accounts') || '[]');
					const matched = stored.find(
						(a: any) =>
							a.email.toLowerCase() === email.trim().toLowerCase() && a.password === password
					);
					if (matched) {
						localStorage.setItem('session', JSON.stringify(matched));
						goto(matched.role === 'admin' ? '/admin' : '/home');
						return;
					}
					err = error.message;
					return;
				}

				const role = data.user.user_metadata?.role || 'user';
				goto(role === 'admin' ? '/admin' : '/home');
			} else {
				const { data, error } = await supabase.auth.signUp({
					email: email.trim(),
					password,
					options: {
						data: {
							name: name.trim(),
							role: 'user'
						}
					}
				});

				if (error) {
					err = error.message;
					return;
				}

				// Also record in local fallback accounts
				const stored = JSON.parse(localStorage.getItem('accounts') || '[]');
				const newAcc = { name: name.trim(), email: email.trim(), password, role: 'user' };
				localStorage.setItem('accounts', JSON.stringify([...stored, newAcc]));
				localStorage.setItem('session', JSON.stringify(newAcc));

				goto('/home');
			}
		} catch (e: any) {
			err = e.message || 'An error occurred during authentication.';
		} finally {
			loading = false;
		}
	}

	function setDemo(demoEmail: string, demoPass: string) {
		mode = 'in';
		email = demoEmail;
		password = demoPass;
		err = '';
	}

	const inputClass =
		'mt-1 w-full border border-line bg-white px-4 py-3 outline-none transition focus:border-brand';
</script>

<svelte:head>
	<title>{mode === 'in' ? 'Sign In' : 'Join'} — Jelajah</title>
</svelte:head>

<div class="grid min-h-screen lg:grid-cols-[1.1fr_1fr]">
	<!-- Left visual showcase -->
	<div class="relative hidden bg-forest lg:block">
		<img
			src="https://images.unsplash.com/photo-1559628233-eb1b1a45564b?w=1400&fit=crop&auto=format&q=80"
			alt="Aerial view of rice terraces"
			class="absolute inset-0 h-full w-full object-cover"
		/>
		<div class="absolute inset-0 bg-gradient-to-t from-forest/90 via-forest/20 to-transparent" />
		<p
			class="absolute bottom-12 left-12 max-w-md font-display text-4xl font-extrabold leading-tight text-white"
		>
			Good trips start with a better shortlist.
		</p>
	</div>

	<!-- Right auth form -->
	<div class="flex flex-col justify-center px-6 py-12 sm:px-16">
		<a href="/" class="mb-14 flex items-center gap-2 font-display text-xl font-extrabold">
			<Compass size={20} class="text-brand" />Jelajah
		</a>

		<p class="mono text-brand">{mode === 'in' ? 'Welcome back' : 'Create account'}</p>
		<h1 class="mt-2 text-4xl font-extrabold">{mode === 'in' ? 'Sign in' : 'Join Jelajah'}</h1>

		<form on:submit|preventDefault={handleSubmit} class="mt-8 max-w-md space-y-5">
			{#if mode === 'up'}
				<label class="block">
					<span class="mono text-slate-soft">Full name</span>
					<input required bind:value={name} class={inputClass} />
				</label>
			{/if}

			<label class="block">
				<span class="mono text-slate-soft">Email</span>
				<input required type="email" bind:value={email} class={inputClass} />
			</label>

			<label class="block">
				<span class="mono text-slate-soft">Password</span>
				<input
					required
					type="password"
					minlength="6"
					bind:value={password}
					class={inputClass}
				/>
			</label>

			{#if err}
				<p role="alert" class="border-l-2 border-red-600 bg-red-50 px-3 py-2 text-sm text-red-700">
					{err}
				</p>
			{/if}

			<button
				type="submit"
				disabled={loading}
				class="w-full bg-ink py-4 font-bold text-white transition hover:bg-brand disabled:opacity-50"
			>
				{loading ? 'Processing...' : mode === 'in' ? 'Sign in' : 'Create account'}
			</button>
		</form>

		<button
			type="button"
			on:click={() => {
				mode = mode === 'in' ? 'up' : 'in';
				err = '';
			}}
			class="mt-5 max-w-md text-left text-sm text-slate-soft"
		>
			{mode === 'in' ? 'New here? ' : 'Already have an account? '}
			<span class="font-bold text-ocean underline">
				{mode === 'in' ? 'Create an account' : 'Sign in'}
			</span>
		</button>

		<!-- Demo accounts widget -->
		<div class="mt-10 max-w-md border border-dashed border-line p-4">
			<p class="mono text-slate-soft">Demo accounts</p>
			<div class="mt-3 grid grid-cols-2 gap-2">
				<button
					type="button"
					on:click={() => setDemo('admin@jelajah.id', 'admin123')}
					class="border border-line bg-white px-3 py-2 text-left text-sm hover:border-brand"
				>
					<b>Admin</b><br />
					<span class="text-xs text-slate-soft">admin@jelajah.id</span>
				</button>
				<button
					type="button"
					on:click={() => setDemo('user@jelajah.id', 'user123')}
					class="border border-line bg-white px-3 py-2 text-left text-sm hover:border-brand"
				>
					<b>User</b><br />
					<span class="text-xs text-slate-soft">user@jelajah.id</span>
				</button>
			</div>
		</div>
	</div>
</div>
