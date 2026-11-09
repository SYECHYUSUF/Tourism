<script lang="ts">
	import { onMount } from 'svelte';
	import { Plus, Pencil, Trash2, X, Search } from 'lucide-svelte';
	import { priceRange } from '$lib/scoring';
	import { t, locale } from '$lib/i18n';
	import type { Place } from '$lib/types';
	import type { PageData } from './$types';

	export let data: PageData;

	let q = '';
	let places: Place[] = [];
	let cats: string[] = [];
	let editing: Place | null = null;

	onMount(() => {
		places = [...(data.places || [])];
		cats = [...(data.categories || [])];
	});

	function commitPlaces(v: Place[]) {
		places = v;
	}

	function addPlace() {
		editing = {
			id: `place-${Date.now()}`,
			name: '',
			category: cats[0] || 'Culinary',
			area: '',
			address: '',
			lat: -8.5,
			lng: 115.2,
			priceMin: 25000,
			priceMax: 100000,
			rating: 0,
			reviewCount: 0,
			image:
				'https://images.unsplash.com/photo-1539755530862-00f623c00f52?w=900&fit=crop&auto=format&q=80',
			blurb: '',
			hours: '08:00 – 22:00',
			tags: []
		};
	}

	function savePlaceForm() {
		if (!editing) return;
		const exists = places.some((r) => r.id === editing!.id);
		commitPlaces(exists ? places.map((r) => (r.id === editing!.id ? editing! : r)) : [editing, ...places]);
		editing = null;
	}

	$: term = q.toLowerCase();
	$: filteredPlaces = places.filter((p) => p.name.toLowerCase().includes(term) || p.area.toLowerCase().includes(term));

	const th = 'px-5 py-3 font-bold';
	const inputCls = 'w-full border border-line px-4 py-2.5 outline-none focus:border-brand';
</script>

<svelte:head>
	<title>{$t.admin.tabs.places} — {$t.admin.title}</title>
</svelte:head>

<div class="space-y-6">
	<div class="flex flex-wrap items-end justify-between gap-4">
		<div>
			<p class="mono text-brand">{$t.admin.title}</p>
			<h1 class="text-3xl font-extrabold tracking-tight">{$t.admin.tabs.places}</h1>
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
		<div class="flex items-center justify-between p-5">
			<h2 class="font-bold">
				{$t.admin.allPlaces} ({filteredPlaces.length})
			</h2>
			<button
				type="button"
				on:click={addPlace}
				class="inline-flex items-center gap-2 bg-brand px-4 py-2 text-sm font-bold text-white hover:bg-emerald-deep"
			>
				<Plus size={16} />{$t.admin.addPlace}
			</button>
		</div>

		<div class="overflow-x-auto">
			<table class="w-full min-w-[760px] text-left text-sm">
				<thead class="bg-slate-50 text-xs uppercase tracking-wider text-slate-soft">
					<tr>
						{#each [$t.admin.table.place, $t.admin.table.category, $t.admin.table.price, $t.admin.table.rating, ''] as h}
							<th class={th}>{h}</th>
						{/each}
					</tr>
				</thead>
				<tbody class="divide-y divide-line">
					{#each filteredPlaces as r (r.id)}
						<tr class="hover:bg-slate-50/70">
							<td class="px-5 py-3">
								<div class="flex items-center gap-3">
									<img
										src={r.image}
										alt=""
										class="h-11 w-11 bg-slate-200 object-cover"
									/>
									<div>
										<p class="font-bold">{r.name}</p>
										<p class="text-xs text-slate-soft">{r.address}</p>
									</div>
								</div>
							</td>
							<td class="px-5 py-3">{r.category}</td>
							<td class="px-5 py-3">{priceRange(r, $locale === 'en')}</td>
							<td class="px-5 py-3 font-semibold">{r.rating || '–'}</td>
							<td class="px-5 py-3">
								<div class="flex justify-end gap-1">
									<button
										type="button"
										aria-label={$t.admin.editPlace}
										on:click={() => (editing = { ...r })}
										class="p-2 text-slate-soft hover:bg-ocean-soft hover:text-ocean"
									>
										<Pencil size={16} />
									</button>
									<button
										type="button"
										aria-label="Delete"
										on:click={() =>
											confirm(`Hapus ${r.name}?`) &&
											commitPlaces(places.filter((x) => x.id !== r.id))}
										class="p-2 text-slate-soft hover:bg-red-50 hover:text-red-600"
									>
										<Trash2 size={16} />
									</button>
								</div>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</section>
</div>

<!-- Add/Edit Place Modal Dialog -->
{#if editing}
	<div
		class="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-ink/50 p-4"
		on:click|self={() => (editing = null)}
		role="presentation"
	>
		<form
			on:submit|preventDefault={savePlaceForm}
			class="w-full max-w-md space-y-4 bg-white p-6 shadow-2xl"
		>
			<div class="flex items-center justify-between">
				<h2 class="text-xl font-extrabold">
					{places.some((r) => r.id === editing?.id) ? 'Edit place' : 'Add place'}
				</h2>
				<button
					type="button"
					aria-label="Close"
					on:click={() => (editing = null)}
				>
					<X size={18} />
				</button>
			</div>
			<input
				required
				bind:value={editing.name}
				placeholder="Name"
				class={inputCls}
			/>
			<input
				bind:value={editing.area}
				placeholder="Area"
				class={inputCls}
			/>
			<input
				bind:value={editing.address}
				placeholder="Address"
				class={inputCls}
			/>
			<select bind:value={editing.category} class={inputCls}>
				{#each cats as c}
					<option>{c}</option>
				{/each}
			</select>
			<div class="grid grid-cols-2 gap-3">
				<input
					type="number"
					min="0"
					bind:value={editing.priceMin}
					aria-label="Min price"
					class={inputCls}
				/>
				<input
					type="number"
					min="0"
					bind:value={editing.priceMax}
					aria-label="Max price"
					class={inputCls}
				/>
				<input
					type="number"
					step="any"
					bind:value={editing.lat}
					aria-label="Latitude"
					class={inputCls}
				/>
				<input
					type="number"
					step="any"
					bind:value={editing.lng}
					aria-label="Longitude"
					class={inputCls}
				/>
			</div>
			<input
				bind:value={editing.hours}
				placeholder="Opening hours"
				class={inputCls}
			/>
			<textarea
				bind:value={editing.blurb}
				rows="3"
				placeholder="Description"
				class={inputCls}
			/>
			<button
				type="submit"
				class="w-full bg-brand py-3 font-bold text-white hover:bg-emerald-deep"
			>
				Save
			</button>
		</form>
	</div>
{/if}

