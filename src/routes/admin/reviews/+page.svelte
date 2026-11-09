<script lang="ts">
	import { onMount } from 'svelte';
	import { Star, Eye, EyeOff, Trash2, Search } from 'lucide-svelte';
	import { getReviews, saveReviews, getPlaces } from '$lib/data';
	import { t } from '$lib/i18n';
	import type { Review, Place } from '$lib/types';

	let q = '';
	let reviews: Review[] = [];
	let places: Place[] = [];

	onMount(() => {
		reviews = getReviews();
		places = getPlaces();
	});

	function commitReviews(v: Review[]) {
		reviews = v;
		saveReviews(v);
	}

	function placeName(id: string) {
		return places.find((p) => p.id === id)?.name ?? 'Deleted place';
	}

	$: term = q.toLowerCase();
	$: filteredReviews = reviews.filter((r) =>
		(r.reviewerName + r.reviewText + placeName(r.placeId)).toLowerCase().includes(term)
	);

	const th = 'px-5 py-3 font-bold';
</script>

<svelte:head>
	<title>{$t.admin.tabs.reviews} — {$t.admin.title}</title>
</svelte:head>

<div class="space-y-6">
	<div class="flex flex-wrap items-end justify-between gap-4">
		<div>
			<p class="mono text-brand">{$t.admin.title}</p>
			<h1 class="text-3xl font-extrabold tracking-tight">{$t.admin.tabs.reviews}</h1>
		</div>

		<label class="flex w-full max-w-xs items-center gap-2 border border-line bg-white px-4 py-2 focus-within:border-brand">
			<Search size={16} class="text-slate-400" />
			<input
				bind:value={q}
				placeholder={$t.admin.searchPlaceholder}
				class="w-full bg-transparent text-sm outline-none"
			/>
		</label>
	</div>

	<section class="border border-line bg-white">
		<div class="p-5 border-b border-line">
			<h2 class="font-bold">{$t.admin.moderateHeading}</h2>
			<p class="text-sm text-slate-soft mt-1">
				{$t.admin.moderateSub}
			</p>
		</div>

		<div class="overflow-x-auto">
			<table class="w-full min-w-[760px] text-left text-sm">
				<thead class="bg-slate-50 text-xs uppercase tracking-wider text-slate-soft">
					<tr>
						{#each [$t.admin.table.reviewer, $t.admin.table.place, $t.admin.table.rating, $t.admin.table.review, $t.admin.table.status, ''] as h}
							<th class={th}>{h}</th>
						{/each}
					</tr>
				</thead>
				<tbody class="divide-y divide-line">
					{#each filteredReviews as r (r.id)}
						<tr class={r.hidden ? 'bg-slate-50 text-slate-400' : ''}>
							<td class="px-5 py-3 font-bold">
								{r.reviewerName}
								<p class="mono font-normal text-slate-400">{r.createdAt}</p>
							</td>
							<td class="px-5 py-3">{placeName(r.placeId)}</td>
							<td class="px-5 py-3">
								<span class="flex items-center gap-1 font-semibold">
									<Star size={13} class="fill-amber-400 text-amber-400" />{r.rating}
								</span>
							</td>
							<td class="max-w-xs px-5 py-3">
								<p class="line-clamp-2">{r.reviewText}</p>
							</td>
							<td class="px-5 py-3">
								<span
									class="mono px-2 py-1 {r.hidden
										? 'bg-slate-200 text-slate-soft'
										: 'bg-brand-soft text-emerald-deep'}"
								>
									{r.hidden ? $t.admin.table.hidden : $t.admin.table.visible}
								</span>
							</td>
							<td class="px-5 py-3">
								<div class="flex justify-end gap-1">
									<button
										type="button"
										aria-label={r.hidden ? 'Show' : 'Hide'}
										on:click={() =>
											commitReviews(
												reviews.map((x) =>
													x.id === r.id ? { ...x, hidden: !x.hidden } : x
												)
											)}
										class="p-2 text-slate-soft hover:bg-ocean-soft hover:text-ocean"
									>
										{#if r.hidden}
											<Eye size={16} />
										{:else}
											<EyeOff size={16} />
										{/if}
									</button>
									<button
										type="button"
										aria-label="Delete"
										on:click={() =>
											confirm(`Hapus ulasan dari ${r.reviewerName}?`) &&
											commitReviews(reviews.filter((x) => x.id !== r.id))}
										class="p-2 text-slate-soft hover:bg-red-50 hover:text-red-600"
									>
										<Trash2 size={16} />
									</button>
								</div>
							</td>
						</tr>
					{/each}
					{#if filteredReviews.length === 0}
						<tr>
							<td colspan="6" class="p-8 text-center text-slate-soft">
								Tidak ada ulasan yang sesuai.
							</td>
						</tr>
					{/if}
				</tbody>
			</table>
		</div>
	</section>
</div>

