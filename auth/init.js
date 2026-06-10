// auth/init.js - Inisialisasi data awal jika kosong
function initDatabase() {
  if (!localStorage.getItem('kategoriLowongan')) {
    localStorage.setItem('kategoriLowongan', JSON.stringify([
      { id: 1, nama: 'IT' }, { id: 2, nama: 'Marketing' }, { id: 3, nama: 'Administrasi' },
      { id: 4, nama: 'Pendidikan' }, { id: 5, nama: 'Lainnya' }
    ]));
  }
  if (!localStorage.getItem('sistemConfig')) {
    localStorage.setItem('sistemConfig', JSON.stringify({ metodeLogin: 'username_email' }));
  }
  if (!localStorage.getItem('pengaturanUmum')) {
    localStorage.setItem('pengaturanUmum', JSON.stringify({ namaWebsite: 'Loker Kendari Official', footer: '© 2026 Loker Kendari' }));
  }
  if (!localStorage.getItem('lokerData')) {
    localStorage.setItem('lokerData', JSON.stringify([
      { id: 1, title: 'Frontend Developer', company: 'PT Tekno', location: 'Kendari', type: 'Fulltime', salary: '5jt', category: 'IT', desc: 'React, Tailwind', address: 'Jl. Tekno', qualification: 'S1', contact: 'email@teknologi.com', uploadedAt: Date.now() }
    ]));
  }
}
initDatabase();
window.initDatabase = initDatabase;