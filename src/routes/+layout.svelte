<script lang="ts">
	import '../app.css';
	import { page } from '$app/stores';
	import Navbar from '$components/Navbar.svelte';
	import Footer from '$components/Footer.svelte';
	import type { LayoutData } from './$types';

	export let data: LayoutData;
	$: isAdmin = $page.url.pathname.startsWith('/admin');
</script>

{#if !isAdmin}
	<Navbar user={data.user} />
{/if}

<slot />

{#if !isAdmin}
	<Footer />
{/if}
