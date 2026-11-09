<script lang="ts">
	import { onMount } from 'svelte';
	import PlaceCard from '$components/PlaceCard.svelte';
	import { loadPrefs } from '$lib/prefs';
	import { matchScore, distanceKm, originCoords } from '$lib/scoring';
	import { t } from '$lib/i18n';
	import type { PageData } from './$types';
	import type { Place, Prefs } from '$lib/types';

	export let data: PageData;

	let prefs: Prefs;

	onMount(() => {
		prefs = loadPrefs();
	});

	$: list = (data.places || []) as Place[];
	$: origin = prefs ? originCoords(prefs) : ([-8.6913, 115.1682] as [number, number]);
</script>

<svelte:head>
	<title>{$t.wishlist.title} — Jelajah</title>
</svelte:head>

<main class="mx-auto max-w-[1400px] px-5 py-12 lg:px-10">
	<p class="mono text-brand">{$t.wishlist.badge}</p>
	<h1 class="mt-1 text-4xl font-extrabold">{$t.wishlist.title}</h1>

	{#if list.length === 0}
		<div class="mt-10 border border-dashed border-line p-16 text-center text-slate-soft">
			{$t.wishlist.empty}
			<a href="/find" class="font-bold text-ocean underline">{$t.wishlist.exploreLink}</a>
		</div>
	{:else}
		<div class="mt-10 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
			{#each list as p (p.id)}
				<PlaceCard
					place={p}
					score={prefs ? matchScore(p, prefs) : undefined}
					distance={distanceKm(p, origin)}
				/>
			{/each}
		</div>
	{/if}
</main>
