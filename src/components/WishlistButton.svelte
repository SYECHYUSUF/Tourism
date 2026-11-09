<script lang="ts">
	import { page } from '$app/stores';
	import { Heart } from 'lucide-svelte';
	import { getWishlist, toggleWishlist } from '$lib/data';
	import { t } from '$lib/i18n';

	export let placeId: string;
	export let userEmail: string | null = null;
	export let label: boolean = false;
	export let className: string = '';

	$: activeEmail = userEmail || $page.data.user?.email || null;
	$: on = activeEmail ? getWishlist(activeEmail).includes(placeId) : false;

	function handleClick(e: MouseEvent) {
		e.preventDefault();
		e.stopPropagation();
		if (!activeEmail) {
			window.location.href = '/login';
			return;
		}
		on = toggleWishlist(activeEmail, placeId);
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
