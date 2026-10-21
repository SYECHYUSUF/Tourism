<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import {
		MapPinned,
		Tags,
		MessageSquare,
		Users,
		LayoutDashboard,
		Search,
		Plus,
		Pencil,
		Trash2,
		Compass,
		LogOut,
		X,
		EyeOff,
		Eye,
		Star
	} from 'lucide-svelte';
	import {
		getPlaces,
		savePlaces,
		getCategories,
		saveCategories,
		getReviews,
		saveReviews
	} from '$lib/data';
	import { priceRange } from '$lib/scoring';
	import type { Place, Review } from '$lib/types';

	const tabs = [
		['Dashboard', LayoutDashboard],
		['Places', MapPinned],
		['Categories', Tags],
		['Reviews', MessageSquare],
		['Users', Users]
	] as const;

	type Tab = (typeof tabs)[number][0];

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

	let tab: Tab = 'Dashboard';
	let q = '';
	let places: Place[] = [];
	let cats: string[] = [];
	let reviews: Review[] = [];
	let accts: Acct[] = [];
	let user: any = null;

	let editing: Place | null = null;
	let newCat = '';
	let renaming: [string, string] | null = null;

	onMount(async () => {
		places = getPlaces();
		cats = getCategories();
		reviews = getReviews();

		try {
			accts = JSON.parse(localStorage.getItem('accounts') || '[]');
		} catch {
			accts = [];
		}

		// Auth check
		const { supabase } = await import('$lib/supabaseClient');
		const {
			data: { session }
		} = await supabase.auth.getSession();
		if (session?.user) {
			user = {
				name: session.user.user_metadata?.name || session.user.email,
				email: session.user.email,
				role: session.user.user_metadata?.role || 'user'
			};
		} else {
			try {
				const sess = JSON.parse(localStorage.getItem('session') || 'null');
				if (sess) user = sess;
			} catch {}
		}
	});

	function commitPlaces(v: Place[]) {
		places = v;
		savePlaces(v);
	}

	function commitCats(v: string[]) {
		cats = v;
		saveCategories(v);
	}

	function commitReviews(v: Review[]) {
		reviews = v;
		saveReviews(v);
	}

	function commitAccts(v: Acct[]) {
		accts = v;
		localStorage.setItem('accounts', JSON.stringify(v));
	}

	async function logout() {
		const { supabase } = await import('$lib/supabaseClient');
		await supabase.auth.signOut();
		localStorage.removeItem('session');
		goto('/login');
	}

	$: term = q.toLowerCase();
	$: allUsers = [...seedUsers, ...accts];

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
		['Places', String(places.length)],
		['Reviews', String(reviews.length)],
		['Users', String(allUsers.length)],
		['Searches logged', report.searches.toLocaleString()]
	];

	function addPlace() {
		editing = {
			id: `place-${Date.now()}`,
			name: '',
			category: cats[0] || 'Culinary',
			area: '',
			address: '',
			lat: -8.5,
			lng: 115.2,
			priceMin: 5,
			priceMax: 30,
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

	function placeName(id: string) {
		return places.find((p) => p.id === id)?.name ?? 'Deleted place';
	}

	const th = 'px-5 py-3 font-bold';
	const inputCls = 'w-full border border-line px-4 py-2.5 outline-none focus:border-brand';
</script>

<svelte:head>
	<title>Admin Dashboard — Jelajah</title>
</svelte:head>

<div class="grid min-h-screen bg-canvas lg:grid-cols-[250px_1fr]">
	<!-- Left Sidebar -->
	<aside class="hidden bg-forest p-6 text-white lg:block">
		<a href="/" class="flex items-center gap-2 font-display text-xl font-extrabold">
			<Compass size={20} class="text-emerald-300" />
			Jelajah <span class="mono ml-1 text-emerald-300">Admin</span>
		</a>
		<nav class="mt-12 space-y-1">
			{#each tabs as [l, Icon]}
				<button
					type="button"
					on:click={() => (tab = l)}
					class="flex w-full items-center gap-3 px-3 py-3 text-sm font-semibold transition {tab ===
					l
						? 'bg-white text-ink'
						: 'text-white/70 hover:bg-white/10 hover:text-white'}"
				>
					<svelte:component this={Icon} size={17} />
					{l}
				</button>
			{/each}
		</nav>
	</aside>

	<!-- Main Workspace -->
	<div class="min-w-0">
		<!-- Top Bar -->
		<header
			class="flex h-16 items-center justify-between gap-4 border-b border-line bg-white px-5 sm:px-8"
		>
			<label
				class="flex w-full max-w-sm items-center gap-2 border border-line px-4 py-2 focus-within:border-brand"
			>
				<Search size={16} class="text-slate-400" />
				<input
					bind:value={q}
					placeholder="Search {tab.toLowerCase()}"
					class="w-full bg-transparent text-sm outline-none"
				/>
			</label>
			<div class="flex items-center gap-4">
				<span class="mono hidden sm:inline">{user?.name || 'Admin'}</span>
				<button
					type="button"
					on:click={logout}
					class="flex items-center gap-2 border border-line px-3 py-2 text-sm font-semibold hover:bg-ink hover:text-white"
				>
					<LogOut size={14} />Sign out
				</button>
			</div>
		</header>

		<main class="space-y-8 p-5 sm:p-8">
			<!-- Header Title + Mobile Nav -->
			<div class="flex flex-wrap items-end justify-between gap-3">
				<div>
					<p class="mono text-brand">Admin panel</p>
					<h1 class="text-3xl font-extrabold tracking-tight">{tab}</h1>
				</div>
				<div class="flex flex-wrap gap-1 lg:hidden">
					{#each tabs as [l]}
						<button
							type="button"
							on:click={() => (tab = l)}
							class="px-3 py-1.5 text-xs font-semibold {tab === l
								? 'bg-ink text-white'
								: 'border border-line bg-white'}"
						>
							{l}
						</button>
					{/each}
				</div>
			</div>

			<!-- TAB: DASHBOARD -->
			{#if tab === 'Dashboard'}
				<div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
					{#each stats as [l, v]}
						<div class="border border-line bg-white p-5">
							<p class="mono text-slate-soft">{l}</p>
							<p class="mt-2 font-display text-4xl font-extrabold">{v}</p>
						</div>
					{/each}
				</div>

				<div class="grid gap-6 xl:grid-cols-2">
					<!-- Top Places -->
					<section class="border border-line bg-white p-6">
						<h2 class="font-display text-xl font-bold">Most popular places</h2>
						<p class="mono mb-5 mt-1 text-slate-soft">By review volume</p>
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
						<h2 class="font-display text-xl font-bold">Most searched categories</h2>
						<p class="mono mb-5 mt-1 text-slate-soft">From preference searches</p>
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
			{/if}

			<!-- TAB: PLACES -->
			{#if tab === 'Places'}
				<section class="border border-line bg-white">
					<div class="flex items-center justify-between p-5">
						<h2 class="font-bold">
							All places ({places.filter((p) => p.name.toLowerCase().includes(term)).length})
						</h2>
						<button
							type="button"
							on:click={addPlace}
							class="inline-flex items-center gap-2 bg-brand px-4 py-2 text-sm font-bold text-white hover:bg-emerald-deep"
						>
							<Plus size={16} />Add place
						</button>
					</div>

					<div class="overflow-x-auto">
						<table class="w-full min-w-[760px] text-left text-sm">
							<thead class="bg-slate-50 text-xs uppercase tracking-wider text-slate-soft">
								<tr>
									{#each ['Place', 'Category', 'Price', 'Rating', ''] as h}
										<th class={th}>{h}</th>
									{/each}
								</tr>
							</thead>
							<tbody class="divide-y divide-line">
								{#each places.filter((p) => p.name.toLowerCase().includes(term)) as r (r.id)}
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
										<td class="px-5 py-3">{priceRange(r)}</td>
										<td class="px-5 py-3 font-semibold">{r.rating || '–'}</td>
										<td class="px-5 py-3">
											<div class="flex justify-end gap-1">
												<button
													type="button"
													aria-label="Edit"
													on:click={() => (editing = { ...r })}
													class="p-2 text-slate-soft hover:bg-ocean-soft hover:text-ocean"
												>
													<Pencil size={16} />
												</button>
												<button
													type="button"
													aria-label="Delete"
													on:click={() =>
														confirm(`Delete ${r.name}?`) &&
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
			{/if}

			<!-- TAB: CATEGORIES -->
			{#if tab === 'Categories'}
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
							placeholder="New category name"
							class="{inputCls} max-w-xs"
						/>
						<button
							type="submit"
							class="inline-flex items-center gap-2 bg-brand px-4 py-2 text-sm font-bold text-white hover:bg-emerald-deep"
						>
							<Plus size={16} />Add
						</button>
					</form>

					<table class="w-full text-left text-sm">
						<thead class="bg-slate-50 text-xs uppercase tracking-wider text-slate-soft">
							<tr>
								<th class={th}>Category</th>
								<th class={th}>Places</th>
								<th class={th} />
							</tr>
						</thead>
						<tbody class="divide-y divide-line">
							{#each cats.filter((c) => c.toLowerCase().includes(term)) as c}
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
													Save
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
			{/if}

			<!-- TAB: REVIEWS -->
			{#if tab === 'Reviews'}
				<section class="border border-line bg-white">
					<div class="p-5">
						<h2 class="font-bold">Moderate reviews</h2>
						<p class="text-sm text-slate-soft">
							Hide reviews that break the rules. Hidden reviews disappear from place pages.
						</p>
					</div>
					<div class="overflow-x-auto">
						<table class="w-full min-w-[760px] text-left text-sm">
							<thead class="bg-slate-50 text-xs uppercase tracking-wider text-slate-soft">
								<tr>
									{#each ['Reviewer', 'Place', 'Rating', 'Review', 'Status', ''] as h}
										<th class={th}>{h}</th>
									{/each}
								</tr>
							</thead>
							<tbody class="divide-y divide-line">
								{#each reviews.filter((r) => (r.reviewerName + r.reviewText + placeName(r.placeId))
										.toLowerCase()
										.includes(term)) as r (r.id)}
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
												{r.hidden ? 'Hidden' : 'Visible'}
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
														commitReviews(reviews.filter((x) => x.id !== r.id))}
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
			{/if}

			<!-- TAB: USERS -->
			{#if tab === 'Users'}
				<section class="border border-line bg-white">
					<div class="overflow-x-auto">
						<table class="w-full min-w-[640px] text-left text-sm">
							<thead class="bg-slate-50 text-xs uppercase tracking-wider text-slate-soft">
								<tr>
									{#each ['Name', 'Email', 'Role', ''] as h}
										<th class={th}>{h}</th>
									{/each}
								</tr>
							</thead>
							<tbody class="divide-y divide-line">
								{#each allUsers.filter((u) => (u.name + u.email)
										.toLowerCase()
										.includes(term)) as u (u.email)}
									<tr>
										<td class="px-5 py-3 font-bold">{u.name}</td>
										<td class="px-5 py-3">{u.email}</td>
										<td class="px-5 py-3">
											<span
												class="mono px-2 py-1 {u.role === 'admin'
													? 'bg-ocean-soft text-ocean'
													: 'bg-brand-soft text-emerald-deep'}"
											>
												{u.role}
											</span>
										</td>
										<td class="px-5 py-3">
											<div class="flex justify-end gap-1">
												{#if u.locked}
													<span class="mono py-2 text-slate-400">Built-in</span>
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
															confirm(`Remove ${u.name}?`) &&
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
			{/if}
		</main>
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
</div>
