// script.js - fungsi global untuk lowongan, filter, modal
let jobsData = [];
let currentCategory = "all";
let searchKeyword = "";

function initJobsData() {
  const stored = localStorage.getItem('lokerData');
  if (stored && JSON.parse(stored).length > 0) {
    jobsData = JSON.parse(stored);
  } else {
    jobsData = [
      { id: 1, title: "Crew", company: "PT TRIPLEK", location: "Mandonga", type: "Remote", salary: "2.2 jt", category: "it", desc: "Sangat terampil di bidang nya", address: "Jl. Poros Mandonga No. 12, Kendari", qualification: "Pendidikan minimal SMA/SMK", contact: "Email: hrd@triplek.com" },
      { id: 2, title: "Mekanik", company: "Bengkel mobil", location: "Konawe", type: "Kontrak", salary: "4.5 jt", category: "lainnya", desc: "Perbaikan kendaraan", address: "Jl. Raya Konawe", qualification: "SMK Otomotif", contact: "WA: 085266677788" },
      { id: 3, title: "Frontend Developer", company: "PT Teknologi Nusantara", location: "Kendari", type: "Fulltime", salary: "4jt - 7jt", category: "it", desc: "React, Tailwind", address: "Kendari", qualification: "S1 Teknik Informatika", contact: "Email: career@teknologi.id" },
      { id: 4, title: "Staff Administrasi", company: "CV Berkah Abadi", location: "Kendari", type: "Kontrak", salary: "3jt - 4jt", category: "admin", desc: "Administrasi kantor", address: "Jl. Sultan Hasanuddin", qualification: "Mahir Ms. Office", contact: "WA: 082199887766" },
      { id: 5, title: "Guru Bahasa Inggris", company: "SMA Negeri 5 Kendari", location: "Kendari", type: "Fulltime", salary: "Nego", category: "education", desc: "Mengajar Bahasa Inggris", address: "Jl. Pendidikan", qualification: "S1 Pendidikan Inggris", contact: "Email: sma5kendari@sch.id" }
    ];
    localStorage.setItem('lokerData', JSON.stringify(jobsData));
  }
  jobsData = jobsData.map(job => { if (!job.category) job.category = "lainnya"; return job; });
}

function getUniqueCategories() {
  const cats = new Set();
  jobsData.forEach(job => cats.add(job.category));
  return Array.from(cats).sort();
}

function renderCategories(containerId = 'categoriesContainer') {
  const container = document.getElementById(containerId);
  if (!container) return;
  const categories = getUniqueCategories();
  let html = `<div class="chip ${currentCategory === 'all' ? 'active' : ''}" data-cat="all"><i class="fas fa-list"></i> Semua</div>`;
  categories.forEach(cat => {
    let display = cat;
    if (cat === "it") display = "IT & Teknologi";
    else if (cat === "marketing") display = "Pemasaran";
    else if (cat === "admin") display = "Administrasi";
    else if (cat === "education") display = "Pendidikan";
    else if (cat === "lainnya") display = "Lainnya";
    html += `<div class="chip ${currentCategory === cat ? 'active' : ''}" data-cat="${cat}"><i class="fas fa-tag"></i> ${display}</div>`;
  });
  container.innerHTML = html;
  document.querySelectorAll('.chip').forEach(chip => {
    chip.addEventListener('click', () => {
      currentCategory = chip.getAttribute('data-cat');
      renderCategories(containerId);
      renderJobs();
    });
  });
}

function renderJobs() {
  let filtered = [...jobsData];
  if (currentCategory !== "all") filtered = filtered.filter(job => job.category === currentCategory);
  if (searchKeyword.trim() !== "") {
    const kw = searchKeyword.toLowerCase();
    filtered = filtered.filter(job => job.title.toLowerCase().includes(kw) || job.company.toLowerCase().includes(kw));
  }
  const container = document.getElementById('jobList');
  const countSpan = document.getElementById('jobCountDisplay');
  if (!container) return;
  if (filtered.length === 0) {
    container.innerHTML = `<div class="empty-msg"><i class="fas fa-folder-open"></i> Tidak ada lowongan yang cocok.</div>`;
    if (countSpan) countSpan.innerText = `0 lowongan ditemukan`;
    return;
  }
  if (countSpan) countSpan.innerText = `${filtered.length} lowongan ditemukan`;
  container.innerHTML = filtered.map(job => `
    <div class="job-card">
      <div class="job-title">${escapeHtml(job.title)}</div>
      <div class="job-company"><i class="fas fa-building"></i> ${escapeHtml(job.company)}</div>
      <div class="job-details">
        <span><i class="fas fa-map-marker-alt"></i> ${escapeHtml(job.location)}</span>
        <span><i class="fas fa-clock"></i> ${escapeHtml(job.type)}</span>
        <span><i class="fas fa-money-bill-wave"></i> ${escapeHtml(job.salary)}</span>
      </div>
      <div class="job-desc">${escapeHtml(job.desc.substring(0, 80))}${job.desc.length > 80 ? '...' : ''}</div>
      <div class="card-footer"><button class="btn-detail" data-id="${job.id}">Lihat Selengkapnya</button></div>
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

function escapeHtml(str) { if (!str) return ''; return str.replace(/[&<>]/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' })[m]); }

function showModal(job) {
  const modal = document.getElementById('detailModal');
  const modalBody = document.getElementById('modalBody');
  const addressHtml = job.address ? `<div><strong>Alamat Lengkap Kantor:</strong><br>${escapeHtml(job.address)}</div>` : '<div><strong>Alamat Lengkap Kantor:</strong><br>Alamat tidak tersedia.</div>';
  const qualificationHtml = job.qualification ? `<div><strong>Kualifikasi:</strong><br>${escapeHtml(job.qualification)}</div>` : '<div><strong>Kualifikasi:</strong><br>Tidak ada informasi.</div>';
  const contactHtml = job.contact ? `<div><strong>Kontak:</strong> ${escapeHtml(job.contact)}</div>` : '';
  modalBody.innerHTML = `
    <div class="detail-section"><strong>${escapeHtml(job.company)}</strong><h3 style="margin:4px 0 0 0;">${escapeHtml(job.title)}</h3></div>
    <div class="detail-section"><div><strong>Lokasi:</strong> ${escapeHtml(job.location)}</div><div><strong>Tipe:</strong> ${escapeHtml(job.type)}</div><div><strong>Gaji:</strong> ${escapeHtml(job.salary)}</div></div>
    <div class="detail-section">${addressHtml}</div>
    <div class="detail-section">${qualificationHtml}</div>
    <div class="detail-section"><div><strong>Deskripsi Pekerjaan:</strong><br>${escapeHtml(job.desc)}</div></div>
    <div class="detail-section">${contactHtml}</div>
  `;
  modal.classList.add('active');
}

// Inisialisasi
function init() {
  initJobsData();
  if (document.getElementById('categoriesContainer')) {
    renderCategories();
    renderJobs();
    const searchBtn = document.getElementById('searchBtn');
    const searchInput = document.getElementById('searchInput');
    if (searchBtn) searchBtn.addEventListener('click', () => { searchKeyword = searchInput.value.trim(); renderJobs(); });
    if (searchInput) searchInput.addEventListener('keypress', e => { if (e.key === 'Enter') searchBtn.click(); });
  }
  // Modal global
  const modal = document.getElementById('detailModal');
  const closeModalBtn = document.getElementById('closeModalBtn');
  if (closeModalBtn) closeModalBtn.onclick = () => modal.classList.remove('active');
  if (modal) modal.onclick = e => { if (e.target === modal) modal.classList.remove('active'); };
}
init();