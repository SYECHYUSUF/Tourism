<script lang="ts">
	import { onMount } from 'svelte';
	import { ArrowLeft, Clock, MapPin, Wallet, Navigation, Star, ImagePlus, X } from 'lucide-svelte';
	import Stars from '$components/Stars.svelte';
	import MapComponent from '$components/MapComponent.svelte';
	import WishlistButton from '$components/WishlistButton.svelte';
	import { getReviews, saveReviews } from '$lib/data';
	import { loadPrefs } from '$lib/prefs';
	import { priceRange, matchScore, distanceKm, originCoords } from '$lib/scoring';
	import type { PageData } from './$types';
	import type { Review, Prefs } from '$lib/types';

	export let data: PageData;

	$: place = data.place;
	$: all = data.all;

	let active = 0;
	let reviews: Review[] = [];
	let form = { r: 5, t: '', photo: '' };
	let prefs: Prefs;
	let origin: [number, number] = [-8.6913, 115.1682]; // default Seminyak
	let currentUser: any = null;

	onMount(async () => {
		prefs = loadPrefs();
		origin = originCoords(prefs);
		reviews = getReviews();

		// Check local storage or session
		const { supabase } = await import('$lib/supabaseClient');
		const {
			data: { session }
		} = await supabase.auth.getSession();
		if (session?.user) {
			currentUser = {
				name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'User',
				email: session.user.email
			};
		} else {
			// check demo session
			try {
				const sess = JSON.parse(localStorage.getItem('session') || 'null');
				if (sess) currentUser = sess;
			} catch {}
		}
	});

	$: gallery = [
		place.image,
		...all
			.filter((p) => p.id !== place.id)
			.slice(0, 3)
			.map((p) => p.image)
	];

	$: mine = reviews.filter((r) => r.placeId === place.id && !r.hidden);
	$: avg = mine.length ? mine.reduce((a, r) => a + r.rating, 0) / mine.length : place.rating;

	function pickPhoto(files: FileList | null) {
		const f = files?.[0];
		if (!f) return;
		const img = new Image();
		const url = URL.createObjectURL(f);
		img.onload = () => {
			const c = document.createElement('canvas');
			const s = Math.min(1, 640 / img.width);
			c.width = img.width * s;
			c.height = img.height * s;
			c.getContext('2d')?.drawImage(img, 0, 0, c.width, c.height);
			form.photo = c.toDataURL('image/jpeg', 0.7);
			URL.revokeObjectURL(url);
		};
		img.src = url;
	}

	function submitReview() {
		if (!currentUser || !form.t.trim()) return;
		const next: Review[] = [
			{
				id: crypto.randomUUID(),
				placeId: place.id,
				reviewerName: currentUser.name,
				rating: form.r,
				reviewText: form.t.trim(),
				photoUrl: form.photo || undefined,
				hidden: false,
				createdAt: new Date().toISOString().slice(0, 10)
			},
			...reviews
		];
		saveReviews(next);
		reviews = next;
		form = { r: 5, t: '', photo: '' };
	}
</script>

<svelte:head>
	<title>{place.name} — Jelajah</title>
</svelte:head>

<main class="mx-auto max-w-[1400px] px-5 py-8 lg:px-10">
	<a
		href="/results"
		class="mono inline-flex items-center gap-2 text-slate-soft hover:text-brand"
	>
		<ArrowLeft size={14} />Back to results
	</a>

	<!-- Gallery -->
	<div class="mt-5 grid gap-3 lg:grid-cols-[1fr_150px]">
		<div class="aspect-[16/10] overflow-hidden bg-slate-200 lg:aspect-[16/9]">
			<img src={gallery[active]} alt={place.name} class="h-full w-full object-cover" />
		</div>
		<div class="grid grid-cols-4 gap-3 lg:grid-cols-1 lg:grid-rows-4">
			{#each gallery as g, i}
				<button
					type="button"
					on:click={() => (active = i)}
					class="overflow-hidden bg-slate-200 outline-2 transition {i === active
						? 'outline outline-brand'
						: 'opacity-60 hover:opacity-100'}"
				>
					<img src={g} alt="{place.name} view {i + 1}" class="h-full w-full object-cover" />
				</button>
			{/each}
		</div>
	</div>

	<!-- Main Details & Sidebar Grid -->
	<div class="mt-10 grid gap-12 lg:grid-cols-[1fr_380px]">
		<div>
			<div class="flex flex-wrap items-center gap-3">
				<span class="mono bg-brand-soft px-3 py-1 text-emerald-deep">{place.category}</span>
				{#if prefs}
					<span class="mono bg-forest px-3 py-1 text-white"
						>{matchScore(place, prefs)}% match</span
					>
				{/if}
			</div>

			<div class="mt-4 flex items-start justify-between gap-4">
				<h1 class="text-5xl font-extrabold tracking-tight">{place.name}</h1>
				<WishlistButton
					placeId={place.id}
					userEmail={currentUser?.email}
					label
					className="shrink-0 border border-line bg-white px-4 py-2 text-sm hover:border-red-300"
				/>
			</div>

			<div class="mt-3 flex flex-wrap items-center gap-4 text-sm text-slate-soft">
				<span class="flex items-center gap-2">
					<Stars value={avg} />
					<b class="text-ink">{avg.toFixed(1)}</b> ({mine.length} reviews)
				</span>
				<span class="flex items-center gap-1">
					<MapPin size={14} />{place.address}
				</span>
			</div>

			<p class="mt-6 max-w-2xl text-lg leading-relaxed text-slate-soft">{place.blurb}</p>

			<div class="mt-5 flex flex-wrap gap-2">
				{#each place.tags as t}
					<span class="border border-line bg-white px-3 py-1 text-sm">{t}</span>
				{/each}
			</div>

			<!-- Location Map Section -->
			<section class="mt-14">
				<div class="flex items-end justify-between">
					<h2 class="text-2xl font-extrabold">Location</h2>
					<span class="mono text-slate-soft">
						{distanceKm(place, origin)} km from {prefs?.coords ? 'you' : prefs?.origin ?? 'Seminyak'}
					</span>
				</div>
				<div class="mt-4">
					<MapComponent lat={place.lat} lng={place.lng} name={place.name} {origin} />
				</div>
			</section>

			<!-- Reviews Section -->
			<section class="mt-14">
				<h2 class="text-2xl font-extrabold">Reviews</h2>

				{#if currentUser}
					<form
						on:submit|preventDefault={submitReview}
						class="mt-4 space-y-4 border border-line bg-white p-5"
					>
						<div class="flex items-center justify-between">
							<span class="text-sm font-semibold">Reviewing as {currentUser.name}</span>
							<div class="flex gap-1" role="radiogroup" aria-label="Rating">
								{#each [1, 2, 3, 4, 5] as i}
									<button
										type="button"
										on:click={() => (form.r = i)}
										aria-label="{i} stars"
									>
										<Star
											size={24}
											class={i <= form.r
												? 'fill-amber-400 text-amber-400'
												: 'text-slate-300'}
										/>
									</button>
								{/each}
							</div>
						</div>

						<textarea
							required
							bind:value={form.t}
							rows="3"
							placeholder="Share your experience"
							class="w-full border border-line px-4 py-3 outline-none focus:border-brand"
						/>

						<div class="flex flex-wrap items-center justify-between gap-3">
							<div class="flex items-center gap-3">
								<label
									class="mono flex cursor-pointer items-center gap-2 border border-dashed border-slate-300 px-3 py-2 text-slate-soft hover:border-brand hover:text-brand"
								>
									<ImagePlus size={14} />Add photo (optional)
									<input
										type="file"
										accept="image/*"
										class="hidden"
										on:change={(e) => pickPhoto(e.currentTarget.files)}
									/>
								</label>
								{#if form.photo}
									<span class="relative">
										<img
											src={form.photo}
											alt="Preview"
											class="h-10 w-10 object-cover"
										/>
										<button
											type="button"
											aria-label="Remove photo"
											on:click={() => (form.photo = '')}
											class="absolute -right-2 -top-2 grid h-4 w-4 place-items-center bg-ink text-white"
										>
											<X size={10} />
										</button>
									</span>
								{/if}
							</div>
							<button
								type="submit"
								class="bg-brand px-6 py-2.5 font-bold text-white transition hover:bg-emerald-deep"
							>
								Post review
							</button>
						</div>
					</form>
				{:else}
					<div
						class="mt-4 flex flex-wrap items-center justify-between gap-3 border border-dashed border-line bg-white p-5"
					>
						<p class="text-slate-soft">Sign in to rate this place and share photos.</p>
						<a
							href="/login"
							class="bg-ink px-5 py-2.5 text-sm font-bold text-white hover:bg-brand"
						>
							Sign in to review
						</a>
					</div>
				{/if}

				<ul class="mt-6 divide-y divide-line">
					{#each mine as r (r.id)}
						<li class="flex gap-4 py-5">
							<span
								class="grid h-10 w-10 shrink-0 place-items-center bg-ocean-soft font-bold text-ocean"
							>
								{r.reviewerName?.[0] ?? 'U'}
							</span>
							<div>
								<div class="flex flex-wrap items-center gap-3">
									<b>{r.reviewerName}</b>
									<Stars value={r.rating} size={12} />
									<span class="mono text-slate-400">{r.createdAt}</span>
								</div>
								<p class="mt-1 text-slate-soft">{r.reviewText}</p>
								{#if r.photoUrl}
									<img
										src={r.photoUrl}
										alt="Review attachment"
										class="mt-3 h-28 w-40 object-cover"
									/>
								{/if}
							</div>
						</li>
					{/each}
					{#if mine.length === 0}
						<li class="py-8 text-slate-soft">No reviews yet. Be the first.</li>
					{/if}
				</ul>
			</section>
		</div>

		<!-- Sticky Right Aside -->
		<aside class="h-fit space-y-5 border border-line bg-white p-6 lg:sticky lg:top-24">
			<div class="flex gap-4">
				<span class="grid h-11 w-11 place-items-center bg-brand-soft text-emerald-deep">
					<Wallet size={20} />
				</span>
				<div>
					<p class="mono text-slate-soft">Average price</p>
					<p class="font-display text-2xl font-extrabold">{priceRange(place)}</p>
				</div>
			</div>

			<div class="flex gap-4">
				<span class="grid h-11 w-11 place-items-center bg-ocean-soft text-ocean">
					<Clock size={20} />
				</span>
				<div>
					<p class="mono text-slate-soft">Operating hours</p>
					<p class="font-bold">{place.hours}</p>
				</div>
			</div>

			<div class="flex gap-4">
				<span class="grid h-11 w-11 place-items-center bg-slate-100 text-ink">
					<MapPin size={20} />
				</span>
				<div>
					<p class="mono text-slate-soft">Address</p>
					<p class="font-bold">{place.address}</p>
				</div>
			</div>

			<table class="w-full border-t border-line text-sm">
				<tbody>
					{#each [['Mon – Fri', place.hours], ['Saturday', place.hours], ['Sunday', place.hours]] as [d, h]}
						<tr>
							<td class="py-1.5 text-slate-soft">{d}</td>
							<td class="py-1.5 text-right font-semibold">{h}</td>
						</tr>
					{/each}
				</tbody>
			</table>

			<a
				href="https://www.openstreetmap.org/directions?from={origin[0]},{origin[1]}&to={place.lat},{place.lng}"
				target="_blank"
				rel="noreferrer"
				class="flex w-full items-center justify-center gap-2 bg-ink py-3 font-bold text-white transition hover:bg-brand"
			>
				<Navigation size={16} />Get directions
			</a>
		</aside>
	</div>
</main>
