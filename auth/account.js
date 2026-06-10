// auth/account.js - Sistem akun dengan session token unik (double login protection)
function generateToken() {
  return 'sess_' + Date.now() + '_' + Math.random().toString(36).substr(2, 16);
}

function findUserByLoginId(loginId) {
  const users = getUsers();
  const config = JSON.parse(localStorage.getItem('sistemConfig') || '{"metodeLogin":"username_email"}');
  const fieldName = config.metodeLogin === 'telepon' ? 'nomorTelepon' : 'username';
  return users.find(u => u[fieldName] === loginId);
}

function loginUnique(loginId, password) {
  const user = findUserByLoginId(loginId);
  if (!user || user.password !== btoa(password)) {
    return { success: false, msg: 'ID atau password salah.' };
  }
  const newToken = generateToken();
  user.sessionToken = newToken;
  user.lastLogin = new Date().toISOString();
  saveUsers(getUsers().map(u => u.id === user.id ? user : u));
  sessionStorage.setItem('currentUser', JSON.stringify({
    id: user.id,
    nama: user.nama,
    role: user.role,
    sessionToken: newToken,
    loginAt: Date.now()
  }));
  addLog(user.id, user.nama, 'LOGIN', `User ${user.nama} login dengan token ${newToken}`);
  return { success: true, role: user.role };
}

function isSessionValid() {
  const current = JSON.parse(sessionStorage.getItem('currentUser'));
  if (!current) return false;
  const users = getUsers();
  const user = users.find(u => u.id === current.id);
  if (!user) return false;
  return user.sessionToken === current.sessionToken;
}

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

function loadUserData() {
  const current = getCurrentUser();
  if (!current) return null;
  const profil = JSON.parse(localStorage.getItem(`profil_${current.id}`) || '{}');
  const lamaran = JSON.parse(localStorage.getItem(`lamaran_${current.id}`) || '[]');
  return { profil, lamaran };
}
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

function requireValidSession(redirect = '../index.html') {
  if (!isSessionValid()) {
    sessionStorage.removeItem('currentUser');
    window.location.href = redirect;
    return false;
  }
  return true;
}

window.loginUnique = loginUnique;
window.isSessionValid = isSessionValid;
window.logoutUnique = logoutUnique;
window.loadUserData = loadUserData;
window.saveUserProfil = saveUserProfil;
window.saveUserLamaran = saveUserLamaran;
window.requireValidSession = requireValidSession;