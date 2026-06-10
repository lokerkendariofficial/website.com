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
      { id: 1, nama: 'Pemilik Utama', email: 'pemilik@loker.com', password: btoa('pemilik123'), role: 'pemilik' },
      { id: 2, nama: 'User Biasa', email: 'user@loker.com', password: btoa('user123'), role: 'user' }
    ];
    saveUsers(users);
  }
}
ensureDefaultAccounts();

function register(nama, email, password) {
  let users = getUsers();
  if (users.find(u => u.email === email)) return { success: false, msg: 'Email sudah terdaftar.' };
  const newUser = { id: Date.now(), nama, email, password: btoa(password), role: 'user' };
  users.push(newUser);
  saveUsers(users);
  return { success: true };
}

function login(email, password) {
  let users = getUsers();
  const user = users.find(u => u.email === email && u.password === btoa(password));
  if (!user) return { success: false, msg: 'Email atau password salah.' };
  setCurrentUser({ id: user.id, nama: user.nama, email: user.email, role: user.role });
  return { success: true, role: user.role };
}