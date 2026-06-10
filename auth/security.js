// auth/security.js - Fungsi keamanan
function can(action, userRole) {
  if (!userRole) return false;
  const allowedRoles = window.PERMISSIONS[action];
  if (!allowedRoles) return false;
  return allowedRoles.includes(userRole);
}

function canAccessPage(page, userRole) {
  // Mapping halaman ke action yang dibutuhkan
  const pageRules = {
    'owner.html': 'sistem.ubah', // owner boleh akses semua, pakai salah satu action
    'admin.html': 'pending.baca',
    'user.html': 'lamaran.buat',
    'konfirmasi.html': 'pending.baca',
    'kelola-user.html': 'user.lihat',
    'laporan.html': 'log.lihat',
    'pengaturan.html': 'sistem.ubah',
    'pasang.html': 'pending.buat',
    'profil.html': 'lamaran.lihat.sendiri',
    'kontak.html': 'lamaran.buat'
  };
  const base = page.split('/').pop();
  const action = pageRules[base];
  if (!action) return true; // jika tidak ada aturan, izinkan
  return can(action, userRole);
}

function protectPage(page, redirect = '../index.html') {
  const user = getCurrentUser();
  if (!user) {
    window.location.href = redirect;
    return false;
  }
  if (!canAccessPage(page, user.role)) {
    alert('Akses ditolak!');
    window.location.href = redirect;
    return false;
  }
  return true;
}

window.can = can;
window.canAccessPage = canAccessPage;
window.protectPage = protectPage;