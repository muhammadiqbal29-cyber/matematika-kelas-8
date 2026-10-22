# Kuis Fungsi — Vercel + Firebase

Situs siswa: https://matematika-kelas-8.vercel.app/

Dashboard guru: https://matematika-kelas-8.vercel.app/guru.html

Jawaban hanya dikirim setelah siswa menekan **Kumpulkan**. Server mencatat waktu penerimaan, nama, kelas, jawaban, dan nilai ke Firebase Realtime Database. Dashboard memperbarui daftar setiap 5 detik, menampilkan waktu dalam WIB, serta menandai dan memberi nomor pada kiriman berulang dengan nama dan kelas yang sama. Pengiriman ulang akibat koneksi tidak membuat percobaan tambahan.

## Konfigurasi aktif

- Repository GitHub ini terhubung ke Vercel; push ke `main` memicu deployment.
- Firebase project: `kuis-fungsi-kelas8-20261022`; database berada di `asia-southeast1`.
- Firebase service account dan kata sandi dashboard disimpan sebagai environment variables Vercel, bukan di repository.
- Database menolak akses langsung dari browser. API Vercel memakai Firebase Admin SDK.

Dashboard menampilkan dan mengekspor 100 kiriman terbaru. Jumlah terkumpul mencakup seluruh kiriman, sedangkan rata-rata nilai dihitung dari kiriman yang sedang ditampilkan.
