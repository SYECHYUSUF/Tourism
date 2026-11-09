<script lang="ts">
	import { enhance } from '$app/forms';
	import { Plus, Pencil, Trash2 } from 'lucide-svelte';
	import { t } from '$lib/i18n';
	import type { ActionData, PageData } from './$types';

	export let data: PageData;
	export let form: ActionData;

	let editingId: number | null = null;
	let toast = '';

	$: errors = ((form as any)?.errors ?? {}) as Record<string, string>;

	function showToast(msg: string) {
		toast = msg;
		setTimeout(() => (toast = ''), 3000);
	}

	const th = 'px-5 py-3 font-bold';
	const inputCls = 'w-full border border-line px-3 py-2 outline-none focus:border-brand';
</script>

<svelte:head>
	<title>{$t.admin.tabs.categories} — {$t.admin.title}</title>
</svelte:head>

<div class="space-y-6">
	<div>
		<p class="mono text-brand">{$t.admin.title}</p>
		<h1 class="text-3xl font-extrabold tracking-tight">{$t.admin.tabs.categories}</h1>
	</div>

	{#if errors.form}
		<p role="alert" class="border-l-4 border-red-600 bg-red-50 px-4 py-3 text-sm text-red-700">{errors.form}</p>
	{/if}

	<section class="border border-line bg-white">
		<form
			method="POST"
			action="?/create"
			use:enhance={() =>
				async ({ result, update }) => {
					await update();
					if (result.type === 'success') showToast($t.admin.f.saved);
				}}
			class="grid gap-3 border-b border-line p-5 sm:grid-cols-[1fr_1fr_1fr_auto]"
		>
			<label>
				<span class="text-xs font-semibold text-slate-soft">{$t.admin.f.catKey}</span>
				<input name="name" required placeholder={$t.admin.newCategoryName} class={inputCls} />
			</label>
			<label>
				<span class="text-xs font-semibold text-slate-soft">{$t.admin.f.labelId}</span>
				<input name="label_id" class={inputCls} />
			</label>
			<label>
				<span class="text-xs font-semibold text-slate-soft">{$t.admin.f.labelEn}</span>
				<input name="label_en" class={inputCls} />
			</label>
			<button
				type="submit"
				class="inline-flex items-center justify-center gap-2 self-end bg-brand px-4 py-2.5 text-sm font-bold text-white hover:bg-emerald-deep"
			>
				<Plus size={16} />{$t.admin.addCategoryBtn}
			</button>
			{#if errors.name}<p class="text-xs text-red-600 sm:col-span-4">{errors.name}</p>{/if}
		</form>

		<div class="overflow-x-auto">
			<table class="w-full min-w-[640px] text-left text-sm">
				<thead class="bg-slate-50 text-xs uppercase tracking-wider text-slate-soft">
					<tr>
						<th class={th}>{$t.admin.f.catKey}</th>
						<th class={th}>{$t.admin.f.labelId}</th>
						<th class={th}>{$t.admin.f.labelEn}</th>
						<th class={th}>{$t.admin.stats.places}</th>
						<th class={th} />
					</tr>
				</thead>
				<tbody class="divide-y divide-line">
					{#each data.categories as c (c.id)}
						<tr>
							<td class="px-5 py-3 font-bold">{c.name}</td>
							{#if editingId === c.id}
								<td class="px-5 py-3" colspan="3">
									<form
										method="POST"
										action="?/update"
										use:enhance={() =>
											async ({ result, update }) => {
												await update();
												if (result.type === 'success') {
													editingId = null;
													showToast($t.admin.f.saved);
												}
											}}
										class="flex flex-wrap gap-2"
									>
										<input type="hidden" name="id" value={c.id} />
										<input name="label_id" value={c.label_id} aria-label={$t.admin.f.labelId} class="{inputCls} max-w-[12rem]" />
										<input name="label_en" value={c.label_en} aria-label={$t.admin.f.labelEn} class="{inputCls} max-w-[12rem]" />
										<button class="px-3 py-1.5 text-sm font-bold text-emerald-deep hover:bg-brand-soft">{$t.admin.table.save}</button>
										<button type="button" on:click={() => (editingId = null)} class="px-3 py-1.5 text-sm">{$t.admin.f.cancel}</button>
										{#if errors.label}<span class="w-full text-xs text-red-600">{errors.label}</span>{/if}
									</form>
								</td>
							{:else}
								<td class="px-5 py-3">{c.label_id}</td>
								<td class="px-5 py-3">{c.label_en}</td>
								<td class="px-5 py-3">{c.placeCount}</td>
							{/if}
							<td class="px-5 py-3">
								<div class="flex justify-end gap-1">
									{#if editingId !== c.id}
										<button
											type="button"
											aria-label="{$t.admin.f.edit} {c.name}"
											on:click={() => (editingId = c.id)}
											class="p-2 text-slate-soft hover:bg-ocean-soft hover:text-ocean"
										>
											<Pencil size={16} />
										</button>
									{/if}
									<form
										method="POST"
										action="?/delete"
										use:enhance={({ cancel }) => {
											if (c.placeCount > 0) {
												alert($t.admin.f.catInUse.replace('{n}', String(c.placeCount)));
												return cancel();
											}
											if (!confirm($t.admin.f.deleteConfirm.replace('{name}', c.name))) return cancel();
											return async ({ result, update }) => {
												await update();
												if (result.type === 'success') showToast($t.admin.f.deleted);
											};
										}}
									>
										<input type="hidden" name="id" value={c.id} />
										<button
											type="submit"
											aria-label="{$t.admin.f.delete} {c.name}"
											class="p-2 text-slate-soft hover:bg-red-50 hover:text-red-600"
										>
											<Trash2 size={16} />
										</button>
									</form>
								</div>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
		<p class="border-t border-line p-4 text-xs text-slate-soft">{$t.admin.f.catKeyHint}</p>
	</section>
</div>

{#if toast}
	<div role="status" aria-live="polite" class="fixed bottom-5 right-5 z-[60] bg-forest px-5 py-3 text-sm font-semibold text-white shadow-lg">
		{toast}
	</div>
{/if}
