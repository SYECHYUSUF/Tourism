<script lang="ts">
	import { enhance } from '$app/forms';
	import { page } from '$app/stores';
	import { Trash2, Search } from 'lucide-svelte';
	import { t } from '$lib/i18n';
	import type { ActionData, PageData } from './$types';

	export let data: PageData;
	export let form: ActionData;

	let toast = '';
	$: errors = ((form as any)?.errors ?? {}) as Record<string, string>;
	$: meId = $page.data.user?.id;

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
	<title>{$t.admin.tabs.users} — {$t.admin.title}</title>
</svelte:head>

<div class="space-y-6">
	<div class="flex flex-wrap items-end justify-between gap-4">
		<div>
			<p class="mono text-brand">{$t.admin.title}</p>
			<h1 class="text-3xl font-extrabold tracking-tight">{$t.admin.tabs.users}</h1>
		</div>

		<form method="GET" class="flex w-full max-w-xs items-center gap-2 border border-line bg-white px-4 py-2 focus-within:border-brand">
			<Search size={16} class="text-slate-400" />
			<input
				name="q"
				value={data.q}
				placeholder={$t.admin.searchPlaceholder}
				aria-label={$t.admin.searchPlaceholder}
				class="w-full bg-transparent text-sm outline-none"
			/>
		</form>
	</div>

	{#if errors.form}
		<p role="alert" class="border-l-4 border-red-600 bg-red-50 px-4 py-3 text-sm text-red-700">{errors.form}</p>
	{/if}

	<section class="border border-line bg-white">
		<div class="overflow-x-auto">
			<table class="w-full min-w-[760px] text-left text-sm">
				<thead class="bg-slate-50 text-xs uppercase tracking-wider text-slate-soft">
					<tr>
						{#each [$t.admin.table.name, $t.admin.table.email, $t.admin.table.role, $t.admin.f.joined, ''] as h}
							<th class={th}>{h}</th>
						{/each}
					</tr>
				</thead>
				<tbody class="divide-y divide-line">
					{#each data.users as u (u.id)}
						<tr>
							<td class="px-5 py-3 font-bold">
								{u.name}
								{#if u.id === meId}<span class="mono ml-1 text-xs text-brand">({$t.admin.f.you})</span>{/if}
							</td>
							<td class="px-5 py-3">{u.email}</td>
							<td class="px-5 py-3">
								<span class="mono px-2 py-1 {u.role === 'admin' ? 'bg-ocean-soft font-bold text-ocean' : 'bg-brand-soft text-emerald-deep'}">
									{u.role}
								</span>
							</td>
							<td class="mono px-5 py-3 text-slate-soft">{u.createdAt}</td>
							<td class="px-5 py-3">
								<div class="flex justify-end gap-1">
									{#if u.id === meId}
										<span class="mono py-2 text-slate-400">—</span>
									{:else}
										<form
											method="POST"
											action="?/setRole"
											use:enhance={() =>
												async ({ result, update }) => {
													await update();
													if (result.type === 'success') showToast($t.admin.f.saved);
												}}
										>
											<input type="hidden" name="id" value={u.id} />
											<input type="hidden" name="role" value={u.role === 'admin' ? 'user' : 'admin'} />
											<button type="submit" class="px-3 py-1.5 text-sm font-semibold text-ocean hover:bg-ocean-soft">
												{u.role === 'admin' ? $t.admin.f.makeUser : $t.admin.f.makeAdmin}
											</button>
										</form>
										<form
											method="POST"
											action="?/delete"
											use:enhance={({ cancel }) => {
												if (!confirm($t.admin.f.deleteConfirm.replace('{name}', u.email))) return cancel();
												return async ({ result, update }) => {
													await update();
													if (result.type === 'success') showToast($t.admin.f.deleted);
												};
											}}
										>
											<input type="hidden" name="id" value={u.id} />
											<button
												type="submit"
												aria-label="{$t.admin.f.delete} {u.email}"
												class="p-2 text-slate-soft hover:bg-red-50 hover:text-red-600"
											>
												<Trash2 size={16} />
											</button>
										</form>
									{/if}
								</div>
							</td>
						</tr>
					{:else}
						<tr><td colspan="5" class="p-8 text-center text-slate-soft">{$t.admin.f.empty}</td></tr>
					{/each}
				</tbody>
			</table>
		</div>

		{#if data.page > 1 || data.hasNext}
			<nav class="flex items-center justify-between border-t border-line p-4 text-sm" aria-label="Pagination">
				{#if data.page > 1}
					<a href={pageHref(data.page - 1)} class="font-semibold text-ocean hover:underline">{$t.admin.f.prev}</a>
				{:else}<span />{/if}
				<span class="mono text-slate-soft">{data.page}</span>
				{#if data.hasNext}
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
