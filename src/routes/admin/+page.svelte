<script lang="ts">
	import { t } from '$lib/i18n';
	import type { Place, Review } from '$lib/types';
	import type { PageData } from './$types';

	export let data: PageData;

	interface Acct {
		name: string;
		email: string;
		role: 'admin' | 'user';
		locked?: boolean;
	}

	const seedUsers: Acct[] = [
		{ name: 'Admin Jelajah', email: 'admin@jelajah.id', role: 'admin', locked: true },
		{ name: 'Rani Putri', email: 'user@jelajah.id', role: 'user', locked: true }
	];

	$: places = data.places || [];
	$: reviews = data.reviews || [];

	// Analytics report
	$: report = (() => {
		const baseline: Record<string, number> = {
			Culinary: 420,
			Cafe: 310,
			Beach: 280,
			Nature: 190,
			Culture: 160,
			Resort: 90
		};
		const topCats = Object.entries(baseline)
			.sort((a, b) => b[1] - a[1])
			.slice(0, 6);
		const topPlaces = places
			.map(
				(p) =>
					[p.name, p.reviewCount + reviews.filter((r) => r.placeId === p.id).length] as [
						string,
						number
					]
			)
			.sort((a, b) => b[1] - a[1])
			.slice(0, 5);
		return { topCats, topPlaces, searches: 1840 };
	})();

	$: stats = [
		[$t.admin.stats.places, String(places.length)],
		[$t.admin.stats.reviews, String(reviews.length)],
		[$t.admin.stats.users, String(seedUsers.length)],
		[$t.admin.stats.searches, report.searches.toLocaleString()]
	];
</script>

<svelte:head>
	<title>{$t.admin.tabs.dashboard} — {$t.admin.title}</title>
</svelte:head>

<div class="space-y-8">
	<div>
		<p class="mono text-brand">{$t.admin.title}</p>
		<h1 class="text-3xl font-extrabold tracking-tight">{$t.admin.tabs.dashboard}</h1>
	</div>

	<!-- Stats Grid -->
	<div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
		{#each stats as [l, v]}
			<div class="border border-line bg-white p-5">
				<p class="mono text-slate-soft">{l}</p>
				<p class="mt-2 font-display text-4xl font-extrabold">{v}</p>
			</div>
		{/each}
	</div>

	<!-- Analytics Sections -->
	<div class="grid gap-6 xl:grid-cols-2">
		<!-- Top Places -->
		<section class="border border-line bg-white p-6">
			<h2 class="font-display text-xl font-bold">{$t.admin.topPlaces}</h2>
			<p class="mono mb-5 mt-1 text-slate-soft">{$t.admin.topPlacesSub}</p>
			<ul class="space-y-4">
				{#each report.topPlaces as [l, v]}
					{@const max = Math.max(1, ...report.topPlaces.map((r) => r[1]))}
					<li>
						<div class="flex justify-between text-sm">
							<span class="font-semibold">{l}</span>
							<span class="mono text-slate-soft">{v.toLocaleString()}</span>
						</div>
						<div class="mt-1.5 h-2 bg-slate-100">
							<div class="h-2 bg-brand" style="width: {(v / max) * 100}%" />
						</div>
					</li>
				{/each}
			</ul>
		</section>

		<!-- Top Categories -->
		<section class="border border-line bg-white p-6">
			<h2 class="font-display text-xl font-bold">{$t.admin.topCats}</h2>
			<p class="mono mb-5 mt-1 text-slate-soft">{$t.admin.topCatsSub}</p>
			<ul class="space-y-4">
				{#each report.topCats as [l, v]}
					{@const max = Math.max(1, ...report.topCats.map((r) => r[1]))}
					<li>
						<div class="flex justify-between text-sm">
							<span class="font-semibold">{l}</span>
							<span class="mono text-slate-soft">{v.toLocaleString()}</span>
						</div>
						<div class="mt-1.5 h-2 bg-slate-100">
							<div class="h-2 bg-brand" style="width: {(v / max) * 100}%" />
						</div>
					</li>
				{/each}
			</ul>
		</section>
	</div>
</div>
