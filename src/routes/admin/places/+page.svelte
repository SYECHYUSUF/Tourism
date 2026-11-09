<script lang="ts">
	import { enhance } from '$app/forms';
	import { page } from '$app/stores';
	import { Plus, Pencil, Trash2, X, Search } from 'lucide-svelte';
	import LocationPicker from '$components/LocationPicker.svelte';
	import { priceRange } from '$lib/scoring';
	import { t, locale } from '$lib/i18n';
	import type { Place } from '$lib/types';
	import type { ActionData, PageData } from './$types';

	export let data: PageData;
	export let form: ActionData;

	type Draft = Place & { isNew: boolean };
	let editing: Draft | null = null;
	let saving = false;
	let toast = '';

	$: errors = ((form as any)?.errors ?? {}) as Record<string, string>;
	$: totalPages = Math.max(1, Math.ceil(data.total / data.pageSize));

	function blank(): Draft {
		return {
			isNew: true,
			id: '',
			name: '',
			category_id: data.categoryRows[0]?.id,
			category: data.categoryRows[0]?.name ?? '',
			area: '',
			address: '',
			lat: -8.65,
			lng: 115.2,
			priceMin: 25000,
			priceMax: 100000,
			rating: 0,
			reviewCount: 0,
			image: '',
			gallery: [],
			blurb: '',
			hours: '08:00 – 22:00',
			tags: [],
			facilities: [],
			highlights: []
		};
	}

	function edit(p: Place) {
		editing = { ...p, isNew: false, gallery: (p.gallery ?? []).filter((g) => g && g !== p.image) };
		form = null;
	}

	function showToast(msg: string) {
		toast = msg;
		setTimeout(() => (toast = ''), 3000);
	}

	function pageHref(n: number) {
		const u = new URL($page.url);
		u.searchParams.set('page', String(n));
		return u.pathname + u.search;
	}

	const th = 'px-5 py-3 font-bold';
	const inputCls = 'w-full border border-line px-4 py-2.5 outline-none focus:border-brand';
	const labelCls = 'block text-xs font-semibold text-slate-soft';
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

		<form method="GET" class="flex w-full flex-wrap gap-2 sm:w-auto">
			<label class="flex flex-1 items-center gap-2 border border-line bg-white px-4 py-2 focus-within:border-brand sm:w-64">
				<Search size={16} class="text-slate-400" />
				<input
					name="q"
					value={data.q}
					placeholder={$t.admin.searchPlaceholder}
					aria-label={$t.admin.searchPlaceholder}
					class="w-full bg-transparent text-sm outline-none"
				/>
			</label>
			<select name="cat" value={data.cat} aria-label={$t.admin.f.category} class="border border-line bg-white px-3 py-2 text-sm">
				<option value="">{$t.admin.f.allCategories}</option>
				{#each data.categoryRows as c}
					<option value={c.name}>{c.name}</option>
				{/each}
			</select>
			<button class="border border-line bg-white px-4 py-2 text-sm font-semibold hover:bg-ink hover:text-white">
				{$t.admin.f.filter}
			</button>
		</form>
	</div>

	{#if errors.form && !editing}
		<p role="alert" class="border-l-4 border-red-600 bg-red-50 px-4 py-3 text-sm text-red-700">{errors.form}</p>
	{/if}

	<section class="border border-line bg-white">
		<div class="flex items-center justify-between p-5">
			<h2 class="font-bold">{$t.admin.allPlaces} ({data.total})</h2>
			<button
				type="button"
				on:click={() => {
					editing = blank();
					form = null;
				}}
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
					{#each data.places as r (r.id)}
						<tr class="hover:bg-slate-50/70">
							<td class="px-5 py-3">
								<div class="flex items-center gap-3">
									<img src={r.image} alt="" width="44" height="44" loading="lazy" class="h-11 w-11 bg-slate-200 object-cover" />
									<div>
										<a href="/places/{r.id}" class="font-bold hover:underline">{r.name}</a>
										<p class="text-xs text-slate-soft">{r.address}</p>
									</div>
								</div>
							</td>
							<td class="px-5 py-3">{r.category}</td>
							<td class="px-5 py-3">{priceRange(r, $locale === 'en')}</td>
							<td class="px-5 py-3 font-semibold">{r.rating || '–'} <span class="text-xs font-normal text-slate-soft">({r.reviewCount})</span></td>
							<td class="px-5 py-3">
								<div class="flex justify-end gap-1">
									<button
										type="button"
										aria-label="{$t.admin.f.edit} {r.name}"
										on:click={() => edit(r)}
										class="p-2 text-slate-soft hover:bg-ocean-soft hover:text-ocean"
									>
										<Pencil size={16} />
									</button>
									<form
										method="POST"
										action="?/delete"
										use:enhance={({ cancel }) => {
											if (!confirm($t.admin.f.deleteConfirm.replace('{name}', r.name))) return cancel();
											return async ({ result, update }) => {
												await update();
												if (result.type === 'success') showToast($t.admin.f.deleted);
											};
										}}
									>
										<input type="hidden" name="id" value={r.id} />
										<button
											type="submit"
											aria-label="{$t.admin.f.delete} {r.name}"
											class="p-2 text-slate-soft hover:bg-red-50 hover:text-red-600"
										>
											<Trash2 size={16} />
										</button>
									</form>
								</div>
							</td>
						</tr>
					{:else}
						<tr><td colspan="5" class="p-8 text-center text-slate-soft">{$t.admin.f.empty}</td></tr>
					{/each}
				</tbody>
			</table>
		</div>

		{#if totalPages > 1}
			<nav class="flex items-center justify-between border-t border-line p-4 text-sm" aria-label="Pagination">
				{#if data.page > 1}
					<a href={pageHref(data.page - 1)} class="font-semibold text-ocean hover:underline">{$t.admin.f.prev}</a>
				{:else}<span />{/if}
				<span class="mono text-slate-soft">{data.page} / {totalPages}</span>
				{#if data.page < totalPages}
					<a href={pageHref(data.page + 1)} class="font-semibold text-ocean hover:underline">{$t.admin.f.next}</a>
				{:else}<span />{/if}
			</nav>
		{/if}
	</section>
</div>

{#if toast}
	<div role="status" aria-live="polite" class="fixed bottom-5 right-5 z-[60] bg-forest px-5 py-3 text-sm font-semibold text-white shadow-lg">
		{toast}
	</div>
{/if}

{#if editing}
	<div
		class="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-ink/50 p-4"
		on:click|self={() => (editing = null)}
		on:keydown={(e) => e.key === 'Escape' && (editing = null)}
		role="presentation"
	>
		<form
			method="POST"
			action="?/save"
			enctype="multipart/form-data"
			use:enhance={() => {
				saving = true;
				return async ({ result, update }) => {
					saving = false;
					if (result.type === 'success') {
						editing = null;
						showToast($t.admin.f.saved);
						await update();
					} else {
						await update({ reset: false });
					}
				};
			}}
			class="my-8 w-full max-w-2xl space-y-4 bg-white p-6 shadow-2xl"
			role="dialog"
			aria-modal="true"
			aria-labelledby="place-dialog-title"
		>
			<div class="flex items-center justify-between">
				<h2 id="place-dialog-title" class="text-xl font-extrabold">
					{editing.isNew ? $t.admin.addPlace : $t.admin.editPlace}
				</h2>
				<button type="button" aria-label={$t.admin.f.close} on:click={() => (editing = null)}>
					<X size={18} />
				</button>
			</div>

			{#if errors.form}
				<p role="alert" class="border-l-4 border-red-600 bg-red-50 px-4 py-2 text-sm text-red-700">{errors.form}</p>
			{/if}

			<input type="hidden" name="id" value={editing.isNew ? '' : editing.id} />

			<div class="grid gap-4 sm:grid-cols-2">
				<label class="sm:col-span-2">
					<span class={labelCls}>{$t.admin.f.name}</span>
					<input name="name" required minlength="2" maxlength="150" bind:value={editing.name} class={inputCls} />
					{#if errors.name}<span class="text-xs text-red-600">{errors.name}</span>{/if}
				</label>
				<label>
					<span class={labelCls}>{$t.admin.f.category}</span>
					<select name="category_id" bind:value={editing.category_id} class={inputCls} required>
						{#each data.categoryRows as c}
							<option value={c.id}>{c.name}</option>
						{/each}
					</select>
					{#if errors.category_id}<span class="text-xs text-red-600">{errors.category_id}</span>{/if}
				</label>
				<label>
					<span class={labelCls}>{$t.admin.f.area}</span>
					<input name="area" maxlength="100" bind:value={editing.area} class={inputCls} />
				</label>
				<label class="sm:col-span-2">
					<span class={labelCls}>{$t.admin.f.address}</span>
					<input name="address" maxlength="300" bind:value={editing.address} class={inputCls} />
				</label>

				<div class="sm:col-span-2 space-y-2">
					<span class={labelCls}>{$t.admin.f.mapHint}</span>
					<LocationPicker bind:lat={editing.lat} bind:lng={editing.lng} label={$t.admin.f.mapHint} />
					<div class="grid grid-cols-2 gap-3">
						<label>
							<span class={labelCls}>{$t.admin.f.lat}</span>
							<input name="lat" type="number" step="any" min="-9" max="-8" required bind:value={editing.lat} class={inputCls} />
						</label>
						<label>
							<span class={labelCls}>{$t.admin.f.lng}</span>
							<input name="lng" type="number" step="any" min="114.4" max="115.8" required bind:value={editing.lng} class={inputCls} />
						</label>
					</div>
					{#if errors.lat}<span class="text-xs text-red-600">{errors.lat}</span>{/if}
				</div>

				<label>
					<span class={labelCls}>{$t.admin.f.priceMin}</span>
					<input name="price_min" type="number" min="0" step="1000" required bind:value={editing.priceMin} class={inputCls} />
					{#if errors.price_min}<span class="text-xs text-red-600">{errors.price_min}</span>{/if}
				</label>
				<label>
					<span class={labelCls}>{$t.admin.f.priceMax}</span>
					<input name="price_max" type="number" min="0" step="1000" required bind:value={editing.priceMax} class={inputCls} />
					{#if errors.price_max}<span class="text-xs text-red-600">{errors.price_max}</span>{/if}
				</label>
				<label class="sm:col-span-2">
					<span class={labelCls}>{$t.admin.f.hours}</span>
					<input name="hours" maxlength="100" bind:value={editing.hours} class={inputCls} />
				</label>
				<label class="sm:col-span-2">
					<span class={labelCls}>{$t.admin.f.blurb}</span>
					<textarea name="blurb" rows="3" maxlength="2000" bind:value={editing.blurb} class={inputCls} />
				</label>

				<label>
					<span class={labelCls}>{$t.admin.f.tags}</span>
					<textarea name="tags" rows="2" class={inputCls} value={editing.tags.join(', ')} />
				</label>
				<label>
					<span class={labelCls}>{$t.admin.f.facilities}</span>
					<textarea name="facilities" rows="2" class={inputCls} value={(editing.facilities ?? []).join(', ')} />
				</label>
				<label class="sm:col-span-2">
					<span class={labelCls}>{$t.admin.f.highlights}</span>
					<textarea name="highlights" rows="2" class={inputCls} value={(editing.highlights ?? []).join(', ')} />
					<span class="text-xs text-slate-soft">{$t.admin.f.listHint}</span>
				</label>

				<label>
					<span class={labelCls}>{$t.admin.f.phone}</span>
					<input name="phone" maxlength="40" value={editing.phone ?? ''} class={inputCls} />
				</label>
				<label>
					<span class={labelCls}>{$t.admin.f.instagram}</span>
					<input name="instagram" maxlength="80" value={editing.instagram ?? ''} class={inputCls} />
				</label>
				<label class="sm:col-span-2">
					<span class={labelCls}>{$t.admin.f.gmapsUrl}</span>
					<input name="gmaps_url" type="url" maxlength="500" value={editing.gmapsUrl ?? ''} class={inputCls} />
					{#if errors.gmaps_url}<span class="text-xs text-red-600">{errors.gmaps_url}</span>{/if}
				</label>

				<fieldset class="sm:col-span-2 space-y-2 border border-line p-4">
					<legend class="px-1 text-xs font-semibold text-slate-soft">{$t.admin.f.image}</legend>
					{#if editing.image}
						<img src={editing.image} alt="" class="h-24 w-36 object-cover" />
					{/if}
					<label class="block">
						<span class={labelCls}>{$t.admin.f.imageUpload}</span>
						<input name="image_file" type="file" accept="image/jpeg,image/png,image/webp" class="text-sm" />
					</label>
					<label class="block">
						<span class={labelCls}>{$t.admin.f.imageUrl}</span>
						<input name="image_url" type="url" maxlength="500" value={editing.image} class={inputCls} />
					</label>
					{#if errors.image_file}<span class="text-xs text-red-600">{errors.image_file}</span>{/if}
					{#if errors.image_url}<span class="text-xs text-red-600">{errors.image_url}</span>{/if}
				</fieldset>

				<fieldset class="sm:col-span-2 space-y-2 border border-line p-4">
					<legend class="px-1 text-xs font-semibold text-slate-soft">{$t.admin.f.gallery}</legend>
					{#if editing.gallery && editing.gallery.length > 0}
						<p class="text-xs text-slate-soft">{$t.admin.f.galleryKeep}</p>
						<div class="flex flex-wrap gap-2">
							{#each editing.gallery as g}
								<label class="relative block">
									<img src={g} alt="" class="h-16 w-20 object-cover" />
									<input type="checkbox" name="keep_gallery" value={g} checked class="absolute left-1 top-1" />
								</label>
							{/each}
						</div>
					{/if}
					<label class="block">
						<span class={labelCls}>{$t.admin.f.galleryAdd}</span>
						<input name="gallery_files" type="file" multiple accept="image/jpeg,image/png,image/webp" class="text-sm" />
					</label>
					{#if errors.gallery_files}<span class="text-xs text-red-600">{errors.gallery_files}</span>{/if}
				</fieldset>

				<p class="sm:col-span-2 text-xs text-slate-soft">{$t.admin.f.ratingAuto}</p>
			</div>

			<div class="flex gap-3">
				<button type="button" on:click={() => (editing = null)} class="flex-1 border border-line py-3 font-semibold">
					{$t.admin.f.cancel}
				</button>
				<button
					type="submit"
					disabled={saving}
					class="flex-1 bg-brand py-3 font-bold text-white hover:bg-emerald-deep disabled:opacity-60"
				>
					{saving ? $t.admin.f.saving : $t.admin.f.save}
				</button>
			</div>
		</form>
	</div>
{/if}
