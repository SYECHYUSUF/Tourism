<script lang="ts">
	import { Trash2, Search } from 'lucide-svelte';
	import { t } from '$lib/i18n';

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

	let q = '';
	let accts: Acct[] = [];

	function commitAccts(v: Acct[]) {
		accts = v;
	}

	$: allUsers = [...seedUsers, ...accts];
	$: term = q.toLowerCase();
	$: filteredUsers = allUsers.filter((u) => (u.name + u.email).toLowerCase().includes(term));

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
		<div class="overflow-x-auto">
			<table class="w-full min-w-[640px] text-left text-sm">
				<thead class="bg-slate-50 text-xs uppercase tracking-wider text-slate-soft">
					<tr>
						{#each [$t.admin.table.name, $t.admin.table.email, $t.admin.table.role, ''] as h}
							<th class={th}>{h}</th>
						{/each}
					</tr>
				</thead>
				<tbody class="divide-y divide-line">
					{#each filteredUsers as u (u.email)}
						<tr>
							<td class="px-5 py-3 font-bold">{u.name}</td>
							<td class="px-5 py-3">{u.email}</td>
							<td class="px-5 py-3">
								<span
									class="mono px-2 py-1 {u.role === 'admin'
										? 'bg-ocean-soft text-ocean font-bold'
										: 'bg-brand-soft text-emerald-deep'}"
								>
									{u.role}
								</span>
							</td>
							<td class="px-5 py-3">
								<div class="flex justify-end gap-1">
									{#if u.locked}
										<span class="mono py-2 text-slate-400">{$t.admin.table.builtIn}</span>
									{:else}
										<button
											type="button"
											on:click={() =>
												commitAccts(
													accts.map((a) =>
														a.email === u.email
															? { ...a, role: a.role === 'admin' ? 'user' : 'admin' }
															: a
													)
												)}
											class="px-3 py-1.5 text-sm font-semibold text-ocean hover:bg-ocean-soft"
										>
											Make {u.role === 'admin' ? 'user' : 'admin'}
										</button>
										<button
											type="button"
											aria-label="Delete"
											on:click={() =>
												confirm(`Hapus pengguna ${u.name}?`) &&
												commitAccts(accts.filter((a) => a.email !== u.email))}
											class="p-2 text-slate-soft hover:bg-red-50 hover:text-red-600"
										>
											<Trash2 size={16} />
										</button>
									{/if}
								</div>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</section>
</div>

