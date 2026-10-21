<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import {
		ArrowLeft,
		ArrowRight,
		Check,
		Utensils,
		Coffee,
		Trees,
		Landmark,
		Waves,
		Hotel,
		Tag,
		LocateFixed
	} from 'lucide-svelte';
	import { loadPrefs, savePrefs } from '$lib/prefs';
	import { getCategories } from '$lib/data';
	import { ORIGINS } from '$lib/scoring';
	import type { Prefs } from '$lib/types';

	const icons: Record<string, any> = {
		Culinary: Utensils,
		Cafe: Coffee,
		Nature: Trees,
		Culture: Landmark,
		Beach: Waves,
		Resort: Hotel
	};

	const steps = ['Category', 'Budget', 'Distance'];
	const priorities: { v: Prefs['priority']; t: string; d: string }[] = [
		{ v: 'balanced', t: 'Balanced', d: '30 / 25 / 25 / 20' },
		{ v: 'category', t: 'Category first', d: '50 / 20 / 15 / 15' },
		{ v: 'budget', t: 'Budget first', d: '20 / 45 / 20 / 15' },
		{ v: 'distance', t: 'Nearest first', d: '20 / 20 / 45 / 15' },
		{ v: 'rating', t: 'Top rated', d: '20 / 20 / 20 / 40' }
	];

	let step = 0;
	let p: Prefs = {
		categories: ['Culinary', 'Beach'],
		min: 5,
		max: 60,
		radius: 20,
		priority: 'balanced',
		origin: 'Seminyak'
	};
	let categoriesList: string[] = ['Culinary', 'Cafe', 'Nature', 'Culture', 'Beach', 'Resort'];
	let geoErr = '';

	onMount(() => {
		p = loadPrefs();
		categoriesList = getCategories();
	});

	function toggle(c: string) {
		p.categories = p.categories.includes(c)
			? p.categories.filter((x) => x !== c)
			: [...p.categories, c];
	}

	function locate() {
		if (typeof navigator !== 'undefined' && navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(
				(g) => {
					geoErr = '';
					p = {
						...p,
						origin: 'My location',
						coords: [g.coords.latitude, g.coords.longitude]
					};
				},
				() => {
					geoErr = 'Location blocked. Choose an area instead.';
				}
			);
		}
	}

	function submit() {
		savePrefs(p);
		goto('/results');
	}
</script>

<svelte:head>
	<title>Preferences — Jelajah</title>
</svelte:head>

<main class="mx-auto grid max-w-6xl gap-10 px-5 py-12 lg:grid-cols-[1fr_320px]">
	<div>
		<!-- Stepper Header -->
		<ol class="mb-10 flex gap-3">
			{#each steps as s, i}
				<li class="flex-1">
					<button on:click={() => (step = i)} class="w-full text-left">
						<div
							class="h-1.5 rounded-sm transition {i <= step ? 'bg-brand' : 'bg-slate-200'}"
						/>
						<span
							class="mt-2 block text-xs font-bold uppercase tracking-wider {i === step
								? 'text-ink'
								: 'text-slate-400'}"
						>
							{i + 1}. {s}
						</span>
					</button>
				</li>
			{/each}
		</ol>

		<!-- Step Content -->
		<div class="min-h-[360px] rounded-md border border-line bg-white p-6 sm:p-9">
			<!-- Step 0: Category -->
			{#if step === 0}
				<section>
					<h1 class="text-3xl font-extrabold tracking-tight">What are you in the mood for?</h1>
					<p class="mt-2 text-slate-soft">Select one or more categories.</p>
					<div class="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3">
						{#each categoriesList as c}
							{@const Icon = icons[c] ?? Tag}
							{@const on = p.categories.includes(c)}
							<button
								type="button"
								on:click={() => toggle(c)}
								aria-pressed={on}
								class="relative flex flex-col items-start gap-6 rounded-md border-2 p-4 text-left transition {on
									? 'border-brand bg-brand-soft'
									: 'border-line hover:border-slate-300'}"
							>
								<svelte:component
									this={Icon}
									size={24}
									class={on ? 'text-emerald-deep' : 'text-slate-soft'}
								/>
								<span class="font-bold">{c}</span>
								{#if on}
									<span
										class="absolute right-3 top-3 grid h-5 w-5 place-items-center rounded-sm bg-brand text-white"
									>
										<Check size={12} />
									</span>
								{/if}
							</button>
						{/each}
					</div>
				</section>
			{/if}

			<!-- Step 1: Budget -->
			{#if step === 1}
				<section>
					<h1 class="text-3xl font-extrabold tracking-tight">What is your budget?</h1>
					<p class="mt-2 text-slate-soft">Typical spend per person, in USD.</p>
					<div class="mt-8 grid grid-cols-2 gap-4">
						<label class="block">
							<span class="text-xs font-bold uppercase tracking-wider text-slate-soft"
								>Minimum</span
							>
							<div
								class="mt-2 flex items-center rounded-sm border border-line px-4 focus-within:border-brand"
							>
								<span class="text-slate-400">$</span>
								<input
									type="number"
									min="0"
									bind:value={p.min}
									class="w-full bg-transparent px-2 py-3 text-lg font-bold outline-none"
								/>
							</div>
						</label>
						<label class="block">
							<span class="text-xs font-bold uppercase tracking-wider text-slate-soft"
								>Maximum</span
							>
							<div
								class="mt-2 flex items-center rounded-sm border border-line px-4 focus-within:border-brand"
							>
								<span class="text-slate-400">$</span>
								<input
									type="number"
									min="0"
									bind:value={p.max}
									class="w-full bg-transparent px-2 py-3 text-lg font-bold outline-none"
								/>
							</div>
						</label>
					</div>
					<div class="mt-8 space-y-5">
						<input
							type="range"
							min="0"
							max="300"
							bind:value={p.min}
							on:input={() => {
								if (p.min > p.max) p.max = p.min;
							}}
							class="w-full"
							aria-label="Minimum budget"
						/>
						<input
							type="range"
							min="0"
							max="300"
							bind:value={p.max}
							on:input={() => {
								if (p.max < p.min) p.min = p.max;
							}}
							class="w-full"
							aria-label="Maximum budget"
						/>
						<div class="flex justify-between text-xs text-slate-400">
							<span>$0</span><span>$150</span><span>$300+</span>
						</div>
					</div>
				</section>
			{/if}

			<!-- Step 2: Distance & Weights -->
			{#if step === 2}
				<section>
					<h1 class="text-3xl font-extrabold tracking-tight">How far will you go?</h1>
					<p class="mt-2 text-slate-soft">Pick your starting point and a radius.</p>
					<div class="mt-6 flex flex-wrap gap-2">
						{#each Object.keys(ORIGINS) as o}
							<button
								type="button"
								on:click={() => {
									p.origin = o;
									p.coords = undefined;
								}}
								aria-pressed={p.origin === o && !p.coords}
								class="border px-3 py-2 text-sm font-semibold transition {p.origin === o &&
								!p.coords
									? 'border-brand bg-brand text-white'
									: 'border-line hover:border-slate-400'}"
							>
								{o}
							</button>
						{/each}
						<button
							type="button"
							on:click={locate}
							aria-pressed={!!p.coords}
							class="flex items-center gap-2 border px-3 py-2 text-sm font-semibold transition {p.coords
								? 'border-ocean bg-ocean text-white'
								: 'border-line hover:border-slate-400'}"
						>
							<LocateFixed size={14} />Use my location
						</button>
					</div>
					{#if geoErr}
						<p class="mt-2 text-sm text-red-600">{geoErr}</p>
					{/if}

					<div class="mt-8 flex items-end gap-2">
						<span class="text-6xl font-extrabold text-brand">{p.radius}</span>
						<span class="pb-2 font-semibold text-slate-soft">km</span>
					</div>
					<input
						type="range"
						min="1"
						max="50"
						bind:value={p.radius}
						class="mt-4 w-full"
						aria-label="Radius"
					/>

					<h2 class="mono mt-10 text-slate-soft">
						What matters most? (category / budget / location / rating)
					</h2>
					<div class="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
						{#each priorities as o}
							<button
								type="button"
								on:click={() => (p.priority = o.v)}
								aria-pressed={p.priority === o.v}
								class="rounded-sm border-2 p-3 text-left transition {p.priority === o.v
									? 'border-ocean bg-ocean-soft'
									: 'border-line hover:border-slate-300'}"
							>
								<span class="block text-sm font-bold">{o.t}</span>
								<span class="text-xs text-slate-soft">{o.d}</span>
							</button>
						{/each}
					</div>
				</section>
			{/if}
		</div>

		<!-- Action buttons -->
		<div class="mt-6 flex justify-between">
			<button
				type="button"
				on:click={() => (step = Math.max(0, step - 1))}
				disabled={step === 0}
				class="inline-flex items-center gap-2 rounded-sm px-5 py-3 font-semibold text-slate-soft transition hover:bg-slate-100 disabled:opacity-30"
			>
				<ArrowLeft size={16} />Back
			</button>
			{#if step < 2}
				<button
					type="button"
					on:click={() => (step = step + 1)}
					class="inline-flex items-center gap-2 rounded-sm bg-ink px-7 py-3 font-bold text-white transition hover:bg-brand"
				>
					Continue <ArrowRight size={16} />
				</button>
			{:else}
				<button
					type="button"
					on:click={submit}
					class="inline-flex items-center gap-2 rounded-sm bg-brand px-7 py-3 font-bold text-white shadow-lg shadow-emerald-600/25 transition hover:bg-emerald-deep"
				>
					Show my matches <ArrowRight size={16} />
				</button>
			{/if}
		</div>
	</div>

	<!-- Sidebar Summary -->
	<aside class="h-fit rounded-md bg-ink p-7 text-white lg:sticky lg:top-24">
		<h2 class="text-xs font-bold uppercase tracking-wider text-emerald-300">Your profile</h2>
		<dl class="mt-5 space-y-5 text-sm">
			<div>
				<dt class="text-slate-400">Categories</dt>
				<dd class="mt-1 font-semibold">{p.categories.join(', ') || 'Any'}</dd>
			</div>
			<div>
				<dt class="text-slate-400">Budget</dt>
				<dd class="mt-1 font-semibold">${p.min} – ${p.max}</dd>
			</div>
			<div>
				<dt class="text-slate-400">Radius</dt>
				<dd class="mt-1 font-semibold">
					{p.radius} km from {p.coords ? 'you' : p.origin}
				</dd>
			</div>
			<div>
				<dt class="text-slate-400">Weights</dt>
				<dd class="mt-1 font-semibold capitalize">{p.priority}</dd>
			</div>
		</dl>
	</aside>
</main>
