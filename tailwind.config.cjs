module.exports = {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			colors: {
				ink: '#0c1f1a',
				forest: '#0a2a22',
				'slate-soft': '#4b5a55',
				canvas: '#f5f6f2',
				line: '#d9ddd6',
				'emerald-deep': '#065f46',
				brand: '#0d8a62',
				'brand-soft': '#e3f3ec',
				ocean: '#0b5f8f',
				'ocean-soft': '#e0eef6'
			},
			fontFamily: {
				sans: ['Plus Jakarta Sans', 'ui-sans-serif', 'system-ui', 'sans-serif'],
				display: ['Bricolage Grotesque', 'Plus Jakarta Sans', 'sans-serif'],
				mono: ['DM Mono', 'ui-monospace', 'monospace']
			}
		}
	},
	plugins: []
};
