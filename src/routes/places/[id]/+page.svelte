<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import {
		ArrowLeft,
		Clock,
		MapPin,
		Wallet,
		Navigation,
		Star,
		ImagePlus,
		X,
		Phone,
		Instagram,
		Share2,
		Check,
		Sparkles,
		ShieldCheck,
		Trash2
	} from 'lucide-svelte';
	import Stars from '$components/Stars.svelte';
	import MapComponent from '$components/MapComponent.svelte';
	import WishlistButton from '$components/WishlistButton.svelte';
	import PlaceCard from '$components/PlaceCard.svelte';
	import { enhance } from '$app/forms';
	import { loadPrefs } from '$lib/prefs';
	import { priceRange, matchScore, distanceKm, originCoords } from '$lib/scoring';
	import { t, locale } from '$lib/i18n';
	import type { PageData, ActionData } from './$types';
	import type { Review, Prefs } from '$lib/types';

	export let data: PageData;
	export let form: ActionData;

	$: place = data.place;
	$: all = data.all;
	$: reviews = data.reviews || [];
	$: userReview = data.userReview || null;

	let active = 0;
	let reviewForm = { r: 5, t: '' };
	let selectedBlob: Blob | null = null;
	let previewUrl: string | null = null;
	let removePhoto = false;
	let submitting = false;
	let deleting = false;

	let prefs: Prefs;
	let origin: [number, number] = [-8.6913, 115.1682]; // default Seminyak
	$: currentUser = $page.data.user;
	let copied = false;

	// Populate form with user's existing review if present
	$: if (userReview) {
		reviewForm.r = userReview.rating;
		reviewForm.t = userReview.reviewText;
		if (!selectedBlob && !removePhoto) {
			previewUrl = userReview.photoUrl || null;
		}
	} else if (!form || !('values' in form) || !form.values) {
		reviewForm = { r: 5, t: '' };
		if (!selectedBlob) {
			previewUrl = null;
		}
	}

	onMount(() => {
		prefs = loadPrefs();
		origin = originCoords(prefs);
	});

	$: gallery =
		place.gallery && place.gallery.length > 0
			? place.gallery
			: [place.image];

	function pickPhoto(files: FileList | null) {
		const f = files?.[0];
		if (!f) return;
		const img = new Image();
		const objectUrl = URL.createObjectURL(f);
		img.onload = () => {
			const c = document.createElement('canvas');
			const maxDim = 1200;
			const s = Math.min(1, maxDim / Math.max(img.width, img.height));
			c.width = img.width * s;
			c.height = img.height * s;
			const ctx = c.getContext('2d');
			ctx?.drawImage(img, 0, 0, c.width, c.height);
			c.toBlob(
				(blob) => {
					if (blob) {
						selectedBlob = blob;
						if (previewUrl && previewUrl.startsWith('blob:')) {
							URL.revokeObjectURL(previewUrl);
						}
						previewUrl = URL.createObjectURL(blob);
						removePhoto = false;
					}
				},
				'image/jpeg',
				0.82
			);
			URL.revokeObjectURL(objectUrl);
		};
		img.src = objectUrl;
	}

	function handleRemovePhoto() {
		if (previewUrl && previewUrl.startsWith('blob:')) {
			URL.revokeObjectURL(previewUrl);
		}
		previewUrl = null;
		selectedBlob = null;
		removePhoto = true;
	}

	function handleDeleteReview() {
		if (confirm($t.detail.deleteConfirm)) {
			const deleteForm = document.getElementById('delete-review-form') as HTMLFormElement;
			deleteForm?.requestSubmit();
		}
	}

	function sharePlace() {
		if (typeof navigator !== 'undefined' && navigator.share) {
			navigator
				.share({
					title: place.name,
					text: `Lihat rekomendasi tempat ini di Jelajah: ${place.name} (${place.category} di ${place.area})`,
					url: window.location.href
				})
				.catch(() => {});
		} else if (typeof navigator !== 'undefined' && navigator.clipboard) {
			navigator.clipboard.writeText(window.location.href);
			copied = true;
			setTimeout(() => {
				copied = false;
			}, 2500);
		}
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
		<ArrowLeft size={14} />{$t.detail.back}
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
						>{matchScore(place, prefs)}{$t.common.match}</span
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
					<Stars value={place.rating} />
					<b class="text-ink">{place.rating.toFixed(1)}</b> ({place.reviewCount} {$t.detail.reviewsCount})
				</span>
				<span class="flex items-center gap-1">
					<MapPin size={14} />{place.address}
				</span>
			</div>

			<p class="mt-6 max-w-2xl text-lg leading-relaxed text-slate-soft">{place.blurb}</p>

			<div class="mt-5 flex flex-wrap gap-2">
				{#each place.tags as tItem}
					<span class="border border-line bg-white px-3 py-1 text-sm">{tItem}</span>
				{/each}
			</div>

			<!-- Highlights (Keunggulan / Menu Rekomendasi) -->
			{#if place.highlights && place.highlights.length > 0}
				<div class="mt-8 rounded-md border border-line bg-brand-soft/40 p-5">
					<div class="flex items-center gap-2 font-bold text-emerald-deep">
						<Sparkles size={18} />
						<span>{$locale === 'id' ? 'Menu & Daya Tarik Utama' : 'Highlights & Signatures'}</span>
					</div>
					<div class="mt-3 flex flex-wrap gap-2">
						{#each place.highlights as hl}
							<span class="rounded border border-line bg-white px-3 py-1.5 text-xs font-bold text-ink shadow-sm">
								★ {hl}
							</span>
						{/each}
					</div>
				</div>
			{/if}

			<!-- Facilities (Fasilitas & Layanan) -->
			{#if place.facilities && place.facilities.length > 0}
				<div class="mt-8">
					<h3 class="text-xl font-bold">{$locale === 'id' ? 'Fasilitas & Fasilitas Pendukung' : 'Amenities & Facilities'}</h3>
					<div class="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
						{#each place.facilities as fac}
							<div class="flex items-center gap-2 rounded border border-line bg-white p-3 text-sm">
								<Check size={16} class="shrink-0 text-brand" />
								<span class="font-medium text-slate-700">{fac}</span>
							</div>
						{/each}
					</div>
				</div>
			{/if}

			<!-- Location Map Section -->
			<section class="mt-14">
				<div class="flex items-end justify-between">
					<h2 class="text-2xl font-extrabold">{$t.detail.location}</h2>
					<span class="mono text-slate-soft">
						{distanceKm(place, origin)} {$t.detail.distanceFrom} {prefs?.coords ? $t.find.you : prefs?.origin ?? 'Seminyak'}
					</span>
				</div>
				<div class="mt-4">
					<MapComponent lat={place.lat} lng={place.lng} name={place.name} {origin} />
				</div>
			</section>

			<!-- Reviews Section -->
			<section class="mt-14">
				<div class="flex items-baseline justify-between">
					<h2 class="text-2xl font-extrabold">{$t.detail.reviews}</h2>
					<span class="mono text-sm text-slate-soft">
						{data.totalReviews} {$t.detail.reviewsCount}
					</span>
				</div>

				{#if form?.deleteSuccess}
					<div class="mt-4 border border-emerald-500 bg-emerald-50 p-4 text-sm font-semibold text-emerald-800">
						{form.message || $t.detail.reviewDeleted}
					</div>
				{/if}

				{#if currentUser}
					{#if form?.reviewSuccess}
						<div class="mt-4 border border-emerald-500 bg-emerald-50 p-4 text-sm font-semibold text-emerald-800">
							{form.message || $t.detail.reviewSuccess}
						</div>
					{:else if form?.reviewError && form?.message}
						<div class="mt-4 border border-red-500 bg-red-50 p-4 text-sm font-semibold text-red-800">
							{form.message}
						</div>
					{/if}

					<!-- Hidden form for deleting review -->
					<form
						id="delete-review-form"
						method="POST"
						action="?/deleteReview"
						use:enhance={() => {
							deleting = true;
							return async ({ update }) => {
								await update();
								deleting = false;
								selectedBlob = null;
								previewUrl = null;
								removePhoto = false;
								reviewForm = { r: 5, t: '' };
							};
						}}
						class="hidden"
					/>

					<form
						method="POST"
						action="?/review"
						enctype="multipart/form-data"
						use:enhance={({ formData }) => {
							submitting = true;
							if (selectedBlob) {
								formData.set('photo', selectedBlob, 'photo.jpg');
							}
							if (removePhoto) {
								formData.set('removePhoto', 'true');
							}
							return async ({ update, result }) => {
								await update();
								submitting = false;
								if (result.type === 'success') {
									selectedBlob = null;
									removePhoto = false;
								}
							};
						}}
						class="mt-4 space-y-4 border border-line bg-white p-5"
					>
						<input type="hidden" name="rating" value={reviewForm.r} />

						<div class="flex items-center justify-between">
							<span class="text-sm font-semibold">
								{$t.detail.reviewingAs} {currentUser.name}
								{#if userReview}
									<span class="ml-2 rounded bg-amber-100 px-2 py-0.5 text-xs font-bold text-amber-800">
										{$t.detail.editReview}
									</span>
								{/if}
							</span>
							<div class="flex gap-1" role="radiogroup" aria-label="Rating">
								{#each [1, 2, 3, 4, 5] as i}
									<button
										type="button"
										on:click={() => (reviewForm.r = i)}
										aria-label="{i} stars"
									>
										<Star
											size={24}
											class={i <= reviewForm.r
												? 'fill-amber-400 text-amber-400'
												: 'text-slate-300'}
										/>
									</button>
								{/each}
							</div>
						</div>
						{#if form?.errors?.rating}
							<p class="text-xs font-semibold text-red-600">{form.errors.rating}</p>
						{/if}

						<textarea
							required
							name="reviewText"
							bind:value={reviewForm.t}
							rows="3"
							minlength="10"
							maxlength="1000"
							placeholder={$t.detail.shareExperience}
							class="w-full border border-line px-4 py-3 outline-none focus:border-brand"
						/>
						<div class="flex justify-between text-xs text-slate-400">
							{#if form?.errors?.reviewText}
								<span class="font-semibold text-red-600">{form.errors.reviewText}</span>
							{:else}
								<span>{$t.detail.textLengthError}</span>
							{/if}
							<span>{reviewForm.t.length} / 1000</span>
						</div>

						<div class="flex flex-wrap items-center justify-between gap-3">
							<div class="flex items-center gap-3">
								<label
									class="mono flex cursor-pointer items-center gap-2 border border-dashed border-slate-300 px-3 py-2 text-slate-soft hover:border-brand hover:text-brand"
								>
									<ImagePlus size={14} />{$t.detail.addPhoto}
									<input
										type="file"
										accept="image/jpeg,image/png,image/webp"
										class="hidden"
										on:change={(e) => pickPhoto(e.currentTarget.files)}
									/>
								</label>
								{#if previewUrl}
									<span class="relative">
										<img
											src={previewUrl}
											alt="Review attachment preview"
											class="h-12 w-12 rounded object-cover border border-line"
										/>
										<button
											type="button"
											aria-label={$t.detail.removePhoto}
											on:click={handleRemovePhoto}
											class="absolute -right-2 -top-2 grid h-5 w-5 place-items-center rounded-full bg-ink text-white hover:bg-red-600"
										>
											<X size={12} />
										</button>
									</span>
								{/if}
								{#if form?.errors?.photo}
									<span class="text-xs font-semibold text-red-600">{form.errors.photo}</span>
								{/if}
							</div>

							<div class="flex items-center gap-2">
								{#if userReview}
									<button
										type="button"
										disabled={deleting || submitting}
										on:click={handleDeleteReview}
										class="flex items-center gap-1.5 border border-red-200 bg-white px-4 py-2.5 text-sm font-bold text-red-600 transition hover:bg-red-50 disabled:opacity-50"
									>
										<Trash2 size={15} />
										{$t.detail.deleteReview}
									</button>
								{/if}
								<button
									type="submit"
									disabled={submitting || deleting}
									class="bg-brand px-6 py-2.5 font-bold text-white transition hover:bg-emerald-deep disabled:opacity-50"
								>
									{submitting
										? $t.common.loading
										: userReview
											? $t.detail.saveChanges
											: $t.detail.postReview}
								</button>
							</div>
						</div>
					</form>
				{:else}
					<div
						class="mt-4 flex flex-wrap items-center justify-between gap-3 border border-dashed border-line bg-white p-5"
					>
						<p class="text-slate-soft">{$t.detail.signInPrompt}</p>
						<a
							href="/login?redirectTo=/places/{place.id}"
							class="bg-ink px-5 py-2.5 text-sm font-bold text-white hover:bg-brand"
						>
							{$t.detail.signInBtn}
						</a>
					</div>
				{/if}

				<!-- Reviews List -->
				<ul class="mt-6 divide-y divide-line">
					{#each reviews as r (r.id)}
						<li class="flex gap-4 py-5">
							<span
								class="grid h-10 w-10 shrink-0 place-items-center bg-ocean-soft font-bold text-ocean"
							>
								{r.reviewerName?.[0] ?? 'U'}
							</span>
							<div class="w-full">
								<div class="flex flex-wrap items-center gap-3">
									<b>{r.reviewerName}</b>
									{#if currentUser && r.userId === currentUser.id}
										<span class="rounded bg-brand-soft px-2 py-0.5 text-xs font-bold text-emerald-deep">
											{$locale === 'id' ? 'Ulasan Anda' : 'Your Review'}
										</span>
									{/if}
									<Stars value={r.rating} size={12} />
									<span class="mono text-slate-400">{r.createdAt}</span>
								</div>
								<p class="mt-1 text-slate-soft leading-relaxed">{r.reviewText}</p>
								{#if r.photoUrl}
									<a href={r.photoUrl} target="_blank" rel="noreferrer" class="mt-3 inline-block">
										<img
											src={r.photoUrl}
											alt="Review attachment"
											class="h-28 w-40 object-cover rounded border border-line transition hover:opacity-95"
										/>
									</a>
								{/if}
							</div>
						</li>
					{/each}
					{#if reviews.length === 0}
						<li class="py-8 text-slate-soft">{$t.detail.noReviews}</li>
					{/if}
				</ul>

				<!-- Pagination Controls -->
				{#if data.totalPages > 1}
					<div class="mt-8 flex items-center justify-between border-t border-line pt-4">
						{#if data.page > 1}
							<a
								href="/places/{place.id}?page={data.page - 1}"
								class="mono border border-line bg-white px-4 py-2 text-sm font-bold text-ink hover:border-brand hover:text-brand"
							>
								← {$t.detail.prevPage}
							</a>
						{:else}
							<span class="mono border border-transparent px-4 py-2 text-sm text-slate-300">
								← {$t.detail.prevPage}
							</span>
						{/if}

						<span class="mono text-sm text-slate-soft">
							{$t.detail.pageOf.replace('{page}', String(data.page)).replace('{totalPages}', String(data.totalPages))}
						</span>

						{#if data.page < data.totalPages}
							<a
								href="/places/{place.id}?page={data.page + 1}"
								class="mono border border-line bg-white px-4 py-2 text-sm font-bold text-ink hover:border-brand hover:text-brand"
							>
								{$t.detail.nextPage} →
							</a>
						{:else}
							<span class="mono border border-transparent px-4 py-2 text-sm text-slate-300">
								{$t.detail.nextPage} →
							</span>
						{/if}
					</div>
				{/if}
			</section>
		</div>

		<!-- Sticky Right Aside -->
		<aside class="h-fit space-y-5 border border-line bg-white p-6 lg:sticky lg:top-24">
			<div class="flex gap-4">
				<span class="grid h-11 w-11 place-items-center bg-brand-soft text-emerald-deep">
					<Wallet size={20} />
				</span>
				<div>
					<p class="mono text-slate-soft">{$t.detail.avgPrice}</p>
					<p class="font-display text-2xl font-extrabold">{priceRange(place, $locale === 'en')}</p>
				</div>
			</div>

			<div class="flex gap-4">
				<span class="grid h-11 w-11 place-items-center bg-ocean-soft text-ocean">
					<Clock size={20} />
				</span>
				<div>
					<p class="mono text-slate-soft">{$t.detail.hours}</p>
					<p class="font-bold">{place.hours}</p>
				</div>
			</div>

			<div class="flex gap-4">
				<span class="grid h-11 w-11 place-items-center bg-slate-100 text-ink">
					<MapPin size={20} />
				</span>
				<div>
					<p class="mono text-slate-soft">{$t.detail.address}</p>
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

			<div class="space-y-2 pt-2">
				{#if place.gmapsUrl}
					<a
						href={place.gmapsUrl}
						target="_blank"
						rel="noreferrer"
						class="flex w-full items-center justify-center gap-2 border border-line bg-white py-3 font-bold text-ink transition hover:border-brand hover:text-brand shadow-sm"
					>
						<MapPin size={16} class="text-red-500" />
						{$locale === 'id' ? 'Buka di Google Maps' : 'Open in Google Maps'}
					</a>
				{/if}

				<a
					href="https://www.openstreetmap.org/directions?from={origin[0]},{origin[1]}&to={place.lat},{place.lng}"
					target="_blank"
					rel="noreferrer"
					class="flex w-full items-center justify-center gap-2 bg-ink py-3 font-bold text-white transition hover:bg-brand"
				>
					<Navigation size={16} />{$t.detail.directions}
				</a>

				<button
					type="button"
					on:click={sharePlace}
					class="flex w-full items-center justify-center gap-2 border border-line bg-white py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
				>
					{#if copied}
						<Check size={16} class="text-emerald-600" />
						<span class="text-emerald-600 font-bold">{$locale === 'id' ? 'Tautan Tersalin!' : 'Link Copied!'}</span>
					{:else}
						<Share2 size={16} />
						{$locale === 'id' ? 'Bagikan Tempat Ini' : 'Share Place'}
					{/if}
				</button>
			</div>

			{#if place.phone || place.instagram}
				<div class="border-t border-line pt-4 text-xs text-slate-soft space-y-2">
					{#if place.phone}
						<div class="flex items-center justify-between">
							<span class="flex items-center gap-1.5"><Phone size={13} /> Kontak</span>
							<a href="tel:{place.phone}" class="font-bold text-ink hover:text-brand">{place.phone}</a>
						</div>
					{/if}
					{#if place.instagram}
						<div class="flex items-center justify-between">
							<span class="flex items-center gap-1.5"><Instagram size={13} /> Instagram</span>
							<a
								href="https://instagram.com/{place.instagram.replace('@', '')}"
								target="_blank"
								rel="noreferrer"
								class="font-bold text-ink hover:text-brand"
							>
								{place.instagram}
							</a>
						</div>
					{/if}
				</div>
			{/if}
		</aside>
	</div>

	<!-- Similar Places Section -->
	{#if data.similarPlaces && data.similarPlaces.length > 0}
		<section class="mt-16 border-t border-line pt-10">
			<h2 class="text-2xl font-extrabold tracking-tight">{$t.detail.similarPlaces}</h2>
			<div class="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
				{#each data.similarPlaces as sp (sp.id)}
					<PlaceCard
						place={sp}
						distance={distanceKm(sp, origin)}
						score={prefs ? matchScore(sp, prefs) : undefined}
					/>
				{/each}
			</div>
		</section>
	{/if}
</main>
