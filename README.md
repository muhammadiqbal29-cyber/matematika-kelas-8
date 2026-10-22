# Kuis Fungsi — Vercel + Firebase

Halaman siswa tersedia di alamat utama `/` dari `index.html`. Dashboard hasil guru ada di `/guru.html`; jawaban terbaru diperbarui otomatis setiap 5 detik. API dan Firebase Admin SDK berjalan sebagai Vercel Functions. Kunci layanan Firebase hanya disimpan di environment Vercel, tidak di HTML.

## Menyiapkan Firebase

1. Project `kuis-fungsi-kelas8-20261022` dan Realtime Database di Singapura sudah dibuat. URL database: `https://kuis-fungsi-kelas8-20261022-default-rtdb.asia-southeast1.firebasedatabase.app`.
2. Rules berikut sudah diterbitkan. Aturan ini menolak akses langsung dari browser:

   ```json
   {
     "rules": {
       ".read": false,
       ".write": false,
       "quizSubmissions": { ".indexOn": ["createdAt"] }
     }
   }
   ```

3. Di Project settings → Service accounts, buat private key service account. Simpan seluruh isi JSON-nya; jangan masukkan ke Git atau bagikan ke siswa.

## Deploy ke Vercel

1. Import repository GitHub ini di Vercel. Root directory biarkan di `/` dan biarkan Vercel mendeteksi project sebagai Node.js.
2. Di Project → Settings → Environment Variables, tambahkan:
   - `FIREBASE_SERVICE_ACCOUNT`: seluruh isi JSON service account dalam satu nilai.
   - `FIREBASE_DATABASE_URL`: URL Realtime Database dari Firebase Console.
   - `TEACHER_DASHBOARD_PASSWORD`: kata sandi panjang yang hanya dibagikan kepada guru.
3. Deploy atau lakukan redeploy setelah ketiga variabel tersedia.
4. Bagikan URL utama deployment kepada siswa. Buka `/guru.html` untuk melihat jawaban.

Jawaban dikirim hanya setelah siswa menekan **Kumpulkan**. Sistem memvalidasi format dan menghitung skor di server. Nama, kelas, jawaban, skor, dan waktu kirim disimpan di Firebase. Database menolak akses langsung dari browser; endpoint server memakai service account.

## Catatan dashboard

Dashboard menampilkan dan mengekspor 100 jawaban terbaru. Jumlah terkumpul mencakup seluruh kiriman. Rata-rata nilai dihitung dari kiriman yang sedang ditampilkan.
