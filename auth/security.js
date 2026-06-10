// auth/security.js - Aturan keamanan berbasis role
const ROLES = {
  PEMILIK: 'pemilik',
  ADMIN: 'admin',
  USER: 'user'
};

const PERMISSIONS = {
  // Lowongan
  'lowongan.baca': [ROLES.PEMILIK, ROLES.ADMIN, ROLES.USER],
  'lowongan.tulis': [ROLES.PEMILIK, ROLES.ADMIN],
  'lowongan.hapus': [ROLES.PEMILIK, ROLES.ADMIN],
  'lowongan.edit': [ROLES.PEMILIK, ROLES.ADMIN],

  // Pending iklan
  'pending.baca': [ROLES.PEMILIK, ROLES.ADMIN],
  'pending.approve': [ROLES.PEMILIK, ROLES.ADMIN],
  'pending.buat': [ROLES.PEMILIK, ROLES.ADMIN, ROLES.USER],

  // User management
  'user.lihat': [ROLES.PEMILIK, ROLES.ADMIN],
  'user.ubahRole': [ROLES.PEMILIK, ROLES.ADMIN],
  'user.hapus': [ROLES.PEMILIK, ROLES.ADMIN],

  // Lamaran
  'lamaran.lihat.sendiri': [ROLES.PEMILIK, ROLES.ADMIN, ROLES.USER],
  'lamaran.lihat.semua': [ROLES.PEMILIK, ROLES.ADMIN],
  'lamaran.buat': [ROLES.PEMILIK, ROLES.ADMIN, ROLES.USER],

  // Log aktivitas
  'log.lihat': [ROLES.PEMILIK],
  'log.lihatTerbatas': [ROLES.ADMIN],

  // Backup & reset
  'backup': [ROLES.PEMILIK],
  'restore': [ROLES.PEMILIK],
  'reset': [ROLES.PEMILIK],

  // Sistem
  'sistem.ubah': [ROLES.PEMILIK],

  // Notifikasi
  'notifikasi.buat': [ROLES.PEMILIK],
  'notifikasi.baca': [ROLES.PEMILIK, ROLES.ADMIN, ROLES.USER],

  // Kategori
  'kategori.kelola': [ROLES.PEMILIK],

  // Laporan
  'laporan.lihat': [ROLES.PEMILIK, ROLES.ADMIN]
};

function can(action, userRole) {
  if (!userRole) return false;
  const allowed = PERMISSIONS[action];
  return allowed ? allowed.includes(userRole) : false;
}

function canAccessPage(allowedRoles, userRole) {
  return allowedRoles.includes(userRole);
}

function requireAuth(redirectUrl = '../index.html') {
  const user = getCurrentUser();
  if (!user) {
    window.location.href = redirectUrl;
    return false;
  }
  return true;
}

function requireRole(requiredRole, redirectUrl = '../index.html') {
  const user = getCurrentUser();
  if (!user || user.role !== requiredRole) {
    window.location.href = redirectUrl;
    return false;
  }
  return true;
}

// Ekspor
window.can = can;
window.canAccessPage = canAccessPage;
window.requireAuth = requireAuth;
window.requireRole = requireRole;