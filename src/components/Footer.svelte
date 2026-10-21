<script lang="ts">
	import { t } from '$lib/i18n';
</script>

<footer class="mt-28 bg-forest text-white/70">
	<div class="mx-auto grid max-w-[1400px] gap-10 px-5 py-14 lg:grid-cols-[1.4fr_1fr_1fr] lg:px-10">
		<div>
			<p class="font-display text-4xl font-extrabold text-white">Jelajah</p>
			<p class="mt-3 max-w-xs text-sm">
				{$t.footer.tagline}
			</p>
		</div>
		<div class="mono space-y-2">
			<p class="text-white">{$t.footer.exploreTitle}</p>
			<p>Culinary</p>
			<p>Cafes</p>
			<p>Nature</p>
		</div>
		<div class="mono space-y-2">
			<p class="text-white">{$t.footer.methodTitle}</p>
			<p>{$t.footer.methodSubtitle}</p>
			<p>{$t.footer.weightedScoring}</p>
		</div>
	</div>
	<div class="mono border-t border-white/10 px-5 py-5 text-center">{$t.footer.copyright}</div>
</footer>
