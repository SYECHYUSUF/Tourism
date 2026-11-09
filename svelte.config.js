import adapter from '@sveltejs/adapter-vercel';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),
	kit: {
		// Deploy ke Vercel (sesuai laporan Bab 3.3.5). Runtime mengikuti versi Node di Vercel.
		adapter: adapter(),
		alias: {
			$components: 'src/components'
		}
	}
};

export default config;
