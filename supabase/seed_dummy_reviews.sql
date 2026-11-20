-- =============================================================================
-- Jelajah — Seed Dummy Reviews for Top 5 Places
-- File   : supabase/seed_dummy_reviews.sql
-- Run in : Supabase SQL Editor
--
-- This script:
--   1. Creates 10 dummy users in auth.users and public.profiles
--   2. Inserts authentic verified reviews into public.reviews for the top 5 places
-- =============================================================================

-- Step 1: Create dummy users in auth.users and public.profiles if they don't exist
do $$
declare
  dummy_users record;
  new_uid uuid;
begin
  for dummy_users in
    select * from (values
      ('budi.santoso@jelajah.id', 'Budi Santoso'),
      ('kadek.ayu@jelajah.id', 'Ni Kadek Ayu Lestari'),
      ('michael.chen@jelajah.id', 'Michael Chen'),
      ('rina.wahyuni@jelajah.id', 'Rina Wahyuni'),
      ('gede.aditya@jelajah.id', 'I Gede Aditya Wardana'),
      ('farhan.pratama@jelajah.id', 'Farhan Pratama'),
      ('siti.rahmawati@jelajah.id', 'Siti Rahmawati'),
      ('david.robinson@jelajah.id', 'David Robinson'),
      ('agus.setiawan@jelajah.id', 'Agus Setiawan'),
      ('dewi.lestari@jelajah.id', 'Dewi Lestari')
    ) as t(email, name)
  loop
    select id into new_uid from auth.users where email = dummy_users.email;
    if new_uid is null then
      new_uid := gen_random_uuid();
      insert into auth.users (
        instance_id,
        id,
        aud,
        role,
        email,
        encrypted_password,
        email_confirmed_at,
        raw_app_meta_data,
        raw_user_meta_data,
        created_at,
        updated_at
      ) values (
        '00000000-0000-0000-0000-000000000000',
        new_uid,
        'authenticated',
        'authenticated',
        dummy_users.email,
        crypt('Password123!', gen_salt('bf')),
        now(),
        '{"provider":"email","providers":["email"]}',
        jsonb_build_object('name', dummy_users.name),
        now(),
        now()
      );
    end if;

    insert into public.profiles (id, name, role)
    values (new_uid, dummy_users.name, 'user')
    on conflict (id) do update set name = excluded.name;
  end loop;
end;
$$;

-- Step 2: Insert reviews into public.reviews
with u as (
  select id, email, raw_user_meta_data->>'name' as name from auth.users
)
insert into public.reviews (place_id, user_id, reviewer_name, rating, review_text, photo_url, hidden)
values
  -- Pura Tanah Lot
  ('tanah-lot', (select id from u where email = 'budi.santoso@jelajah.id'), 'Budi Santoso', 5,
   'Pemandangan sunset di Tanah Lot benar-benar magis dan tidak pernah mengecewakan. Ombak yang menghantam pura saat air pasang sangat spektakuler. Disarankan datang sebelum pukul 17:00 untuk spot foto terbaik.',
   'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&fit=crop&auto=format&q=80', false),

  ('tanah-lot', (select id from u where email = 'kadek.ayu@jelajah.id'), 'Ni Kadek Ayu Lestari', 5,
   'Pura yang sangat sakral dengan keindahan alam yang memukau. Area taman tertata rapi dan bersih. Banyak toko cinderamata khas Bali dengan harga yang bersahabat.',
   null, false),

  ('tanah-lot', (select id from u where email = 'michael.chen@jelajah.id'), 'Michael Chen', 5,
   'Iconic Bali landmark. The cliffside views and crashing waves against the sea temple are breathtaking, especially during golden hour.',
   null, false),

  ('tanah-lot', (select id from u where email = 'rina.wahyuni@jelajah.id'), 'Rina Wahyuni', 4,
   'Sangat ramai pengunjung saat menjelang sore, tapi pemandangannya sepadan dengan keramaian. Fasilitas toilet bersih dan akses jalan setapak sangat ramah wisatawan.',
   null, false),

  ('tanah-lot', (select id from u where email = 'gede.aditya@jelajah.id'), 'I Gede Aditya Wardana', 5,
   'Tempat ibadah yang penuh kedamaian sekaligus destinasi wisata kelas dunia. Upacara keagamaan di sini auranya luar biasa khidmat.',
   null, false),

  ('tanah-lot', (select id from u where email = 'farhan.pratama@jelajah.id'), 'Farhan Pratama', 5,
   'Salah satu sunset tercantik di dunia! Ada spot minum kelapa muda dingin di tebing sambil menikmati deburan ombak. Sangat recommended untuk liburan keluarga.',
   null, false),

  -- Pantai Melasti
  ('pantai-melasti', (select id from u where email = 'siti.rahmawati@jelajah.id'), 'Siti Rahmawati', 5,
   'Pantai terbersih di Bali Selatan! Tebing kapur yang dibelah untuk jalan masuknya sangat megah dan Instagramable. Pasir putih halus dan air laut jernih bergradasi biru toska.',
   'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&fit=crop&auto=format&q=80', false),

  ('pantai-melasti', (select id from u where email = 'david.robinson@jelajah.id'), 'David Robinson', 5,
   'Stunning white sand beach nestled beneath dramatic limestone cliffs. Water is calm enough for swimming during low tide. Beach clubs nearby offer great food.',
   null, false),

  ('pantai-melasti', (select id from u where email = 'budi.santoso@jelajah.id'), 'Budi Santoso', 5,
   'Jalanan aspal mulus sampai ke bibir pantai. Tersedia banyak tempat duduk santai dan warung makanan dengan harga bersahabat. Ombaknya tenang cocok buat bermain air.',
   null, false),

  ('pantai-melasti', (select id from u where email = 'kadek.ayu@jelajah.id'), 'Ni Kadek Ayu Lestari', 5,
   'Pantai Melasti memiliki fasilitas yang sangat lengkap: toilet bersih, ruang bilas luas, dan area parkir yang sangat lapang. Selalu jadi pilihan utama bila ke Uluwatu.',
   null, false),

  ('pantai-melasti', (select id from u where email = 'michael.chen@jelajah.id'), 'Michael Chen', 4,
   'Sore hari ada pertunjukan tari kecak di tebing pantai dengan latar matahari terbenam. Benar-benar pengalaman yang tidak terlupakan!',
   null, false),

  ('pantai-melasti', (select id from u where email = 'rina.wahyuni@jelajah.id'), 'Rina Wahyuni', 5,
   'Airnya bening sekali sampai karang dan ikan kecil terlihat jelas. Suasana sore hari sangat syahdu.',
   null, false),

  -- Campuhan Ridge Walk
  ('campuhan-ridge-walk', (select id from u where email = 'agus.setiawan@jelajah.id'), 'Agus Setiawan', 5,
   'Trek jalan kaki paling menyegarkan di Ubud! Waktu terbaik adalah jam 06:00 pagi saat kabut tipis masih menyelimuti bukit dan perbukitan hijau terhampar luas. Udara sangat sejuk.',
   'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=600&fit=crop&auto=format&q=80', false),

  ('campuhan-ridge-walk', (select id from u where email = 'dewi.lestari@jelajah.id'), 'Dewi Lestari', 5,
   'A peaceful nature walk on the ridge of two river valleys. Paved stone trail that is easy to navigate with stunning greenery.',
   null, false),

  ('campuhan-ridge-walk', (select id from u where email = 'gede.aditya@jelajah.id'), 'I Gede Aditya Wardana', 5,
   'Tempat jogging favorit warga Ubud dan wisatawan. Pemandangan bukit ilalang dan pohon kelapa sungguh menenangkan jiwa. Gratis tanpa tiket masuk!',
   null, false),

  ('campuhan-ridge-walk', (select id from u where email = 'farhan.pratama@jelajah.id'), 'Farhan Pratama', 4,
   'Jalan setapaknya bersih dan rapi. Jangan lupa bawa air minum dan topi karena di tengah jalur tidak ada pohon pelindung saat matahari sudah naik.',
   null, false),

  ('campuhan-ridge-walk', (select id from u where email = 'siti.rahmawati@jelajah.id'), 'Siti Rahmawati', 5,
   'Cocok untuk jalan santai bersama pasangan atau keluarga. Pemandangan 360 derajat bukit Ubud yang hijau asri benar-benar memanjakan mata.',
   null, false),

  ('campuhan-ridge-walk', (select id from u where email = 'david.robinson@jelajah.id'), 'David Robinson', 5,
   'One of the best free attractions in Ubud. Refreshing breeze and panoramic greenery. Highly recommended in the morning.',
   null, false),

  -- Bebek Tepi Sawah
  ('bebek-tepi-sawah', (select id from u where email = 'budi.santoso@jelajah.id'), 'Budi Santoso', 5,
   'Bebek krispi terenak di Bali! Dagingnya empuk gurih, kulitnya renyah sempurna, dan ada 3 pilihan sambal khas yang nagih. Makan di gazebo tengah sawah membuat suasananya semakin istimewa.',
   'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&fit=crop&auto=format&q=80', false),

  ('bebek-tepi-sawah', (select id from u where email = 'dewi.lestari@jelajah.id'), 'Dewi Lestari', 5,
   'Suasana Ubud yang begitu kental. Pelayanan ramah dan cepat walau restoran sedang sangat ramai. Sambal matah dan sambal embe-nya juara!',
   null, false),

  ('bebek-tepi-sawah', (select id from u where email = 'agus.setiawan@jelajah.id'), 'Agus Setiawan', 5,
   'Crispy duck here is unmatched. The combination of seasoned duck and aromatic Balinese sambal served right by lush green paddy fields is an unforgettable dining experience.',
   null, false),

  ('bebek-tepi-sawah', (select id from u where email = 'kadek.ayu@jelajah.id'), 'Ni Kadek Ayu Lestari', 4,
   'Porsi bebeknya cukup besar dan mengenyangkan. Tempatnya luas cocok untuk makan bersama rombongan atau keluarga besar. Anak-anak senang melihat sawah.',
   null, false),

  ('bebek-tepi-sawah', (select id from u where email = 'michael.chen@jelajah.id'), 'Michael Chen', 5,
   'Kuliner legendaris yang selalu konsisten rasanya sejak belasan tahun lalu. Bebek panggang dan bebek betutunya juga tak kalah nikmat dibanding bebek gorengnya.',
   null, false),

  ('bebek-tepi-sawah', (select id from u where email = 'rina.wahyuni@jelajah.id'), 'Rina Wahyuni', 5,
   'Es kelapa muda dan bebek goreng renyahnya perpaduan sempurna setelah lelah jalan-jalan di Ubud. Wajib dicoba saat ke Ubud!',
   null, false),

  -- Pura Giri Hilltop Temple
  ('pura-giri', (select id from u where email = 'gede.aditya@jelajah.id'), 'I Gede Aditya Wardana', 5,
   'Pura yang sangat sakral, hening, dan penuh energi kedamaian di puncak bukit. Pemandangan panorama lembah hijau dari pelataran pura sungguh menakjubkan.',
   'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&fit=crop&auto=format&q=80', false),

  ('pura-giri', (select id from u where email = 'farhan.pratama@jelajah.id'), 'Farhan Pratama', 5,
   'One of the most spiritual places on the island. The elevation provides cool, crisp mountain air and an unobstructed view of the volcanic ridgeline.',
   null, false),

  ('pura-giri', (select id from u where email = 'siti.rahmawati@jelajah.id'), 'Siti Rahmawati', 5,
   'Arsitektur candi yang otentik dan terpelihara sangat baik. Pengelola pura sangat ramah meminjamkan sarung dan selendang bagi pengunjung yang belum membawa.',
   null, false),

  ('pura-giri', (select id from u where email = 'david.robinson@jelajah.id'), 'David Robinson', 5,
   'Suasana meditatif yang tidak bisa didapatkan di tempat wisata biasa. Datanglah pagi hari saat kicauan burung hutan masih bersahutan. Luar biasa tenang.',
   null, false),

  ('pura-giri', (select id from u where email = 'agus.setiawan@jelajah.id'), 'Agus Setiawan', 5,
   'Spot foto terbaik dengan latar pura bertingkat dan awan yang melintas di bawah bukit. Sangat sakral dan menghormati tradisi lokal.',
   null, false),

  ('pura-giri', (select id from u where email = 'dewi.lestari@jelajah.id'), 'Dewi Lestari', 5,
   'Magnificent cultural heritage. The stone carvings and historical shrines show master craftsmanship. A truly humbling cultural experience.',
   null, false)
on conflict (place_id, user_id) do update set
  rating = excluded.rating,
  review_text = excluded.review_text,
  photo_url = excluded.photo_url,
  hidden = false,
  updated_at = now();
