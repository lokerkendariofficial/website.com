// auth.js - sistem autentikasi dengan localStorage (hash password, session token)
function getUsers() { return JSON.parse(localStorage.getItem('users') || '[]'); }
function saveUsers(users) { localStorage.setItem('users', JSON.stringify(users)); }
function getCurrentUser() { return JSON.parse(sessionStorage.getItem('currentUser') || 'null'); }
function setCurrentUser(user) { sessionStorage.setItem('currentUser', JSON.stringify(user)); }
function logout() { sessionStorage.removeItem('currentUser'); window.location.href = 'index.html'; }

function hashPassword(pw) { return btoa(pw); } // sederhana, bisa diganti dengan SHA-256 jika perlu

function generateToken() { return 'sess_' + Date.now() + '_' + Math.random().toString(36).substr(2, 16); }

function addLog(userId, username, aksi, detail) {
  let logs = JSON.parse(localStorage.getItem('logAktivitas') || '[]');
  logs.unshift({ id: Date.now(), userId, username, aksi, detail, timestamp: new Date().toISOString() });
  if (logs.length > 1000) logs.pop();
  localStorage.setItem('logAktivitas', JSON.stringify(logs));
}

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

function ensureFebryAccount() {
  let users = getUsers();
  const existing = users.find(u => u.username === '5678');
  if (!existing) {
    const newUser = {
      id: Date.now(),
      nama: 'Febry',
      username: '5678',
      password: hashPassword('456321'),
      role: 'user',
      isOwner: false,
      createdAt: new Date().toISOString(),
      noHp: '081241908108'
    };
    users.push(newUser);
    saveUsers(users);
    addLog(newUser.id, 'Febry', 'SYSTEM', 'Akun Febry ditambahkan (ID 5678)');
  }
}

ensureDefaultAccounts();
ensureFebryAccount();

function login(username, password) {
  let users = getUsers();
  const user = users.find(u => u.username === username && u.password === hashPassword(password));
  if (!user) return { success: false, msg: 'Username atau password salah.' };
  const token = generateToken();
  user.sessionToken = token;
  saveUsers(users);
  setCurrentUser({ id: user.id, nama: user.nama, username: user.username, role: user.role, token: token, loginAt: Date.now() });
  addLog(user.id, user.nama, 'LOGIN', `Login berhasil dengan token ${token.substring(0,8)}...`);
  return { success: true, role: user.role };
}

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