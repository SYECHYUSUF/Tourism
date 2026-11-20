<script lang="ts">
	import { locale, setLocale } from '$lib/i18n';
	import { Languages } from 'lucide-svelte';

	export let clear = false; // When navbar is in transparent hero state

	function toggleLocale() {
		setLocale($locale === 'id' ? 'en' : 'id');
	}
</script>

<button
	type="button"
	on:click={toggleLocale}
	aria-label={$locale === 'id' ? 'Ganti bahasa ke English' : 'Switch language to Bahasa Indonesia'}
	title={$locale === 'id' ? 'Ganti bahasa ke English (EN)' : 'Switch language to Bahasa Indonesia (ID)'}
	class="inline-flex items-center gap-1.5 rounded-sm border px-2.5 py-1.5 text-xs font-bold transition select-none {clear
		? 'border-white/40 bg-white/10 text-white hover:bg-white/20'
		: 'border-line bg-white text-ink shadow-sm hover:border-slate-400'}"
>
	<Languages size={14} class={clear ? 'text-emerald-300' : 'text-brand'} />
	<span class="tracking-wider uppercase">{$locale === 'id' ? 'ID' : 'EN'}</span>
</button>
