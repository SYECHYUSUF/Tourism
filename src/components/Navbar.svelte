<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { Compass, LogOut } from 'lucide-svelte';
	import LangSwitcher from '$components/LangSwitcher.svelte';
	import { t } from '$lib/i18n';

	export let user: { name: string; role: string } | null = null;

	let scrolled = false;
	let isHome = false;

	$: isHome = $page.url.pathname === '/' || $page.url.pathname === '/home';

	// Track scroll on the client
	function handleScroll() {
		scrolled = window.scrollY > 40;
	}

	import { onMount } from 'svelte';
	onMount(() => {
		handleScroll();
		window.addEventListener('scroll', handleScroll, { passive: true });
		return () => window.removeEventListener('scroll', handleScroll);
	});

	$: clear = isHome && !scrolled;

	async function logout() {
		const { supabase } = await import('$lib/supabaseClient');
		await supabase.auth.signOut();
		goto('/');
	}
</script>

<header
	class={`${isHome ? 'fixed' : 'sticky'} inset-x-0 top-0 z-30 border-b transition-colors duration-300 ${clear ? 'border-transparent bg-transparent text-white' : 'border-line bg-canvas/90 text-ink backdrop-blur'}`}
>
	<div class="mx-auto flex h-16 max-w-[1400px] items-center justify-between px-5 lg:px-10">
		<!-- Logo -->
		<a
			href={user ? '/home' : '/'}
			class="flex items-center gap-2 font-display text-xl font-extrabold tracking-tight"
		>
			<Compass size={20} class={clear ? 'text-white' : 'text-brand'} />
			Jelajah
		</a>

		<!-- Desktop nav -->
		<nav class="hidden items-center gap-9 md:flex">
			{#if user}
				<a
					href="/home"
					class={`mono transition ${clear ? 'text-white/80 hover:text-white' : 'text-slate-soft hover:text-brand'} ${$page.url.pathname === '/home' ? (clear ? '!text-white' : '!text-brand') : ''}`}
				>
					{$t.nav.home}
				</a>
				<a
					href="/find"
					class={`mono transition ${clear ? 'text-white/80 hover:text-white' : 'text-slate-soft hover:text-brand'} ${$page.url.pathname === '/find' ? (clear ? '!text-white' : '!text-brand') : ''}`}
				>
					{$t.nav.preferences}
				</a>
				<a
					href="/results"
					class={`mono transition ${clear ? 'text-white/80 hover:text-white' : 'text-slate-soft hover:text-brand'} ${$page.url.pathname === '/results' ? (clear ? '!text-white' : '!text-brand') : ''}`}
				>
					{$t.nav.explore}
				</a>
				<a
					href="/wishlist"
					class={`mono transition ${clear ? 'text-white/80 hover:text-white' : 'text-slate-soft hover:text-brand'} ${$page.url.pathname === '/wishlist' ? (clear ? '!text-white' : '!text-brand') : ''}`}
				>
					{$t.nav.wishlist}
				</a>
				{#if user.role === 'admin'}
					<a
						href="/admin"
						class={`mono transition ${clear ? 'text-white/80 hover:text-white' : 'text-slate-soft hover:text-brand'}`}
					>
						{$t.nav.admin}
					</a>
				{/if}
			{:else}
				<a
					href="/#how"
					class={`mono transition ${clear ? 'text-white/80 hover:text-white' : 'text-slate-soft hover:text-brand'}`}
				>
					{$t.nav.howItWorks}
				</a>
				<a
					href="/find"
					class={`mono transition ${clear ? 'text-white/80 hover:text-white' : 'text-slate-soft hover:text-brand'}`}
				>
					{$t.nav.preferences}
				</a>
				<a
					href="/results"
					class={`mono transition ${clear ? 'text-white/80 hover:text-white' : 'text-slate-soft hover:text-brand'}`}
				>
					{$t.nav.explore}
				</a>
				<a
					href="/login"
					class={`mono transition ${clear ? 'text-white/80 hover:text-white' : 'text-slate-soft hover:text-brand'}`}
				>
					{$t.nav.signIn}
				</a>
			{/if}
		</nav>

		<!-- Right actions -->
		<div class="flex items-center gap-3">
			<LangSwitcher {clear} />

			{#if user}
				<span class="mono hidden sm:inline">{user.name}</span>
				<button
					on:click={logout}
					aria-label={$t.nav.signOut}
					class={`grid h-9 w-9 place-items-center border transition ${clear ? 'border-white/40 hover:bg-white hover:text-ink' : 'border-line hover:bg-ink hover:text-white'}`}
				>
					<LogOut size={15} />
				</button>
			{:else}
				<a
					href="/login?mode=register"
					class={`mono px-4 py-2.5 transition ${clear ? 'bg-white text-ink hover:bg-brand hover:text-white' : 'bg-ink text-white hover:bg-brand'}`}
				>
					{$t.nav.getStarted}
				</a>
			{/if}
		</div>
	</div>
</header>
