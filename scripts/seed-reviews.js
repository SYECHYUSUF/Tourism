import fs from 'node:fs';
import { createClient } from '@supabase/supabase-js';

// Read .env file
const envContent = fs.readFileSync('.env', 'utf-8');
const urlMatch = envContent.match(/PUBLIC_SUPABASE_URL=["']?([^"'\n]+)/);
const keyMatch = envContent.match(/SUPABASE_SERVICE_ROLE_KEY=["']?([^"'\n]+)/);

if (!urlMatch || !keyMatch) {
  console.error('Missing Supabase credentials in .env');
  process.exit(1);
}

const supabaseUrl = urlMatch[1].trim();
const supabaseServiceKey = keyMatch[1].trim();

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

const reviewers = [
  { name: 'Budi Santoso', email: 'budi.santoso@jelajah.id' },
  { name: 'Ni Kadek Ayu Lestari', email: 'kadek.ayu@jelajah.id' },
  { name: 'Michael Chen', email: 'michael.chen@jelajah.id' },
  { name: 'Rina Wahyuni', email: 'rina.wahyuni@jelajah.id' },
  { name: 'I Gede Aditya Wardana', email: 'gede.aditya@jelajah.id' },
  { name: 'Farhan Pratama', email: 'farhan.pratama@jelajah.id' },
  { name: 'Siti Rahmawati', email: 'siti.rahmawati@jelajah.id' },
  { name: 'David Robinson', email: 'david.robinson@jelajah.id' },
  { name: 'Agus Setiawan', email: 'agus.setiawan@jelajah.id' },
  { name: 'Dewi Lestari', email: 'dewi.lestari@jelajah.id' }
];

const reviewsData = [
  // 1. Pura Tanah Lot
  {
    place_id: 'tanah-lot',
    reviewer_index: 0,
    rating: 5,
    review_text: 'Pemandangan sunset di Tanah Lot benar-benar magis dan tidak pernah mengecewakan. Ombak yang menghantam pura saat air pasang sangat spektakuler. Disarankan datang sebelum pukul 17:00 untuk spot foto terbaik.',
    photo_url: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&fit=crop&auto=format&q=80'
  },
  {
    place_id: 'tanah-lot',
    reviewer_index: 1,
    rating: 5,
    review_text: 'Pura yang sangat sakral dengan keindahan alam yang memukau. Area taman tertata rapi dan bersih. Banyak toko cinderamata khas Bali dengan harga yang bersahabat.',
    photo_url: null
  },
  {
    place_id: 'tanah-lot',
    reviewer_index: 2,
    rating: 5,
    review_text: 'Iconic Bali landmark. The cliffside views and crashing waves against the sea temple are breathtaking, especially during golden hour.',
    photo_url: null
  },
  {
    place_id: 'tanah-lot',
    reviewer_index: 3,
    rating: 4,
    review_text: 'Sangat ramai pengunjung saat menjelang sore, tapi pemandangannya sepadan dengan keramaian. Fasilitas toilet bersih dan akses jalan setapak sangat ramah wisatawan.',
    photo_url: null
  },
  {
    place_id: 'tanah-lot',
    reviewer_index: 4,
    rating: 5,
    review_text: 'Tempat ibadah yang penuh kedamaian sekaligus destinasi wisata kelas dunia. Upacara keagamaan di sini auranya luar biasa khidmat.',
    photo_url: null
  },
  {
    place_id: 'tanah-lot',
    reviewer_index: 5,
    rating: 5,
    review_text: 'Salah satu sunset tercantik di dunia! Ada spot minum kelapa muda dingin di tebing sambil menikmati deburan ombak. Sangat recommended untuk liburan keluarga.',
    photo_url: null
  },

  // 2. Pantai Melasti
  {
    place_id: 'pantai-melasti',
    reviewer_index: 6,
    rating: 5,
    review_text: 'Pantai terbersih di Bali Selatan! Tebing kapur yang dibelah untuk jalan masuknya sangat megah dan Instagramable. Pasir putih halus dan air laut jernih bergradasi biru toska.',
    photo_url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&fit=crop&auto=format&q=80'
  },
  {
    place_id: 'pantai-melasti',
    reviewer_index: 7,
    rating: 5,
    review_text: 'Stunning white sand beach nestled beneath dramatic limestone cliffs. Water is calm enough for swimming during low tide. Beach clubs nearby offer great food.',
    photo_url: null
  },
  {
    place_id: 'pantai-melasti',
    reviewer_index: 0,
    rating: 5,
    review_text: 'Jalanan aspal mulus sampai ke bibir pantai. Tersedia banyak tempat duduk santai dan warung makanan dengan harga bersahabat. Ombaknya tenang cocok buat bermain air.',
    photo_url: null
  },
  {
    place_id: 'pantai-melasti',
    reviewer_index: 1,
    rating: 5,
    review_text: 'Pantai Melasti memiliki fasilitas yang sangat lengkap: toilet bersih, ruang bilas luas, dan area parkir yang sangat lapang. Selalu jadi pilihan utama bila ke Uluwatu.',
    photo_url: null
  },
  {
    place_id: 'pantai-melasti',
    reviewer_index: 2,
    rating: 4,
    review_text: 'Sore hari ada pertunjukan tari kecak di tebing pantai dengan latar matahari terbenam. Benar-benar pengalaman yang tidak terlupakan!',
    photo_url: null
  },
  {
    place_id: 'pantai-melasti',
    reviewer_index: 3,
    rating: 5,
    review_text: 'Airnya bening sekali sampai karang dan ikan kecil terlihat jelas. Suasana sore hari sangat syahdu.',
    photo_url: null
  },

  // 3. Campuhan Ridge Walk
  {
    place_id: 'campuhan-ridge-walk',
    reviewer_index: 8,
    rating: 5,
    review_text: 'Trek jalan kaki paling menyegarkan di Ubud! Waktu terbaik adalah jam 06:00 pagi saat kabut tipis masih menyelimuti bukit dan perbukitan hijau terhampar luas. Udara sangat sejuk.',
    photo_url: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=600&fit=crop&auto=format&q=80'
  },
  {
    place_id: 'campuhan-ridge-walk',
    reviewer_index: 9,
    rating: 5,
    review_text: 'A peaceful nature walk on the ridge of two river valleys. Paved stone trail that is easy to navigate with stunning greenery.',
    photo_url: null
  },
  {
    place_id: 'campuhan-ridge-walk',
    reviewer_index: 4,
    rating: 5,
    review_text: 'Tempat jogging favorit warga Ubud dan wisatawan. Pemandangan bukit ilalang dan pohon kelapa sungguh menenangkan jiwa. Gratis tanpa tiket masuk!',
    photo_url: null
  },
  {
    place_id: 'campuhan-ridge-walk',
    reviewer_index: 5,
    rating: 4,
    review_text: 'Jalan setapaknya bersih dan rapi. Jangan lupa bawa air minum dan topi karena di tengah jalur tidak ada pohon pelindung saat matahari sudah naik.',
    photo_url: null
  },
  {
    place_id: 'campuhan-ridge-walk',
    reviewer_index: 6,
    rating: 5,
    review_text: 'Cocok untuk jalan santai bersama pasangan atau keluarga. Pemandangan 360 derajat bukit Ubud yang hijau asri benar-benar memanjakan mata.',
    photo_url: null
  },
  {
    place_id: 'campuhan-ridge-walk',
    reviewer_index: 7,
    rating: 5,
    review_text: 'One of the best free attractions in Ubud. Refreshing breeze and panoramic greenery. Highly recommended in the morning.',
    photo_url: null
  },

  // 4. Bebek Tepi Sawah
  {
    place_id: 'bebek-tepi-sawah',
    reviewer_index: 0,
    rating: 5,
    review_text: 'Bebek krispi terenak di Bali! Dagingnya empuk gurih, kulitnya renyah sempurna, dan ada 3 pilihan sambal khas yang nagih. Makan di gazebo tengah sawah membuat suasananya semakin istimewa.',
    photo_url: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&fit=crop&auto=format&q=80'
  },
  {
    place_id: 'bebek-tepi-sawah',
    reviewer_index: 9,
    rating: 5,
    review_text: 'Suasana Ubud yang begitu kental. Pelayanan ramah dan cepat walau restoran sedang sangat ramai. Sambal matah dan sambal embe-nya juara!',
    photo_url: null
  },
  {
    place_id: 'bebek-tepi-sawah',
    reviewer_index: 8,
    rating: 5,
    review_text: 'Crispy duck here is unmatched. The combination of seasoned duck and aromatic Balinese sambal served right by lush green paddy fields is an unforgettable dining experience.',
    photo_url: null
  },
  {
    place_id: 'bebek-tepi-sawah',
    reviewer_index: 1,
    rating: 4,
    review_text: 'Porsi bebeknya cukup besar dan mengenyangkan. Tempatnya luas cocok untuk makan bersama rombongan atau keluarga besar. Anak-anak senang melihat sawah.',
    photo_url: null
  },
  {
    place_id: 'bebek-tepi-sawah',
    reviewer_index: 2,
    rating: 5,
    review_text: 'Kuliner legendaris yang selalu konsisten rasanya sejak belasan tahun lalu. Bebek panggang dan bebek betutunya juga tak kalah nikmat dibanding bebek gorengnya.',
    photo_url: null
  },
  {
    place_id: 'bebek-tepi-sawah',
    reviewer_index: 3,
    rating: 5,
    review_text: 'Es kelapa muda dan bebek goreng renyahnya perpaduan sempurna setelah lelah jalan-jalan di Ubud. Wajib dicoba saat ke Ubud!',
    photo_url: null
  },

  // 5. Pura Giri Hilltop Temple
  {
    place_id: 'pura-giri',
    reviewer_index: 4,
    rating: 5,
    review_text: 'Pura yang sangat sakral, hening, dan penuh energi kedamaian di puncak bukit. Pemandangan panorama lembah hijau dari pelataran pura sungguh menakjubkan.',
    photo_url: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&fit=crop&auto=format&q=80'
  },
  {
    place_id: 'pura-giri',
    reviewer_index: 5,
    rating: 5,
    review_text: 'One of the most spiritual places on the island. The elevation provides cool, crisp mountain air and an unobstructed view of the volcanic ridgeline.',
    photo_url: null
  },
  {
    place_id: 'pura-giri',
    reviewer_index: 6,
    rating: 5,
    review_text: 'Arsitektur candi yang otentik dan terpelihara sangat baik. Pengelola pura sangat ramah meminjamkan sarung dan selendang bagi pengunjung yang belum membawa.',
    photo_url: null
  },
  {
    place_id: 'pura-giri',
    reviewer_index: 7,
    rating: 5,
    review_text: 'Suasana meditatif yang tidak bisa didapatkan di tempat wisata biasa. Datanglah pagi hari saat kicauan burung hutan masih bersahutan. Luar biasa tenang.',
    photo_url: null
  },
  {
    place_id: 'pura-giri',
    reviewer_index: 8,
    rating: 5,
    review_text: 'Spot foto terbaik dengan latar pura bertingkat dan awan yang melintas di bawah bukit. Sangat sakral dan menghormati tradisi lokal.',
    photo_url: null
  },
  {
    place_id: 'pura-giri',
    reviewer_index: 9,
    rating: 5,
    review_text: 'Magnificent cultural heritage. The stone carvings and historical shrines show master craftsmanship. A truly humbling cultural experience.',
    photo_url: null
  }
];

async function seed() {
  console.log('Seeding dummy reviewers into auth.users & profiles...');
  const userMap = new Map();

  for (const r of reviewers) {
    // Check if user exists in auth
    const { data: listData } = await supabase.auth.admin.listUsers();
    let existing = listData?.users?.find((u) => u.email === r.email);

    if (!existing) {
      const { data: created, error } = await supabase.auth.admin.createUser({
        email: r.email,
        password: 'Password123!',
        email_confirm: true,
        user_metadata: { name: r.name }
      });
      if (error) {
        console.error(`Failed to create user ${r.email}:`, error);
        continue;
      }
      existing = created.user;
      console.log(`Created user: ${r.name} (${existing.id})`);
    } else {
      console.log(`User already exists: ${r.name} (${existing.id})`);
    }

    userMap.set(r.email, existing.id);

    // Ensure profile row exists
    await supabase.from('profiles').upsert({
      id: existing.id,
      name: r.name,
      role: 'user'
    });
  }

  console.log('\nSeeding reviews into public.reviews table...');
  let inserted = 0;

  for (const item of reviewsData) {
    const reviewer = reviewers[item.reviewer_index];
    const userId = userMap.get(reviewer.email);
    if (!userId) continue;

    const { error } = await supabase.from('reviews').upsert(
      {
        place_id: item.place_id,
        user_id: userId,
        reviewer_name: reviewer.name,
        rating: item.rating,
        review_text: item.review_text,
        photo_url: item.photo_url,
        hidden: false
      },
      { onConflict: 'place_id,user_id' }
    );

    if (error) {
      console.error(`Error inserting review for ${item.place_id}:`, error);
    } else {
      inserted++;
    }
  }

  console.log(`\nSuccessfully seeded ${inserted} reviews into Supabase DB!`);
}

seed().catch(console.error);
