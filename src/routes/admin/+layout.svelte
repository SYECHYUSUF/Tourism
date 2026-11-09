<script lang="ts">
	import { page } from '$app/stores';
	import {
		Compass,
		LayoutDashboard,
		MapPinned,
		Tags,
		MessageSquare,
		Users,
		LogOut
	} from 'lucide-svelte';
	import LangSwitcher from '$components/LangSwitcher.svelte';
	import { t } from '$lib/i18n';
	import type { LayoutData } from './$types';

	export let data: LayoutData;
	$: user = data.user ?? $page.data.user;

	const navItems: [string, keyof typeof $t.admin.tabs, any][] = [
		['/admin', 'dashboard', LayoutDashboard],
		['/admin/places', 'places', MapPinned],
		['/admin/categories', 'categories', Tags],
		['/admin/reviews', 'reviews', MessageSquare],
		['/admin/users', 'users', Users]
	];

	function isActive(href: string, currentPath: string): boolean {
		if (href === '/admin') {
			return currentPath === '/admin';
		}
		return currentPath === href || currentPath.startsWith(`${href}/`);
	}
</script>

<svelte:head>
	<title>{$t.admin.title} — Jelajah</title>
</svelte:head>

<div class="grid min-h-screen bg-canvas lg:grid-cols-[250px_1fr]">
	<!-- Left Sidebar (Desktop) -->
	<aside class="hidden bg-forest p-6 text-white lg:block">
		<a href="/" class="flex items-center gap-2 font-display text-xl font-extrabold">
			<Compass size={20} class="text-emerald-300" />
			Jelajah <span class="mono ml-1 text-emerald-300">Admin</span>
		</a>

		<nav class="mt-12 space-y-1">
			{#each navItems as [href, key, Icon]}
				{@const active = isActive(href, $page.url.pathname)}
				<a
					{href}
					class="flex w-full items-center gap-3 px-3 py-3 text-sm font-semibold transition {active
						? 'bg-white text-ink'
						: 'text-white/70 hover:bg-white/10 hover:text-white'}"
				>
					<svelte:component this={Icon} size={17} />
					{$t.admin.tabs[key]}
				</a>
			{/each}
		</nav>
	</aside>

	<!-- Main Workspace -->
	<div class="min-w-0">
		<!-- Top Bar -->
		<header
			class="flex h-16 items-center justify-between gap-4 border-b border-line bg-white px-5 sm:px-8"
		>
			<div class="flex items-center gap-2 text-sm">
				<a href="/" class="font-display font-bold text-brand hover:underline">Jelajah</a>
				<span class="text-slate-300">/</span>
				<span class="mono text-slate-500">{$t.admin.title}</span>
			</div>

			<div class="flex items-center gap-4">
				<LangSwitcher />
				<span class="mono hidden sm:inline font-bold text-ink">{user?.name || 'Admin'}</span>
				<form method="POST" action="/logout" class="inline">
					<button
						type="submit"
						class="flex items-center gap-2 border border-line px-3 py-2 text-sm font-semibold hover:bg-ink hover:text-white transition"
					>
						<LogOut size={14} />{$t.nav.signOut}
					</button>
				</form>
			</div>
		</header>

		<main class="space-y-8 p-5 sm:p-8">
			<!-- Mobile Nav Tabs -->
			<div class="flex flex-wrap gap-1 lg:hidden border-b border-line pb-4">
				{#each navItems as [href, key]}
					{@const active = isActive(href, $page.url.pathname)}
					<a
						{href}
						class="px-3 py-1.5 text-xs font-semibold transition {active
							? 'bg-ink text-white'
							: 'border border-line bg-white text-ink hover:bg-slate-50'}"
					>
						{$t.admin.tabs[key]}
					</a>
				{/each}
			</div>

			<!-- Tab Page Content -->
			<slot />
		</main>
	</div>
</div>

