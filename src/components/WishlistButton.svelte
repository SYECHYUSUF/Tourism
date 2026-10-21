<script lang="ts">
	import { onMount } from 'svelte';
	import { Heart } from 'lucide-svelte';
	import { getWishlist, toggleWishlist } from '$lib/data';

	export let placeId: string;
	export let userEmail: string | null = null;
	export let label: boolean = false;
	export let className: string = '';

	let on = false;

	onMount(() => {
		if (userEmail) {
			on = getWishlist(userEmail).includes(placeId);
		}
	});

	function handleClick(e: MouseEvent) {
		e.preventDefault();
		e.stopPropagation();
		if (!userEmail) {
			window.location.href = '/login';
			return;
		}
		on = toggleWishlist(userEmail, placeId);
	}
</script>

<button
	on:click={handleClick}
	aria-pressed={on}
	aria-label={on ? 'Remove from wishlist' : 'Save to wishlist'}
	class="flex items-center gap-2 transition {className}"
>
	<Heart size={18} class={on ? 'fill-red-500 text-red-500' : ''} />
	{#if label}
		<span class="font-semibold">{on ? 'Saved' : 'Save to wishlist'}</span>
	{/if}
</button>
