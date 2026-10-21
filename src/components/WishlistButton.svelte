<script lang="ts">
	import { onMount } from 'svelte';
	import { Heart } from 'lucide-svelte';
	import { getWishlist, toggleWishlist } from '$lib/data';
	import { t } from '$lib/i18n';

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
	aria-label={on ? $t.wishlist.saved : $t.wishlist.saveToWishlist}
	class="flex items-center gap-2 transition {className}"
>
	<Heart size={18} class={on ? 'fill-red-500 text-red-500' : ''} />
	{#if label}
		<span class="font-semibold">{on ? $t.wishlist.saved : $t.wishlist.saveToWishlist}</span>
	{/if}
</button>
