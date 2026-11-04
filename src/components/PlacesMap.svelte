<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import type { Place } from '$lib/types';
	import { priceRange } from '$lib/scoring';
	import { locale } from '$lib/i18n';

	export let items: { p: Place; s: number; d: number }[] = [];
	export let origin: [number, number];

	let mapEl: HTMLDivElement;
	let map: any = null;
	let L: any = null;
	let markersGroup: any = null;

	onMount(async () => {
		L = (await import('leaflet')).default;
		await import('leaflet/dist/leaflet.css');

		if (!mapEl) return;

		map = L.map(mapEl, { scrollWheelZoom: true }).setView(origin, 11);

		L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
			attribution: '© OpenStreetMap contributors',
			maxZoom: 19
		}).addTo(map);

		markersGroup = L.featureGroup().addTo(map);

		updateMarkers();
	});

	$: if (map && L && items) {
		updateMarkers();
	}

	function updateMarkers() {
		if (!map || !L || !markersGroup) return;

		markersGroup.clearLayers();

		// Origin pin
		const originIcon = L.divIcon({
			className: '',
			iconSize: [28, 28],
			iconAnchor: [14, 14],
			html: `
				<div style="width:28px;height:28px;border-radius:50%;background:#0b5f8f;border:3px solid #fff;box-shadow:0 3px 10px rgba(0,0,0,0.35);display:flex;align-items:center;justify-content:center;color:#fff;font-size:11px;font-weight:bold;">
					📍
				</div>`
		});

		const originMarker = L.marker(origin, { icon: originIcon }).bindPopup(
			`<div style="font-family:sans-serif;padding:4px;font-size:13px;"><b>Titik Awal Anda</b></div>`
		);
		markersGroup.addLayer(originMarker);

		// Place pins
		items.forEach(({ p, s, d }) => {
			const pinIcon = L.divIcon({
				className: '',
				iconSize: [36, 36],
				iconAnchor: [18, 18],
				html: `
					<div style="background:#0d8a62;color:#fff;border:2.5px solid #fff;border-radius:18px;height:32px;padding:0 8px;display:flex;align-items:center;justify-content:center;box-shadow:0 3px 10px rgba(0,0,0,0.3);font-family:sans-serif;font-size:12px;font-weight:800;gap:3px;cursor:pointer;">
						<span>★</span><span>${p.rating}</span>
					</div>`
			});

			const popupContent = `
				<div style="width:230px;font-family:system-ui,-apple-system,sans-serif;border-radius:6px;overflow:hidden;">
					<img src="${p.image}" alt="${p.name}" style="width:100%;height:110px;object-fit:cover;display:block;" />
					<div style="padding:10px 6px 4px 6px;">
						<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;">
							<span style="font-size:11px;font-weight:700;color:#0d8a62;text-transform:uppercase;">${p.category} · ${p.area}</span>
							<span style="background:#093322;color:#6ee7b7;font-size:10px;font-weight:bold;padding:2px 5px;border-radius:2px;">${s}% Cocok</span>
						</div>
						<h4 style="margin:0 0 4px 0;font-size:15px;font-weight:bold;line-height:1.2;">
							<a href="/places/${p.id}" style="color:#111;text-decoration:none;">${p.name}</a>
						</h4>
						<div style="font-size:12px;color:#555;margin-bottom:8px;">
							${priceRange(p, $locale === 'en')} · ${d} km
						</div>
						<a href="/places/${p.id}" style="display:block;background:#111827;color:#fff;text-align:center;padding:6px;font-size:12px;font-weight:bold;text-decoration:none;border-radius:3px;">
							Lihat Detail & Arah →
						</a>
					</div>
				</div>
			`;

			const marker = L.marker([p.lat, p.lng], { icon: pinIcon }).bindPopup(popupContent, {
				maxWidth: 260
			});

			markersGroup.addLayer(marker);
		});

		try {
			const bounds = markersGroup.getBounds();
			if (bounds.isValid()) {
				map.fitBounds(bounds.pad(0.15), { maxZoom: 14 });
			}
		} catch {}
	}

	onDestroy(() => {
		map?.remove();
	});
</script>

<div bind:this={mapEl} class="relative z-0 h-[620px] w-full rounded-md border border-line shadow-sm" />
