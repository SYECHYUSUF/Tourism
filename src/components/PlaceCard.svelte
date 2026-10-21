<script lang="ts">
	import { Star } from 'lucide-svelte';
	import type { Place } from '$lib/types';
	import { priceRange } from '$lib/scoring';
	import { t, locale } from '$lib/i18n';

	export let place: Place;
	export let score: number | undefined = undefined;
	export let distance: number;
</script>

<a href="/places/{place.id}" class="group block">
	<!-- Image -->
	<div class="relative aspect-[4/5] overflow-hidden bg-slate-200">
		<img
			src={place.image}
			alt={place.name}
			loading="lazy"
			class="h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]"
		/>
		<!-- gradient overlay -->
		<div class="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/40 to-transparent" />

		<!-- Match score badge -->
		{#if score !== undefined}
			<div class="absolute left-0 top-0 bg-forest px-3 py-2 text-white">
				<span class="font-display text-3xl font-extrabold leading-none">{score}</span>
				<span class="mono ml-1 text-emerald-300">{$t.common.match}</span>
			</div>
		{/if}

		<!-- Category / Area label -->
		<span class="mono absolute bottom-3 left-3 text-white">{place.category} / {place.area}</span>
	</div>

	<!-- Card body -->
	<div class="mt-4 flex items-start justify-between gap-3">
		<h3
			class="font-display text-xl font-bold leading-tight underline decoration-transparent decoration-2 underline-offset-4 transition group-hover:decoration-brand"
		>
			{place.name}
		</h3>
		<span class="flex items-center gap-1 text-sm font-semibold">
			<Star size={13} class="fill-ink" />{place.rating}
		</span>
	</div>

	<div class="mono mt-2 flex justify-between border-t border-line pt-2 text-slate-soft">
		<span>{distance} {$t.common.km}</span>
		<span class="text-ink">{priceRange(place, $locale === 'en')}</span>
	</div>
</a>
