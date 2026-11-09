<script lang="ts">
	import { page } from '$app/stores';
	import { goto, invalidate } from '$app/navigation';
	import { Heart } from 'lucide-svelte';
	import { t } from '$lib/i18n';

	export let placeId: string;
	export let label: boolean = false;
	export let className: string = '';

	let busy = false;
	let failed = false;
	let on = false;

	// Status awal & sinkronisasi berasal dari data server ($page.data.wishlistIds).
	$: serverOn = (($page.data.wishlistIds as string[] | undefined) ?? []).includes(placeId);
	$: if (!busy) on = serverOn;

	async function handleClick(e: MouseEvent) {
		e.preventDefault();
		e.stopPropagation();
		if (busy) return;

		if (!$page.data.user) {
			const back = $page.url.pathname + $page.url.search;
			await goto(`/login?redirectTo=${encodeURIComponent(back)}`);
			return;
		}

		busy = true;
		failed = false;
		const previous = on;
		on = !on; // optimistic update

		try {
			const res = await fetch('/api/wishlist', {
				method: 'POST',
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify({ placeId })
			});
			if (!res.ok) throw new Error(String(res.status));
			const body = (await res.json()) as { saved: boolean };
			on = body.saved;
			await invalidate('app:wishlist');
		} catch {
			on = previous;
			failed = true;
			setTimeout(() => (failed = false), 3000);
		} finally {
			busy = false;
		}
	}
</script>

<button
	type="button"
	on:click={handleClick}
	disabled={busy}
	aria-pressed={on}
	aria-label={on ? $t.wishlist.removeFromWishlist : $t.wishlist.saveToWishlist}
	title={failed ? $t.wishlist.error : undefined}
	class="flex items-center gap-2 transition disabled:opacity-60 {className}"
>
	<Heart size={18} class={on ? 'fill-red-500 text-red-500' : ''} />
	{#if label}
		<span class="font-semibold">{on ? $t.wishlist.saved : $t.wishlist.saveToWishlist}</span>
	{/if}
	{#if failed}
		<span class="sr-only" role="status" aria-live="polite">{$t.wishlist.error}</span>
	{/if}
</button>
