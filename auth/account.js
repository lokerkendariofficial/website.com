// auth/account.js - Sistem akun dengan session unik (double login protection)
// dan load data pribadi user

// Helper: generate token unik per session
function generateToken() {
  return 'sess_' + Date.now() + '_' + Math.random().toString(36).substr(2, 16);
}

// Ambil semua user
function getUsers() {
  return JSON.parse(localStorage.getItem('users') || '[]');
}
function saveUsers(users) {
  localStorage.setItem('users', JSON.stringify(users));
}

// Ambil user berdasarkan ID login (nomor telepon atau username)
function findUserByLoginId(loginId) {
  const users = getUsers();
  const config = JSON.parse(localStorage.getItem('sistemConfig') || '{"metodeLogin":"username_email"}');
  const fieldName = config.metodeLogin === 'telepon' ? 'nomorTelepon' : 'username';
  return users.find(u => u[fieldName] === loginId);
}

// Login: buat session token unik, simpan ke user dan sessionStorage
function loginUnique(loginId, password) {
  const user = findUserByLoginId(loginId);
  if (!user || user.password !== btoa(password)) {
    return { success: false, msg: 'ID atau password salah.' };
  }
  // Generate token baru (akan menggantikan token lama, membuat session lain tidak valid)
  const newToken = generateToken();
  user.sessionToken = newToken;
  user.lastLogin = new Date().toISOString();
  saveUsers(getUsers().map(u => u.id === user.id ? user : u));
  // Simpan session di sessionStorage
  sessionStorage.setItem('currentUser', JSON.stringify({
    id: user.id,
    nama: user.nama,
    role: user.role,
    sessionToken: newToken,
    loginAt: Date.now()
  }));
  // Load data pribadi user (profil, lamaran, dll) bisa diakses nanti
  addLog(user.id, user.nama, 'LOGIN', `User ${user.nama} login dengan session token ${newToken}`);
  return { success: true, role: user.role };
}

// Cek apakah session valid (token cocok dengan yang tersimpan di user)
function isSessionValid() {
  const current = JSON.parse(sessionStorage.getItem('currentUser'));
  if (!current) return false;
  const users = getUsers();
  const user = users.find(u => u.id === current.id);
  if (!user) return false;
  return user.sessionToken === current.sessionToken;
}

// Logout: hapus session token dari user dan hapus sessionStorage
function logoutUnique() {
  const current = JSON.parse(sessionStorage.getItem('currentUser'));
  if (current) {
    let users = getUsers();
    const user = users.find(u => u.id === current.id);
    if (user) delete user.sessionToken;
    saveUsers(users);
    addLog(current.id, current.nama, 'LOGOUT', `User ${current.nama} logout`);
  }
  sessionStorage.removeItem('currentUser');
  window.location.href = '../index.html';
}

// Load data pribadi user (profil, lamaran, dll) dari localStorage
function loadUserData() {
  const current = getCurrentUser();
  if (!current) return null;
  const profil = JSON.parse(localStorage.getItem(`profil_${current.id}`) || '{}');
  const lamaran = JSON.parse(localStorage.getItem(`lamaran_${current.id}`) || '[]');
  return { profil, lamaran };
}

// Simpan data pribadi user (profil, lamaran) dengan prefix userId
function saveUserProfil(profilData) {
  const current = getCurrentUser();
  if (!current) return false;
  localStorage.setItem(`profil_${current.id}`, JSON.stringify(profilData));
  return true;
}

function saveUserLamaran(lamaranData) {
  const current = getCurrentUser();
  if (!current) return false;
  localStorage.setItem(`lamaran_${current.id}`, JSON.stringify(lamaranData));
  return true;
}

// Middleware: pastikan session valid, jika tidak redirect ke login
function requireValidSession(redirect = '../index.html') {
  if (!isSessionValid()) {
    sessionStorage.removeItem('currentUser');
    window.location.href = redirect;
    return false;
  }
  return true;
}

// Ekspor ke global
window.loginUnique = loginUnique;
window.isSessionValid = isSessionValid;
window.logoutUnique = logoutUnique;
window.loadUserData = loadUserData;
window.saveUserProfil = saveUserProfil;
window.saveUserLamaran = saveUserLamaran;
window.requireValidSession = requireValidSession;