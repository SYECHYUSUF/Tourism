/**
 * data.ts — Seed data + localStorage helpers for demo/dev mode.
 * In production these are replaced by Supabase queries.
 */

import type { Place, Review } from './types';

const u = (id: string, w = 900) =>
	`https://images.unsplash.com/photo-${id}?w=${w}&fit=crop&auto=format&q=80`;

export const SEED_PLACES: Place[] = [
	{
		id: 'warung-nusantara',
		category: 'Culinary',
		name: 'Warung Nusantara',
		area: 'Ubud Center',
		priceMin: 25000,
		priceMax: 75000,
		address: 'Jl. Monkey Forest No. 18, Ubud',
		lat: -8.5069,
		lng: 115.2625,
		rating: 4.8,
		reviewCount: 842,
		image: u('1539755530862-00f623c00f52'),
		gallery: [
			u('1539755530862-00f623c00f52'),
			u('1504674900247-0877df9cc836'),
			u('1555396273-367ea4eb4db5'),
			u('1544025162-d76694265947')
		],
		blurb: 'Dapur keluarga yang menyajikan rendang empuk, sambal matah segar, dan aneka hidangan autentik Nusantara di tengah suasana Ubud yang tenang.',
		hours: '08:00 – 22:00',
		tags: ['Halal friendly', 'Keluarga', 'Lokal'],
		facilities: ['Wi-Fi Gratis', 'Tempat Parkir', 'Musholla', 'Area Outdoor', 'Pembayaran QRIS', 'Ramah Anak'],
		highlights: ['Rendang Sapi Warisan', 'Nasi Campur Spesial', 'Sambal Matah Honje'],
		phone: '+62 361 975 882',
		instagram: '@warungnusantara.bali',
		gmapsUrl: 'https://maps.google.com/?q=Warung+Nusantara+Ubud+Bali'
	},
	{
		id: 'kopi-lamplight',
		category: 'Cafe',
		name: 'Lamplight Coffee House',
		area: 'Seminyak',
		priceMin: 20000,
		priceMax: 55000,
		address: 'Jl. Kayu Aya No. 42, Seminyak',
		lat: -8.6913,
		lng: 115.1682,
		rating: 4.6,
		reviewCount: 531,
		image: u('1511081692775-05d0f180a065'),
		gallery: [
			u('1511081692775-05d0f180a065'),
			u('1501339847302-ac426a4a7cbb'),
			u('1442512595331-e89e73853f31'),
			u('1495474472287-4d71bcdd2085')
		],
		blurb: 'Kopi seduh manual single-origin dan roti hangat di bawah cahaya lampu temaram. Suasana nyaman dan tenang, ideal untuk remote working.',
		hours: '07:00 – 21:00',
		tags: ['Wi-Fi Kencang', 'Menu Vegan', 'Tenang'],
		facilities: ['Wi-Fi Cepat (100 Mbps)', 'Stopkontak di Tiap Meja', 'Ruang AC', 'Area Non-Smoking', 'Pet Friendly'],
		highlights: ['Pour Over Kintamani Natural', 'Almond Croissant', 'Cold Brew Tonic'],
		phone: '+62 812 3988 1204',
		instagram: '@lamplight.bali',
		gmapsUrl: 'https://maps.google.com/?q=Lamplight+Coffee+Seminyak+Bali'
	},
	{
		id: 'pantai-biru',
		category: 'Beach',
		name: 'Pantai Biru Beach Club',
		area: 'Uluwatu',
		priceMin: 100000,
		priceMax: 350000,
		address: 'Jl. Labuansait, Pecatu, Uluwatu',
		lat: -8.8291,
		lng: 115.0849,
		rating: 4.7,
		reviewCount: 1204,
		image: u('1605538108568-7f0d77a214c1'),
		gallery: [
			u('1605538108568-7f0d77a214c1'),
			u('1507525428034-b723cf961d3e'),
			u('1519046904884-53103b34b206'),
			u('1506744038136-46273834b3fb')
		],
		blurb: 'Pasir putih, ombak jernih, dan daybed teduh di atas tebing karang untuk menikmati matahari terbenam dengan sajian seafood bakar segar.',
		hours: '09:00 – 23:00',
		tags: ['Sunset View', 'Seafood Bakar', 'Daybed'],
		facilities: ['Kolam Renang Infinity', 'Akses Pantai Privat', 'Handuk & Shower', 'Bar & Koktail', 'Parkir Valet'],
		highlights: ['Ikan Kakap Bakar Jimbaran', 'Sunset Daybed Experience', 'Kelapa Muda Batok'],
		phone: '+62 361 847 9010',
		instagram: '@pantaibiru.uluwatu',
		gmapsUrl: 'https://maps.google.com/?q=Pantai+Biru+Uluwatu+Bali'
	},
	{
		id: 'pura-giri',
		category: 'Culture',
		name: 'Pura Giri Hilltop Temple',
		area: 'Kintamani',
		priceMin: 0,
		priceMax: 30000,
		address: 'Desa Batur, Kintamani',
		lat: -8.242,
		lng: 115.335,
		rating: 4.9,
		reviewCount: 2310,
		image: u('1609770836167-7a74ed99bfad'),
		gallery: [
			u('1609770836167-7a74ed99bfad'),
			u('1537996194471-e657df975ab4'),
			u('1518548419970-58e3b4079ab2'),
			u('1544644181-1484b3fdfc62')
		],
		blurb: 'Pura megah di puncak bukit di atas awan, memesona saat fajar ketika puncak gunung berapi Batur bermandikan cahaya keemasan.',
		hours: '06:00 – 18:00',
		tags: ['Sunrise View', 'Warisan Budaya', 'Spot Foto'],
		facilities: ['Penyewaan Sarung/Kamben', 'Pemandu Lokal Berlisensi', 'Area Parkir Luas', 'Warung Tradisional'],
		highlights: ['Panorama Lautan Awan', 'Arsitektur Kori Agung', 'Upacara Adat Purnama'],
		phone: '+62 821 4455 6677',
		instagram: '@puragiri.heritage',
		gmapsUrl: 'https://maps.google.com/?q=Pura+Giri+Kintamani+Bali'
	},
	{
		id: 'ridge-lodge',
		category: 'Nature',
		name: 'Ridgeline Forest Lodge',
		area: 'Munduk',
		priceMin: 350000,
		priceMax: 950000,
		address: 'Jl. Raya Munduk, Buleleng',
		lat: -8.273,
		lng: 115.068,
		rating: 4.5,
		reviewCount: 388,
		image: u('1637201813231-e7e824db5485'),
		gallery: [
			u('1637201813231-e7e824db5485'),
			u('1448375240586-882707db888b'),
			u('1470071459604-3b5ec3a7fe05'),
			u('1426604966848-d7adac402bff')
		],
		blurb: 'Kabin kayu di punggung bukit berkabut dengan jalur air terjun alami, dapur kebun organik, dan udara pegunungan yang sangat sejuk.',
		hours: 'Buka Setiap Hari (Check-in 14:00)',
		tags: ['Wisata Alam', 'Eco Lodge', 'Udara Sejuk'],
		facilities: ['Jalur Trekking Pribadi', 'Restoran Farm-to-Table', 'Api Unggun Malam', 'Balkon Pemandangan Lembah'],
		highlights: ['Tur Air Terjun Munduk', 'Kopi Robusta Kebun Sendiri', 'Sarapan Tepi Jurang'],
		phone: '+62 813 3789 2234',
		instagram: '@ridgeline.munduk',
		gmapsUrl: 'https://maps.google.com/?q=Ridgeline+Forest+Lodge+Munduk'
	},
	{
		id: 'laut-resort',
		category: 'Resort',
		name: 'Laut Lagoon Resort',
		area: 'Nusa Dua',
		priceMin: 850000,
		priceMax: 2200000,
		address: 'Kawasan ITDC, Nusa Dua',
		lat: -8.8003,
		lng: 115.2316,
		rating: 4.4,
		reviewCount: 712,
		image: u('1605581813258-076a6654a37f'),
		gallery: [
			u('1605581813258-076a6654a37f'),
			u('1582719478250-c89cae4dc85b'),
			u('1571896349842-33c89424de2d'),
			u('1540555700478-4be289fbecef')
		],
		blurb: 'Vila tepi laguna pirus dengan fasilitas spa mewah, klub anak-anak, dan akses langsung ke pantai berpasir putih Nusa Dua.',
		hours: 'Layanan 24 Jam',
		tags: ['Kolam Renang Laguna', 'Spa Tradisional', 'Ramah Keluarga'],
		facilities: ['Kolam Laguna 1.000 m²', 'Kids Club', 'Spa Tradisional Bali', 'Gym & Yoga Pavilion', 'Restoran Tepi Pantai'],
		highlights: ['Akses Langsung ke Kolam dari Kamar', 'Pijat Aromaterapi Bunga Jepun', 'Romantic Beachfront Dinner'],
		phone: '+62 361 771 900',
		instagram: '@lautlagoon.resort',
		gmapsUrl: 'https://maps.google.com/?q=Laut+Lagoon+Resort+Nusa+Dua'
	},
	{
		id: 'meja-panjang',
		category: 'Culinary',
		name: 'Meja Panjang Restaurant',
		area: 'Canggu',
		priceMin: 65000,
		priceMax: 200000,
		address: 'Jl. Pantai Batu Bolong No. 7, Canggu',
		lat: -8.6478,
		lng: 115.1385,
		rating: 4.7,
		reviewCount: 467,
		image: u('1682139710677-cb02f6bc4211'),
		gallery: [
			u('1682139710677-cb02f6bc4211'),
			u('1517248135467-4c7edcad34c4'),
			u('1550966871-3ed3cdb5ed0c'),
			u('1559339352-11d035aa65de')
		],
		blurb: 'Meja komunal panjang yang menyajikan menu santap bersama dari dapur kayu bakar yang selalu segar, mengusung konsep kebersamaan.',
		hours: '11:00 – 23:00',
		tags: ['Wood-fired', 'Santap Bersama', 'Suasana Hangat'],
		facilities: ['Dapur Terbuka (Open Kitchen)', 'Outdoor Seating', 'Bar & Mocktail', 'Reservasi Online', 'Bebas Gluten Tersedia'],
		highlights: ['Ayam Bakar Madu Hutan', 'Pizza Sourdough Dapur Kayu', 'Smoked Beef Brisket'],
		phone: '+62 811 380 9922',
		instagram: '@mejapanjang.canggu',
		gmapsUrl: 'https://maps.google.com/?q=Meja+Panjang+Canggu+Bali'
	},
	{
		id: 'sawah-cafe',
		category: 'Cafe',
		name: 'Sawah Terrace Cafe',
		area: 'Tegallalang',
		priceMin: 25000,
		priceMax: 85000,
		address: 'Jl. Raya Tegallalang, Gianyar',
		lat: -8.4312,
		lng: 115.2793,
		rating: 4.3,
		reviewCount: 329,
		image: u('1521017432531-fbd92d768814'),
		gallery: [
			u('1521017432531-fbd92d768814'),
			u('1497636577773-f1231844b336'),
			u('1509042239860-f550ce710b93'),
			u('1447933601403-0c6688de566e')
		],
		blurb: 'Semangkuk smoothie sehat dan es kopi segar dengan panorama terasering sawah Tegallalang yang memukau dan hembusan angin sejuk.',
		hours: '08:00 – 18:00',
		tags: ['Terasering Sawah', 'Smoothie Bowl', 'Instagramable'],
		facilities: ['Spot Foto Ayunan Sawah', 'Wi-Fi Gratis', 'Tempat Duduk Terbuka', 'Pilihan Makanan Vegetarian'],
		highlights: ['Dragon Fruit Smoothie Bowl', 'Kopi Susu Gula Aren Bali', 'Avocado Toast Brioche'],
		phone: '+62 878 6123 4567',
		instagram: '@sawahterrace.bali',
		gmapsUrl: 'https://maps.google.com/?q=Sawah+Terrace+Cafe+Tegallalang'
	},
	{
		id: 'bebek-tepi-sawah',
		category: 'Culinary',
		name: 'Bebek Tepi Sawah',
		area: 'Ubud',
		priceMin: 80000,
		priceMax: 220000,
		address: 'Jl. Raya Goa Gajah, Peliatan, Ubud',
		lat: -8.5204,
		lng: 115.2758,
		rating: 4.7,
		reviewCount: 3120,
		image: u('1544025162-d76694265947'),
		gallery: [
			u('1544025162-d76694265947'),
			u('1555396273-367ea4eb4db5'),
			u('1504674900247-0877df9cc836'),
			u('1565299624946-b28f40a0ae38')
		],
		blurb: 'Kuliner ikonik Ubud dengan sajian bebek goreng garing gurih disertai 3 varian sambal khas Bali dan panorama hamparan sawah hijau.',
		hours: '10:00 – 22:00',
		tags: ['Kuliner Legendaris', 'View Sawah', 'Halal'],
		facilities: ['Gazebo Bale Bengong', 'Tempat Parkir Bus/Mobil', 'Musholla Bersih', 'Taman Bermain Anak', 'Live Gamelan'],
		highlights: ['Crispy Duck with 3 Sambals', 'Sate Lilit Ikan', 'Es Kelapa Jeruk Segar'],
		phone: '+62 361 975 656',
		instagram: '@bebektepisawah.ubud',
		gmapsUrl: 'https://maps.google.com/?q=Bebek+Tepi+Sawah+Ubud'
	},
	{
		id: 'revolver-espresso',
		category: 'Cafe',
		name: 'Revolver Boutique Espresso',
		area: 'Seminyak',
		priceMin: 35000,
		priceMax: 95000,
		address: 'Jl. Kayu Aya Gang 51, Seminyak',
		lat: -8.6872,
		lng: 115.1578,
		rating: 4.8,
		reviewCount: 1890,
		image: u('1501339847302-ac426a4a7cbb'),
		gallery: [
			u('1501339847302-ac426a4a7cbb'),
			u('1511081692775-05d0f180a065'),
			u('1442512595331-e89e73853f31'),
			u('1495474472287-4d71bcdd2085')
		],
		blurb: 'Kafe butik legendaris tersembunyi di gang Seminyak dengan dekorasi vintage Wild West, kopi sangrai sendiri, dan hidangan brunch lezat.',
		hours: '07:00 – 23:00',
		tags: ['Specialty Coffee', 'Vintage Vibe', 'Brunch Favorit'],
		facilities: ['Barista Counter Interaktif', 'Full AC', 'Merchandise Corner', 'Menu Sarapan Sepanjang Hari'],
		highlights: ['Revolver Signature Blend', 'Smashed Avo on Sourdough', 'Carrot Cake Mascarpone'],
		phone: '+62 851 0084 4849',
		instagram: '@revolver.bali',
		gmapsUrl: 'https://maps.google.com/?q=Revolver+Espresso+Seminyak'
	},
	{
		id: 'pantai-melasti',
		category: 'Beach',
		name: 'Pantai Melasti Ungasan',
		area: 'Uluwatu',
		priceMin: 10000,
		priceMax: 50000,
		address: 'Jl. Melasti, Ungasan, Kuta Selatan',
		lat: -8.8475,
		lng: 115.1586,
		rating: 4.8,
		reviewCount: 4150,
		image: u('1507525428034-b723cf961d3e'),
		gallery: [
			u('1507525428034-b723cf961d3e'),
			u('1605538108568-7f0d77a214c1'),
			u('1519046904884-53103b34b206'),
			u('1506744038136-46273834b3fb')
		],
		blurb: 'Pantai eksotis dengan akses jalan membelah tebing kapur menjulang tinggi, ombak ramah untuk berenang, dan pasir putih bersih.',
		hours: '07:00 – 19:00',
		tags: ['Tebing Kapur', 'Pasir Putih', 'Berenang'],
		facilities: ['Jalan Aspal Halus', 'Parkir Sangat Luas', 'Kamar Bilas & Toilet', 'Penyewaan Payung Pantai', 'Warung Kuliner'],
		highlights: ['Jalan Berkelok Tebing Kapur', 'Pertunjukan Tari Kecak Senja', 'Kolam Karang Alami Saat Surut'],
		phone: '+62 819 9901 2233',
		instagram: '@melastibeachbali',
		gmapsUrl: 'https://maps.google.com/?q=Pantai+Melasti+Ungasan+Bali'
	},
	{
		id: 'tanah-lot',
		category: 'Culture',
		name: 'Pura Tanah Lot',
		area: 'Tabanan',
		priceMin: 20000,
		priceMax: 60000,
		address: 'Desa Beraban, Kediri, Tabanan',
		lat: -8.6212,
		lng: 115.0868,
		rating: 4.7,
		reviewCount: 5820,
		image: u('1537996194471-e657df975ab4'),
		gallery: [
			u('1537996194471-e657df975ab4'),
			u('1609770836167-7a74ed99bfad'),
			u('1518548419970-58e3b4079ab2'),
			u('1544644181-1484b3fdfc62')
		],
		blurb: 'Ikon pariwisata Bali berupa pura suci yang bertengger di atas bongkahan batu karang besar di tengah deburan ombak samudra lepas.',
		hours: '07:00 – 19:00',
		tags: ['Pura Ikonik', 'Sunset Terbaik', 'Fotografi'],
		facilities: ['Pasar Seni & Suvenir', 'Taman Budaya Luas', 'Pusat Informasi Turis', 'Restoran Sunset View'],
		highlights: ['Siluet Pura Saat Sunset', 'Sumber Air Tawar Suci di Laut', 'Pura Batu Bolong'],
		phone: '+62 361 880 361',
		instagram: '@tanahlot.official',
		gmapsUrl: 'https://maps.google.com/?q=Tanah+Lot+Temple+Bali'
	},
	{
		id: 'air-terjun-tibumana',
		category: 'Nature',
		name: 'Air Terjun Tibumana',
		area: 'Bangli',
		priceMin: 15000,
		priceMax: 30000,
		address: 'Jl. Desa Apuan, Susut, Bangli',
		lat: -8.5042,
		lng: 115.3347,
		rating: 4.6,
		reviewCount: 940,
		image: u('1470071459604-3b5ec3a7fe05'),
		gallery: [
			u('1470071459604-3b5ec3a7fe05'),
			u('1637201813231-e7e824db5485'),
			u('1448375240586-882707db888b'),
			u('1426604966848-d7adac402bff')
		],
		blurb: 'Air terjun tirai lurus yang elegan tersembunyi di hutan tropis lebat dengan kolam air jernih yang tenang dan sejuk untuk berenang.',
		hours: '06:00 – 18:00',
		tags: ['Air Terjun Alami', 'Berenang', 'Jungle Walk'],
		facilities: ['Jalur Setapak Tertata Rapi', 'Ruang Ganti Baju', 'Penyewaan Loker', 'Warung Kopi Tradisional'],
		highlights: ['Kolam Renang Alami Tenang', 'Jembatan Bambu Artistik', 'Hutan Pakis Rimbun'],
		phone: '+62 822 3671 9988',
		instagram: '@tibumanawaterfall',
		gmapsUrl: 'https://maps.google.com/?q=Tibumana+Waterfall+Bali'
	},
	{
		id: 'alila-villas',
		category: 'Resort',
		name: 'Alila Villas Uluwatu',
		area: 'Uluwatu',
		priceMin: 1500000,
		priceMax: 3500000,
		address: 'Jl. Belimbing Sari, Tambiyak, Pecatu',
		lat: -8.8464,
		lng: 115.1384,
		rating: 4.9,
		reviewCount: 650,
		image: u('1582719478250-c89cae4dc85b'),
		gallery: [
			u('1582719478250-c89cae4dc85b'),
			u('1605581813258-076a6654a37f'),
			u('1571896349842-33c89424de2d'),
			u('1540555700478-4be289fbecef')
		],
		blurb: 'Resor mewah ramah lingkungan yang bertengger di atas tebing kapur 100 meter di atas Samudera Hindia dengan sunset cabana ikonik.',
		hours: 'Layanan 24 Jam',
		tags: ['Luxury Eco Resort', 'Sunset Cabana', 'Private Pool'],
		facilities: ['Kolam Renang Infinity 50 Meter', 'Private Butler 24 Jam', 'Cliff Edge Spa', 'Fine Dining The Warung & CIRE'],
		highlights: ['Iconic Overhanging Sunset Cabana', 'Private Pool Villa', 'Arsitektur Kayu Daur Ulang Mewah'],
		phone: '+62 361 848 2166',
		instagram: '@alilavillasuluwatu',
		gmapsUrl: 'https://maps.google.com/?q=Alila+Villas+Uluwatu'
	},
	{
		id: 'sate-plecing-argapura',
		category: 'Culinary',
		name: 'Sate Plecing Bali Argapura',
		area: 'Denpasar',
		priceMin: 30000,
		priceMax: 80000,
		address: 'Jl. Argapura No. 9, Denpasar Barat',
		lat: -8.6652,
		lng: 115.2045,
		rating: 4.8,
		reviewCount: 1680,
		image: u('1555396273-367ea4eb4db5'),
		gallery: [
			u('1555396273-367ea4eb4db5'),
			u('1539755530862-00f623c00f52'),
			u('1504674900247-0877df9cc836'),
			u('1544025162-d76694265947')
		],
		blurb: 'Sajian sate daging bumbu rempah khas Bali yang dibakar arang dan disiram sambal plecing cabai merah pedas, asam segar jeruk limau.',
		hours: '09:00 – 21:00',
		tags: ['Kuliner Pedas', 'Legendaris', 'Lokal Favorit'],
		facilities: ['Parkir Motor & Mobil', 'Area Duduk Nyaman', 'Es Kelapa Segar', 'Takeaway Cepat'],
		highlights: ['Sate Plecing Bumbu Merah', 'Soto Sapi Kuah Gurih', 'Sambal Plecing Jeruk Limau'],
		phone: '+62 812 3881 9900',
		instagram: '@sateplecing.argapura',
		gmapsUrl: 'https://maps.google.com/?q=Sate+Plecing+Argapura+Denpasar'
	},
	{
		id: 'campuhan-ridge-walk',
		category: 'Nature',
		name: 'Campuhan Ridge Walk',
		area: 'Ubud',
		priceMin: 0,
		priceMax: 15000,
		address: 'Kelusa, Payangan, Jl. Raya Campuan, Ubud',
		lat: -8.5036,
		lng: 115.2547,
		rating: 4.7,
		reviewCount: 3750,
		image: u('1448375240586-882707db888b'),
		gallery: [
			u('1448375240586-882707db888b'),
			u('1637201813231-e7e824db5485'),
			u('1470071459604-3b5ec3a7fe05'),
			u('1426604966848-d7adac402bff')
		],
		blurb: 'Jalur trekking santai sepanjang punggung bukit hijau yang membelah dua lembah sungai dengan pemandangan ilalang dan pohon palem asri.',
		hours: 'Buka 24 Jam (Terbaik 06:00 - 08:30)',
		tags: ['Trekking Pagi', 'Pemandangan Lembah', 'Gratis'],
		facilities: ['Jalur Paving Halus', 'Warung Kelapa Muda di Ujung Jalur', 'Spot Foto Sunset & Sunrise'],
		highlights: ['Bukit Ilalang Tropis', 'Panorama Dua Lembah Sungai Campuhan', 'Kafe Santai Karsa Kafe di Ujung Trek'],
		phone: '+62 812 4680 1122',
		instagram: '@campuhanridgewalk',
		gmapsUrl: 'https://maps.google.com/?q=Campuhan+Ridge+Walk+Ubud'
	}
];

export const DEFAULT_CATEGORIES = ['Culinary', 'Cafe', 'Nature', 'Culture', 'Beach', 'Resort'];

// ─── LocalStorage helpers (demo/dev only) ────────────────────────────────────

const read = <T>(k: string, d: T): T => {
	if (typeof localStorage === 'undefined') return d;
	try {
		const v = localStorage.getItem(k);
		return v ? (JSON.parse(v) as T) : d;
	} catch {
		return d;
	}
};
const write = (k: string, v: unknown) => {
	if (typeof localStorage === 'undefined') return;
	try {
		localStorage.setItem(k, JSON.stringify(v));
	} catch {
		/* quota */
	}
};

export const getPlaces = (): Place[] => {
	const stored = read<Place[] | null>('places', null);
	if (!stored || stored.length < SEED_PLACES.length) {
		write('places', SEED_PLACES);
		return SEED_PLACES;
	}
	return stored;
};

export const savePlaces = (v: Place[]) => write('places', v);
export const getCategories = (): string[] => read<string[]>('categories', DEFAULT_CATEGORIES);
export const saveCategories = (v: string[]) => write('categories', v);

// Seed reviews
const SEED_TEXT: [string, number, string][] = [
	['Dewi Anggraini', 5, 'Luar biasa memuaskan! Pelayanannya sangat ramah, makanan disajikan hangat dan bumbu autentik. Datang lebih awal saat senja agar dapat tempat duduk terbaik.'],
	['Marcus Hall', 4, 'Great value for money. The atmosphere is top notch, clean facilities, and the view is stunning.'],
	['Sari Wulandari', 5, 'Rekomendasi terbaik selama di Bali! Pasti akan kembali lagi mengajak seluruh keluarga.']
];

export function getReviews(): Review[] {
	const r = read<Review[] | null>('reviews', null);
	if (r) return r;
	const seeded = SEED_PLACES.flatMap((p) =>
		SEED_TEXT.map(([name, rating, text], i) => ({
			id: `${p.id}-${i}`,
			placeId: p.id,
			reviewerName: name,
			rating,
			reviewText: text,
			hidden: false,
			createdAt: ['2026-09-24', '2026-09-02', '2026-08-11'][i]
		}))
	);
	write('reviews', seeded);
	return seeded;
}
export const saveReviews = (v: Review[]) => write('reviews', v);

export const getWishlist = (email: string): string[] =>
	read<string[]>(`wish:${email}`, []);

export function toggleWishlist(email: string, id: string): boolean {
	const w = getWishlist(email);
	const next = w.includes(id) ? w.filter((x) => x !== id) : [...w, id];
	write(`wish:${email}`, next);
	return next.includes(id);
}
