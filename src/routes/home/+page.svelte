<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { ArrowRight, ArrowDown } from 'lucide-svelte';
	import PlaceCard from '$components/PlaceCard.svelte';
	import { getPlaces, getCategories } from '$lib/data';
	import { loadPrefs, savePrefs } from '$lib/prefs';
	import { matchScore, distanceKm, originCoords } from '$lib/scoring';
	import type { Place, Prefs } from '$lib/types';

	const hero =
		'https://images.unsplash.com/photo-1558005530-a7958896ec60?w=2400&fit=crop&auto=format&q=80';

	let user: any = null;
	let prefs: Prefs;
	let places: Place[] = [];
	let categories: string[] = [];

	let cat = 'Culinary';
	let budget = 50;
	let radius = 20;

	onMount(async () => {
		prefs = loadPrefs();
		places = getPlaces();
		categories = getCategories();

		// Check session
		const { supabase } = await import('$lib/supabaseClient');
		const {
			data: { session }
		} = await supabase.auth.getSession();
		if (session?.user) {
			user = {
				name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'there',
				email: session.user.email
			};
		} else {
			try {
				const sess = JSON.parse(localStorage.getItem('session') || 'null');
				if (sess) user = sess;
			} catch {}
		}
	});

	$: first = user?.name ? user.name.split(' ')[0] : 'there';
	$: origin = prefs ? originCoords(prefs) : [-8.6913, 115.1682];

	$: topMatches = places
		.map((p) => ({
			p,
			s: prefs ? matchScore(p, prefs) : 80,
			d: distanceKm(p, origin)
		}))
		.sort((a, b) => b.s - a.s)
		.slice(0, 4);

	function go() {
		const np: Prefs = {
			...(prefs || loadPrefs()),
			categories: [cat],
			max: budget,
			radius
		};
		savePrefs(np);
		goto('/results');
	}

	const field = 'w-full bg-transparent py-1 font-display text-lg font-bold outline-none';
</script>

<svelte:head>
	<title>Home — Jelajah</title>
</svelte:head>

<main>
	<!-- Hero with search input -->
	<section
		class="relative flex h-[100svh] min-h-[640px] flex-col justify-end overflow-hidden bg-forest text-white"
	>
		<img
			src={hero}
			alt="Green rice terraces below a misty mountain at dawn"
			class="absolute inset-0 h-full w-full object-cover"
		/>
		<div class="absolute inset-0 bg-gradient-to-t from-forest via-forest/40 to-forest/30" />
		<div class="relative mx-auto w-full max-w-[1400px] px-5 pb-8 lg:px-10">
			<p class="mono rise text-emerald-300" style="animation-delay: .1s">
				Welcome back, {first}
			</p>
			<h1
				class="rise mt-5 max-w-5xl font-display text-[clamp(3rem,9vw,8.5rem)] font-extrabold leading-[0.92]"
				style="animation-delay: .2s"
			>
				Hi {first},<br />where to <span class="text-emerald-300">next?</span>
			</h1>

			<!-- Quick Preference Form -->
			<div
				class="rise mt-10 grid border border-white/20 bg-white text-ink lg:grid-cols-[1fr_1fr_1fr_auto]"
				style="animation-delay: .4s"
			>
				<label class="border-b border-line p-4 lg:border-b-0 lg:border-r">
					<span class="mono text-slate-soft">Category</span>
					<select bind:value={cat} class={field}>
						{#each categories as c}
							<option>{c}</option>
						{/each}
					</select>
				</label>
				<label class="border-b border-line p-4 lg:border-b-0 lg:border-r">
					<span class="mono flex justify-between text-slate-soft">
						<span>Max budget</span><span>${budget}</span>
					</span>
					<input
						type="range"
						min="5"
						max="300"
						step="5"
						bind:value={budget}
						class="mt-2 w-full"
					/>
				</label>
				<label class="border-b border-line p-4 lg:border-b-0 lg:border-r">
					<span class="mono flex justify-between text-slate-soft">
						<span>Distance</span><span>{radius} km</span>
					</span>
					<input type="range" min="1" max="50" bind:value={radius} class="mt-2 w-full" />
				</label>
				<button
					type="button"
					on:click={go}
					class="group flex items-center justify-center gap-3 bg-brand px-10 py-5 font-bold text-white transition hover:bg-emerald-deep"
				>
					Find matches
					<ArrowRight size={18} class="transition group-hover:translate-x-1" />
				</button>
			</div>

			<div class="mono mt-6 flex items-center justify-between text-white/60">
				<span>2,400 places · 38k reviews</span>
				<a href="/find" class="flex items-center gap-2 hover:text-white">
					Full preference form <ArrowDown size={12} />
				</a>
			</div>
		</div>
	</section>

	<!-- Current preferences summary bar -->
	{#if prefs}
		<section class="border-b border-line bg-white">
			<div
				class="mx-auto flex max-w-[1400px] flex-wrap items-center justify-between gap-4 px-5 py-5 lg:px-10"
			>
				<p class="mono text-slate-soft">Your preferences</p>
				<div class="flex flex-wrap gap-x-8 gap-y-2 text-sm font-semibold">
					<span>{prefs.categories.join(', ') || 'Any category'}</span>
					<span>${prefs.min}–${prefs.max}</span>
					<span>within {prefs.radius} km</span>
					<span class="capitalize">{prefs.priority} weights</span>
				</div>
				<a href="/find" class="mono border-b border-brand pb-0.5 text-brand">Edit →</a>
			</div>
		</section>
	{/if}

	<!-- Top matches grid -->
	<section class="mx-auto max-w-[1400px] px-5 pt-24 lg:px-10">
		<div class="flex items-end justify-between border-b border-ink pb-4">
			<div>
				<p class="mono text-brand">Picked for you</p>
				<h2 class="mt-2 text-4xl font-extrabold sm:text-5xl">Your top matches</h2>
			</div>
			<a href="/results" class="mono hover:text-brand">View all →</a>
		</div>
		<div class="mt-10 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
			{#each topMatches as { p, s, d }, i (p.id)}
				<div class={i % 2 ? 'lg:mt-12' : ''}>
					<PlaceCard place={p} score={s} distance={d} />
				</div>
			{/each}
		</div>
	</section>

	<!-- Category visual cards -->
	<section class="mx-auto mt-28 grid max-w-[1400px] gap-px bg-line px-0 lg:grid-cols-3">
		{#if places.length >= 4}
			{#each [['Culinary', places[0].image], ['Beach', places[2].image], ['Culture', places[3].image]] as [c, img]}
				<a
					href="/results"
					class="group relative block aspect-[4/3] overflow-hidden bg-slate-200 lg:aspect-[3/4]"
				>
					<img
						src={img}
						alt={c}
						class="h-full w-full object-cover transition duration-700 group-hover:scale-105"
					/>
					<div class="absolute inset-0 bg-gradient-to-t from-forest/80 to-transparent" />
					<div class="absolute bottom-6 left-6 text-white">
						<p class="mono text-emerald-300">Browse</p>
						<p class="font-display text-4xl font-extrabold">{c}</p>
					</div>
				</a>
			{/each}
		{/if}
	</section>
</main>
