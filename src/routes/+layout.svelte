<script lang="ts">
	import '../app.css';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import Navbar from '$components/Navbar.svelte';
	import Footer from '$components/Footer.svelte';
	import { userStore } from '$lib/userStore';
	import type { LayoutData } from './$types';

	export let data: LayoutData;
	$: isAdmin = $page.url.pathname.startsWith('/admin');

	onMount(() => {
		userStore.init(data.user);
	});
</script>

{#if !isAdmin}
	<Navbar />
{/if}

<slot />

{#if !isAdmin}
	<Footer />
{/if}
