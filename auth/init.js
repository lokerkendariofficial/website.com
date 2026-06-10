// auth/init.js - Inisialisasi database awal
function initDatabase() {
  // Users sudah di ensure di session.js, tapi pastikan kategori dll.
  if (!localStorage.getItem('kategoriLowongan')) {
    const defaultKategori = [
      { id: 1, nama: 'IT' },
      { id: 2, nama: 'Marketing' },
      { id: 3, nama: 'Administrasi' },
      { id: 4, nama: 'Pendidikan' },
      { id: 5, nama: 'Lainnya' }
    ];
    localStorage.setItem('kategoriLowongan', JSON.stringify(defaultKategori));
  }
  if (!localStorage.getItem('sistemConfig')) {
    localStorage.setItem('sistemConfig', JSON.stringify({ metodeLogin: 'username_email' }));
  }
  if (!localStorage.getItem('pengaturanUmum')) {
    localStorage.setItem('pengaturanUmum', JSON.stringify({ namaWebsite: 'Loker Kendari Official', footer: '© 2026 Loker Kendari' }));
  }
  // Data lowongan contoh (opsional)
  if (!localStorage.getItem('lokerData')) {
    const contoh = [
      { id: 1, title: 'Frontend Developer', company: 'PT Tekno', location: 'Kendari', type: 'Fulltime', salary: '5jt', category: 'IT', desc: 'React, Tailwind', address: 'Jl. Tekno', qualification: 'S1', contact: 'email@teknologi.com', uploadedAt: Date.now() }
    ];
    localStorage.setItem('lokerData', JSON.stringify(contoh));
  }
}
initDatabase();