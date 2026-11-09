<script lang="ts">
	import '../app.css';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { invalidate } from '$app/navigation';
	import Navbar from '$components/Navbar.svelte';
	import Footer from '$components/Footer.svelte';
	import { locale } from '$lib/i18n';
	import type { LayoutData } from './$types';

	export let data: LayoutData;

	// Bahasa dari cookie (dibaca server) agar SSR dan klien sama, tanpa kedip.
	if (data.locale) locale.set(data.locale);

	$: ({ supabase, user } = data);
	$: isAdmin = $page.url.pathname.startsWith('/admin');

	onMount(() => {
		const {
			data: { subscription }
		} = supabase.auth.onAuthStateChange((_event, _session) => {
			invalidate('supabase:auth');
		});

		return () => {
			subscription.unsubscribe();
		};
	});
</script>

{#if !isAdmin}
	<Navbar {user} />
{/if}

<slot />

{#if !isAdmin}
	<Footer />
{/if}
