// owner/script.js
const currentUser = getCurrentUser();
if (!currentUser || currentUser.role !== 'pemilik') {
    alert('Akses ditolak. Anda bukan pemilik.');
    window.location.href = '../index.html';
}
document.getElementById('userName').innerText = currentUser.nama || 'Pemilik';

let lowongan = JSON.parse(localStorage.getItem('lokerData') || '[]');
let pending = JSON.parse(localStorage.getItem('pendingIklan') || '[]');
let users = getUsers();
let lamaran = JSON.parse(localStorage.getItem('lamaranSaya') || '[]');

function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>]/g, m => ({ '&':'&amp;','<':'&lt;','>':'&gt;' })[m]);
}

function updateStats() {
    document.getElementById('totalLowongan').innerText = lowongan.length;
    document.getElementById('totalPending').innerText = pending.length;
    document.getElementById('totalUser').innerText = users.length;
    document.getElementById('totalLamaran').innerText = lamaran.length;
    document.getElementById('pendingCountBadge').innerText = pending.length;
    document.getElementById('lowonganCountBadge').innerText = lowongan.length;
    document.getElementById('userCountBadge').innerText = users.length;
}

function renderPending() {
    const tbody = document.getElementById('pendingTableBody');
    if (pending.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="py-4 text-center text-gray-500">Tidak ada iklan pending</td></tr>';
        return;
    }
    let html = '';
    pending.forEach(job => {
        html += `
            <tr class="border-b border-slate-700/50 hover:bg-slate-700/30">
                <td class="py-2">${escapeHtml(job.title)}</td>
                <td class="py-2">${escapeHtml(job.company)}</td>
                <td class="py-2">${escapeHtml(job.location)}</td>
                <td class="py-2">${escapeHtml(job.userName || 'Tidak diketahui')}</td>
                <td class="py-2">
                    <button class="approve-btn bg-green-600 hover:bg-green-700 text-white text-xs px-2 py-1 rounded mr-1" data-id="${job.id}">Setujui</button>
                    <button class="reject-btn bg-red-600 hover:bg-red-700 text-white text-xs px-2 py-1 rounded" data-id="${job.id}">Tolak</button>
                </td>
            </tr>
        `;
    });
    tbody.innerHTML = html;
    document.querySelectorAll('.approve-btn').forEach(btn => btn.addEventListener('click', () => approvePending(parseInt(btn.dataset.id))));
    document.querySelectorAll('.reject-btn').forEach(btn => btn.addEventListener('click', () => rejectPending(parseInt(btn.dataset.id))));
}

function approvePending(id) {
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
}

function rejectPending(id) {
    pending = pending.filter(j => j.id !== id);
    localStorage.setItem('pendingIklan', JSON.stringify(pending));
    renderPending();
    updateStats();
}

function renderLowongan() {
    const tbody = document.getElementById('lowonganTableBody');
    if (lowongan.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" class="py-4 text-center text-gray-500">Belum ada lowongan</td></tr>';
        return;
    }
    let html = '';
    lowongan.forEach(job => {
        html += `
            <tr class="border-b border-slate-700/50 hover:bg-slate-700/30">
                <td class="py-2">${escapeHtml(job.title)}</td>
                <td class="py-2">${escapeHtml(job.company)}</td>
                <td class="py-2">${escapeHtml(job.location)}</td>
                <td class="py-2"><button class="delete-job bg-red-600/80 hover:bg-red-700 text-white text-xs px-2 py-1 rounded" data-id="${job.id}">Hapus</button></td>
            </tr>
        `;
    });
    tbody.innerHTML = html;
    document.querySelectorAll('.delete-job').forEach(btn => btn.addEventListener('click', () => {
        const id = parseInt(btn.dataset.id);
        if (confirm('Hapus lowongan ini?')) {
            lowongan = lowongan.filter(j => j.id !== id);
            localStorage.setItem('lokerData', JSON.stringify(lowongan));
            renderLowongan();
            updateStats();
        }
    }));
}

function renderUsers() {
    const tbody = document.getElementById('userTableBody');
    if (users.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="py-4 text-center text-gray-500">Belum ada user</td></tr>';
        return;
    }
    let html = '';
    users.forEach(u => {
        html += `
            <tr class="border-b border-slate-700/50 hover:bg-slate-700/30">
                <td class="py-2">${u.id}</td>
                <td class="py-2">${escapeHtml(u.nama)}</td>
                <td class="py-2">${escapeHtml(u.username)}</td>
                <td class="py-2">${u.role}</td>
                <td class="py-2">${u.role !== 'pemilik' ? `<button class="delete-user bg-red-600/80 hover:bg-red-700 text-white text-xs px-2 py-1 rounded" data-id="${u.id}">Hapus</button>` : '-'}</td>
            </tr>
        `;
    });
    tbody.innerHTML = html;
    document.querySelectorAll('.delete-user').forEach(btn => btn.addEventListener('click', () => {
        const id = parseInt(btn.dataset.id);
        if (confirm('Hapus user ini?')) {
            users = users.filter(u => u.id !== id);
            saveUsers(users);
            renderUsers();
            updateStats();
        }
    }));
}

document.getElementById('logoutBtn').addEventListener('click', () => logout());

renderPending();
renderLowongan();
renderUsers();
updateStats();