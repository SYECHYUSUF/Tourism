<script lang="ts">
	import { onDestroy, onMount } from 'svelte';

	/** Koordinat terikat (bind:lat / bind:lng). Klik peta atau geser pin untuk mengubah. */
	export let lat: number;
	export let lng: number;
	export let label = 'Pilih lokasi di peta';

	let el: HTMLDivElement;
	let map: import('leaflet').Map | undefined;
	let marker: import('leaflet').Marker | undefined;

	onMount(async () => {
		const L = (await import('leaflet')).default;
		await import('leaflet/dist/leaflet.css');

		map = L.map(el, { scrollWheelZoom: false }).setView([lat, lng], 11);
		L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
			attribution: '© OpenStreetMap contributors',
			maxZoom: 19
		}).addTo(map);

		const icon = L.divIcon({
			className: '',
			iconSize: [18, 18],
			iconAnchor: [9, 9],
			html: '<div style="width:18px;height:18px;border-radius:50%;background:#0d8a62;border:3px solid #fff;box-shadow:0 2px 8px rgba(0,0,0,.4)"></div>'
		});
		marker = L.marker([lat, lng], { icon, draggable: true }).addTo(map);

		const set = (p: { lat: number; lng: number }) => {
			lat = Math.round(p.lat * 1e6) / 1e6;
			lng = Math.round(p.lng * 1e6) / 1e6;
		};
		map.on('click', (e) => {
			marker?.setLatLng(e.latlng);
			set(e.latlng);
		});
		marker.on('dragend', () => marker && set(marker.getLatLng()));
	});

	// Sinkronkan pin bila angka diketik manual
	$: if (marker && Number.isFinite(lat) && Number.isFinite(lng)) {
		const cur = marker.getLatLng();
		if (cur.lat !== lat || cur.lng !== lng) marker.setLatLng([lat, lng]);
	}

	onDestroy(() => map?.remove());
</script>

<div bind:this={el} role="application" aria-label={label} class="z-0 h-56 w-full border border-line bg-[#e6f0ec]" />
