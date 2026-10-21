<script lang="ts">
	import { onMount, onDestroy } from 'svelte';

	export let lat: number;
	export let lng: number;
	export let name: string;
	export let origin: [number, number];

	let mapEl: HTMLDivElement;
	let map: import('leaflet').Map;

	const pin = (bg: string) => {
		const L = (window as unknown as { L: typeof import('leaflet') }).L;
		return L.divIcon({
			className: '',
			iconSize: [18, 18],
			iconAnchor: [9, 9],
			html: `<div style="width:18px;height:18px;border-radius:50%;background:${bg};border:3px solid #fff;box-shadow:0 2px 8px rgba(0,0,0,.4)"></div>`
		});
	};

	onMount(async () => {
		const L = (await import('leaflet')).default;
		await import('leaflet/dist/leaflet.css');

		map = L.map(mapEl, { scrollWheelZoom: false }).setView([lat, lng], 12);

		L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
			attribution: '© OpenStreetMap contributors',
			maxZoom: 19
		}).addTo(map);

		const mkPin = (bg: string) =>
			L.divIcon({
				className: '',
				iconSize: [18, 18],
				iconAnchor: [9, 9],
				html: `<div style="width:18px;height:18px;border-radius:50%;background:${bg};border:3px solid #fff;box-shadow:0 2px 8px rgba(0,0,0,.4)"></div>`
			});

		L.marker([lat, lng], { icon: mkPin('#0d8a62') })
			.addTo(map)
			.bindPopup(`<b>${name}</b>`)
			.openPopup();

		L.marker(origin, { icon: mkPin('#0b5f8f') })
			.addTo(map)
			.bindPopup('Your starting point');

		L.polyline([origin, [lat, lng]], {
			color: '#0b5f8f',
			weight: 2,
			dashArray: '6 6'
		}).addTo(map);

		map.fitBounds(L.latLngBounds([origin, [lat, lng]]).pad(0.3), { maxZoom: 14 });
	});

	onDestroy(() => {
		map?.remove();
	});
</script>

<div bind:this={mapEl} class="z-0 h-80 w-full border border-line bg-[#e6f0ec]" />
