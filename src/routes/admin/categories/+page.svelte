<script lang="ts">
	import { onMount } from 'svelte';
	import { Plus, Pencil, Trash2, Search } from 'lucide-svelte';
	import { t } from '$lib/i18n';
	import type { Place } from '$lib/types';
	import type { PageData } from './$types';

	export let data: PageData;

	let q = '';
	let cats: string[] = [];
	let places: Place[] = [];
	let newCat = '';
	let renaming: [string, string] | null = null;

	onMount(() => {
		cats = [...(data.categories || [])];
		places = [...(data.places || [])];
	});

	function commitCats(v: string[]) {
		cats = v;
	}

	function commitPlaces(v: Place[]) {
		places = v;
	}

	$: term = q.toLowerCase();
	$: filteredCats = cats.filter((c) => c.toLowerCase().includes(term));

	const th = 'px-5 py-3 font-bold';
	const inputCls = 'w-full border border-line px-4 py-2.5 outline-none focus:border-brand';
</script>

<svelte:head>
	<title>{$t.admin.tabs.categories} — {$t.admin.title}</title>
</svelte:head>

<div class="space-y-6">
	<div class="flex flex-wrap items-end justify-between gap-4">
		<div>
			<p class="mono text-brand">{$t.admin.title}</p>
			<h1 class="text-3xl font-extrabold tracking-tight">{$t.admin.tabs.categories}</h1>
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
		<form
			on:submit|preventDefault={() => {
				const n = newCat.trim();
				if (n && !cats.includes(n)) commitCats([...cats, n]);
				newCat = '';
			}}
			class="flex gap-3 border-b border-line p-5"
		>
			<input
				bind:value={newCat}
				placeholder={$t.admin.newCategoryName}
				class="{inputCls} max-w-xs"
			/>
			<button
				type="submit"
				class="inline-flex items-center gap-2 bg-brand px-4 py-2 text-sm font-bold text-white hover:bg-emerald-deep"
			>
				<Plus size={16} />{$t.admin.addCategoryBtn}
			</button>
		</form>

		<table class="w-full text-left text-sm">
			<thead class="bg-slate-50 text-xs uppercase tracking-wider text-slate-soft">
				<tr>
					<th class={th}>{$t.admin.table.category}</th>
					<th class={th}>{$t.admin.stats.places}</th>
					<th class={th} />
				</tr>
			</thead>
			<tbody class="divide-y divide-line">
				{#each filteredCats as c}
					<tr>
						<td class="px-5 py-3 font-bold">
							{#if renaming?.[0] === c}
								<input
									bind:value={renaming[1]}
									class="{inputCls} max-w-xs py-1.5"
								/>
							{:else}
								{c}
							{/if}
						</td>
						<td class="px-5 py-3">
							{places.filter((p) => p.category === c).length}
						</td>
						<td class="px-5 py-3">
							<div class="flex justify-end gap-1">
								{#if renaming?.[0] === c}
									<button
										type="button"
										on:click={() => {
											if (!renaming) return;
											const n = renaming[1].trim();
											if (n && (n === c || !cats.includes(n))) {
												commitCats(cats.map((x) => (x === c ? n : x)));
												commitPlaces(
													places.map((p) => (p.category === c ? { ...p, category: n } : p))
												);
											}
											renaming = null;
										}}
										class="px-3 py-1.5 text-sm font-bold text-emerald-deep hover:bg-brand-soft"
									>
										{$t.admin.table.save}
									</button>
								{:else}
									<button
										type="button"
										aria-label="Rename"
										on:click={() => (renaming = [c, c])}
										class="p-2 text-slate-soft hover:bg-ocean-soft hover:text-ocean"
									>
										<Pencil size={16} />
									</button>
								{/if}
								<button
									type="button"
									aria-label="Delete"
									on:click={() =>
										places.some((p) => p.category === c)
											? alert('Reassign or delete the places in this category first.')
											: commitCats(cats.filter((x) => x !== c))}
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
	</section>
</div>

