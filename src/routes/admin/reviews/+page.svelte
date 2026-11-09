<script lang="ts">
	import { enhance } from '$app/forms';
	import { page } from '$app/stores';
	import { Star, Eye, EyeOff, Trash2, ImageIcon } from 'lucide-svelte';
	import { t } from '$lib/i18n';
	import type { ActionData, PageData } from './$types';

	export let data: PageData;
	export let form: ActionData;

	let toast = '';
	$: errors = ((form as any)?.errors ?? {}) as Record<string, string>;
	$: totalPages = Math.max(1, Math.ceil(data.total / data.pageSize));

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

		<form method="GET" class="flex flex-wrap gap-2">
			<select name="place" value={data.place} aria-label={$t.admin.table.place} class="max-w-[14rem] border border-line bg-white px-3 py-2 text-sm">
				<option value="">{$t.admin.f.allPlaces}</option>
				{#each data.places as p}
					<option value={p.id}>{p.name}</option>
				{/each}
			</select>
			<select name="status" value={data.status} aria-label={$t.admin.table.status} class="border border-line bg-white px-3 py-2 text-sm">
				<option value="all">{$t.admin.f.allStatus}</option>
				<option value="visible">{$t.admin.table.visible}</option>
				<option value="hidden">{$t.admin.table.hidden}</option>
			</select>
			<button class="border border-line bg-white px-4 py-2 text-sm font-semibold hover:bg-ink hover:text-white">
				{$t.admin.f.filter}
			</button>
		</form>
	</div>

	{#if errors.form}
		<p role="alert" class="border-l-4 border-red-600 bg-red-50 px-4 py-3 text-sm text-red-700">{errors.form}</p>
	{/if}

	<section class="border border-line bg-white">
		<div class="border-b border-line p-5">
			<h2 class="font-bold">{$t.admin.moderateHeading} ({data.total})</h2>
			<p class="mt-1 text-sm text-slate-soft">{$t.admin.moderateSub}</p>
		</div>

		<div class="overflow-x-auto">
			<table class="w-full min-w-[820px] text-left text-sm">
				<thead class="bg-slate-50 text-xs uppercase tracking-wider text-slate-soft">
					<tr>
						{#each [$t.admin.table.reviewer, $t.admin.table.place, $t.admin.table.rating, $t.admin.table.review, $t.admin.table.status, ''] as h}
							<th class={th}>{h}</th>
						{/each}
					</tr>
				</thead>
				<tbody class="divide-y divide-line">
					{#each data.reviews as r (r.id)}
						<tr class={r.hidden ? 'bg-slate-50 text-slate-400' : ''}>
							<td class="px-5 py-3 font-bold">
								{r.reviewerName}
								<p class="mono font-normal text-slate-400">{r.createdAt}</p>
							</td>
							<td class="px-5 py-3"><a href="/places/{r.placeId}" class="hover:underline">{r.placeName}</a></td>
							<td class="px-5 py-3">
								<span class="flex items-center gap-1 font-semibold">
									<Star size={13} class="fill-amber-400 text-amber-400" />{r.rating}
								</span>
							</td>
							<td class="max-w-xs px-5 py-3">
								<p class="line-clamp-2">{r.reviewText}</p>
								{#if r.photoUrl}
									<a href={r.photoUrl} target="_blank" rel="noopener noreferrer" class="mt-1 inline-flex items-center gap-1 text-xs text-ocean hover:underline">
										<ImageIcon size={12} />{$t.admin.f.photo}
									</a>
								{/if}
							</td>
							<td class="px-5 py-3">
								<span class="mono px-2 py-1 {r.hidden ? 'bg-slate-200 text-slate-soft' : 'bg-brand-soft text-emerald-deep'}">
									{r.hidden ? $t.admin.table.hidden : $t.admin.table.visible}
								</span>
							</td>
							<td class="px-5 py-3">
								<div class="flex justify-end gap-1">
									<form
										method="POST"
										action="?/toggle"
										use:enhance={() =>
											async ({ result, update }) => {
												await update();
												if (result.type === 'success') showToast($t.admin.f.saved);
											}}
									>
										<input type="hidden" name="id" value={r.id} />
										<input type="hidden" name="hidden" value={String(!r.hidden)} />
										<button
											type="submit"
											aria-label={r.hidden ? $t.admin.f.show : $t.admin.f.hide}
											title={r.hidden ? $t.admin.f.show : $t.admin.f.hide}
											class="p-2 text-slate-soft hover:bg-ocean-soft hover:text-ocean"
										>
											{#if r.hidden}<Eye size={16} />{:else}<EyeOff size={16} />{/if}
										</button>
									</form>
									<form
										method="POST"
										action="?/delete"
										use:enhance={({ cancel }) => {
											if (!confirm($t.admin.f.deleteConfirm.replace('{name}', r.reviewerName))) return cancel();
											return async ({ result, update }) => {
												await update();
												if (result.type === 'success') showToast($t.admin.f.deleted);
											};
										}}
									>
										<input type="hidden" name="id" value={r.id} />
										<button
											type="submit"
											aria-label={$t.admin.f.delete}
											class="p-2 text-slate-soft hover:bg-red-50 hover:text-red-600"
										>
											<Trash2 size={16} />
										</button>
									</form>
								</div>
							</td>
						</tr>
					{:else}
						<tr><td colspan="6" class="p-8 text-center text-slate-soft">{$t.admin.f.noReviews}</td></tr>
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
