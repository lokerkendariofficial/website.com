// auth.js - login tanpa password, ID generator dari nomor HP
function getUsers() { return JSON.parse(localStorage.getItem('users') || '[]'); }
function saveUsers(users) { localStorage.setItem('users', JSON.stringify(users)); }
function getCurrentUser() { return JSON.parse(sessionStorage.getItem('currentUser') || 'null'); }
function setCurrentUser(user) { sessionStorage.setItem('currentUser', JSON.stringify(user)); }
function logout() { sessionStorage.removeItem('currentUser'); window.location.href = 'index.html'; }

function hashPassword(pw) { return btoa(pw); }
function addLog(userId, username, aksi, detail) {
  let logs = JSON.parse(localStorage.getItem('logAktivitas') || '[]');
  logs.unshift({ id: Date.now(), userId, username, aksi, detail, timestamp: new Date().toISOString() });
  if (logs.length > 1000) logs.pop();
  localStorage.setItem('logAktivitas', JSON.stringify(logs));
}

// ID Generator dari nomor telepon
function prosesNomorHP(nomor) {
  if (!/^\d+$/.test(nomor) || nomor.length < 10 || nomor.length > 13) {
    return { error: true, message: "Nomor harus 10-13 digit angka!" };
  }
  let nomorBaru = nomor.startsWith('0') ? nomor.replace(/^0/, '62') : nomor;
  let totalDigit = nomorBaru.length;
  let urutanTarget = [];
  if (totalDigit === 14) urutanTarget = [4,7,10,13];
  else if (totalDigit === 13) urutanTarget = [3,6,9,12];
  else if (totalDigit === 12) urutanTarget = [2,5,8,11];
  else if (totalDigit === 11) urutanTarget = [1,4,7,10];
  else if (totalDigit === 10) urutanTarget = [0,3,6,9];
  else return { error: true, message: "Panjang digit tidak sesuai" };
  let teks4Digit = "";
  for (let i = 0; i < totalDigit; i++) {
    if (urutanTarget.includes(i)) teks4Digit += nomorBaru[i];
  }
  if (teks4Digit.length !== 4) return { error: true, message: "Gagal ekstraksi" };
  let hasilAkhir = parseInt(teks4Digit, 10) + 12;
  return { error: false, id: hasilAkhir };
}

// Akun default
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

// Registrasi dengan nomor HP
function registerWithPhone(nama, nomorHp, password) {
  let users = getUsers();
  if (users.find(u => u.nomorHp === nomorHp)) return { success: false, msg: 'Nomor HP sudah terdaftar' };
  const result = prosesNomorHP(nomorHp);
  if (result.error) return { success: false, msg: result.message };
  const userId = result.id;
  if (users.find(u => u.id === userId)) return { success: false, msg: 'ID bentrok, hubungi admin' };
  const newUser = {
    id: userId,
    nama: nama,
    username: nomorHp,
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

// LOGIN TANPA PASSWORD (cukup ID / No HP / username)
function loginWithoutPassword(identifier) {
  let users = getUsers();
  let idNumber = !isNaN(identifier) ? parseInt(identifier) : null;
  let user = users.find(u => u.id === idNumber || u.username === identifier || u.nomorHp === identifier);
  if (!user) return { success: false, msg: 'ID / Username / Nomor HP tidak ditemukan' };
  setCurrentUser({ id: user.id, nama: user.nama, username: user.username, role: user.role });
  addLog(user.id, user.nama, 'LOGIN', 'Login tanpa password');
  return { success: true, role: user.role, nama: user.nama };
}

// Manajemen user
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

// Ekspor global
window.getCurrentUser = getCurrentUser;
window.logout = logout;
window.loginWithoutPassword = loginWithoutPassword;
window.getAllUsers = getAllUsers;
window.updateUserRole = updateUserRole;
window.deleteUser = deleteUser;
window.registerWithPhone = registerWithPhone;