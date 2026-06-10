// auth/session.js - Manajemen user, login, register
function getUsers() { return JSON.parse(localStorage.getItem('users') || '[]'); }
function saveUsers(users) { localStorage.setItem('users', JSON.stringify(users)); }
function getCurrentUser() { return JSON.parse(localStorage.getItem('currentUser') || 'null'); }
function setCurrentUser(user) { localStorage.setItem('currentUser', JSON.stringify(user)); }
function logout() { localStorage.removeItem('currentUser'); window.location.href = '../index.html'; }

function addLog(userId, username, aksi, detail) {
  let logs = JSON.parse(localStorage.getItem('logAktivitas') || '[]');
  logs.unshift({ id: Date.now(), userId, username, aksi, detail, timestamp: new Date().toISOString() });
  if (logs.length > 1000) logs.pop();
  localStorage.setItem('logAktivitas', JSON.stringify(logs));
}

function ensureDefaultAccounts() {
  let users = getUsers();
  const defaults = [
    { id: 1, nama: 'Pemilik Utama', password: btoa('900900'), role: 'pemilik', isOwner: true, nomorTelepon: '900900', username: '900900' },
    { id: 2, nama: 'Admin Sistem', password: btoa('0909'), role: 'admin', isOwner: false, nomorTelepon: '0909', username: '0909' },
    { id: 3, nama: 'User Biasa', password: btoa('9090'), role: 'user', isOwner: false, nomorTelepon: '9090', username: '9090' }
  ];
  let changed = false;
  defaults.forEach(def => {
    if (!users.some(u => u.nomorTelepon === def.nomorTelepon || u.username === def.username)) {
      users.push(def);
      changed = true;
    }
  });
  if (changed) saveUsers(users);
}

function register(loginId, nama, password) {
  let users = getUsers();
  const config = JSON.parse(localStorage.getItem('sistemConfig') || '{"metodeLogin":"username_email"}');
  const isFirst = users.length === 0;
  const fieldName = config.metodeLogin === 'telepon' ? 'nomorTelepon' : 'username';
  if (users.find(u => u[fieldName] === loginId)) return { success: false, msg: 'ID sudah terdaftar.' };
  const newUser = {
    id: Date.now(), nama, password: btoa(password), role: isFirst ? 'pemilik' : 'user', isOwner: isFirst,
    createdAt: new Date().toISOString(), lastLogin: null
  };
  newUser[fieldName] = loginId;
  users.push(newUser);
  saveUsers(users);
  addLog(newUser.id, nama, 'REGISTER', `User ${nama} mendaftar dengan ${fieldName}: ${loginId}`);
  return { success: true };
}

function login(loginId, password) {
  let users = getUsers();
  const config = JSON.parse(localStorage.getItem('sistemConfig') || '{"metodeLogin":"username_email"}');
  const fieldName = config.metodeLogin === 'telepon' ? 'nomorTelepon' : 'username';
  let user = users.find(u => u[fieldName] === loginId && u.password === btoa(password));
  if (!user) user = users.find(u => (u.nomorTelepon === loginId || u.username === loginId) && u.password === btoa(password));
  if (!user) return { success: false, msg: 'ID atau password salah.' };
  user.lastLogin = new Date().toISOString();
  saveUsers(users);
  setCurrentUser({ id: user.id, loginId: user[fieldName] || user.nomorTelepon || user.username, nama: user.nama, role: user.role, loginAt: Date.now() });
  addLog(user.id, user.nama, 'LOGIN', `User ${user.nama} login`);
  return { success: true, role: user.role };
}

ensureDefaultAccounts();

// Ekspor ke global
window.getUsers = getUsers;
window.saveUsers = saveUsers;
window.getCurrentUser = getCurrentUser;
window.setCurrentUser = setCurrentUser;
window.logout = logout;
window.addLog = addLog;
window.register = register;
window.login = login;