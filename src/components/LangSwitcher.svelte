<script lang="ts">
	import { locale, setLocale } from '$lib/i18n';
	import { Languages } from 'lucide-svelte';

	export let clear = false; // When navbar is in transparent hero state
</script>

<div
	class="inline-flex items-center rounded-sm border p-0.5 text-xs font-bold transition {clear
		? 'border-white/30 bg-black/20 text-white'
		: 'border-line bg-white text-ink shadow-sm'}"
	role="group"
	aria-label="Language Switcher"
>
	<Languages size={13} class="ml-1.5 mr-1 {clear ? 'text-emerald-300' : 'text-brand'}" />
	<button
		type="button"
		on:click={() => setLocale('id')}
		class="px-2 py-1 transition rounded-sm {$locale === 'id'
			? clear
				? 'bg-white text-ink font-extrabold shadow'
				: 'bg-brand text-white font-extrabold shadow-sm'
			: clear
				? 'text-white/80 hover:text-white'
				: 'text-slate-soft hover:text-brand'}"
		aria-pressed={$locale === 'id'}
	>
		ID
	</button>
	<span class="opacity-30">|</span>
	<button
		type="button"
		on:click={() => setLocale('en')}
		class="px-2 py-1 transition rounded-sm {$locale === 'en'
			? clear
				? 'bg-white text-ink font-extrabold shadow'
				: 'bg-brand text-white font-extrabold shadow-sm'
			: clear
				? 'text-white/80 hover:text-white'
				: 'text-slate-soft hover:text-brand'}"
		aria-pressed={$locale === 'en'}
	>
		EN
	</button>
</div>
