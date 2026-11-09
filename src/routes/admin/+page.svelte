<script lang="ts">
	import { Star } from 'lucide-svelte';
	import { t } from '$lib/i18n';
	import type { PageData } from './$types';

	export let data: PageData;

	$: stats = [
		[$t.admin.stats.places, data.stats.places.toLocaleString('id-ID'), ''],
		[$t.admin.stats.reviews, data.stats.reviews.toLocaleString('id-ID'), $t.admin.f.hiddenCount.replace('{n}', String(data.stats.hiddenReviews))],
		[$t.admin.stats.users, data.stats.users.toLocaleString('id-ID'), ''],
		[$t.admin.stats.searches, data.stats.searches.toLocaleString('id-ID'), $t.admin.f.last30]
	];

	// Grafik batang SVG ringan (tanpa library)
	const W = 600;
	const H = 140;
	$: maxDay = Math.max(1, ...data.searchesPerDay.map(([, v]) => v));
	$: barW = W / Math.max(1, data.searchesPerDay.length);
	$: maxCat = Math.max(1, ...data.topCategories.map(([, v]) => v));
	$: maxPlace = Math.max(1, ...data.topPlaces.map((p) => p.reviewCount));
</script>

<svelte:head>
	<title>{$t.admin.tabs.dashboard} — {$t.admin.title}</title>
</svelte:head>

<div class="space-y-8">
	<div>
		<p class="mono text-brand">{$t.admin.title}</p>
		<h1 class="text-3xl font-extrabold tracking-tight">{$t.admin.tabs.dashboard}</h1>
	</div>

	<div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
		{#each stats as [l, v, sub]}
			<div class="border border-line bg-white p-5">
				<p class="mono text-slate-soft">{l}</p>
				<p class="mt-2 font-display text-4xl font-extrabold">{v}</p>
				{#if sub}<p class="mt-1 text-xs text-slate-soft">{sub}</p>{/if}
			</div>
		{/each}
	</div>

	<section class="border border-line bg-white p-6">
		<h2 class="font-display text-xl font-bold">{$t.admin.f.searchesPerDay}</h2>
		<p class="mono mb-5 mt-1 text-slate-soft">{$t.admin.f.last30}</p>
		{#if data.stats.searches === 0}
			<p class="text-sm text-slate-soft">{$t.admin.f.noSearches}</p>
		{:else}
			<svg viewBox="0 0 {W} {H + 20}" class="h-auto w-full" role="img" aria-label={$t.admin.f.searchesPerDay}>
				{#each data.searchesPerDay as [day, v], i}
					{@const h = (v / maxDay) * H}
					<rect x={i * barW + 1} y={H - h} width={barW - 2} height={h} class="fill-brand">
						<title>{day}: {v}</title>
					</rect>
				{/each}
				<line x1="0" y1={H} x2={W} y2={H} class="stroke-line" />
				<text x="0" y={H + 15} class="fill-slate-400 text-[10px]">{data.searchesPerDay[0]?.[0]}</text>
				<text x={W} y={H + 15} text-anchor="end" class="fill-slate-400 text-[10px]">
					{data.searchesPerDay[data.searchesPerDay.length - 1]?.[0]}
				</text>
				<text x={W} y="10" text-anchor="end" class="fill-slate-400 text-[10px]">max {maxDay}</text>
			</svg>
		{/if}
	</section>

	<div class="grid gap-6 xl:grid-cols-2">
		<section class="border border-line bg-white p-6">
			<h2 class="font-display text-xl font-bold">{$t.admin.topPlaces}</h2>
			<p class="mono mb-5 mt-1 text-slate-soft">{$t.admin.topPlacesSub}</p>
			<ul class="space-y-4">
				{#each data.topPlaces as p}
					<li>
						<div class="flex justify-between text-sm">
							<a href="/places/{p.id}" class="font-semibold hover:underline">{p.name}</a>
							<span class="mono text-slate-soft">{p.reviewCount.toLocaleString('id-ID')}</span>
						</div>
						<div class="mt-1.5 h-2 bg-slate-100">
							<div class="h-2 bg-brand" style="width: {(p.reviewCount / maxPlace) * 100}%" />
						</div>
					</li>
				{/each}
			</ul>
		</section>

		<section class="border border-line bg-white p-6">
			<h2 class="font-display text-xl font-bold">{$t.admin.topCats}</h2>
			<p class="mono mb-5 mt-1 text-slate-soft">{$t.admin.topCatsSub}</p>
			{#if data.topCategories.length === 0}
				<p class="text-sm text-slate-soft">{$t.admin.f.noSearches}</p>
			{:else}
				<ul class="space-y-4">
					{#each data.topCategories as [l, v]}
						<li>
							<div class="flex justify-between text-sm">
								<span class="font-semibold">{l}</span>
								<span class="mono text-slate-soft">{v.toLocaleString('id-ID')}</span>
							</div>
							<div class="mt-1.5 h-2 bg-slate-100">
								<div class="h-2 bg-brand" style="width: {(v / maxCat) * 100}%" />
							</div>
						</li>
					{/each}
				</ul>
			{/if}
		</section>
	</div>

	<section class="border border-line bg-white p-6">
		<div class="flex items-center justify-between">
			<h2 class="font-display text-xl font-bold">{$t.admin.f.latestReviews}</h2>
			<a href="/admin/reviews" class="text-sm font-semibold text-ocean hover:underline">{$t.admin.tabs.reviews}</a>
		</div>
		{#if data.latestReviews.length === 0}
			<p class="mt-4 text-sm text-slate-soft">{$t.admin.f.noReviews}</p>
		{:else}
			<ul class="mt-4 divide-y divide-line">
				{#each data.latestReviews as r (r.id)}
					<li class="py-3 text-sm {r.hidden ? 'text-slate-400' : ''}">
						<div class="flex flex-wrap items-center gap-2">
							<span class="font-bold">{r.reviewerName}</span>
							<a href="/places/{r.placeId}" class="text-slate-soft hover:underline">{r.placeName}</a>
							<span class="flex items-center gap-1"><Star size={12} class="fill-amber-400 text-amber-400" />{r.rating}</span>
							<span class="mono ml-auto text-xs text-slate-400">{r.createdAt}</span>
						</div>
						<p class="mt-1 line-clamp-1">{r.reviewText}</p>
					</li>
				{/each}
			</ul>
		{/if}
	</section>
</div>
