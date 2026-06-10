// user/beranda.js
let jobsData = [];
let currentCategory = "all";
let searchKeyword = "";

function initJobsData() {
  const stored = localStorage.getItem('lokerData');
  if (stored && JSON.parse(stored).length > 0) {
    jobsData = JSON.parse(stored);
  } else {
    jobsData = [
      { id: 1, title: "Digital Marketing", company: "Kreatif Agency", location: "Kendari", type: "Fulltime", salary: "5jt - 8jt", category: "marketing", desc: "SEO, sosial media.", address: "Kendari", qualification: "Berpengalaman", contact: "WA: 08123456789" }
    ];
    localStorage.setItem('lokerData', JSON.stringify(jobsData));
  }
  jobsData = jobsData.map(j => { if (!j.category) j.category = "lainnya"; return j; });
}

function getUniqueCategories() {
  const cats = new Set();
  jobsData.forEach(j => cats.add(j.category));
  return Array.from(cats).sort();
}

function renderCategories() {
  const container = document.getElementById('categoriesContainer');
  if (!container) return;
  const cats = getUniqueCategories();
  let html = `<div class="chip ${currentCategory === 'all' ? 'active' : ''}" data-cat="all">Semua</div>`;
  const displayMap = { it: "IT & Teknologi", marketing: "Pemasaran", admin: "Administrasi", education: "Pendidikan", lainnya: "Lainnya" };
  cats.forEach(c => {
    let display = displayMap[c] || c;
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
  if (currentCategory !== "all") filtered = filtered.filter(j => j.category === currentCategory);
  if (searchKeyword.trim()) {
    const kw = searchKeyword.toLowerCase();
    filtered = filtered.filter(j => j.title.toLowerCase().includes(kw) || j.company.toLowerCase().includes(kw));
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
      <div class="job-desc">${escapeHtml(job.desc)}</div>
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
  return str.replace(/[&<>]/g, m => ({ '&':'&amp;','<':'&lt;','>':'&gt;' })[m]);
}

function showModal(job) {
  const modal = document.getElementById('detailModal');
  const body = document.getElementById('modalBody');
  body.innerHTML = `
    <div><strong>${escapeHtml(job.company)}</strong> - ${escapeHtml(job.title)}</div>
    <div><strong>Lokasi:</strong> ${escapeHtml(job.location)}</div>
    <div><strong>Tipe:</strong> ${escapeHtml(job.type)}</div>
    <div><strong>Gaji:</strong> ${escapeHtml(job.salary)}</div>
    <div><strong>Alamat:</strong> ${escapeHtml(job.address || 'Tidak tersedia')}</div>
    <div><strong>Kualifikasi:</strong> ${escapeHtml(job.qualification || 'Tidak ada')}</div>
    <div><strong>Deskripsi:</strong> ${escapeHtml(job.desc)}</div>
    <div><strong>Kontak:</strong> ${escapeHtml(job.contact || 'Tidak tersedia')}</div>
  `;
  modal.classList.add('active');
}

function bindSearchEvents() {
  const searchBtn = document.getElementById('searchBtn');
  const searchInput = document.getElementById('searchInput');
  if (searchBtn) {
    searchBtn.addEventListener('click', () => {
      searchKeyword = searchInput.value.trim();
      renderJobs();
    });
  }
  if (searchInput) {
    searchInput.addEventListener('keypress', e => {
      if (e.key === 'Enter') searchBtn.click();
    });
  }
}

function init() {
  initJobsData();
  renderCategories();
  renderJobs();
  bindSearchEvents();
  const modal = document.getElementById('detailModal');
  const closeModal = document.getElementById('closeModalBtn');
  if (closeModal) closeModal.onclick = () => modal.classList.remove('active');
  modal.onclick = (e) => { if (e.target === modal) modal.classList.remove('active'); };
}
init();