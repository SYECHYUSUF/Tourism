-- =============================================================================
-- Jelajah — Seed Data
-- File   : supabase/seed.sql
-- Run in : Supabase SQL Editor AFTER the migration has been applied.
--
-- Seeds:
--   • 6 categories
--   • 16 places from SEED_PLACES (src/lib/data.ts)
--     All camelCase field names converted to snake_case.
--     No fake reviews are seeded (reviews come from real users).
-- =============================================================================


-- =============================================================================
-- 1. Categories
--    `name` must stay identical to the strings used in scoring.ts / data.ts.
-- =============================================================================
insert into public.categories (name, label_id, label_en, icon)
values
  ('Culinary', 'Kuliner',    'Culinary',  'UtensilsCrossed'),
  ('Cafe',     'Kafe',       'Café',      'Coffee'),
  ('Nature',   'Alam',       'Nature',    'TreePine'),
  ('Culture',  'Budaya',     'Culture',   'Landmark'),
  ('Beach',    'Pantai',     'Beach',     'Waves'),
  ('Resort',   'Resor',      'Resort',    'Hotel')
on conflict (name) do update
  set label_id = excluded.label_id,
      label_en = excluded.label_en,
      icon     = excluded.icon;


-- =============================================================================
-- 2. Places
--    id  : slug text — matches SEED_PLACES and all in-app routes.
--    rating / review_count : seeded with original demo values; will be
--      recalculated automatically whenever real reviews are inserted.
--    gallery / facilities / highlights / tags : array literals.
--    gmaps_url : mapped from gmapsUrl.
-- =============================================================================

-- Helper: resolve category_id by name in one upsert pass
with cat as (
  select id, name from public.categories
)
insert into public.places (
  id, category_id, category,
  name, area, address, lat, lng,
  price_min, price_max, rating, review_count,
  image, gallery, blurb, hours, tags, facilities, highlights,
  phone, instagram, gmaps_url
)
values

  -- 1 · Warung Nusantara
  (
    'warung-nusantara',
    (select id from cat where name = 'Culinary'),
    'Culinary',
    'Warung Nusantara', 'Ubud Center', 'Jl. Monkey Forest No. 18, Ubud',
    -8.5069, 115.2625,
    25000, 75000, 4.8, 842,
    'https://images.unsplash.com/photo-1539755530862-00f623c00f52?w=900&fit=crop&auto=format&q=80',
    array[
      'https://images.unsplash.com/photo-1539755530862-00f623c00f52?w=900&fit=crop&auto=format&q=80',
      'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=900&fit=crop&auto=format&q=80',
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=900&fit=crop&auto=format&q=80',
      'https://images.unsplash.com/photo-1544025162-d76694265947?w=900&fit=crop&auto=format&q=80'
    ],
    'Dapur keluarga yang menyajikan rendang empuk, sambal matah segar, dan aneka hidangan autentik Nusantara di tengah suasana Ubud yang tenang.',
    '08:00 – 22:00',
    array['Halal friendly','Keluarga','Lokal'],
    array['Wi-Fi Gratis','Tempat Parkir','Musholla','Area Outdoor','Pembayaran QRIS','Ramah Anak'],
    array['Rendang Sapi Warisan','Nasi Campur Spesial','Sambal Matah Honje'],
    '+62 361 975 882', '@warungnusantara.bali',
    'https://maps.google.com/?q=Warung+Nusantara+Ubud+Bali'
  ),

  -- 2 · Lamplight Coffee House
  (
    'kopi-lamplight',
    (select id from cat where name = 'Cafe'),
    'Cafe',
    'Lamplight Coffee House', 'Seminyak', 'Jl. Kayu Aya No. 42, Seminyak',
    -8.6913, 115.1682,
    20000, 55000, 4.6, 531,
    'https://images.unsplash.com/photo-1511081692775-05d0f180a065?w=900&fit=crop&auto=format&q=80',
    array[
      'https://images.unsplash.com/photo-1511081692775-05d0f180a065?w=900&fit=crop&auto=format&q=80',
      'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=900&fit=crop&auto=format&q=80',
      'https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=900&fit=crop&auto=format&q=80',
      'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=900&fit=crop&auto=format&q=80'
    ],
    'Kopi seduh manual single-origin dan roti hangat di bawah cahaya lampu temaram. Suasana nyaman dan tenang, ideal untuk remote working.',
    '07:00 – 21:00',
    array['Wi-Fi Kencang','Menu Vegan','Tenang'],
    array['Wi-Fi Cepat (100 Mbps)','Stopkontak di Tiap Meja','Ruang AC','Area Non-Smoking','Pet Friendly'],
    array['Pour Over Kintamani Natural','Almond Croissant','Cold Brew Tonic'],
    '+62 812 3988 1204', '@lamplight.bali',
    'https://maps.google.com/?q=Lamplight+Coffee+Seminyak+Bali'
  ),

  -- 3 · Pantai Biru Beach Club
  (
    'pantai-biru',
    (select id from cat where name = 'Beach'),
    'Beach',
    'Pantai Biru Beach Club', 'Uluwatu', 'Jl. Labuansait, Pecatu, Uluwatu',
    -8.8291, 115.0849,
    100000, 350000, 4.7, 1204,
    'https://images.unsplash.com/photo-1605538108568-7f0d77a214c1?w=900&fit=crop&auto=format&q=80',
    array[
      'https://images.unsplash.com/photo-1605538108568-7f0d77a214c1?w=900&fit=crop&auto=format&q=80',
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=900&fit=crop&auto=format&q=80',
      'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=900&fit=crop&auto=format&q=80',
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=900&fit=crop&auto=format&q=80'
    ],
    'Pasir putih, ombak jernih, dan daybed teduh di atas tebing karang untuk menikmati matahari terbenam dengan sajian seafood bakar segar.',
    '09:00 – 23:00',
    array['Sunset View','Seafood Bakar','Daybed'],
    array['Kolam Renang Infinity','Akses Pantai Privat','Handuk & Shower','Bar & Koktail','Parkir Valet'],
    array['Ikan Kakap Bakar Jimbaran','Sunset Daybed Experience','Kelapa Muda Batok'],
    '+62 361 847 9010', '@pantaibiru.uluwatu',
    'https://maps.google.com/?q=Pantai+Biru+Uluwatu+Bali'
  ),

  -- 4 · Pura Giri Hilltop Temple
  (
    'pura-giri',
    (select id from cat where name = 'Culture'),
    'Culture',
    'Pura Giri Hilltop Temple', 'Kintamani', 'Desa Batur, Kintamani',
    -8.242, 115.335,
    0, 30000, 4.9, 2310,
    'https://images.unsplash.com/photo-1609770836167-7a74ed99bfad?w=900&fit=crop&auto=format&q=80',
    array[
      'https://images.unsplash.com/photo-1609770836167-7a74ed99bfad?w=900&fit=crop&auto=format&q=80',
      'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=900&fit=crop&auto=format&q=80',
      'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=900&fit=crop&auto=format&q=80',
      'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=900&fit=crop&auto=format&q=80'
    ],
    'Pura megah di puncak bukit di atas awan, memesona saat fajar ketika puncak gunung berapi Batur bermandikan cahaya keemasan.',
    '06:00 – 18:00',
    array['Sunrise View','Warisan Budaya','Spot Foto'],
    array['Penyewaan Sarung/Kamben','Pemandu Lokal Berlisensi','Area Parkir Luas','Warung Tradisional'],
    array['Panorama Lautan Awan','Arsitektur Kori Agung','Upacara Adat Purnama'],
    '+62 821 4455 6677', '@puragiri.heritage',
    'https://maps.google.com/?q=Pura+Giri+Kintamani+Bali'
  ),

  -- 5 · Ridgeline Forest Lodge
  (
    'ridge-lodge',
    (select id from cat where name = 'Nature'),
    'Nature',
    'Ridgeline Forest Lodge', 'Munduk', 'Jl. Raya Munduk, Buleleng',
    -8.273, 115.068,
    350000, 950000, 4.5, 388,
    'https://images.unsplash.com/photo-1637201813231-e7e824db5485?w=900&fit=crop&auto=format&q=80',
    array[
      'https://images.unsplash.com/photo-1637201813231-e7e824db5485?w=900&fit=crop&auto=format&q=80',
      'https://images.unsplash.com/photo-1448375240586-882707db888b?w=900&fit=crop&auto=format&q=80',
      'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=900&fit=crop&auto=format&q=80',
      'https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=900&fit=crop&auto=format&q=80'
    ],
    'Kabin kayu di punggung bukit berkabut dengan jalur air terjun alami, dapur kebun organik, dan udara pegunungan yang sangat sejuk.',
    'Buka Setiap Hari (Check-in 14:00)',
    array['Wisata Alam','Eco Lodge','Udara Sejuk'],
    array['Jalur Trekking Pribadi','Restoran Farm-to-Table','Api Unggun Malam','Balkon Pemandangan Lembah'],
    array['Tur Air Terjun Munduk','Kopi Robusta Kebun Sendiri','Sarapan Tepi Jurang'],
    '+62 813 3789 2234', '@ridgeline.munduk',
    'https://maps.google.com/?q=Ridgeline+Forest+Lodge+Munduk'
  ),

  -- 6 · Laut Lagoon Resort
  (
    'laut-resort',
    (select id from cat where name = 'Resort'),
    'Resort',
    'Laut Lagoon Resort', 'Nusa Dua', 'Kawasan ITDC, Nusa Dua',
    -8.8003, 115.2316,
    850000, 2200000, 4.4, 712,
    'https://images.unsplash.com/photo-1605581813258-076a6654a37f?w=900&fit=crop&auto=format&q=80',
    array[
      'https://images.unsplash.com/photo-1605581813258-076a6654a37f?w=900&fit=crop&auto=format&q=80',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=900&fit=crop&auto=format&q=80',
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=900&fit=crop&auto=format&q=80',
      'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=900&fit=crop&auto=format&q=80'
    ],
    'Vila tepi laguna pirus dengan fasilitas spa mewah, klub anak-anak, dan akses langsung ke pantai berpasir putih Nusa Dua.',
    'Layanan 24 Jam',
    array['Kolam Renang Laguna','Spa Tradisional','Ramah Keluarga'],
    array['Kolam Laguna 1.000 m²','Kids Club','Spa Tradisional Bali','Gym & Yoga Pavilion','Restoran Tepi Pantai'],
    array['Akses Langsung ke Kolam dari Kamar','Pijat Aromaterapi Bunga Jepun','Romantic Beachfront Dinner'],
    '+62 361 771 900', '@lautlagoon.resort',
    'https://maps.google.com/?q=Laut+Lagoon+Resort+Nusa+Dua'
  ),

  -- 7 · Meja Panjang Restaurant
  (
    'meja-panjang',
    (select id from cat where name = 'Culinary'),
    'Culinary',
    'Meja Panjang Restaurant', 'Canggu', 'Jl. Pantai Batu Bolong No. 7, Canggu',
    -8.6478, 115.1385,
    65000, 200000, 4.7, 467,
    'https://images.unsplash.com/photo-1682139710677-cb02f6bc4211?w=900&fit=crop&auto=format&q=80',
    array[
      'https://images.unsplash.com/photo-1682139710677-cb02f6bc4211?w=900&fit=crop&auto=format&q=80',
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=900&fit=crop&auto=format&q=80',
      'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?w=900&fit=crop&auto=format&q=80',
      'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=900&fit=crop&auto=format&q=80'
    ],
    'Meja komunal panjang yang menyajikan menu santap bersama dari dapur kayu bakar yang selalu segar, mengusung konsep kebersamaan.',
    '11:00 – 23:00',
    array['Wood-fired','Santap Bersama','Suasana Hangat'],
    array['Dapur Terbuka (Open Kitchen)','Outdoor Seating','Bar & Mocktail','Reservasi Online','Bebas Gluten Tersedia'],
    array['Ayam Bakar Madu Hutan','Pizza Sourdough Dapur Kayu','Smoked Beef Brisket'],
    '+62 811 380 9922', '@mejapanjang.canggu',
    'https://maps.google.com/?q=Meja+Panjang+Canggu+Bali'
  ),

  -- 8 · Sawah Terrace Cafe
  (
    'sawah-cafe',
    (select id from cat where name = 'Cafe'),
    'Cafe',
    'Sawah Terrace Cafe', 'Tegallalang', 'Jl. Raya Tegallalang, Gianyar',
    -8.4312, 115.2793,
    25000, 85000, 4.3, 329,
    'https://images.unsplash.com/photo-1521017432531-fbd92d768814?w=900&fit=crop&auto=format&q=80',
    array[
      'https://images.unsplash.com/photo-1521017432531-fbd92d768814?w=900&fit=crop&auto=format&q=80',
      'https://images.unsplash.com/photo-1497636577773-f1231844b336?w=900&fit=crop&auto=format&q=80',
      'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=900&fit=crop&auto=format&q=80',
      'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=900&fit=crop&auto=format&q=80'
    ],
    'Semangkuk smoothie sehat dan es kopi segar dengan panorama terasering sawah Tegallalang yang memukau dan hembusan angin sejuk.',
    '08:00 – 18:00',
    array['Terasering Sawah','Smoothie Bowl','Instagramable'],
    array['Spot Foto Ayunan Sawah','Wi-Fi Gratis','Tempat Duduk Terbuka','Pilihan Makanan Vegetarian'],
    array['Dragon Fruit Smoothie Bowl','Kopi Susu Gula Aren Bali','Avocado Toast Brioche'],
    '+62 878 6123 4567', '@sawahterrace.bali',
    'https://maps.google.com/?q=Sawah+Terrace+Cafe+Tegallalang'
  ),

  -- 9 · Bebek Tepi Sawah
  (
    'bebek-tepi-sawah',
    (select id from cat where name = 'Culinary'),
    'Culinary',
    'Bebek Tepi Sawah', 'Ubud', 'Jl. Raya Goa Gajah, Peliatan, Ubud',
    -8.5204, 115.2758,
    80000, 220000, 4.7, 3120,
    'https://images.unsplash.com/photo-1544025162-d76694265947?w=900&fit=crop&auto=format&q=80',
    array[
      'https://images.unsplash.com/photo-1544025162-d76694265947?w=900&fit=crop&auto=format&q=80',
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=900&fit=crop&auto=format&q=80',
      'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=900&fit=crop&auto=format&q=80',
      'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=900&fit=crop&auto=format&q=80'
    ],
    'Kuliner ikonik Ubud dengan sajian bebek goreng garing gurih disertai 3 varian sambal khas Bali dan panorama hamparan sawah hijau.',
    '10:00 – 22:00',
    array['Kuliner Legendaris','View Sawah','Halal'],
    array['Gazebo Bale Bengong','Tempat Parkir Bus/Mobil','Musholla Bersih','Taman Bermain Anak','Live Gamelan'],
    array['Crispy Duck with 3 Sambals','Sate Lilit Ikan','Es Kelapa Jeruk Segar'],
    '+62 361 975 656', '@bebektepisawah.ubud',
    'https://maps.google.com/?q=Bebek+Tepi+Sawah+Ubud'
  ),

  -- 10 · Revolver Boutique Espresso
  (
    'revolver-espresso',
    (select id from cat where name = 'Cafe'),
    'Cafe',
    'Revolver Boutique Espresso', 'Seminyak', 'Jl. Kayu Aya Gang 51, Seminyak',
    -8.6872, 115.1578,
    35000, 95000, 4.8, 1890,
    'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=900&fit=crop&auto=format&q=80',
    array[
      'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=900&fit=crop&auto=format&q=80',
      'https://images.unsplash.com/photo-1511081692775-05d0f180a065?w=900&fit=crop&auto=format&q=80',
      'https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=900&fit=crop&auto=format&q=80',
      'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=900&fit=crop&auto=format&q=80'
    ],
    'Kafe butik legendaris tersembunyi di gang Seminyak dengan dekorasi vintage Wild West, kopi sangrai sendiri, dan hidangan brunch lezat.',
    '07:00 – 23:00',
    array['Specialty Coffee','Vintage Vibe','Brunch Favorit'],
    array['Barista Counter Interaktif','Full AC','Merchandise Corner','Menu Sarapan Sepanjang Hari'],
    array['Revolver Signature Blend','Smashed Avo on Sourdough','Carrot Cake Mascarpone'],
    '+62 851 0084 4849', '@revolver.bali',
    'https://maps.google.com/?q=Revolver+Espresso+Seminyak'
  ),

  -- 11 · Pantai Melasti Ungasan
  (
    'pantai-melasti',
    (select id from cat where name = 'Beach'),
    'Beach',
    'Pantai Melasti Ungasan', 'Uluwatu', 'Jl. Melasti, Ungasan, Kuta Selatan',
    -8.8475, 115.1586,
    10000, 50000, 4.8, 4150,
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=900&fit=crop&auto=format&q=80',
    array[
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=900&fit=crop&auto=format&q=80',
      'https://images.unsplash.com/photo-1605538108568-7f0d77a214c1?w=900&fit=crop&auto=format&q=80',
      'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=900&fit=crop&auto=format&q=80',
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=900&fit=crop&auto=format&q=80'
    ],
    'Pantai eksotis dengan akses jalan membelah tebing kapur menjulang tinggi, ombak ramah untuk berenang, dan pasir putih bersih.',
    '07:00 – 19:00',
    array['Tebing Kapur','Pasir Putih','Berenang'],
    array['Jalan Aspal Halus','Parkir Sangat Luas','Kamar Bilas & Toilet','Penyewaan Payung Pantai','Warung Kuliner'],
    array['Jalan Berkelok Tebing Kapur','Pertunjukan Tari Kecak Senja','Kolam Karang Alami Saat Surut'],
    '+62 819 9901 2233', '@melastibeachbali',
    'https://maps.google.com/?q=Pantai+Melasti+Ungasan+Bali'
  ),

  -- 12 · Pura Tanah Lot
  (
    'tanah-lot',
    (select id from cat where name = 'Culture'),
    'Culture',
    'Pura Tanah Lot', 'Tabanan', 'Desa Beraban, Kediri, Tabanan',
    -8.6212, 115.0868,
    20000, 60000, 4.7, 5820,
    'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=900&fit=crop&auto=format&q=80',
    array[
      'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=900&fit=crop&auto=format&q=80',
      'https://images.unsplash.com/photo-1609770836167-7a74ed99bfad?w=900&fit=crop&auto=format&q=80',
      'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=900&fit=crop&auto=format&q=80',
      'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=900&fit=crop&auto=format&q=80'
    ],
    'Ikon pariwisata Bali berupa pura suci yang bertengger di atas bongkahan batu karang besar di tengah deburan ombak samudra lepas.',
    '07:00 – 19:00',
    array['Pura Ikonik','Sunset Terbaik','Fotografi'],
    array['Pasar Seni & Suvenir','Taman Budaya Luas','Pusat Informasi Turis','Restoran Sunset View'],
    array['Siluet Pura Saat Sunset','Sumber Air Tawar Suci di Laut','Pura Batu Bolong'],
    '+62 361 880 361', '@tanahlot.official',
    'https://maps.google.com/?q=Tanah+Lot+Temple+Bali'
  ),

  -- 13 · Air Terjun Tibumana
  (
    'air-terjun-tibumana',
    (select id from cat where name = 'Nature'),
    'Nature',
    'Air Terjun Tibumana', 'Bangli', 'Jl. Desa Apuan, Susut, Bangli',
    -8.5042, 115.3347,
    15000, 30000, 4.6, 940,
    'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=900&fit=crop&auto=format&q=80',
    array[
      'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=900&fit=crop&auto=format&q=80',
      'https://images.unsplash.com/photo-1637201813231-e7e824db5485?w=900&fit=crop&auto=format&q=80',
      'https://images.unsplash.com/photo-1448375240586-882707db888b?w=900&fit=crop&auto=format&q=80',
      'https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=900&fit=crop&auto=format&q=80'
    ],
    'Air terjun tirai lurus yang elegan tersembunyi di hutan tropis lebat dengan kolam air jernih yang tenang dan sejuk untuk berenang.',
    '06:00 – 18:00',
    array['Air Terjun Alami','Berenang','Jungle Walk'],
    array['Jalur Setapak Tertata Rapi','Ruang Ganti Baju','Penyewaan Loker','Warung Kopi Tradisional'],
    array['Kolam Renang Alami Tenang','Jembatan Bambu Artistik','Hutan Pakis Rimbun'],
    '+62 822 3671 9988', '@tibumanawaterfall',
    'https://maps.google.com/?q=Tibumana+Waterfall+Bali'
  ),

  -- 14 · Alila Villas Uluwatu
  (
    'alila-villas',
    (select id from cat where name = 'Resort'),
    'Resort',
    'Alila Villas Uluwatu', 'Uluwatu', 'Jl. Belimbing Sari, Tambiyak, Pecatu',
    -8.8464, 115.1384,
    1500000, 3500000, 4.9, 650,
    'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=900&fit=crop&auto=format&q=80',
    array[
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=900&fit=crop&auto=format&q=80',
      'https://images.unsplash.com/photo-1605581813258-076a6654a37f?w=900&fit=crop&auto=format&q=80',
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=900&fit=crop&auto=format&q=80',
      'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=900&fit=crop&auto=format&q=80'
    ],
    'Resor mewah ramah lingkungan yang bertengger di atas tebing kapur 100 meter di atas Samudera Hindia dengan sunset cabana ikonik.',
    'Layanan 24 Jam',
    array['Luxury Eco Resort','Sunset Cabana','Private Pool'],
    array['Kolam Renang Infinity 50 Meter','Private Butler 24 Jam','Cliff Edge Spa','Fine Dining The Warung & CIRE'],
    array['Iconic Overhanging Sunset Cabana','Private Pool Villa','Arsitektur Kayu Daur Ulang Mewah'],
    '+62 361 848 2166', '@alilavillasuluwatu',
    'https://maps.google.com/?q=Alila+Villas+Uluwatu'
  ),

  -- 15 · Sate Plecing Bali Argapura
  (
    'sate-plecing-argapura',
    (select id from cat where name = 'Culinary'),
    'Culinary',
    'Sate Plecing Bali Argapura', 'Denpasar', 'Jl. Argapura No. 9, Denpasar Barat',
    -8.6652, 115.2045,
    30000, 80000, 4.8, 1680,
    'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=900&fit=crop&auto=format&q=80',
    array[
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=900&fit=crop&auto=format&q=80',
      'https://images.unsplash.com/photo-1539755530862-00f623c00f52?w=900&fit=crop&auto=format&q=80',
      'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=900&fit=crop&auto=format&q=80',
      'https://images.unsplash.com/photo-1544025162-d76694265947?w=900&fit=crop&auto=format&q=80'
    ],
    'Sajian sate daging bumbu rempah khas Bali yang dibakar arang dan disiram sambal plecing cabai merah pedas, asam segar jeruk limau.',
    '09:00 – 21:00',
    array['Kuliner Pedas','Legendaris','Lokal Favorit'],
    array['Parkir Motor & Mobil','Area Duduk Nyaman','Es Kelapa Segar','Takeaway Cepat'],
    array['Sate Plecing Bumbu Merah','Soto Sapi Kuah Gurih','Sambal Plecing Jeruk Limau'],
    '+62 812 3881 9900', '@sateplecing.argapura',
    'https://maps.google.com/?q=Sate+Plecing+Argapura+Denpasar'
  ),

  -- 16 · Campuhan Ridge Walk
  (
    'campuhan-ridge-walk',
    (select id from cat where name = 'Nature'),
    'Nature',
    'Campuhan Ridge Walk', 'Ubud', 'Kelusa, Payangan, Jl. Raya Campuan, Ubud',
    -8.5036, 115.2547,
    0, 15000, 4.7, 3750,
    'https://images.unsplash.com/photo-1448375240586-882707db888b?w=900&fit=crop&auto=format&q=80',
    array[
      'https://images.unsplash.com/photo-1448375240586-882707db888b?w=900&fit=crop&auto=format&q=80',
      'https://images.unsplash.com/photo-1637201813231-e7e824db5485?w=900&fit=crop&auto=format&q=80',
      'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=900&fit=crop&auto=format&q=80',
      'https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=900&fit=crop&auto=format&q=80'
    ],
    'Jalur trekking santai sepanjang punggung bukit hijau yang membelah dua lembah sungai dengan pemandangan ilalang dan pohon palem asri.',
    'Buka 24 Jam (Terbaik 06:00 - 08:30)',
    array['Trekking Pagi','Pemandangan Lembah','Gratis'],
    array['Jalur Paving Halus','Warung Kelapa Muda di Ujung Jalur','Spot Foto Sunset & Sunrise'],
    array['Bukit Ilalang Tropis','Panorama Dua Lembah Sungai Campuhan','Kafe Santai Karsa Kafe di Ujung Trek'],
    '+62 812 4680 1122', '@campuhanridgewalk',
    'https://maps.google.com/?q=Campuhan+Ridge+Walk+Ubud'
  )

on conflict (id) do update
  set
    category_id  = excluded.category_id,
    category     = excluded.category,
    name         = excluded.name,
    area         = excluded.area,
    address      = excluded.address,
    lat          = excluded.lat,
    lng          = excluded.lng,
    price_min    = excluded.price_min,
    price_max    = excluded.price_max,
    -- Do NOT overwrite rating/review_count — let the trigger own those.
    image        = excluded.image,
    gallery      = excluded.gallery,
    blurb        = excluded.blurb,
    hours        = excluded.hours,
    tags         = excluded.tags,
    facilities   = excluded.facilities,
    highlights   = excluded.highlights,
    phone        = excluded.phone,
    instagram    = excluded.instagram,
    gmaps_url    = excluded.gmaps_url,
    updated_at   = now();

