// owner/script.js
function logout() { sessionStorage.removeItem('currentUser'); window.location.href = '../index.html'; }
function escapeHtml(str) { if (!str) return ''; return str.replace(/[&<>]/g, m => ({ '&':'&amp;','<':'&lt;','>':'&gt;' })[m]); }
function getCurrentUser() { return JSON.parse(sessionStorage.getItem('currentUser') || 'null'); }

const user = getCurrentUser();
if (!user || user.role !== 'pemilik') { alert('Akses ditolak.'); window.location.href = '../index.html'; }
document.getElementById('userName') && (document.getElementById('userName').innerText = user.nama || 'Pemilik');

const sidebar = document.getElementById('sidebar');
const toggleBtn = document.getElementById('sidebarToggleBtn');
if (toggleBtn && sidebar) {
    toggleBtn.addEventListener('click', () => {
        sidebar.classList.toggle('collapsed');
        document.getElementById('mainContent')?.classList.toggle('content-expanded');
    });
}
document.getElementById('logoutBtn')?.addEventListener('click', () => logout());

// Fungsi global untuk refresh data (bisa dipanggil dari halaman masing-masing)
window.refreshData = function() {
    location.reload();
};