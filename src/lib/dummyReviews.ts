import type { Review } from './types';

export const DUMMY_REVIEWS: Record<string, Review[]> = {
	'tanah-lot': [
		{
			id: 'rev-tl-1',
			placeId: 'tanah-lot',
			userId: 'dummy-u-101',
			reviewerName: 'Budi Santoso',
			rating: 5,
			reviewText: 'Pemandangan sunset di Tanah Lot benar-benar magis dan tidak pernah mengecewakan. Ombak yang menghantam pura saat air pasang sangat spektakuler. Disarankan datang sebelum pukul 17:00 untuk mendapatkan spot foto terbaik.',
			photoUrl: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&fit=crop&auto=format&q=80',
			hidden: false,
			createdAt: '2026-11-15T10:30:00.000Z'
		},
		{
			id: 'rev-tl-2',
			placeId: 'tanah-lot',
			userId: 'dummy-u-102',
			reviewerName: 'Ni Kadek Ayu Lestari',
			rating: 5,
			reviewText: 'Pura yang sangat sakral dengan keindahan alam yang memukau. Area taman tertata rapi dan bersih. Banyak toko cinderamata dengan harga yang wajar jika pandai menawar. Wajib dikunjungi saat ke Bali!',
			hidden: false,
			createdAt: '2026-11-12T14:15:00.000Z'
		},
		{
			id: 'rev-tl-3',
			placeId: 'tanah-lot',
			userId: 'dummy-u-103',
			reviewerName: 'Michael Chen',
			rating: 5,
			reviewText: 'Iconic Bali landmark. The cliffside views and crashing waves against the sea temple are breathtaking, especially during golden hour. Plenty of parking and good amenities around.',
			hidden: false,
			createdAt: '2026-11-08T09:40:00.000Z'
		},
		{
			id: 'rev-tl-4',
			placeId: 'tanah-lot',
			userId: 'dummy-u-104',
			reviewerName: 'Rina Wahyuni',
			rating: 4,
			reviewText: 'Sangat ramai pengunjung saat menjelang sore, tapi pemandangannya sepadan dengan keramaian. Fasilitas toilet bersih dan akses jalan setapak sangat ramah wisatawan.',
			hidden: false,
			createdAt: '2026-11-02T16:20:00.000Z'
		},
		{
			id: 'rev-tl-5',
			placeId: 'tanah-lot',
			userId: 'dummy-u-105',
			reviewerName: 'I Gede Aditya Wardana',
			rating: 5,
			reviewText: 'Tempat ibadah yang penuh kedamaian sekaligus destinasi wisata kelas dunia. Upacara keagamaan di sini auranya luar biasa khidmat.',
			hidden: false,
			createdAt: '2026-10-28T11:00:00.000Z'
		},
		{
			id: 'rev-tl-6',
			placeId: 'tanah-lot',
			userId: 'dummy-u-106',
			reviewerName: 'Farhan Pratama',
			rating: 5,
			reviewText: 'Salah satu sunset tercantik di dunia! Ada spot minum kelapa muda dingin di tebing sambil menikmati deburan ombak. Sangat recommended untuk liburan keluarga.',
			hidden: false,
			createdAt: '2026-10-20T17:45:00.000Z'
		}
	],
	'pantai-melasti': [
		{
			id: 'rev-pm-1',
			placeId: 'pantai-melasti',
			userId: 'dummy-u-201',
			reviewerName: 'Siti Rahmawati',
			rating: 5,
			reviewText: 'Pantai terbersih di Bali Selatan! Tebing kapur yang dibelah untuk jalan masuknya sangat megah dan Instagramable. Pasir putih halus dan air laut jernih bergradasi biru toska.',
			photoUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&fit=crop&auto=format&q=80',
			hidden: false,
			createdAt: '2026-11-16T11:10:00.000Z'
		},
		{
			id: 'rev-pm-2',
			placeId: 'pantai-melasti',
			userId: 'dummy-u-202',
			reviewerName: 'David Robinson',
			rating: 5,
			reviewText: 'Stunning white sand beach nestled beneath dramatic limestone cliffs. Water is calm enough for swimming during low tide. Beach clubs nearby offer great food and drinks.',
			hidden: false,
			createdAt: '2026-11-13T15:30:00.000Z'
		},
		{
			id: 'rev-pm-3',
			placeId: 'pantai-melasti',
			userId: 'dummy-u-203',
			reviewerName: 'Anindya Putri',
			rating: 5,
			reviewText: 'Jalanan aspal mulus sampai ke bibir pantai. Tersedia banyak tempat duduk santai dan warung makanan dengan harga bersahabat. Ombaknya tenang cocok buat anak-anak bermain air.',
			hidden: false,
			createdAt: '2026-11-09T13:45:00.000Z'
		},
		{
			id: 'rev-pm-4',
			placeId: 'pantai-melasti',
			userId: 'dummy-u-204',
			reviewerName: 'Made Suardika',
			rating: 5,
			reviewText: 'Pantai Melasti memiliki fasilitas yang sangat lengkap: toilet bersih, ruang bilas luas, dan area parkir yang sangat lapang. Selalu jadi pilihan utama bila mengajak tamu luar kota.',
			hidden: false,
			createdAt: '2026-11-04T10:00:00.000Z'
		},
		{
			id: 'rev-pm-5',
			placeId: 'pantai-melasti',
			userId: 'dummy-u-205',
			reviewerName: 'Hendra Gunawan',
			rating: 4,
			reviewText: 'Sore hari ada pertunjukan tari kecak di tebing pantai dengan latar matahari terbenam. Benar-benar pengalaman yang tidak terlupakan!',
			hidden: false,
			createdAt: '2026-10-25T16:50:00.000Z'
		},
		{
			id: 'rev-pm-6',
			placeId: 'pantai-melasti',
			userId: 'dummy-u-206',
			reviewerName: 'Jessica Tan',
			rating: 5,
			reviewText: 'Airnya bening sekali sampai karang dan ikan kecil terlihat jelas. Suasana sore hari sangat syahdu. Salah satu pantai terbaik di Uluwatu.',
			hidden: false,
			createdAt: '2026-10-18T08:20:00.000Z'
		}
	],
	'campuhan-ridge-walk': [
		{
			id: 'rev-cr-1',
			placeId: 'campuhan-ridge-walk',
			userId: 'dummy-u-301',
			reviewerName: 'Agus Setiawan',
			rating: 5,
			reviewText: 'Trek jalan kaki paling menyegarkan di Ubud! Waktu terbaik adalah jam 06:00 pagi saat kabut tipis masih menyelimuti bukit dan perbukitan hijau terhampar luas. Udara sangat sejuk.',
			photoUrl: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=600&fit=crop&auto=format&q=80',
			hidden: false,
			createdAt: '2026-11-17T07:15:00.000Z'
		},
		{
			id: 'rev-cr-2',
			placeId: 'campuhan-ridge-walk',
			userId: 'dummy-u-302',
			reviewerName: 'Emma Watson',
			rating: 5,
			reviewText: 'A peaceful nature walk on the ridge of two river valleys. Paved stone trail that is easy to navigate. At the end of the walk, there are delightful small cafes surrounded by paddy fields.',
			hidden: false,
			createdAt: '2026-11-11T08:45:00.000Z'
		},
		{
			id: 'rev-cr-3',
			placeId: 'campuhan-ridge-walk',
			userId: 'dummy-u-303',
			reviewerName: 'Wayan Krisna',
			rating: 5,
			reviewText: 'Tempat jogging favorit warga Ubud dan wisatawan. Pemandangan bukit ilalang dan pohon kelapa sungguh menenangkan jiwa. Gratis tanpa tiket masuk!',
			hidden: false,
			createdAt: '2026-11-06T06:30:00.000Z'
		},
		{
			id: 'rev-cr-4',
			placeId: 'campuhan-ridge-walk',
			userId: 'dummy-u-304',
			reviewerName: 'Nadia Safitri',
			rating: 4,
			reviewText: 'Jalan setapaknya bersih dan rapi. Jangan lupa bawa air minum dan topi karena di tengah jalur tidak ada pohon pelindung saat matahari sudah naik.',
			hidden: false,
			createdAt: '2026-10-30T09:20:00.000Z'
		},
		{
			id: 'rev-cr-5',
			placeId: 'campuhan-ridge-walk',
			userId: 'dummy-u-305',
			reviewerName: 'Rudi Hartono',
			rating: 5,
			reviewText: 'Cocok untuk jalan santai bersama pasangan atau keluarga. Pemandangan 360 derajat bukit Ubud yang hijau asri benar-benar memanjakan mata.',
			hidden: false,
			createdAt: '2026-10-22T07:50:00.000Z'
		},
		{
			id: 'rev-cr-6',
			placeId: 'campuhan-ridge-walk',
			userId: 'dummy-u-306',
			reviewerName: 'Clara Oswald',
			rating: 5,
			reviewText: 'One of the best free attractions in Ubud. Refreshing breeze and panoramic greenery. Stop by Karsa Cafe at the trail end for healthy smoothie bowls.',
			hidden: false,
			createdAt: '2026-10-15T10:15:00.000Z'
		}
	],
	'bebek-tepi-sawah': [
		{
			id: 'rev-bts-1',
			placeId: 'bebek-tepi-sawah',
			userId: 'dummy-u-401',
			reviewerName: 'Bambang Triatmojo',
			rating: 5,
			reviewText: 'Bebek krispi terenak di Bali! Dagingnya empuk gurih, kulitnya renyah sempurna, dan ada 3 pilihan sambal khas yang nagih. Makan di gazebo tengah sawah membuat suasananya semakin istimewa.',
			photoUrl: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&fit=crop&auto=format&q=80',
			hidden: false,
			createdAt: '2026-11-18T12:30:00.000Z'
		},
		{
			id: 'rev-bts-2',
			placeId: 'bebek-tepi-sawah',
			userId: 'dummy-u-402',
			reviewerName: 'Dewi Lestari',
			rating: 5,
			reviewText: 'Suasana Ubud yang begitu kental. Pelayanan ramah dan cepat walau restoran sedang sangat ramai. Sambal matah dan sambal embe-nya juara!',
			hidden: false,
			createdAt: '2026-11-14T19:00:00.000Z'
		},
		{
			id: 'rev-bts-3',
			placeId: 'bebek-tepi-sawah',
			userId: 'dummy-u-403',
			reviewerName: 'Kenji Sato',
			rating: 5,
			reviewText: 'Crispy duck here is unmatched. The combination of seasoned duck and aromatic Balinese sambal served right by lush green paddy fields is an unforgettable dining experience.',
			hidden: false,
			createdAt: '2026-11-07T13:15:00.000Z'
		},
		{
			id: 'rev-bts-4',
			placeId: 'bebek-tepi-sawah',
			userId: 'dummy-u-404',
			reviewerName: 'Rina Kusuma',
			rating: 4,
			reviewText: 'Porsi bebeknya cukup besar dan mengenyangkan. Tempatnya luas cocok untuk makan bersama rombongan atau keluarga besar. Anak-anak senang melihat sawah.',
			hidden: false,
			createdAt: '2026-11-01T18:40:00.000Z'
		},
		{
			id: 'rev-bts-5',
			placeId: 'bebek-tepi-sawah',
			userId: 'dummy-u-405',
			reviewerName: 'I Made Dharma',
			rating: 5,
			reviewText: 'Kuliner legendaris yang selalu konsisten rasanya sejak belasan tahun lalu. Bebek panggang dan bebek betutunya juga tak kalah nikmat dibanding bebek gorengnya.',
			hidden: false,
			createdAt: '2026-10-26T12:00:00.000Z'
		},
		{
			id: 'rev-bts-6',
			placeId: 'bebek-tepi-sawah',
			userId: 'dummy-u-406',
			reviewerName: 'Yuliana Tan',
			rating: 5,
			reviewText: 'Es kelapa muda dan bebek goreng renyahnya perpaduan sempurna setelah lelah jalan-jalan di Ubud. Wajib reservasi bila datang saat jam makan siang.',
			hidden: false,
			createdAt: '2026-10-19T13:45:00.000Z'
		}
	],
	'pura-giri': [
		{
			id: 'rev-pg-1',
			placeId: 'pura-giri',
			userId: 'dummy-u-501',
			reviewerName: 'I Nyoman Sudarsana',
			rating: 5,
			reviewText: 'Pura yang sangat sakral, hening, dan penuh energi kedamaian di puncak bukit. Pemandangan panorama lembah hijau dari pelataran pura sungguh menakjubkan.',
			photoUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&fit=crop&auto=format&q=80',
			hidden: false,
			createdAt: '2026-11-19T08:20:00.000Z'
		},
		{
			id: 'rev-pg-2',
			placeId: 'pura-giri',
			userId: 'dummy-u-502',
			reviewerName: 'Sarah Jenkins',
			rating: 5,
			reviewText: 'One of the most spiritual places on the island. The elevation provides cool, crisp mountain air and an unobstructed view of the volcanic ridgeline. Respectful dress code is observed.',
			hidden: false,
			createdAt: '2026-11-15T10:00:00.000Z'
		},
		{
			id: 'rev-pg-3',
			placeId: 'pura-giri',
			userId: 'dummy-u-503',
			reviewerName: 'Gede Arya Putra',
			rating: 5,
			reviewText: 'Arsitektur candi yang otentik dan terpelihara sangat baik. Pengelola pura sangat ramah meminjamkan sarung dan selendang bagi pengunjung yang belum membawa.',
			hidden: false,
			createdAt: '2026-11-10T11:30:00.000Z'
		},
		{
			id: 'rev-pg-4',
			placeId: 'pura-giri',
			userId: 'dummy-u-504',
			reviewerName: 'Kartika Sari',
			rating: 5,
			reviewText: 'Suasana meditatif yang tidak bisa didapatkan di tempat wisata biasa. Datanglah pagi hari saat kicauan burung hutan masih bersahutan. Luar biasa tenang.',
			hidden: false,
			createdAt: '2026-11-03T07:40:00.000Z'
		},
		{
			id: 'rev-pg-5',
			placeId: 'pura-giri',
			userId: 'dummy-u-505',
			reviewerName: 'Dian Permatasari',
			rating: 5,
			reviewText: 'Spot foto terbaik dengan latar pura bertingkat dan awan yang melintas di bawah bukit. Sangat sakral dan menghormati tradisi lokal.',
			hidden: false,
			createdAt: '2026-10-27T15:10:00.000Z'
		},
		{
			id: 'rev-pg-6',
			placeId: 'pura-giri',
			userId: 'dummy-u-506',
			reviewerName: 'Thomas Muller',
			rating: 5,
			reviewText: 'Magnificent cultural heritage. The stone carvings and historical shrines show master craftsmanship. A truly humbling cultural experience.',
			hidden: false,
			createdAt: '2026-10-17T09:50:00.000Z'
		}
	],
	'alila-villas': [
		{
			id: 'rev-av-1',
			placeId: 'alila-villas',
			userId: 'dummy-u-601',
			reviewerName: 'Clarissa Halim',
			rating: 5,
			reviewText: 'Resor bintang lima terbaik di tebing Uluwatu! Arsitektur kabana gantung di atas samudera sangat ikonik. Pelayanan butler sangat personal dan ramah.',
			photoUrl: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=600&fit=crop&auto=format&q=80',
			hidden: false,
			createdAt: '2026-11-17T16:00:00.000Z'
		},
		{
			id: 'rev-av-2',
			placeId: 'alila-villas',
			userId: 'dummy-u-602',
			reviewerName: 'Alexander Hayes',
			rating: 5,
			reviewText: 'Unrivaled sunset views from the cliff edge. Infinity pool looking straight into the Indian Ocean. Fine dining restaurants on site are world-class.',
			hidden: false,
			createdAt: '2026-11-11T19:30:00.000Z'
		},
		{
			id: 'rev-av-3',
			placeId: 'alila-villas',
			userId: 'dummy-u-603',
			reviewerName: 'Stephanie Wijaya',
			rating: 5,
			reviewText: 'Kenyamanan dan privasi villa luar biasa. Kolam renang pribadi luas dan kamar mandi outdoor sangat mewah. Pengalaman honeymoon impian yang sempurna.',
			hidden: false,
			createdAt: '2026-11-05T14:20:00.000Z'
		},
		{
			id: 'rev-av-4',
			placeId: 'alila-villas',
			userId: 'dummy-u-604',
			reviewerName: 'Ferry Salim',
			rating: 5,
			reviewText: 'Spa Alila menyajikan perawatan relaksasi terbaik dengan wewangian alami Bali. Makanan di The Warung menyajikan hidangan lokal dengan kualitas bintang lima.',
			hidden: false,
			createdAt: '2026-10-29T11:15:00.000Z'
		},
		{
			id: 'rev-av-5',
			placeId: 'alila-villas',
			userId: 'dummy-u-605',
			reviewerName: 'Natasha Romanova',
			rating: 4,
			reviewText: 'Exquisite eco-friendly luxury design. Everything from check-in to dinner was impeccably executed. Will definitely return next year.',
			hidden: false,
			createdAt: '2026-10-21T09:30:00.000Z'
		}
	],
	'revolver-espresso': [
		{
			id: 'rev-re-1',
			placeId: 'revolver-espresso',
			userId: 'dummy-u-701',
			reviewerName: 'Reza Rahardian',
			rating: 5,
			reviewText: 'Kopi terbaik di Seminyak tanpa debat! Vibe retro vintage dengan dekorasi unik membuat betah nongkrong berjam-jam. Flat white dan carrot cake-nya wajib coba.',
			photoUrl: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=600&fit=crop&auto=format&q=80',
			hidden: false,
			createdAt: '2026-11-18T10:15:00.000Z'
		},
		{
			id: 'rev-re-2',
			placeId: 'revolver-espresso',
			userId: 'dummy-u-702',
			reviewerName: 'Chloe Bennett',
			rating: 5,
			reviewText: 'Melbourne-grade coffee in the bustling heart of Bali. The hidden doorway entrance adds so much character. Fast and friendly baristas!',
			hidden: false,
			createdAt: '2026-11-13T09:00:00.000Z'
		},
		{
			id: 'rev-re-3',
			placeId: 'revolver-espresso',
			userId: 'dummy-u-703',
			reviewerName: 'Dimas Anggara',
			rating: 5,
			reviewText: 'Tempat sarapan dan brunch andalan sebelum keliling pantai. Menu egg benedict dan avocado toast-nya porsi pas dan rasanya fresh banget.',
			hidden: false,
			createdAt: '2026-11-06T08:30:00.000Z'
		},
		{
			id: 'rev-re-4',
			placeId: 'revolver-espresso',
			userId: 'dummy-u-704',
			reviewerName: 'Vania Larashati',
			rating: 4,
			reviewText: 'Tempatnya selalu ramai tapi servicenya cepat. Musiknya seru dan interiornya estetik untuk foto-foto. Biji kopinya juga bisa dibeli untuk oleh-oleh.',
			hidden: false,
			createdAt: '2026-10-31T15:20:00.000Z'
		},
		{
			id: 'rev-re-5',
			placeId: 'revolver-espresso',
			userId: 'dummy-u-705',
			reviewerName: 'Liam O’Connor',
			rating: 5,
			reviewText: 'Cold brew and espresso blend are second to none. If you appreciate artisan coffee roasts, this place is an absolute must-visit in Bali.',
			hidden: false,
			createdAt: '2026-10-23T11:40:00.000Z'
		}
	],
	'sate-plecing-argapura': [
		{
			id: 'rev-sp-1',
			placeId: 'sate-plecing-argapura',
			userId: 'dummy-u-801',
			reviewerName: 'I Putu Sudana',
			rating: 5,
			reviewText: 'Sate plecing paling juara di Denpasar! Sambal plecingnya pedas segar dengan perasan jeruk limau dan bumbu rempah khas Bali yang meresap sempurna ke dalam daging empuk.',
			photoUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&fit=crop&auto=format&q=80',
			hidden: false,
			createdAt: '2026-11-16T18:10:00.000Z'
		},
		{
			id: 'rev-sp-2',
			placeId: 'sate-plecing-argapura',
			userId: 'dummy-u-802',
			reviewerName: 'Ferry Kurniawan',
			rating: 5,
			reviewText: 'Kuliner autentik yang wajib didatangi para pecinta kuliner pedas. Daging satenya tidak berbau prengus sama sekali. Disajikan dengan kuah soto balung yang gurih hangat.',
			hidden: false,
			createdAt: '2026-11-10T19:40:00.000Z'
		},
		{
			id: 'rev-sp-3',
			placeId: 'sate-plecing-argapura',
			userId: 'dummy-u-803',
			reviewerName: 'Maya Indriani',
			rating: 5,
			reviewText: 'Harga sangat terjangkau dengan cita rasa bintang lima. Pelayanan cepat dan higienis. Selalu bungkus buat keluarga setiap lewat jalan Teuku Umar.',
			hidden: false,
			createdAt: '2026-11-04T12:30:00.000Z'
		},
		{
			id: 'rev-sp-4',
			placeId: 'sate-plecing-argapura',
			userId: 'dummy-u-804',
			reviewerName: 'Bayu Wicaksono',
			rating: 4,
			reviewText: 'Sensasi pedas cabai rawit dan terasi bakar khas plecing berpadu pas dengan sate daging sapi bakarnya. Parkir motor mudah, parkir mobil agak antre saat jam makan malam.',
			hidden: false,
			createdAt: '2026-10-28T20:15:00.000Z'
		},
		{
			id: 'rev-sp-5',
			placeId: 'sate-plecing-argapura',
			userId: 'dummy-u-805',
			reviewerName: 'Luh Made Sukerti',
			rating: 5,
			reviewText: 'Cita rasa resep tradisional Bali yang tidak berubah sejak lama. Tempat makan sederhana yang selalu dipadati pengunjung setia.',
			hidden: false,
			createdAt: '2026-10-20T17:50:00.000Z'
		}
	],
	'warung-nusantara': [
		{
			id: 'rev-wn-1',
			placeId: 'warung-nusantara',
			userId: 'dummy-u-901',
			reviewerName: 'Siti Nurhaliza',
			rating: 5,
			reviewText: 'Rendang sapinya luar biasa empuk dan kaya rempah! Suasana warung sangat asri khas Ubud, bersih dan nyaman. Pilihan tepat untuk santapan halal friendly.',
			photoUrl: 'https://images.unsplash.com/photo-1539755530862-00f623c00f52?w=600&fit=crop&auto=format&q=80',
			hidden: false,
			createdAt: '2026-11-17T12:00:00.000Z'
		},
		{
			id: 'rev-wn-2',
			placeId: 'warung-nusantara',
			userId: 'dummy-u-902',
			reviewerName: 'Johnathan Miller',
			rating: 5,
			reviewText: 'Authentic Indonesian home cooking at its finest! Friendly family-run establishment. The sambal matah honje and nasi campur are simply phenomenal.',
			hidden: false,
			createdAt: '2026-11-12T13:30:00.000Z'
		},
		{
			id: 'rev-wn-3',
			placeId: 'warung-nusantara',
			userId: 'dummy-u-903',
			reviewerName: 'Agnes Monica',
			rating: 5,
			reviewText: 'Harganya sangat bersahabat di kantong untuk kualitas rasa makanan yang begitu lezat di tengah Ubud. Pelayanan sangat ramah dan hangat.',
			hidden: false,
			createdAt: '2026-11-05T19:15:00.000Z'
		},
		{
			id: 'rev-wn-4',
			placeId: 'warung-nusantara',
			userId: 'dummy-u-904',
			reviewerName: 'Bima Satria',
			rating: 4,
			reviewText: 'Pilihan lauk nasi campurnya sangat variatif dan selalu hangat. Parkir luas dan tempat makan semi outdoor yang adem.',
			hidden: false,
			createdAt: '2026-10-29T14:00:00.000Z'
		},
		{
			id: 'rev-wn-5',
			placeId: 'warung-nusantara',
			userId: 'dummy-u-905',
			reviewerName: 'Ni Made Ratna',
			rating: 5,
			reviewText: 'Makanan terasa seperti masakan ibu di rumah. Bumbu rempahnya meresap mantap. Rekomendasi kuliner wajib saat berkunjung ke Monkey Forest Ubud.',
			hidden: false,
			createdAt: '2026-10-22T11:20:00.000Z'
		}
	]
};

export function getDummyReviews(placeId: string): Review[] {
	return DUMMY_REVIEWS[placeId] || [];
}
