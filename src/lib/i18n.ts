import { writable, derived } from 'svelte/store';

export type Locale = 'id' | 'en';

const initialLocale: Locale = (() => {
	if (typeof localStorage !== 'undefined') {
		const saved = localStorage.getItem('locale') as Locale | null;
		if (saved === 'id' || saved === 'en') return saved;
	}
	return 'id'; // Default Bahasa Indonesia
})();

export const locale = writable<Locale>(initialLocale);

export function setLocale(next: Locale) {
	locale.set(next);
	if (typeof localStorage !== 'undefined') {
		localStorage.setItem('locale', next);
	}
}

export const translations = {
	id: {
		common: {
			currencySymbol: 'Rp',
			free: 'Gratis',
			match: '% cocok',
			km: 'km',
			from: 'dari',
			any: 'Semua Kategori',
			loading: 'Memuat...',
			deleteConfirm: 'Apakah Anda yakin ingin menghapus?'
		},
		nav: {
			home: 'Beranda',
			preferences: 'Preferensi',
			explore: 'Eksplorasi',
			wishlist: 'Favorit',
			howItWorks: 'Cara Kerja',
			signIn: 'Masuk',
			signOut: 'Keluar',
			getStarted: 'Mulai Sekarang',
			admin: 'Admin'
		},
		footer: {
			tagline: 'Rekomendasi tempat wisata & kuliner terbaik, dinilai berdasarkan apa yang benar-benar Anda inginkan.',
			exploreTitle: 'Eksplorasi',
			methodTitle: 'Metode Penilaian',
			methodSubtitle: 'Kategori · Anggaran · Jarak · Rating',
			weightedScoring: 'Penilaian Berbobot v1.0',
			copyright: '© 2026 Jelajah. Semua Hak Dilindungi.'
		},
		landing: {
			badge: 'Sistem Rekomendasi Wisata & Kuliner',
			heroTitle1: 'Berhenti bingung.',
			heroTitle2: 'Mulai jelajah.',
			heroDesc: 'Tentukan kategori favorit, rentang anggaran, dan jarak tempuh Anda. Jelajah memberikan skor akurat dari 0 hingga 100 untuk menampilkan tempat terbaik terlebih dahulu.',
			ctaFind: 'Temukan Rekomendasi Saya',
			ctaRegister: 'Daftar Akun Baru',
			stats: [
				['2.400+', 'Tempat Terkurasi'],
				['38rb', 'Ulasan Terverifikasi'],
				['4', 'Indikator Penilaian'],
				['0–100', 'Skor Kecocokan']
			],
			howTitle: 'Cara Kerja',
			howHeading: 'Dari sekadar rencana menjadi daftar pilihan teratas dalam tiga langkah.',
			steps: [
				[
					'01',
					'Tentukan Keinginan Anda',
					'Pilih kategori wisata atau kuliner, atur batas anggaran belanja, serta tentukan titik keberangkatan dan radius jarak tempuh.'
				],
				[
					'02',
					'Algoritma Menilai Tempat',
					'Kategori (30%), anggaran (25%), jarak lokasi (25%), dan rating (20%) dihitung secara berbobot menjadi satu angka kecocokan.'
				],
				[
					'03',
					'Pilih dengan Percaya Diri',
					'Jelajahi hasil peringkat, gunakan filter, baca ulasan jujur, pantau peta rute terintegrasi, dan simpan tempat favorit Anda.'
				]
			],
			methodBadge: 'Metodologi',
			methodHeading: 'Empat Indikator.<br />Satu Angka Pasti.',
			methodDesc: 'Anda bebas menentukan indikator mana yang paling penting bagi Anda, dan hasil rekomendasi akan menyesuaikan secara seketika.',
			signals: [
				['Kategori', 30, 'Apakah sesuai dengan minat Anda?'],
				['Anggaran', 25, 'Apakah harga rata-rata masuk dalam rentang Anda?'],
				['Lokasi', 25, 'Seberapa dekat dengan titik awal Anda?'],
				['Rating', 20, 'Bagaimana tingkat kepuasan pengunjung lain?']
			],
			popularBadge: 'Pilihan Populer',
			popularTitle: 'Favorit Minggu Ini',
			exploreAll: 'Lihat Semua Tempat →',
			testimonials: [
				[
					'Kami menemukan warung lokal luar biasa yang belum pernah kami dengar sebelumnya. Skor kecocokan 92% dan rasanya luar biasa!',
					'Dewi Anggraini',
					'Jakarta'
				],
				[
					'Fitur batas anggaran sangat membantu menghindari tempat wisata dengan harga yang melambung tinggi.',
					'Marcus Hall',
					'Melbourne'
				],
				[
					'Pembobotan jarak tempuh adalah penyelamat. Sekarang tidak perlu lagi membuang waktu menyeberang kota hanya untuk makan siang.',
					'Sari Wulandari',
					'Bandung'
				]
			],
			ctaBannerTitle: 'Rekomendasi terbaik Anda siap dalam satu menit.',
			ctaBannerBtn: 'Mulai Sekarang Gratis'
		},
		find: {
			stepCategory: 'Kategori',
			stepBudget: 'Anggaran',
			stepDistance: 'Jarak',
			catTitle: 'Apa yang sedang ingin Anda nikmati?',
			catDesc: 'Pilih satu atau beberapa kategori tempat wisata dan kuliner.',
			budgetTitle: 'Berapa anggaran belanja Anda?',
			budgetDesc: 'Estimasi pengeluaran per orang dalam Rupiah (Rp).',
			minBudget: 'Minimal',
			maxBudget: 'Maksimal',
			distanceTitle: 'Seberapa jauh Anda bersedia bepergian?',
			distanceDesc: 'Tentukan titik awal keberangkatan dan radius jarak tempuh.',
			useLocation: 'Gunakan lokasi saya saat ini',
			locationBlocked: 'Akses lokasi tidak diizinkan. Silakan pilih area yang tersedia.',
			radiusLabel: 'Radius',
			priorityHeading: 'Faktor apa yang paling Anda utamakan?',
			priorities: {
				balanced: { t: 'Seimbang (Rekomendasi)', d: '30 / 25 / 25 / 20' },
				category: { t: 'Utamakan Kategori', d: '50 / 20 / 15 / 15' },
				budget: { t: 'Utamakan Anggaran', d: '20 / 45 / 20 / 15' },
				distance: { t: 'Paling Dekat', d: '20 / 20 / 45 / 15' },
				rating: { t: 'Rating Tertinggi', d: '20 / 20 / 20 / 40' }
			},
			btnBack: 'Kembali',
			btnContinue: 'Lanjutkan',
			btnSubmit: 'Tampilkan Rekomendasi',
			profileTitle: 'Ringkasan Pilihan',
			categoriesLabel: 'Kategori',
			budgetLabel: 'Anggaran',
			radiusSummary: 'Radius',
			fromOrigin: 'dari',
			you: 'lokasi Anda',
			weightsLabel: 'Prioritas Bobot'
		},
		results: {
			badge: 'Hasil Rekomendasi',
			title: 'Tempat Pilihan untuk Anda',
			editPrefs: 'Ubah Preferensi',
			filterBtn: 'Filter & Urutan',
			searchPlaceholder: 'Cari nama tempat, kategori, area, atau tag...',
			sortBy: 'Urutkan berdasarkan',
			sortOptions: {
				match: 'Kecocokan Terbaik',
				rating: 'Rating Tertinggi',
				price: 'Harga Termurah',
				distance: 'Jarak Terdekat'
			},
			categoryFilter: 'Kategori',
			maxPrice: 'Batas Maksimum Harga',
			maxDistance: 'Maksimum Jarak',
			minRating: 'Rating Minimal',
			emptyState: 'Tidak ada tempat yang sesuai kriteria filter. Coba perluas pilihan kategori atau anggaran Anda.'
		},
		detail: {
			back: 'Kembali ke hasil rekomendasi',
			reviewsCount: 'ulasan',
			location: 'Lokasi & Peta Rute',
			distanceFrom: 'km dari',
			reviews: 'Ulasan Pengunjung',
			reviewingAs: 'Mengulas sebagai',
			shareExperience: 'Ceritakan pengalaman Anda di tempat ini...',
			addPhoto: 'Tambah foto (opsional)',
			postReview: 'Kirim Ulasan',
			signInPrompt: 'Masuk dengan akun Anda untuk memberikan rating bintang dan foto.',
			signInBtn: 'Masuk untuk Mengulas',
			noReviews: 'Belum ada ulasan untuk tempat ini. Jadilah yang pertama memberikan ulasan!',
			avgPrice: 'Estimasi Pengeluaran',
			hours: 'Jam Operasional',
			address: 'Alamat Lengkap',
			directions: 'Petunjuk Arah (Peta)'
		},
		login: {
			welcomeBack: 'Selamat Datang Kembali',
			createAccount: 'Daftar Akun Baru',
			signIn: 'Masuk ke Jelajah',
			join: 'Bergabung dengan Jelajah',
			heroQuote: 'Perjalanan yang menyenangkan berawal dari pilihan tempat yang tepat.',
			fullName: 'Nama Lengkap',
			email: 'Alamat Email',
			password: 'Kata Sandi',
			signInBtn: 'Masuk',
			registerBtn: 'Buat Akun',
			newHere: 'Belum memiliki akun?',
			alreadyHave: 'Sudah memiliki akun?',
			createAccountLink: 'Daftar sekarang',
			signInLink: 'Masuk di sini',
			demoTitle: 'Akun Demo Siap Pakai'
		},
		home: {
			welcomeBack: 'Selamat datang kembali',
			hi: 'Halo',
			whereToNext: 'ingin ke mana berikutnya?',
			category: 'Kategori',
			maxBudget: 'Maks. Anggaran',
			distance: 'Jarak',
			findBtn: 'Cari Tempat',
			fullForm: 'Form preferensi lengkap',
			yourPrefs: 'Preferensi Anda saat ini',
			edit: 'Ubah →',
			recentSearches: 'Pencarian Terakhir',
			pickedForYou: 'Pilihan Spesial',
			topMatches: 'Rekomendasi Teratas untuk Anda',
			viewAll: 'Lihat Semua →',
			browse: 'Jelajahi'
		},
		wishlist: {
			badge: 'Tempat Favorit',
			title: 'Daftar Tersimpan Anda',
			empty: 'Belum ada tempat yang Anda simpan. Klik ikon hati pada tempat yang Anda minati.',
			exploreLink: 'Eksplorasi Tempat Menarik',
			saved: 'Tersimpan',
			saveToWishlist: 'Simpan ke Favorit'
		},
		admin: {
			title: 'Panel Administrasi',
			tabs: {
				dashboard: 'Dasbor',
				places: 'Tempat Wisata & Kuliner',
				categories: 'Kategori',
				reviews: 'Moderasi Ulasan',
				users: 'Pengguna'
			},
			stats: {
				places: 'Total Tempat',
				reviews: 'Total Ulasan',
				users: 'Pengguna Terdaftar',
				searches: 'Pencarian Tercatat'
			},
			topPlaces: 'Tempat Paling Populer',
			topPlacesSub: 'Berdasarkan volume ulasan',
			topCats: 'Kategori Paling Diminati',
			topCatsSub: 'Dari riwayat pencarian preferensi',
			addPlace: 'Tambah Tempat Baru',
			editPlace: 'Edit Data Tempat',
			newCategoryName: 'Nama kategori baru...',
			addCategoryBtn: 'Tambah',
			searchPlaceholder: 'Cari data...',
			table: {
				place: 'Nama & Alamat',
				category: 'Kategori',
				price: 'Rentang Harga',
				rating: 'Rating',
				status: 'Status',
				reviewer: 'Pengulas',
				review: 'Isi Ulasan',
				name: 'Nama',
				email: 'Email',
				role: 'Peran',
				actions: 'Aksi',
				visible: 'Aktif',
				hidden: 'Disembunyikan',
				builtIn: 'Bawaan Sistem',
				save: 'Simpan'
			},
			moderateHeading: 'Moderasi Ulasan Pengunjung',
			moderateSub: 'Sembunyikan ulasan yang melanggar ketentuan. Ulasan tersembunyi tidak akan terlihat di halaman publik.'
		}
	},
	en: {
		common: {
			currencySymbol: 'Rp',
			free: 'Free',
			match: '% match',
			km: 'km',
			from: 'from',
			any: 'Any Category',
			loading: 'Loading...',
			deleteConfirm: 'Are you sure you want to delete this?'
		},
		nav: {
			home: 'Home',
			preferences: 'Preferences',
			explore: 'Explore',
			wishlist: 'Wishlist',
			howItWorks: 'How it works',
			signIn: 'Sign in',
			signOut: 'Sign out',
			getStarted: 'Get started',
			admin: 'Admin'
		},
		footer: {
			tagline: 'Travel and culinary picks, scored on what you actually care about.',
			exploreTitle: 'Explore',
			methodTitle: 'Scoring Method',
			methodSubtitle: 'Category · Budget · Distance · Rating',
			weightedScoring: 'Weighted scoring v1.0',
			copyright: '© 2026 Jelajah. All rights reserved.'
		},
		landing: {
			badge: 'Tourism & Culinary Recommendation System',
			heroTitle1: 'Stop scrolling.',
			heroTitle2: 'Start going.',
			heroDesc: 'Tell us your category, budget and distance. Jelajah scores every place from 0 to 100 on category, budget, location and rating and shows the best fit first.',
			ctaFind: 'Find my match',
			ctaRegister: 'Create account',
			stats: [
				['2,400+', 'Curated places'],
				['38k', 'Verified reviews'],
				['4', 'Match signals'],
				['0–100', 'Match score']
			],
			howTitle: 'How it works',
			howHeading: 'From a vague craving to a ranked shortlist in three steps.',
			steps: [
				[
					'01',
					'Tell us what you want',
					'Choose categories, set a min and max budget, and pick where you start and how far you will go.'
				],
				[
					'02',
					'We score every place',
					'Category, budget, location and rating are weighted and combined into one match number.'
				],
				[
					'03',
					'Pick with confidence',
					'Browse a ranked grid, search and filter, read reviews, open the map and save favourites.'
				]
			],
			methodBadge: 'The method',
			methodHeading: 'Four signals.<br />One number.',
			methodDesc: 'You choose which signal matters most and the list reorders itself. No black box, just weights you can see.',
			signals: [
				['Category', 30, 'Does it fit what you want to do?'],
				['Budget', 25, 'Is the average price inside your range?'],
				['Location', 25, 'How close is it to your starting point?'],
				['Rating', 20, 'What do other visitors say?']
			],
			popularBadge: 'A taste of what is inside',
			popularTitle: 'Popular this week',
			exploreAll: 'Explore all places →',
			testimonials: [
				[
					'We found a warung we would never have noticed. It was 92% match and the best meal of the trip.',
					'Dewi Anggraini',
					'Jakarta'
				],
				[
					'Setting a budget cap saved us from three tourist traps in one afternoon.',
					'Marcus Hall',
					'Melbourne'
				],
				[
					'The distance weighting is the feature. I finally stopped crossing the island for lunch.',
					'Sari Wulandari',
					'Bandung'
				]
			],
			ctaBannerTitle: 'Your shortlist is one minute away.',
			ctaBannerBtn: 'Get started free'
		},
		find: {
			stepCategory: 'Category',
			stepBudget: 'Budget',
			stepDistance: 'Distance',
			catTitle: 'What are you in the mood for?',
			catDesc: 'Select one or more categories.',
			budgetTitle: 'What is your budget?',
			budgetDesc: 'Typical spend per person, in Rupiah (Rp).',
			minBudget: 'Minimum',
			maxBudget: 'Maximum',
			distanceTitle: 'How far will you go?',
			distanceDesc: 'Pick your starting point and a radius.',
			useLocation: 'Use my location',
			locationBlocked: 'Location blocked. Choose an area instead.',
			radiusLabel: 'Radius',
			priorityHeading: 'What matters most? (category / budget / location / rating)',
			priorities: {
				balanced: { t: 'Balanced (Recommended)', d: '30 / 25 / 25 / 20' },
				category: { t: 'Category first', d: '50 / 20 / 15 / 15' },
				budget: { t: 'Budget first', d: '20 / 45 / 20 / 15' },
				distance: { t: 'Nearest first', d: '20 / 20 / 45 / 15' },
				rating: { t: 'Top rated', d: '20 / 20 / 20 / 40' }
			},
			btnBack: 'Back',
			btnContinue: 'Continue',
			btnSubmit: 'Show my matches',
			profileTitle: 'Your profile',
			categoriesLabel: 'Categories',
			budgetLabel: 'Budget',
			radiusSummary: 'Radius',
			fromOrigin: 'from',
			you: 'you',
			weightsLabel: 'Weights'
		},
		results: {
			badge: 'Recommendations',
			title: 'Your matches',
			editPrefs: 'Edit preferences',
			filterBtn: 'Filters',
			searchPlaceholder: 'Search by name, category, area or tag...',
			sortBy: 'Sort by',
			sortOptions: {
				match: 'Best match',
				rating: 'Top rated',
				price: 'Lowest price',
				distance: 'Nearest'
			},
			categoryFilter: 'Category',
			maxPrice: 'Max starting price',
			maxDistance: 'Max distance',
			minRating: 'Minimum rating',
			emptyState: 'No places match. Try loosening the filters.'
		},
		detail: {
			back: 'Back to results',
			reviewsCount: 'reviews',
			location: 'Location',
			distanceFrom: 'km from',
			reviews: 'Reviews',
			reviewingAs: 'Reviewing as',
			shareExperience: 'Share your experience',
			addPhoto: 'Add photo (optional)',
			postReview: 'Post review',
			signInPrompt: 'Sign in to rate this place and share photos.',
			signInBtn: 'Sign in to review',
			noReviews: 'No reviews yet. Be the first.',
			avgPrice: 'Average price',
			hours: 'Operating hours',
			address: 'Address',
			directions: 'Get directions'
		},
		login: {
			welcomeBack: 'Welcome back',
			createAccount: 'Create account',
			signIn: 'Sign in',
			join: 'Join Jelajah',
			heroQuote: 'Good trips start with a better shortlist.',
			fullName: 'Full name',
			email: 'Email',
			password: 'Password',
			signInBtn: 'Sign in',
			registerBtn: 'Create account',
			newHere: 'New here?',
			alreadyHave: 'Already have an account?',
			createAccountLink: 'Create an account',
			signInLink: 'Sign in',
			demoTitle: 'Demo accounts'
		},
		home: {
			welcomeBack: 'Welcome back',
			hi: 'Hi',
			whereToNext: 'where to next?',
			category: 'Category',
			maxBudget: 'Max budget',
			distance: 'Distance',
			findBtn: 'Find matches',
			fullForm: 'Full preference form',
			yourPrefs: 'Your preferences',
			edit: 'Edit →',
			recentSearches: 'Recent searches',
			pickedForYou: 'Picked for you',
			topMatches: 'Your top matches',
			viewAll: 'View all →',
			browse: 'Browse'
		},
		wishlist: {
			badge: 'Saved places',
			title: 'Your wishlist',
			empty: 'Nothing saved yet. Tap the heart on any place.',
			exploreLink: 'Explore places',
			saved: 'Saved',
			saveToWishlist: 'Save to wishlist'
		},
		admin: {
			title: 'Admin panel',
			tabs: {
				dashboard: 'Dashboard',
				places: 'Places',
				categories: 'Categories',
				reviews: 'Reviews',
				users: 'Users'
			},
			stats: {
				places: 'Places',
				reviews: 'Reviews',
				users: 'Users',
				searches: 'Searches logged'
			},
			topPlaces: 'Most popular places',
			topPlacesSub: 'By review volume',
			topCats: 'Most searched categories',
			topCatsSub: 'From preference searches',
			addPlace: 'Add place',
			editPlace: 'Edit place',
			newCategoryName: 'New category name...',
			addCategoryBtn: 'Add',
			searchPlaceholder: 'Search...',
			table: {
				place: 'Place',
				category: 'Category',
				price: 'Price',
				rating: 'Rating',
				status: 'Status',
				reviewer: 'Reviewer',
				review: 'Review',
				name: 'Name',
				email: 'Email',
				role: 'Role',
				actions: 'Actions',
				visible: 'Visible',
				hidden: 'Hidden',
				builtIn: 'Built-in',
				save: 'Save'
			},
			moderateHeading: 'Moderate reviews',
			moderateSub: 'Hide reviews that break the rules. Hidden reviews disappear from place pages.'
		}
	}
};

export const t = derived(locale, ($locale) => translations[$locale]);
