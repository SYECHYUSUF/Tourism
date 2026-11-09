<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { enhance } from '$app/forms';
	import { Compass, Check, AlertCircle, Eye, EyeOff, ArrowLeft } from 'lucide-svelte';
	import LangSwitcher from '$components/LangSwitcher.svelte';
	import { t } from '$lib/i18n';
	import type { ActionData, PageData } from './$types';

	export let data: PageData;
	export let form: ActionData;

	type Mode = 'in' | 'up' | 'forgot';
	let mode: Mode = 'in';

	let loading = false;
	let showPassword = false;

	onMount(() => {
		const m = $page.url.searchParams.get('mode');
		if (m === 'register') {
			mode = 'up';
		} else if (m === 'forgot') {
			mode = 'forgot';
		}
	});

	const inputClass =
		'mt-1 w-full border border-line bg-white px-4 py-3 outline-none transition focus:border-brand';
</script>

<svelte:head>
	<title>
		{mode === 'in'
			? $t.login.signIn
			: mode === 'up'
				? $t.login.join
				: $t.login.resetPassword} — Jelajah
	</title>
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

		<p class="mono text-brand">
			{#if mode === 'in'}
				{$t.login.welcomeBack}
			{:else if mode === 'up'}
				{$t.login.createAccount}
			{:else}
				{$t.login.resetPassword}
			{/if}
		</p>

		<h1 class="mt-2 text-4xl font-extrabold">
			{#if mode === 'in'}
				{$t.login.signIn}
			{:else if mode === 'up'}
				{$t.login.join}
			{:else}
				{$t.login.resetPasswordTitle}
			{/if}
		</h1>

		<!-- Status Alerts -->
		{#if form?.registerSuccess || form?.forgotSuccess}
			<div
				role="status"
				class="mt-4 flex items-center gap-2 border-l-4 border-emerald-600 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800 shadow-sm"
			>
				<Check size={18} class="shrink-0 text-emerald-600" />
				<span>{form.message}</span>
			</div>
		{/if}

		{#if form?.loginError || form?.registerError || form?.forgotError}
			<div
				role="alert"
				class="mt-4 flex items-center gap-2 border-l-4 border-red-600 bg-red-50 px-4 py-3 text-sm font-semibold text-red-800"
			>
				<AlertCircle size={18} class="shrink-0 text-red-600" />
				<span>{form.message}</span>
			</div>
		{/if}

		{#if $page.url.searchParams.get('reset') === 'success'}
			<div
				role="status"
				class="mt-4 flex items-center gap-2 border-l-4 border-emerald-600 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800 shadow-sm"
			>
				<Check size={18} class="shrink-0 text-emerald-600" />
				<span>{$t.login.resetSuccess}</span>
			</div>
		{/if}

		{#if $page.url.searchParams.get('error') === 'auth_callback_failed'}
			<div
				role="alert"
				class="mt-4 flex items-center gap-2 border-l-4 border-red-600 bg-red-50 px-4 py-3 text-sm font-semibold text-red-800"
			>
				<AlertCircle size={18} class="shrink-0 text-red-600" />
				<span>Tautan verifikasi telah kedaluwarsa atau tidak valid. Silakan coba lagi.</span>
			</div>
		{/if}

		<!-- LOGIN FORM -->
		{#if mode === 'in'}
			<form
				method="POST"
				action="?/login"
				use:enhance={() => {
					loading = true;
					return async ({ update }) => {
						loading = false;
						await update();
					};
				}}
				class="mt-6 max-w-md space-y-5"
			>
				<label class="block">
					<span class="mono text-slate-soft">{$t.login.email}</span>
					<input
						required
						type="email"
						name="email"
						autocomplete="email"
						value={form?.email || ''}
						placeholder="contoh@jelajah.id"
						class={inputClass}
					/>
				</label>

				<label class="block">
					<div class="flex items-center justify-between">
						<span class="mono text-slate-soft">{$t.login.password}</span>
						<button
							type="button"
							on:click={() => (mode = 'forgot')}
							class="text-xs text-ocean hover:underline"
						>
							{$t.login.forgotPassword}
						</button>
					</div>
					<div class="relative">
						<input
							required
							type={showPassword ? 'text' : 'password'}
							name="password"
							minlength="8"
							autocomplete="current-password"
							placeholder="Minimal 8 karakter"
							class="{inputClass} pr-11"
						/>
						<button
							type="button"
							aria-label={showPassword ? $t.login.hidePassword : $t.login.showPassword}
							on:click={() => (showPassword = !showPassword)}
							class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
						>
							{#if showPassword}
								<EyeOff size={18} />
							{:else}
								<Eye size={18} />
							{/if}
						</button>
					</div>
				</label>

				<button
					type="submit"
					disabled={loading}
					class="w-full bg-ink py-4 font-bold text-white transition hover:bg-brand disabled:opacity-50 shadow-sm"
				>
					{loading ? $t.common.loading : $t.login.signInBtn}
				</button>
			</form>

			<button
				type="button"
				on:click={() => (mode = 'up')}
				class="mt-5 max-w-md text-left text-sm text-slate-soft"
			>
				{$t.login.newHere}{' '}
				<span class="font-bold text-ocean underline">
					{$t.login.createAccountLink}
				</span>
			</button>

		<!-- REGISTER FORM -->
		{:else if mode === 'up'}
			<form
				method="POST"
				action="?/register"
				use:enhance={() => {
					loading = true;
					return async ({ update }) => {
						loading = false;
						await update();
					};
				}}
				class="mt-6 max-w-md space-y-5"
			>
				<label class="block">
					<span class="mono text-slate-soft">{$t.login.fullName}</span>
					<input
						required
						type="text"
						name="name"
						minlength="2"
						maxlength="60"
						autocomplete="name"
						value={form?.name || ''}
						placeholder="Nama lengkap Anda"
						class={inputClass}
					/>
				</label>

				<label class="block">
					<span class="mono text-slate-soft">{$t.login.email}</span>
					<input
						required
						type="email"
						name="email"
						autocomplete="email"
						value={form?.email || ''}
						placeholder="contoh@jelajah.id"
						class={inputClass}
					/>
				</label>

				<label class="block">
					<span class="mono text-slate-soft">{$t.login.password}</span>
					<div class="relative">
						<input
							required
							type={showPassword ? 'text' : 'password'}
							name="password"
							minlength="8"
							autocomplete="new-password"
							placeholder="Minimal 8 karakter (huruf & angka)"
							class="{inputClass} pr-11"
						/>
						<button
							type="button"
							aria-label={showPassword ? $t.login.hidePassword : $t.login.showPassword}
							on:click={() => (showPassword = !showPassword)}
							class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
						>
							{#if showPassword}
								<EyeOff size={18} />
							{:else}
								<Eye size={18} />
							{/if}
						</button>
					</div>
					<p class="mt-1 text-xs text-slate-soft">{$t.login.passwordRules}</p>
				</label>

				<button
					type="submit"
					disabled={loading}
					class="w-full bg-ink py-4 font-bold text-white transition hover:bg-brand disabled:opacity-50 shadow-sm"
				>
					{loading ? $t.common.loading : $t.login.registerBtn}
				</button>
			</form>

			<button
				type="button"
				on:click={() => (mode = 'in')}
				class="mt-5 max-w-md text-left text-sm text-slate-soft"
			>
				{$t.login.alreadyHave}{' '}
				<span class="font-bold text-ocean underline">
					{$t.login.signInLink}
				</span>
			</button>

		<!-- FORGOT PASSWORD FORM -->
		{:else if mode === 'forgot'}
			<div class="mt-4 max-w-md">
				<p class="text-sm text-slate-soft">{$t.login.resetInstruction}</p>
			</div>

			<form
				method="POST"
				action="?/forgot"
				use:enhance={() => {
					loading = true;
					return async ({ update }) => {
						loading = false;
						await update();
					};
				}}
				class="mt-6 max-w-md space-y-5"
			>
				<label class="block">
					<span class="mono text-slate-soft">{$t.login.email}</span>
					<input
						required
						type="email"
						name="email"
						autocomplete="email"
						value={form?.email || ''}
						placeholder="contoh@jelajah.id"
						class={inputClass}
					/>
				</label>

				<button
					type="submit"
					disabled={loading}
					class="w-full bg-ink py-4 font-bold text-white transition hover:bg-brand disabled:opacity-50 shadow-sm"
				>
					{loading ? $t.common.loading : $t.login.sendResetLink}
				</button>
			</form>

			<button
				type="button"
				on:click={() => (mode = 'in')}
				class="mt-5 inline-flex items-center gap-1.5 text-sm text-slate-soft hover:text-ink"
			>
				<ArrowLeft size={15} />
				{$t.login.backToLogin}
			</button>
		{/if}

		<!-- Optional Demo Notice (Only displayed if PUBLIC_DEMO_MODE=true in environment) -->
		{#if data.demoMode}
			<div class="mt-10 max-w-md border border-dashed border-line bg-slate-50 p-5 rounded-sm">
				<p class="mono text-xs font-bold uppercase tracking-wider text-slate-700">
					{$t.login.demoTitle}
				</p>
				<p class="mt-1 text-xs text-slate-500">
					{$t.login.demoNotice}
				</p>
				<div class="mt-3 space-y-2 text-xs">
					<div class="rounded border border-line bg-white p-2.5">
						<b class="text-ink">Admin:</b>
						<span class="font-mono text-slate-600"> admin@jelajah.id</span> · Sandi: <span class="font-mono">admin123</span>
					</div>
					<div class="rounded border border-line bg-white p-2.5">
						<b class="text-ink">User:</b>
						<span class="font-mono text-slate-600"> user@jelajah.id</span> · Sandi: <span class="font-mono">user123</span>
					</div>
				</div>
			</div>
		{/if}
	</div>
</div>
