<script lang="ts">
	import { enhance } from '$app/forms';
	import { Compass, AlertCircle, Eye, EyeOff, ArrowLeft } from 'lucide-svelte';
	import LangSwitcher from '$components/LangSwitcher.svelte';
	import { t } from '$lib/i18n';
	import type { ActionData, PageData } from './$types';

	export let data: PageData;
	export let form: ActionData;

	let loading = false;
	let showPassword = false;
	let showConfirmPassword = false;

	const inputClass =
		'mt-1 w-full border border-line bg-white px-4 py-3 outline-none transition focus:border-brand';
</script>

<svelte:head>
	<title>{$t.login.resetPasswordTitle} — Jelajah</title>
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

	<!-- Right form container -->
	<div class="flex flex-col justify-center px-6 py-12 sm:px-16">
		<div class="mb-14 flex items-center justify-between">
			<a href="/" class="flex items-center gap-2 font-display text-xl font-extrabold">
				<Compass size={20} class="text-brand" />Jelajah
			</a>
			<LangSwitcher />
		</div>

		<p class="mono text-brand">{$t.login.resetPassword}</p>
		<h1 class="mt-2 text-4xl font-extrabold">{$t.login.resetPasswordTitle}</h1>
		<p class="mt-2 text-sm text-slate-soft">{$t.login.resetPasswordDesc}</p>

		{#if form?.error}
			<div
				role="alert"
				class="mt-4 flex items-center gap-2 border-l-4 border-red-600 bg-red-50 px-4 py-3 text-sm font-semibold text-red-800"
			>
				<AlertCircle size={18} class="shrink-0 text-red-600" />
				<span>{form.message}</span>
			</div>
		{/if}

		{#if !data.hasSession}
			<div
				role="alert"
				class="mt-4 flex items-center gap-2 border-l-4 border-amber-500 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-900"
			>
				<AlertCircle size={18} class="shrink-0 text-amber-600" />
				<span>
					Sesi pemulihan tidak terdeteksi. Silakan buka tautan dari email Anda atau minta tautan reset baru.
				</span>
			</div>
		{/if}

		<form
			method="POST"
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
				<span class="mono text-slate-soft">{$t.login.newPassword}</span>
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
			</label>

			<label class="block">
				<span class="mono text-slate-soft">{$t.login.confirmPassword}</span>
				<div class="relative">
					<input
						required
						type={showConfirmPassword ? 'text' : 'password'}
						name="confirmPassword"
						minlength="8"
						autocomplete="new-password"
						placeholder="Ulangi kata sandi baru"
						class="{inputClass} pr-11"
					/>
					<button
						type="button"
						aria-label={showConfirmPassword ? $t.login.hidePassword : $t.login.showPassword}
						on:click={() => (showConfirmPassword = !showConfirmPassword)}
						class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
					>
						{#if showConfirmPassword}
							<EyeOff size={18} />
						{:else}
							<Eye size={18} />
						{/if}
					</button>
				</div>
			</label>

			<button
				type="submit"
				disabled={loading || !data.hasSession}
				class="w-full bg-ink py-4 font-bold text-white transition hover:bg-brand disabled:opacity-50 shadow-sm"
			>
				{loading ? $t.common.loading : $t.login.saveNewPassword}
			</button>
		</form>

		<a
			href="/login"
			class="mt-6 inline-flex items-center gap-1.5 text-sm text-slate-soft hover:text-ink"
		>
			<ArrowLeft size={15} />
			{$t.login.backToLogin}
		</a>
	</div>
</div>

