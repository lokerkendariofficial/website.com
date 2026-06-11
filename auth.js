// auth.js - dengan integrasi ID Generator dari nomor telepon

function getUsers() { return JSON.parse(localStorage.getItem('users') || '[]'); }
function saveUsers(users) { localStorage.setItem('users', JSON.stringify(users)); }
function getCurrentUser() { return JSON.parse(sessionStorage.getItem('currentUser') || 'null'); }
function setCurrentUser(user) { sessionStorage.setItem('currentUser', JSON.stringify(user)); }
function logout() { sessionStorage.removeItem('currentUser'); window.location.href = 'index.html'; }

function hashPassword(pw) { return btoa(pw); }
function generateToken() { return 'sess_' + Date.now() + '_' + Math.random().toString(36).substr(2, 16); }

function addLog(userId, username, aksi, detail) {
  let logs = JSON.parse(localStorage.getItem('logAktivitas') || '[]');
  logs.unshift({ id: Date.now(), userId, username, aksi, detail, timestamp: new Date().toISOString() });
  if (logs.length > 1000) logs.pop();
  localStorage.setItem('logAktivitas', JSON.stringify(logs));
}

// ========== ID Generator dari nomor telepon (diambil dari template) ==========
function prosesNomorHP(nomor) {
  if (!/^\d+$/.test(nomor) || nomor.length < 10 || nomor.length > 13) {
    return { error: true, message: "Nomor harus 10-13 digit angka!" };
  }
  let nomorBaru = nomor.startsWith('0') ? nomor.replace(/^0/, '62') : nomor;
  let totalDigit = nomorBaru.length;
  let urutanTarget = [];
  if (totalDigit === 14) urutanTarget = [4, 7, 10, 13];
  else if (totalDigit === 13) urutanTarget = [3, 6, 9, 12];
  else if (totalDigit === 12) urutanTarget = [2, 5, 8, 11];
  else if (totalDigit === 11) urutanTarget = [1, 4, 7, 10];
  else if (totalDigit === 10) urutanTarget = [0, 3, 6, 9];
  else return { error: true, message: "Panjang digit tidak sesuai (10-13)" };
  let teks4Digit = "";
  for (let i = 0; i < totalDigit; i++) {
    if (urutanTarget.includes(i)) teks4Digit += nomorBaru[i];
  }
  if (teks4Digit.length !== 4) return { error: true, message: "Gagal ekstraksi 4 digit" };
  let hasilAkhir = parseInt(teks4Digit, 10) + 12;
  return { error: false, id: hasilAkhir };
}
// ========================================================================

function ensureDefaultAccounts() {
  let users = getUsers();
  if (users.length === 0) {
    users = [
      { id: 1, nama: 'Pemilik Utama', username: '900900', password: hashPassword('900900'), role: 'pemilik', isOwner: true, createdAt: new Date().toISOString() },
      { id: 2, nama: 'Admin Sistem', username: '9090', password: hashPassword('9090'), role: 'admin', isOwner: false, createdAt: new Date().toISOString() },
      { id: 3, nama: 'User Biasa', username: '9091', password: hashPassword('9091'), role: 'user', isOwner: false, createdAt: new Date().toISOString() }
    ];
    saveUsers(users);
    addLog(1, 'Pemilik Utama', 'SYSTEM', 'Akun default dibuat');
  }
}
ensureDefaultAccounts();

// Registrasi menggunakan nomor HP (dengan ID generator)
function registerWithPhone(nama, nomorHp, password) {
  let users = getUsers();
  // Cek apakah nomor sudah terdaftar
  if (users.find(u => u.nomorHp === nomorHp)) {
    return { success: false, msg: 'Nomor HP sudah terdaftar' };
  }
  const result = prosesNomorHP(nomorHp);
  if (result.error) {
    return { success: false, msg: result.message };
  }
  const userId = result.id;
  // Cek apakah ID bentrok (sangat kecil kemungkinan, tapi amankan)
  if (users.find(u => u.id === userId)) {
    return { success: false, msg: 'ID bentrok, hubungi admin' };
  }
  const newUser = {
    id: userId,
    nama: nama,
    username: nomorHp, // bisa login pakai nomor HP
    nomorHp: nomorHp,
    password: hashPassword(password),
    role: 'user',
    isOwner: false,
    createdAt: new Date().toISOString()
  };
  users.push(newUser);
  saveUsers(users);
  addLog(userId, nama, 'REGISTER', `User baru dengan ID ${userId} dari nomor ${nomorHp}`);
  return { success: true, userId: userId };
}

// Login bisa menggunakan username (nomor HP) atau ID
function login(usernameOrId, password) {
  let users = getUsers();
  // Cek apakah input berupa angka (ID) atau teks (nomor HP/username)
  const isNumeric = /^\d+$/.test(usernameOrId);
  let user;
  if (isNumeric) {
    user = users.find(u => u.id == usernameOrId && u.password === hashPassword(password));
    if (!user) user = users.find(u => u.nomorHp === usernameOrId && u.password === hashPassword(password));
  } else {
    user = users.find(u => u.username === usernameOrId && u.password === hashPassword(password));
  }
  if (!user) return { success: false, msg: 'ID/Username/No HP atau password salah.' };
  const token = generateToken();
  user.sessionToken = token;
  saveUsers(users);
  setCurrentUser({ id: user.id, nama: user.nama, username: user.username, role: user.role, token: token, loginAt: Date.now() });
  addLog(user.id, user.nama, 'LOGIN', `Login berhasil`);
  return { success: true, role: user.role };
}

// Registrasi biasa (untuk akun default, tidak dipakai publik)
function register(nama, username, password) {
  let users = getUsers();
  if (users.find(u => u.username === username)) return { success: false, msg: 'Username sudah terdaftar.' };
  const newUser = {
    id: Date.now(),
    nama,
    username,
    password: hashPassword(password),
    role: 'user',
    isOwner: false,
    createdAt: new Date().toISOString()
  };
  users.push(newUser);
  saveUsers(users);
  addLog(newUser.id, nama, 'REGISTER', `User baru mendaftar dengan username ${username}`);
  return { success: true };
}

// Fungsi untuk manajemen user (di dashboard admin/owner)
function getAllUsers() { return getUsers(); }
function updateUserRole(userId, newRole) {
  let users = getUsers();
  const user = users.find(u => u.id === userId);
  if (!user || user.isOwner) return false;
  user.role = newRole;
  saveUsers(users);
  const current = getCurrentUser();
  addLog(current.id, current.nama, 'CHANGE_ROLE', `User ${userId} diubah menjadi ${newRole}`);
  return true;
}
function deleteUser(userId) {
  let users = getUsers();
  const user = users.find(u => u.id === userId);
  if (!user || user.isOwner) return false;
  users = users.filter(u => u.id !== userId);
  saveUsers(users);
  const current = getCurrentUser();
  addLog(current.id, current.nama, 'DELETE_USER', `User ${userId} dihapus`);
  return true;
}

// Ekspor global (opsional)
window.auth = { getCurrentUser, logout, login, registerWithPhone, getAllUsers, updateUserRole, deleteUser };