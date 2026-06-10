// user/profil.js
const user = getCurrentUser();
if (!user) window.location.href = '../index.html';

function simpanProfil() {
  const profil = {
    nama: document.getElementById('nama').value,
    email: document.getElementById('email').value,
    telp: document.getElementById('telp').value
  };
  saveUserProfil(profil);
  alert('Profil disimpan');
}
function loadProfil() {
  const data = loadUserData();
  if (data && data.profil) {
    document.getElementById('nama').value = data.profil.nama || '';
    document.getElementById('email').value = data.profil.email || '';
    document.getElementById('telp').value = data.profil.telp || '';
  }
}
function loadLamaran() {
  const data = loadUserData();
  const container = document.getElementById('lamaranList');
  if (!data || !data.lamaran || data.lamaran.length === 0) {
    container.innerHTML = '<p>Belum ada lamaran yang dikirim.</p>';
    return;
  }
  container.innerHTML = data.lamaran.map(l => `
    <div class="lamaran-item">
      <strong>${escapeHtml(l.posisi)}</strong> - ${escapeHtml(l.perusahaan)}<br>
      <small>Dikirim: ${l.tanggal}</small>
    </div>
  `).join('');
}
function escapeHtml(str) {
  return str.replace(/[&<>]/g, m => ({ '&':'&amp;','<':'&lt;','>':'&gt;' })[m]);
}
loadProfil();
loadLamaran();