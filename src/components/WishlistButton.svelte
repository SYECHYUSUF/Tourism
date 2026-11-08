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
	let activeEmail: string | null = null;

	function resolveEmail(): string | null {
		if (userEmail) return userEmail;
		if (typeof localStorage !== 'undefined') {
			try {
				const sess = JSON.parse(localStorage.getItem('session') || 'null');
				if (sess?.email) return sess.email;
			} catch {}
		}
		return null;
	}

	onMount(() => {
		activeEmail = resolveEmail();
		if (activeEmail) {
			on = getWishlist(activeEmail).includes(placeId);
		}
	});

	function handleClick(e: MouseEvent) {
		e.preventDefault();
		e.stopPropagation();
		activeEmail = resolveEmail();
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
