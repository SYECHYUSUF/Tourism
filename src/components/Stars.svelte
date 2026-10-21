<script lang="ts">
	import { Star } from 'lucide-svelte';

	export let value: number;
	export let size: number = 14;
</script>

<span class="inline-flex items-center gap-0.5" aria-label="{value} out of 5">
	{#each [1, 2, 3, 4, 5] as i}
		<Star
			{size}
			class={i <= Math.round(value) ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}
		/>
	{/each}
</span>
