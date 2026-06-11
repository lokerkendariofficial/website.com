// script.js - logika lowongan untuk beranda.html
let jobsData = [];
let currentCategory = "all";
let searchKeyword = "";

function initJobsData() {
  const stored = localStorage.getItem('lokerData');
  if (stored && JSON.parse(stored).length > 0) {
    jobsData = JSON.parse(stored);
  } else {
    jobsData = [
      { id: 1, title: "Crew", company: "PT TRIPLEK", location: "Mandonga", type: "Remote", salary: "2.2 jt", category: "it", desc: "Sangat terampil", address: "Mandonga", qualification: "SMA/SMK", contact: "WA: 0812" },
      { id: 2, title: "Mekanik", company: "Bengkel mobil", location: "Konawe", type: "Kontrak", salary: "4.5 jt", category: "lainnya", desc: "Perbaikan kendaraan", address: "Konawe", qualification: "SMK Otomotif", contact: "WA: 0852" },
      { id: 3, title: "Barter", company: "PT kasino", location: "Wawotobi", type: "Kontrak", salary: "3.7", category: "admin", desc: "Disiplin", address: "Wawotobi", qualification: "Disiplin", contact: "-" }
    ];
    localStorage.setItem('lokerData', JSON.stringify(jobsData));
  }
  jobsData = jobsData.map(job => {
    if (!job.category) job.category = "lainnya";
    return job;
  });
}

function getUniqueCategories() {
  const cats = new Set();
  jobsData.forEach(job => cats.add(job.category));
  return Array.from(cats).sort();
}

function renderCategories() {
  const container = document.getElementById('categoriesContainer');
  if (!container) return;
  const cats = getUniqueCategories();
  let html = `<div class="chip ${currentCategory === 'all' ? 'active' : ''}" data-cat="all">Semua</div>`;
  const displayMap = { it: "IT & Teknologi", marketing: "Pemasaran", admin: "Administrasi", education: "Pendidikan", lainnya: "Lainnya" };
  cats.forEach(c => {
    let display = displayMap[c] || c.charAt(0).toUpperCase() + c.slice(1);
    html += `<div class="chip ${currentCategory === c ? 'active' : ''}" data-cat="${c}">${display}</div>`;
  });
  container.innerHTML = html;
  document.querySelectorAll('.chip').forEach(chip => {
    chip.addEventListener('click', () => {
      currentCategory = chip.dataset.cat;
      renderCategories();
      renderJobs();
    });
  });
}

function renderJobs() {
  let filtered = [...jobsData];
  if (currentCategory !== "all") filtered = filtered.filter(job => job.category === currentCategory);
  if (searchKeyword.trim()) {
    const kw = searchKeyword.toLowerCase();
    filtered = filtered.filter(job => job.title.toLowerCase().includes(kw) || job.company.toLowerCase().includes(kw));
  }
  const container = document.getElementById('jobList');
  const countSpan = document.getElementById('jobCountDisplay');
  if (!container) return;
  if (filtered.length === 0) {
    container.innerHTML = '<div style="text-align:center; padding:2rem;">Tidak ada lowongan yang cocok.</div>';
    countSpan.innerText = '0 lowongan';
    return;
  }
  countSpan.innerText = `${filtered.length} lowongan ditemukan`;
  container.innerHTML = filtered.map(job => `
    <div class="job-card">
      <div class="job-title">${escapeHtml(job.title)}</div>
      <div class="job-company"><i class="fas fa-building"></i> ${escapeHtml(job.company)}</div>
      <div class="job-details">
        <span><i class="fas fa-map-marker-alt"></i> ${escapeHtml(job.location)}</span>
        <span><i class="fas fa-clock"></i> ${escapeHtml(job.type)}</span>
        <span><i class="fas fa-money-bill-wave"></i> ${escapeHtml(job.salary)}</span>
      </div>
      <div class="job-desc">${escapeHtml(job.desc.substring(0, 80))}${job.desc.length>80?'...':''}</div>
      <div class="card-footer">
        <button class="btn-detail" data-id="${job.id}">Lihat Selengkapnya</button>
      </div>
    </div>
  `).join('');
  document.querySelectorAll('.btn-detail').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-id');
      const job = jobsData.find(j => j.id == id);
      if (job) showModal(job);
    });
  });
}

function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/[&<>]/g, m => ({ '&':'&amp;','<':'&lt;','>':'&gt;' })[m]);
}

function showModal(job) {
  const modal = document.getElementById('detailModal');
  const body = document.getElementById('modalBody');
  if (!job) return;
  body.innerHTML = `
    <div class="detail-section"><strong>${escapeHtml(job.company)}</strong> - ${escapeHtml(job.title)}</div>
    <div class="detail-section"><strong>Lokasi:</strong> ${escapeHtml(job.location)}</div>
    <div class="detail-section"><strong>Tipe:</strong> ${escapeHtml(job.type)}</div>
    <div class="detail-section"><strong>Gaji:</strong> ${escapeHtml(job.salary)}</div>
    <div class="detail-section"><strong>Alamat:</strong> ${escapeHtml(job.address || 'Tidak tersedia')}</div>
    <div class="detail-section"><strong>Kualifikasi:</strong> ${escapeHtml(job.qualification || 'Tidak ada')}</div>
    <div class="detail-section"><strong>Deskripsi:</strong> ${escapeHtml(job.desc)}</div>
    <div class="detail-section"><strong>Kontak:</strong> ${escapeHtml(job.contact || 'Tidak tersedia')}</div>
  `;
  modal.classList.add('active');
}

function closeModal() {
  const modal = document.getElementById('detailModal');
  if (modal) modal.classList.remove('active');
}
document.getElementById('closeModalBtn')?.addEventListener('click', closeModal);
document.getElementById('detailModal')?.addEventListener('click', e => { if (e.target === e.currentTarget) closeModal(); });

function doSearch() {
  searchKeyword = document.getElementById('searchInput')?.value.trim() || '';
  renderJobs();
}
document.getElementById('searchBtn')?.addEventListener('click', doSearch);
document.getElementById('searchInput')?.addEventListener('keypress', e => { if (e.key === 'Enter') doSearch(); });

initJobsData();
renderCategories();
renderJobs();