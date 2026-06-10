// auth/guard.js - Middleware sederhana untuk melindungi halaman
function guard(page, redirect = '../index.html') {
  return protectPage(page, redirect);
}

// Contoh pemakaian di halaman dashboard:
// <script src="../auth/guard.js"></script>
// <script>guard('owner.html');</script>

window.guard = guard;