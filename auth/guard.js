// auth/guard.js - Middleware cepat untuk proteksi halaman
function guard(page, redirect = '../index.html') {
  if (!requireValidSession(redirect)) return false;
  return protectPage(page, redirect);
}
window.guard = guard;