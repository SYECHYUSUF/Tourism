# Jelajah — Sistem Rekomendasi Tempat Wisata & Kuliner

Aplikasi web yang merekomendasikan tempat wisata dan kuliner di Bali berdasarkan kategori,
anggaran, jarak, dan rating, memakai metode **Weighted Scoring**.
Proyek Perangkat Lunak — Kelompok 11, Sistem Informasi Universitas Hasanuddin.

## Teknologi

| Lapisan | Teknologi |
| --- | --- |
| Framework | SvelteKit 2 (SSR) + Svelte 4 + TypeScript |
| Tampilan | Tailwind CSS 3, lucide-svelte |
| Database | PostgreSQL (Supabase) dengan Row Level Security |
| Autentikasi | Supabase Auth (sesi cookie SSR, diverifikasi `getUser()`) |
| Penyimpanan file | Supabase Storage (`place-images`, `review-photos`) |
| Peta | Leaflet + OpenStreetMap |
| Tes | Vitest |
| Deploy | Vercel (`@sveltejs/adapter-vercel`) |

## Struktur folder

```
src/
├── hooks.server.ts            # Klien Supabase per request, verifikasi sesi, role dari tabel profiles,
│                              # guard rute (/admin wajib admin), header keamanan, bahasa SSR
├── lib/
│   ├── scoring.ts             # Algoritma Weighted Scoring (fungsi murni + tes)
│   ├── prefs.ts               # Default, validasi (sanitizePrefs), sessionStorage, query string URL
│   ├── search.ts              # Kirim pencarian: simpan preferensi + catat ke search_logs
│   ├── i18n.ts                # Teks Indonesia & Inggris
│   ├── types.ts, database.types.ts
│   └── server/                # HANYA server
│       ├── supabaseAdmin.ts   # Klien service role (operasi admin)
│       ├── repo/              # places, categories, preferences
│       ├── validation.ts      # Validasi input form
│       ├── storage.ts         # Upload/hapus gambar
│       └── requireAdmin.ts
├── components/                # Navbar, PlaceCard, WishlistButton, MapComponent, LocationPicker, ...
└── routes/
    ├── +page                  # Landing
    ├── find/                  # Wizard preferensi (3 langkah)
    ├── results/               # Hasil rekomendasi (grid/peta, filter, link bisa dibagikan)
    ├── places/[id]/           # Detail tempat, peta, ulasan + foto
    ├── login/, auth/callback, logout, reset-password
    ├── home/, wishlist/       # Wajib login
    ├── admin/                 # Wajib role admin: dasbor, places, categories, reviews, users
    ├── api/wishlist, api/search
    └── sitemap.xml, robots.txt
supabase/
├── migrations/
│   ├── 20261109000001_init.sql         # Tabel, trigger, RLS, storage
│   └── 20261110000001_admin_fixes.sql  # Perbaikan trigger role + index analitik
└── seed.sql                            # 6 kategori + 16 tempat awal
```

## Database

Tabel: `profiles`, `categories`, `places`, `reviews`, `wishlists`, `preferences`, `search_logs`.
Semua tabel memakai Row Level Security. Ringkasnya:

- Semua orang boleh membaca `places` dan `categories`; hanya admin yang boleh mengubahnya.
- Ulasan tersembunyi (`hidden = true`) tidak tampil publik dan tidak dihitung ke rating.
- `rating` dan `review_count` di `places` dihitung otomatis oleh trigger dari ulasan.
- `wishlists` dan `preferences` hanya bisa diakses pemiliknya.
- `search_logs` bisa ditulis siapa pun, hanya admin yang bisa membaca.
- Role disimpan di `profiles.role` dan tidak bisa dinaikkan sendiri oleh pengguna.

## Menjalankan secara lokal

1. **Buat proyek Supabase**, lalu buka **SQL Editor** dan jalankan berurutan:
   1. `supabase/migrations/20261109000001_init.sql`
   2. `supabase/migrations/20261110000001_admin_fixes.sql`
   3. `supabase/seed.sql`
2. **Salin env**: `cp .env.example .env`, lalu isi dari Supabase → Settings → API Keys:
   - `PUBLIC_SUPABASE_URL` = `https://<project-ref>.supabase.co`
   - `PUBLIC_SUPABASE_ANON_KEY` = publishable key (`sb_publishable_...`) atau anon key lama
   - `SUPABASE_SERVICE_ROLE_KEY` = secret key (`sb_secret_...`) atau service_role lama. **Rahasia, jangan di-commit.**
3. **Instal dan jalankan**:
   ```bash
   npm install
   npm run dev
   ```
4. **Buat admin pertama**: Supabase → Authentication → Users → Add user (centang *Auto Confirm User*),
   lalu di SQL Editor:
   ```sql
   update public.profiles set role = 'admin'
   where id = (select id from auth.users where email = 'email-anda@contoh.com');
   ```

> Layanan email bawaan Supabase dibatasi beberapa email per jam. Untuk pengembangan, matikan
> *Confirm email* di Authentication → Sign In / Providers → Email, atau pasang SMTP sendiri.

## Script

| Perintah | Fungsi |
| --- | --- |
| `npm run dev` | Server pengembangan |
| `npm run build` | Build produksi (output Vercel) |
| `npm run preview` | Pratinjau build |
| `npm run check` | Pemeriksaan tipe Svelte/TypeScript |
| `npm test` | Unit test (Vitest): scoring, preferensi, validasi |

## Algoritma Weighted Scoring

Skor 0–100 = jumlah empat sinyal (masing-masing 0–1) × bobot:

| Sinyal | Rumus |
| --- | --- |
| Kategori (C) | 1 jika kategori tempat dipilih (atau tidak ada pilihan), selain itu 0,15 |
| Budget (B) | 1 jika harga tengah tempat di dalam rentang; di luar rentang turun linear sebanding selisih / batas maksimum |
| Lokasi (L) | `max(0, 1 − jarak / (1,5 × radius))`, jarak dengan rumus Haversine |
| Rating (R) | rating / 5 |

| Bobot | Seimbang | Kategori | Budget | Jarak | Rating |
| --- | --- | --- | --- | --- | --- |
| Kategori | 30% | 50% | 20% | 20% | 20% |
| Budget | 25% | 20% | 45% | 20% | 20% |
| Lokasi | 25% | 15% | 20% | 45% | 20% |
| Rating | 20% | 15% | 15% | 15% | 40% |

## Deploy ke Vercel

1. Import repo di vercel.com.
2. Isi tiga variabel env di atas pada Project Settings → Environment Variables.
3. Di Supabase → Authentication → URL Configuration, tambahkan domain Vercel ke *Site URL*
   dan *Redirect URLs* (`https://domain-anda.vercel.app/auth/callback`).
