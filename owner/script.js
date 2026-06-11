// owner/script.js
const user = getCurrentUser();
if (!user || user.role !== 'pemilik') {
  alert('Anda tidak memiliki akses ke halaman ini.');
  window.location.href = '../index.html';
}

let lowongan = JSON.parse(localStorage.getItem('lokerData') || '[]');
let pending = JSON.parse(localStorage.getItem('pendingIklan') || '[]');
let users = getUsers();
let lamaran = JSON.parse(localStorage.getItem('lamaranSaya') || '[]');

function updateStats() {
  document.getElementById('totalLowongan').innerText = lowongan.length;
  document.getElementById('totalPending').innerText = pending.length;
  document.getElementById('totalUser').innerText = users.length;
  document.getElementById('totalLamaran').innerText = lamaran.length;
}

function renderPending() {
  const container = document.getElementById('pendingList');
  if (pending.length === 0) {
    container.innerHTML = '<p>Tidak ada iklan menunggu konfirmasi.</p>';
    return;
  }
  let html = `能<thead><tr><th>Judul</th><th>Perusahaan</th><th>Lokasi</th><th>Pengirim</th><th>Aksi</th></tr></thead><tbody>`;
  pending.forEach(job => {
    html += `
      <tr>
        <td>${escapeHtml(job.title)}</td>
        <td>${escapeHtml(job.company)}</td>
        <td>${escapeHtml(job.location)}</td>
        <td>${escapeHtml(job.userName || 'Tidak diketahui')}</td>
        <td>
          <button class="approve" data-id="${job.id}">Setujui</button>
          <button class="reject" data-id="${job.id}">Tolak</button>
        </td>
      </tr>
    `;
  });
  html += '</tbody></table>';
  container.innerHTML = html;

  document.querySelectorAll('.approve').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = parseInt(btn.dataset.id);
      const job = pending.find(j => j.id === id);
      if (job) {
        lowongan.unshift({ ...job, uploadedAt: Date.now() });
        localStorage.setItem('lokerData', JSON.stringify(lowongan));
        pending = pending.filter(j => j.id !== id);
        localStorage.setItem('pendingIklan', JSON.stringify(pending));
        renderPending();
        renderLowongan();
        updateStats();
      }
    });
  });
  document.querySelectorAll('.reject').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = parseInt(btn.dataset.id);
      pending = pending.filter(j => j.id !== id);
      localStorage.setItem('pendingIklan', JSON.stringify(pending));
      renderPending();
      updateStats();
    });
  });
}

function renderLowongan() {
  const container = document.getElementById('lowonganList');
  if (lowongan.length === 0) {
    container.innerHTML = '<p>Belum ada lowongan.</p>';
    return;
  }
  let html = `能<thead><tr><th>Judul</th><th>Perusahaan</th><th>Lokasi</th><th>Status</th><th>Aksi</th></tr></thead><tbody>`;
  lowongan.forEach(job => {
    html += `
      <tr>
        <td>${escapeHtml(job.title)}</td>
        <td>${escapeHtml(job.company)}</td>
        <td>${escapeHtml(job.location)}</td>
        <td>Aktif</td>
        <td><button class="delete" data-id="${job.id}" data-type="lowongan">Hapus</button></td>
      </tr>
    `;
  });
  html += '</tbody></table>';
  container.innerHTML = html;
  document.querySelectorAll('.delete[data-type="lowongan"]').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = parseInt(btn.dataset.id);
      if (confirm('Hapus lowongan ini?')) {
        lowongan = lowongan.filter(j => j.id !== id);
        localStorage.setItem('lokerData', JSON.stringify(lowongan));
        renderLowongan();
        updateStats();
      }
    });
  });
}

function renderUsers() {
  const container = document.getElementById('userList');
  if (users.length === 0) {
    container.innerHTML = '<p>Belum ada user.</p>';
    return;
  }
  let html = `能<thead><tr><th>ID</th><th>Nama</th><th>Username</th><th>Role</th><th>Aksi</th></tr></thead><tbody>`;
  users.forEach(u => {
    html += `
      <tr>
        <td>${u.id}</td>
        <td>${escapeHtml(u.nama)}</td>
        <td>${escapeHtml(u.username)}</td>
        <td>${u.role}</td>
        <td>${u.role !== 'pemilik' ? `<button class="delete" data-id="${u.id}" data-type="user">Hapus</button>` : '-'}</td>
      </tr>
    `;
  });
  html += '</tbody></table>';
  container.innerHTML = html;
  document.querySelectorAll('.delete[data-type="user"]').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = parseInt(btn.dataset.id);
      if (confirm('Hapus user ini?')) {
        users = users.filter(u => u.id !== id);
        saveUsers(users);
        renderUsers();
        updateStats();
      }
    });
  });
}

function renderLamaran() {
  const container = document.getElementById('lamaranList');
  if (lamaran.length === 0) {
    container.innerHTML = '<p>Belum ada lamaran.</p>';
    return;
  }
  let html = `能<thead><tr><th>Nama</th><th>Email</th><th>Posisi</th><th>Pesan</th><th>Tanggal</th></tr></thead><tbody>`;
  lamaran.forEach(l => {
    html += `
      <tr>
        <td>${escapeHtml(l.nama || l.namaPelamar)}</td>
        <td>${escapeHtml(l.email)}</td>
        <td>${escapeHtml(l.posisi)}</td>
        <td>${escapeHtml(l.pesan)}</td>
        <td>${l.tanggal}</td>
      </tr>
    `;
  });
  html += '</tbody></table>';
  container.innerHTML = html;
}

function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/[&<>]/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' })[m]);
}

document.getElementById('logoutBtn').addEventListener('click', () => logout());

renderPending();
renderLowongan();
renderUsers();
renderLamaran();
updateStats();