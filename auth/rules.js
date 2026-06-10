// auth/rules.js - Aturan keamanan (Firebase rules style)
const RULES = {
  // Koleksi / resource
  lowongan: {
    read: ['pemilik', 'admin', 'user'],
    write: ['pemilik', 'admin'],
    delete: ['pemilik', 'admin']
  },
  pendingIklan: {
    read: ['pemilik', 'admin'],
    create: ['pemilik', 'admin', 'user'],
    update: ['pemilik', 'admin'],
    delete: ['pemilik', 'admin']
  },
  users: {
    read: ['pemilik', 'admin'],
    write: ['pemilik', 'admin'],
    delete: ['pemilik', 'admin']
  },
  lamaran: {
    readSelf: ['pemilik', 'admin', 'user'],
    readAll: ['pemilik', 'admin'],
    create: ['pemilik', 'admin', 'user']
  },
  logs: {
    read: ['pemilik'],
    delete: ['pemilik']
  },
  kategori: {
    read: ['pemilik', 'admin', 'user'],
    write: ['pemilik']
  },
  notifikasi: {
    read: ['pemilik', 'admin', 'user'],
    write: ['pemilik']
  },
  backup: {
    read: ['pemilik'],
    write: ['pemilik']
  },
  sistem: {
    write: ['pemilik']
  }
};

// Mendefinisikan aksi-aksi spesifik untuk pengecekan
const PERMISSIONS = {
  // lowongan
  'lowongan.baca': RULES.lowongan.read,
  'lowongan.tulis': RULES.lowongan.write,
  'lowongan.hapus': RULES.lowongan.delete,

  // pending
  'pending.baca': RULES.pendingIklan.read,
  'pending.buat': RULES.pendingIklan.create,
  'pending.approve': RULES.pendingIklan.update,
  'pending.tolak': RULES.pendingIklan.delete,

  // user management
  'user.lihat': RULES.users.read,
  'user.ubahRole': RULES.users.write,
  'user.hapus': RULES.users.delete,

  // lamaran
  'lamaran.lihat.sendiri': RULES.lamaran.readSelf,
  'lamaran.lihat.semua': RULES.lamaran.readAll,
  'lamaran.buat': RULES.lamaran.create,

  // log
  'log.lihat': RULES.logs.read,
  'log.hapus': RULES.logs.delete,

  // kategori
  'kategori.baca': RULES.kategori.read,
  'kategori.kelola': RULES.kategori.write,

  // notifikasi
  'notifikasi.baca': RULES.notifikasi.read,
  'notifikasi.buat': RULES.notifikasi.write,

  // backup & reset
  'backup': RULES.backup.read,
  'restore': RULES.backup.write,
  'reset': RULES.backup.write,

  // sistem
  'sistem.ubah': RULES.sistem.write
};

window.RULES = RULES;
window.PERMISSIONS = PERMISSIONS;