// auth.js
function getUsers() { return JSON.parse(localStorage.getItem('users') || '[]'); }
function saveUsers(users) { localStorage.setItem('users', JSON.stringify(users)); }
function getCurrentUser() { return JSON.parse(sessionStorage.getItem('currentUser') || 'null'); }
function setCurrentUser(user) { sessionStorage.setItem('currentUser', JSON.stringify(user)); }
function logout() { sessionStorage.removeItem('currentUser'); window.location.href = 'index.html'; }

function ensureDefaultAccounts() {
  let users = getUsers();
  if (users.length === 0) {
    users = [
      { id: 1, nama: 'Pemilik Utama', username: '900900', password: btoa('900900'), role: 'pemilik' },
      { id: 2, nama: 'Admin Sistem', username: '9090', password: btoa('9090'), role: 'admin' },
      { id: 3, nama: 'User Biasa', username: '9091', password: btoa('9091'), role: 'user' }
    ];
    saveUsers(users);
  }
}
ensureDefaultAccounts();

function login(username, password) {
  let users = getUsers();
  const user = users.find(u => u.username === username && u.password === btoa(password));
  if (!user) return { success: false, msg: 'ID atau password salah.' };
  setCurrentUser({ id: user.id, nama: user.nama, username: user.username, role: user.role });
  return { success: true, role: user.role };
}