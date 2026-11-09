<script lang="ts">
	import { page } from '$app/stores';
	import { Compass, ShieldAlert, FileQuestion, ServerCrash, ArrowLeft } from 'lucide-svelte';
	import LangSwitcher from '$components/LangSwitcher.svelte';
	import { t } from '$lib/i18n';

	$: status = $page.status;
	$: is403 = status === 403;
	$: is404 = status === 404;

	$: title = is403
		? $t.error.title403
		: is404
			? $t.error.title404
			: $t.error.title500;

	$: desc = is403
		? $t.error.desc403
		: is404
			? $t.error.desc404
			: $t.error.desc500;

	$: user = $page.data.user;
	$: homeUrl = user ? '/home' : '/';
</script>

<svelte:head>
	<title>{status} — {title} · Jelajah</title>
</svelte:head>

<div class="flex min-h-screen flex-col bg-canvas text-ink">
	<!-- Top Navigation -->
	<header class="border-b border-line bg-white/80 backdrop-blur">
		<div class="mx-auto flex h-16 max-w-[1400px] items-center justify-between px-5 lg:px-10">
			<a href={homeUrl} class="flex items-center gap-2 font-display text-2xl font-extrabold tracking-tight">
				<Compass size={22} class="text-brand" />
				Jelajah
			</a>
			<LangSwitcher />
		</div>
	</header>

	<!-- Main Error Showcase -->
	<main class="mx-auto flex flex-1 max-w-2xl flex-col items-center justify-center px-6 py-16 text-center">
		<!-- Status Badge -->
		<div class="mb-4 inline-flex items-center gap-2 rounded-full border border-line bg-white px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-slate-soft shadow-sm">
			{#if is403}
				<ShieldAlert size={14} class="text-red-500" />
			{:else if is404}
				<FileQuestion size={14} class="text-ocean" />
			{:else}
				<ServerCrash size={14} class="text-amber-500" />
			{/if}
			{$t.error.badge}
		</div>

		<!-- Big Status Number -->
		<p class="font-display text-8xl font-black tracking-tighter text-ink sm:text-9xl">
			{status}
		</p>

		<!-- Error Title & Description -->
		<h1 class="mt-4 text-3xl font-extrabold sm:text-4xl">{title}</h1>
		<p class="mt-3 max-w-md text-base text-slate-soft sm:text-lg">{desc}</p>

		{#if $page.error?.message && !is404}
			<p class="mt-2 text-xs font-mono text-slate-400 bg-slate-100 px-3 py-1.5 rounded">
				{$page.error.message}
			</p>
		{/if}

		<!-- Action Buttons -->
		<div class="mt-8 flex flex-wrap items-center justify-center gap-3">
			<a
				href={homeUrl}
				class="inline-flex items-center gap-2 bg-ink px-8 py-3.5 font-bold text-white transition hover:bg-brand shadow-sm"
			>
				{$t.error.backHome}
			</a>
			<button
				type="button"
				on:click={() => history.back()}
				class="inline-flex items-center gap-2 border border-line bg-white px-6 py-3.5 font-bold text-slate-700 transition hover:bg-slate-50 shadow-sm"
			>
				<ArrowLeft size={16} />
				Kembali
			</button>
		</div>
	</main>
</div>

