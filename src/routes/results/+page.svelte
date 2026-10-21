<script lang="ts">
	import { onMount } from 'svelte';
	import { SlidersHorizontal, Pencil, Search } from 'lucide-svelte';
	import PlaceCard from '$components/PlaceCard.svelte';
	import { getPlaces, getCategories } from '$lib/data';
	import { loadPrefs } from '$lib/prefs';
	import { matchScore, distanceKm, originCoords } from '$lib/scoring';
	import { t, locale } from '$lib/i18n';
	import type { Place, Prefs } from '$lib/types';

	let prefs: Prefs = {
		categories: ['Culinary', 'Beach'],
		min: 25000,
		max: 500000,
		radius: 20,
		priority: 'balanced',
		origin: 'Seminyak'
	};

	let allPlaces: Place[] = [];
	let categoriesList: string[] = [];

	let q = '';
	let sort = 'match';
	let maxPrice = 2500000;
	let maxDist = 60;
	let minRating = 0;
	let selectedCats: string[] = [];
	let openMobileFilters = false;

	onMount(() => {
		prefs = loadPrefs();
		allPlaces = getPlaces();
		categoriesList = getCategories();
		maxDist = Math.max(60, prefs.radius * 2);
		maxPrice = Math.max(2500000, prefs.max * 2);
	});

	function toggleCat(c: string) {
		selectedCats = selectedCats.includes(c)
			? selectedCats.filter((x) => x !== c)
			: [...selectedCats, c];
	}

	$: origin = originCoords(prefs);

	$: list = (() => {
		const term = q.trim().toLowerCase();
		const items = allPlaces
			.map((p) => ({
				p,
				s: matchScore(p, prefs),
				d: distanceKm(p, origin)
			}))
			.filter(
				({ p, d }) =>
					p.priceMin <= maxPrice &&
					p.rating >= minRating &&
					d <= maxDist &&
					(selectedCats.length === 0 || selectedCats.includes(p.category)) &&
					(!term ||
						[p.name, p.category, p.area, ...p.tags].join(' ').toLowerCase().includes(term))
			);

		const by: Record<string, (a: (typeof items)[0], b: (typeof items)[0]) => number> = {
			match: (a, b) => b.s - a.s,
			rating: (a, b) => b.p.rating - a.p.rating,
			price: (a, b) => a.p.priceMin - b.p.priceMin,
			distance: (a, b) => a.d - b.d
		};

		return items.sort(by[sort] ?? by.match);
	})();
</script>

<svelte:head>
	<title>{$t.results.title} — Jelajah</title>
</svelte:head>

<main class="mx-auto max-w-[1400px] px-5 py-10 lg:px-10">
	<!-- Page Header -->
	<div class="flex flex-wrap items-end justify-between gap-4">
		<div>
			<p class="mono text-brand">{$t.results.badge}</p>
			<h1 class="mt-1 text-4xl font-extrabold tracking-tight">{$t.results.title}</h1>
			<p class="mt-2 text-slate-soft">
				{list.length} tempat · {prefs.categories.join(', ') || $t.common.any} · Rp {prefs.min.toLocaleString('id-ID')}–Rp {prefs.max.toLocaleString('id-ID')}
				· {prefs.radius} km {$t.find.fromOrigin} {prefs.coords ? $t.find.you : prefs.origin}
			</p>
		</div>
		<div class="flex gap-2">
			<a
				href="/find"
				class="inline-flex items-center gap-2 border border-line bg-white px-4 py-2 text-sm font-semibold hover:border-brand"
			>
				<Pencil size={14} />{$t.results.editPrefs}
			</a>
			<button
				type="button"
				on:click={() => (openMobileFilters = !openMobileFilters)}
				class="inline-flex items-center gap-2 bg-ink px-4 py-2 text-sm font-semibold text-white lg:hidden"
			>
				<SlidersHorizontal size={14} />{$t.results.filterBtn}
			</button>
		</div>
	</div>

	<!-- Search bar -->
	<label
		class="mt-6 flex items-center gap-3 border border-line bg-white px-4 py-3 focus-within:border-brand"
	>
		<Search size={18} class="text-slate-400" />
		<input
			bind:value={q}
			placeholder={$t.results.searchPlaceholder}
			class="w-full bg-transparent outline-none"
			aria-label={$t.results.searchPlaceholder}
		/>
	</label>

	<!-- Mobile Filters Drawer -->
	{#if openMobileFilters}
		<div class="mt-6 border border-line bg-white p-5 lg:hidden">
			<!-- Sorting -->
			<div>
				<h3 class="mono text-slate-soft">{$t.results.sortBy}</h3>
				<div class="mt-3 space-y-2">
					{#each [['match', $t.results.sortOptions.match], ['rating', $t.results.sortOptions.rating], ['price', $t.results.sortOptions.price], ['distance', $t.results.sortOptions.distance]] as [v, l]}
						<label class="flex cursor-pointer items-center gap-3 text-sm font-medium">
							<input
								type="radio"
								name="sort-mobile"
								value={v}
								bind:group={sort}
								class="accent-emerald-600"
							/>
							{l}
						</label>
					{/each}
				</div>
			</div>

			<!-- Categories -->
			<div class="mt-6">
				<h3 class="mono text-slate-soft">{$t.results.categoryFilter}</h3>
				<div class="mt-3 flex flex-wrap gap-2">
					{#each categoriesList as c}
						<button
							type="button"
							on:click={() => toggleCat(c)}
							aria-pressed={selectedCats.includes(c)}
							class="border px-3 py-1.5 text-sm font-semibold transition {selectedCats.includes(c)
								? 'border-brand bg-brand text-white'
								: 'border-line bg-white hover:border-slate-400'}"
						>
							{c}
						</button>
					{/each}
				</div>
			</div>

			<!-- Max Price -->
			<div class="mt-6">
				<div class="flex justify-between">
					<h3 class="mono text-slate-soft">{$t.results.maxPrice}</h3>
					<span class="text-sm font-bold">Rp {maxPrice.toLocaleString('id-ID')}</span>
				</div>
				<input
					type="range"
					min="25000"
					max="2500000"
					step="25000"
					bind:value={maxPrice}
					class="mt-3 w-full"
				/>
			</div>

			<!-- Max Distance -->
			<div class="mt-6">
				<div class="flex justify-between">
					<h3 class="mono text-slate-soft">{$t.results.maxDistance}</h3>
					<span class="text-sm font-bold">{maxDist} km</span>
				</div>
				<input
					type="range"
					min="1"
					max="60"
					bind:value={maxDist}
					class="mt-3 w-full"
				/>
			</div>

			<!-- Min Rating -->
			<div class="mt-6">
				<h3 class="mono text-slate-soft">{$t.results.minRating}</h3>
				<div class="mt-3 flex gap-2">
					{#each [0, 4, 4.5, 4.8] as r}
						<button
							type="button"
							on:click={() => (minRating = r)}
							class="border px-3 py-1.5 text-sm font-semibold transition {minRating === r
								? 'border-brand bg-brand text-white'
								: 'border-line bg-white hover:border-slate-400'}"
						>
							{r === 0 ? ($locale === 'id' ? 'Semua' : 'Any') : `${r}+`}
						</button>
					{/each}
				</div>
			</div>
		</div>
	{/if}

	<!-- Layout Grid: Aside Filters + Result Cards -->
	<div class="mt-8 grid gap-10 lg:grid-cols-[270px_1fr]">
		<!-- Desktop Aside Filters -->
		<aside class="hidden h-fit border border-line bg-white p-6 lg:sticky lg:top-24 lg:block">
			<div class="space-y-8">
				<div>
					<h3 class="mono text-slate-soft">{$t.results.sortBy}</h3>
					<div class="mt-3 space-y-2">
						{#each [['match', $t.results.sortOptions.match], ['rating', $t.results.sortOptions.rating], ['price', $t.results.sortOptions.price], ['distance', $t.results.sortOptions.distance]] as [v, l]}
							<label class="flex cursor-pointer items-center gap-3 text-sm font-medium">
								<input
									type="radio"
									name="sort"
									value={v}
									bind:group={sort}
									class="accent-emerald-600"
								/>
								{l}
							</label>
						{/each}
					</div>
				</div>

				<div>
					<h3 class="mono text-slate-soft">{$t.results.categoryFilter}</h3>
					<div class="mt-3 flex flex-wrap gap-2">
						{#each categoriesList as c}
							<button
								type="button"
								on:click={() => toggleCat(c)}
								aria-pressed={selectedCats.includes(c)}
								class="border px-3 py-1.5 text-sm font-semibold transition {selectedCats.includes(c)
									? 'border-brand bg-brand text-white'
									: 'border-line bg-white hover:border-slate-400'}"
							>
								{c}
							</button>
						{/each}
					</div>
				</div>

				<div>
					<div class="flex justify-between">
						<h3 class="mono text-slate-soft">{$t.results.maxPrice}</h3>
						<span class="text-sm font-bold">Rp {maxPrice.toLocaleString('id-ID')}</span>
					</div>
					<input
						type="range"
						min="25000"
						max="2500000"
						step="25000"
						bind:value={maxPrice}
						class="mt-3 w-full"
						aria-label={$t.results.maxPrice}
					/>
				</div>

				<div>
					<div class="flex justify-between">
						<h3 class="mono text-slate-soft">{$t.results.maxDistance}</h3>
						<span class="text-sm font-bold">{maxDist} km</span>
					</div>
					<input
						type="range"
						min="1"
						max="60"
						bind:value={maxDist}
						class="mt-3 w-full"
						aria-label={$t.results.maxDistance}
					/>
				</div>

				<div>
					<h3 class="mono text-slate-soft">{$t.results.minRating}</h3>
					<div class="mt-3 flex gap-2">
						{#each [0, 4, 4.5, 4.8] as r}
							<button
								type="button"
								on:click={() => (minRating = r)}
								class="border px-3 py-1.5 text-sm font-semibold transition {minRating === r
									? 'border-brand bg-brand text-white'
									: 'border-line bg-white hover:border-slate-400'}"
							>
								{r === 0 ? ($locale === 'id' ? 'Semua' : 'Any') : `${r}+`}
							</button>
						{/each}
					</div>
				</div>
			</div>
		</aside>

		<!-- Cards Grid -->
		<div class="grid gap-x-6 gap-y-10 sm:grid-cols-2 xl:grid-cols-3">
			{#each list as { p, s, d } (p.id)}
				<PlaceCard place={p} score={s} distance={d} />
			{/each}
			{#if list.length === 0}
				<p class="col-span-full border border-dashed border-line p-12 text-center text-slate-soft">
					{$t.results.emptyState}
				</p>
			{/if}
		</div>
	</div>
</main>
