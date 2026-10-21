<script lang="ts">
	import { onMount } from 'svelte';
	import PlaceCard from '$components/PlaceCard.svelte';
	import { getPlaces, getWishlist } from '$lib/data';
	import { loadPrefs } from '$lib/prefs';
	import { matchScore, distanceKm, originCoords } from '$lib/scoring';
	import { t } from '$lib/i18n';
	import type { Place, Prefs } from '$lib/types';

	let allPlaces: Place[] = [];
	let savedIds: string[] = [];
	let prefs: Prefs;
	let userEmail: string | null = null;

	onMount(async () => {
		prefs = loadPrefs();
		allPlaces = getPlaces();

		const { supabase } = await import('$lib/supabaseClient');
		const {
			data: { session }
		} = await supabase.auth.getSession();
		if (session?.user?.email) {
			userEmail = session.user.email;
		} else {
			try {
				const sess = JSON.parse(localStorage.getItem('session') || 'null');
				if (sess?.email) userEmail = sess.email;
			} catch {}
		}

		if (userEmail) {
			savedIds = getWishlist(userEmail);
		}
	});

	$: list = allPlaces.filter((p) => savedIds.includes(p.id));
	$: origin = prefs ? originCoords(prefs) : [-8.6913, 115.1682];
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
			<a href="/results" class="font-bold text-ocean underline">{$t.wishlist.exploreLink}</a>
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
