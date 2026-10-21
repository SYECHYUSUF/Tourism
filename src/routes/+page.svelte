<script lang="ts">
	import { ArrowRight, Quote } from 'lucide-svelte';
	import PlaceCard from '$components/PlaceCard.svelte';
	import { SEED_PLACES } from '$lib/data';
	import { matchScore, distanceKm, ORIGINS } from '$lib/scoring';
	import { DEFAULT_PREFS } from '$lib/prefs';
	import { t } from '$lib/i18n';

	const hero =
		'https://images.unsplash.com/photo-1650761827030-38288141cbe6?w=2400&fit=crop&auto=format&q=80';

	const origin = ORIGINS[DEFAULT_PREFS.origin];
	const featured = SEED_PLACES.slice(0, 4).map((p) => ({
		p,
		score: matchScore(p, DEFAULT_PREFS),
		distance: distanceKm(p, origin)
	}));
</script>

<svelte:head>
	<title>{$t.landing.badge} — Jelajah</title>
</svelte:head>

<main>
	<!-- Hero -->
	<section class="relative flex h-[100svh] min-h-[620px] items-end overflow-hidden bg-forest text-white">
		<img src={hero} alt="Palm-fringed beach and clear water" class="absolute inset-0 h-full w-full object-cover" />
		<div class="absolute inset-0 bg-gradient-to-t from-forest via-forest/35 to-forest/20" />
		<div class="relative mx-auto w-full max-w-[1400px] px-5 pb-14 lg:px-10">
			<p class="mono rise text-emerald-300">{$t.landing.badge}</p>
			<h1
				class="rise mt-5 max-w-5xl font-display text-[clamp(3.2rem,10vw,9.5rem)] font-extrabold leading-[0.9]"
				style="animation-delay:.15s"
			>
				{$t.landing.heroTitle1}<br /><span class="text-emerald-300">{$t.landing.heroTitle2}</span>
			</h1>
			<div class="rise mt-10 flex flex-wrap items-end justify-between gap-8" style="animation-delay:.3s">
				<p class="max-w-md text-lg leading-relaxed text-white/80">
					{$t.landing.heroDesc}
				</p>
				<div class="flex flex-wrap gap-3">
					<a
						href="/find"
						class="group inline-flex items-center gap-3 bg-brand px-8 py-4 font-bold transition hover:bg-emerald-deep"
					>
						{$t.landing.ctaFind} <ArrowRight size={18} class="transition group-hover:translate-x-1" />
					</a>
					<a
						href="/login?mode=register"
						class="border border-white/50 px-8 py-4 font-bold transition hover:bg-white hover:text-ink"
					>
						{$t.landing.ctaRegister}
					</a>
				</div>
			</div>
		</div>
	</section>

	<!-- Stats bar -->
	<section class="border-b border-line bg-white">
		<dl class="mx-auto grid max-w-[1400px] grid-cols-2 divide-x divide-line lg:grid-cols-4">
			{#each $t.landing.stats as [n, l]}
				<div class="px-5 py-8 lg:px-10">
					<dt class="font-display text-4xl font-extrabold">{n}</dt>
					<dd class="mono mt-1 text-slate-soft">{l}</dd>
				</div>
			{/each}
		</dl>
	</section>

	<!-- How it works -->
	<section id="how" class="mx-auto max-w-[1400px] px-5 py-28 lg:px-10">
		<p class="mono text-brand">{$t.landing.howTitle}</p>
		<h2 class="mt-3 max-w-2xl text-5xl font-extrabold leading-[1.02] sm:text-6xl">
			{$t.landing.howHeading}
		</h2>
		<div class="mt-16 grid border-t border-ink lg:grid-cols-3">
			{#each $t.landing.steps as [n, title, desc]}
				<div class="border-b border-line py-8 lg:border-b-0 lg:border-r lg:px-8 lg:first:pl-0 lg:last:border-r-0">
					<span class="font-display text-7xl font-extrabold text-brand/30">{n}</span>
					<h3 class="mt-4 text-2xl font-bold">{title}</h3>
					<p class="mt-3 leading-relaxed text-slate-soft">{desc}</p>
				</div>
			{/each}
		</div>
	</section>

	<!-- The method -->
	<section class="bg-forest py-24 text-white">
		<div class="mx-auto grid max-w-[1400px] gap-14 px-5 lg:grid-cols-[1fr_1.1fr] lg:px-10">
			<div>
				<p class="mono text-emerald-300">{$t.landing.methodBadge}</p>
				<h2 class="mt-4 text-5xl font-extrabold leading-[1.02] sm:text-6xl">
					{@html $t.landing.methodHeading}
				</h2>
				<p class="mt-6 max-w-md text-lg leading-relaxed text-white/70">
					{$t.landing.methodDesc}
				</p>
			</div>
			<div class="divide-y divide-white/15 border-y border-white/15">
				{#each $t.landing.signals as [signalTitle, w, desc]}
					<div class="grid grid-cols-[auto_1fr] items-center gap-x-6 gap-y-2 py-6">
						<span class="row-span-2 font-display text-6xl font-extrabold leading-none text-emerald-300">
							{w}<span class="text-2xl">%</span>
						</span>
						<h3 class="text-xl font-bold">{signalTitle}</h3>
						<div>
							<div class="h-px bg-white/20">
								<div class="h-px bg-emerald-300" style="width:{w * 3}%" />
							</div>
							<p class="mt-2 text-sm text-white/60">{desc}</p>
						</div>
					</div>
				{/each}
			</div>
		</div>
	</section>

	<!-- Popular this week -->
	<section class="mx-auto max-w-[1400px] px-5 pt-24 lg:px-10">
		<div class="flex items-end justify-between border-b border-ink pb-4">
			<div>
				<p class="mono text-brand">{$t.landing.popularBadge}</p>
				<h2 class="mt-2 text-4xl font-extrabold sm:text-5xl">{$t.landing.popularTitle}</h2>
			</div>
			<a href="/results" class="mono hidden hover:text-brand sm:block">{$t.landing.exploreAll}</a>
		</div>
		<div class="mt-10 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
			{#each featured as { p, score, distance }, i}
				<div class={i % 2 ? 'lg:mt-12' : ''}>
					<PlaceCard place={p} {score} {distance} />
				</div>
			{/each}
		</div>
	</section>

	<!-- Testimonials -->
	<section class="mx-auto mt-28 grid max-w-[1400px] gap-10 px-5 lg:grid-cols-3 lg:px-10">
		{#each $t.landing.testimonials as [q, n, c]}
			<figure class="border-t border-ink pt-6">
				<Quote size={22} class="text-brand" />
				<blockquote class="mt-4 font-display text-2xl font-bold leading-snug">{q}</blockquote>
				<figcaption class="mono mt-5 text-slate-soft">{n} — {c}</figcaption>
			</figure>
		{/each}
	</section>

	<!-- CTA banner -->
	<section class="mx-auto mt-28 max-w-[1400px] px-5 lg:px-10">
		<div class="flex flex-wrap items-center justify-between gap-8 bg-brand p-10 text-white sm:p-16">
			<h2 class="max-w-xl text-4xl font-extrabold leading-tight sm:text-5xl">
				{$t.landing.ctaBannerTitle}
			</h2>
			<a
				href="/login?mode=register"
				class="group inline-flex items-center gap-3 bg-ink px-8 py-4 font-bold transition hover:bg-white hover:text-ink"
			>
				{$t.landing.ctaBannerBtn} <ArrowRight size={18} class="transition group-hover:translate-x-1" />
			</a>
		</div>
	</section>
</main>
