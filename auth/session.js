// auth/session.js - Manajemen user dasar (tanpa token, untuk keperluan internal)
function getUsers() {
  return JSON.parse(localStorage.getItem('users') || '[]');
}
function saveUsers(users) {
  localStorage.setItem('users', JSON.stringify(users));
}
function getCurrentUser() {
  return JSON.parse(sessionStorage.getItem('currentUser') || 'null');
}
function setCurrentUser(user) {
  sessionStorage.setItem('currentUser', JSON.stringify(user));
}
function addLog(userId, username, aksi, detail) {
  let logs = JSON.parse(localStorage.getItem('logAktivitas') || '[]');
  logs.unshift({ id: Date.now(), userId, username, aksi, detail, timestamp: new Date().toISOString() });
  if (logs.length > 1000) logs.pop();
  localStorage.setItem('logAktivitas', JSON.stringify(logs));
}
function ensureDefaultAccounts() {
  let users = getUsers();
  const defaults = [
    { id: 1, nama: 'Pemilik Utama', password: btoa('900900'), role: 'pemilik', isOwner: true, nomorTelepon: '900900', username: '900900', sessionToken: null },
    { id: 2, nama: 'Admin Sistem', password: btoa('9090'), role: 'admin', isOwner: false, nomorTelepon: '9090', username: '9090', sessionToken: null },
    { id: 3, nama: 'User Biasa', password: btoa('9091'), role: 'user', isOwner: false, nomorTelepon: '9091', username: '9091', sessionToken: null }
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
ensureDefaultAccounts();

window.getUsers = getUsers;
window.saveUsers = saveUsers;
window.getCurrentUser = getCurrentUser;
window.setCurrentUser = setCurrentUser;
window.addLog = addLog;