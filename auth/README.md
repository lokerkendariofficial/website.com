# Sistem Keamanan Loker Kendari (Firebase-style)

## Aturan Akses (Rules)

| Resource | Aksi | Role yang diizinkan |
|----------|------|----------------------|
| lowongan | read | semua |
| lowongan | write, delete | pemilik, admin |
| pendingIklan | read, update, delete | pemilik, admin |
| pendingIklan | create | semua |
| users | read, write, delete | pemilik, admin |
| lamaran | readSelf | semua |
| lamaran | readAll | pemilik, admin |
| lamaran | create | semua |
| logs | read, delete | pemilik |
| kategori | read | semua |
| kategori | write | pemilik |
| notifikasi | read | semua |
| notifikasi | write | pemilik |
| backup, restore, reset | - | pemilik |
| sistem | write | pemilik |

## Cara Penggunaan di Halaman

1. Load file:
   ```html
   <script src="../auth/session.js"></script>
   <script src="../auth/rules.js"></script>
   <script src="../auth/security.js"></script>
   <script src="../auth/init.js"></script>
   <script src="../auth/guard.js"></script>