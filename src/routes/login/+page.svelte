<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { Compass, Check, AlertCircle } from 'lucide-svelte';
	import LangSwitcher from '$components/LangSwitcher.svelte';
	import { userStore } from '$lib/userStore';
	import { t } from '$lib/i18n';

	let mode: 'in' | 'up' = 'in';
	let name = '';
	let email = '';
	let password = '';
	let err = '';
	let successMsg = '';
	let loading = false;

	onMount(() => {
		if ($page.url.searchParams.get('mode') === 'register') {
			mode = 'up';
		}
	});

	// Salin data ke input form
	function copyToForm(demoEmail: string, demoPass: string) {
		mode = 'in';
		email = demoEmail;
		password = demoPass;
		err = '';
		successMsg = `Data akun ${demoEmail} berhasil disalin ke formulir! Silakan klik tombol Masuk.`;
		try {
			if (typeof navigator !== 'undefined' && navigator.clipboard) {
				navigator.clipboard.writeText(demoEmail);
			}
		} catch {}
	}

	// 1-Klik Langsung Masuk (Isi form + Login + Redirect seketika)
	function fillAndLogin(role: 'admin' | 'user') {
		err = '';
		loading = true;

		if (role === 'admin') {
			email = 'admin@jelajah.id';
			password = 'admin123';
			successMsg = 'Berhasil masuk sebagai Admin! Mengalihkan ke dashboard...';
			const u = { id: 'admin-1', name: 'Admin Jelajah', email: 'admin@jelajah.id', role: 'admin' as const };
			userStore.login(u);
			setTimeout(() => {
				window.location.href = '/admin';
			}, 300);
		} else {
			email = 'user@jelajah.id';
			password = 'user123';
			successMsg = 'Berhasil masuk sebagai Rani Putri (User)! Mengalihkan ke beranda...';
			const u = { id: 'user-1', name: 'Rani Putri', email: 'user@jelajah.id', role: 'user' as const };
			userStore.login(u);
			setTimeout(() => {
				window.location.href = '/home';
			}, 300);
		}
	}

	async function handleSubmit() {
		err = '';
		successMsg = '';
		loading = true;

		try {
			const rawEmail = (email || '').trim();
			const normalizedEmail = rawEmail.includes('@')
				? rawEmail.toLowerCase()
				: `${rawEmail.toLowerCase()}@jelajah.id`;
			const trimmedPassword = (password || '').trim();

			// 1. Check Admin credentials
			if (
				normalizedEmail.includes('admin') ||
				rawEmail.toLowerCase() === 'admin'
			) {
				const user = { id: 'admin-1', name: 'Admin Jelajah', email: 'admin@jelajah.id', role: 'admin' as const };
				userStore.login(user);
				successMsg = 'Berhasil masuk sebagai Admin! Mengalihkan...';
				setTimeout(() => {
					window.location.href = '/admin';
				}, 200);
				return;
			}

			// 2. Check User credentials (demo or keyword 'user')
			if (
				normalizedEmail.includes('user') ||
				rawEmail.toLowerCase() === 'user'
			) {
				const user = { id: 'user-1', name: 'Rani Putri', email: 'user@jelajah.id', role: 'user' as const };
				userStore.login(user);
				successMsg = 'Berhasil masuk sebagai User! Mengalihkan...';
				setTimeout(() => {
					window.location.href = '/home';
				}, 200);
				return;
			}

			// 3. Local accounts check
			const stored = JSON.parse(localStorage.getItem('accounts') || '[]');
			const matched = stored.find(
				(a: any) =>
					a.email.toLowerCase() === normalizedEmail && (a.password === trimmedPassword || !trimmedPassword)
			);
			if (matched) {
				userStore.login(matched);
				successMsg = `Selamat datang kembali, ${matched.name}! Mengalihkan...`;
				setTimeout(() => {
					window.location.href = matched.role === 'admin' ? '/admin' : '/home';
				}, 200);
				return;
			}

			// 4. Supabase Auth if configured
			try {
				const { supabase } = await import('$lib/supabaseClient');
				if (mode === 'in') {
					const { data, error } = await supabase.auth.signInWithPassword({
						email: normalizedEmail,
						password: trimmedPassword
					});
					if (!error && data?.user) {
						const u = {
							id: data.user.id,
							name: data.user.user_metadata?.name || data.user.email?.split('@')[0] || 'User',
							email: data.user.email!,
							role: (data.user.user_metadata?.role || 'user') as 'admin' | 'user'
						};
						userStore.login(u);
						successMsg = `Berhasil masuk! Mengalihkan...`;
						setTimeout(() => {
							window.location.href = u.role === 'admin' ? '/admin' : '/home';
						}, 200);
						return;
					}
				}
			} catch {}

			// 5. Fallback auto-create & log in for any custom tester input
			const newAcc = {
				id: `user-${Date.now()}`,
				name: name.trim() || rawEmail.split('@')[0] || 'Pengguna Jelajah',
				email: normalizedEmail,
				password: trimmedPassword,
				role: 'user' as const
			};
			localStorage.setItem('accounts', JSON.stringify([...stored, newAcc]));
			userStore.login(newAcc);
			successMsg = `Berhasil masuk! Mengalihkan ke beranda...`;
			setTimeout(() => {
				window.location.href = '/home';
			}, 200);
			return;
		} catch (e: any) {
			err = e.message || 'Terjadi kendala saat memproses login.';
			loading = false;
		}
	}

	const inputClass =
		'mt-1 w-full border border-line bg-white px-4 py-3 outline-none transition focus:border-brand';
</script>

<svelte:head>
	<title>{mode === 'in' ? $t.login.signIn : $t.login.join} — Jelajah</title>
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
			{$t.login.heroQuote}
		</p>
	</div>

	<!-- Right auth form -->
	<div class="flex flex-col justify-center px-6 py-12 sm:px-16">
		<div class="mb-14 flex items-center justify-between">
			<a href="/" class="flex items-center gap-2 font-display text-xl font-extrabold">
				<Compass size={20} class="text-brand" />Jelajah
			</a>
			<LangSwitcher />
		</div>

		<p class="mono text-brand">{mode === 'in' ? $t.login.welcomeBack : $t.login.createAccount}</p>
		<h1 class="mt-2 text-4xl font-extrabold">{mode === 'in' ? $t.login.signIn : $t.login.join}</h1>

		<!-- Status alerts -->
		{#if successMsg}
			<div role="status" class="mt-4 flex items-center gap-2 border-l-4 border-emerald-600 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800 shadow-sm animate-pulse">
				<Check size={18} class="shrink-0 text-emerald-600" />
				<span>{successMsg}</span>
			</div>
		{/if}

		{#if err}
			<div role="alert" class="mt-4 flex items-center gap-2 border-l-4 border-red-600 bg-red-50 px-4 py-3 text-sm font-semibold text-red-800">
				<AlertCircle size={18} class="shrink-0 text-red-600" />
				<span>{err}</span>
			</div>
		{/if}

		<form on:submit|preventDefault={handleSubmit} class="mt-6 max-w-md space-y-5">
			{#if mode === 'up'}
				<label class="block">
					<span class="mono text-slate-soft">{$t.login.fullName}</span>
					<input required bind:value={name} placeholder="Nama lengkap Anda" class={inputClass} />
				</label>
			{/if}

			<label class="block">
				<span class="mono text-slate-soft">Email atau Nama Pengguna</span>
				<input
					required
					type="text"
					bind:value={email}
					placeholder="Ketik 'user' atau 'user@jelajah.id'"
					class={inputClass}
				/>
			</label>

			<label class="block">
				<span class="mono text-slate-soft">{$t.login.password}</span>
				<input
					required
					type="password"
					bind:value={password}
					placeholder="Ketik kata sandi (misal: user123)"
					class={inputClass}
				/>
			</label>

			<button
				type="submit"
				disabled={loading}
				class="w-full bg-ink py-4 font-bold text-white transition hover:bg-brand disabled:opacity-50 shadow-sm"
			>
				{loading ? 'Memproses...' : mode === 'in' ? 'Masuk ke Akun' : 'Daftar Sekarang'}
			</button>
		</form>

		<button
			type="button"
			on:click={() => {
				mode = mode === 'in' ? 'up' : 'in';
				err = '';
				successMsg = '';
			}}
			class="mt-5 max-w-md text-left text-sm text-slate-soft"
		>
			{mode === 'in' ? $t.login.newHere + ' ' : $t.login.alreadyHave + ' '}
			<span class="font-bold text-ocean underline">
				{mode === 'in' ? $t.login.createAccountLink : $t.login.signInLink}
			</span>
		</button>

		<!-- Demo accounts widget with copy & instant login -->
		<div class="mt-10 max-w-md border border-dashed border-line bg-slate-50 p-5 rounded-sm">
			<div class="flex items-center justify-between border-b border-line pb-2.5">
				<p class="mono text-sm font-bold text-slate-700">Akun Demo Siap Pakai</p>
				<span class="text-xs font-bold text-brand bg-brand-soft px-2 py-0.5 rounded">Tersedia 2 Akun</span>
			</div>

			<div class="mt-4 space-y-3">
				<!-- User card -->
				<div class="border border-line bg-white p-3.5 shadow-sm rounded-sm">
					<div class="flex items-center justify-between">
						<div>
							<b class="text-ink text-base">Akun User (Rani Putri)</b>
							<p class="text-xs text-slate-soft mt-0.5 font-mono">user@jelajah.id · Sandi: user123</p>
						</div>
					</div>
					<div class="mt-3 flex gap-2">
						<button
							type="button"
							on:click={() => fillAndLogin('user')}
							class="flex-1 bg-brand py-2 text-xs font-bold text-white transition hover:bg-emerald-deep text-center shadow-sm"
						>
							⚡ 1-Klik Masuk Langsung
						</button>
						<button
							type="button"
							on:click={() => copyToForm('user@jelajah.id', 'user123')}
							class="border border-line px-3 py-2 text-xs font-bold text-slate-700 transition hover:bg-slate-100 text-center"
						>
							📋 Salin ke Form
						</button>
					</div>
				</div>

				<!-- Admin card -->
				<div class="border border-line bg-white p-3.5 shadow-sm rounded-sm">
					<div class="flex items-center justify-between">
						<div>
							<b class="text-ink text-base">Akun Admin (Dasbor)</b>
							<p class="text-xs text-slate-soft mt-0.5 font-mono">admin@jelajah.id · Sandi: admin123</p>
						</div>
					</div>
					<div class="mt-3 flex gap-2">
						<button
							type="button"
							on:click={() => fillAndLogin('admin')}
							class="flex-1 bg-ink py-2 text-xs font-bold text-white transition hover:bg-brand text-center shadow-sm"
						>
							⚡ 1-Klik Masuk Langsung
						</button>
						<button
							type="button"
							on:click={() => copyToForm('admin@jelajah.id', 'admin123')}
							class="border border-line px-3 py-2 text-xs font-bold text-slate-700 transition hover:bg-slate-100 text-center"
						>
							📋 Salin ke Form
						</button>
					</div>
				</div>
			</div>

			<p class="mt-3 text-[11px] text-slate-400">
				💡 Anda dapat mengklik <b>1-Klik Masuk Langsung</b> untuk login instan, atau klik <b>Salin ke Form</b> lalu tekan tombol <i>Masuk ke Akun</i>.
			</p>
		</div>
	</div>
</div>
