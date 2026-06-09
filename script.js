// Data lowongan
let jobsData = [];
let currentCategory = "all";
let searchKeyword = "";

// Inisialisasi data dari localStorage atau default
function initJobsData() {
  const stored = localStorage.getItem('lokerData');
  if (stored && JSON.parse(stored).length > 0) {
    jobsData = JSON.parse(stored);
  } else {
    // Data default seperti gambar
    jobsData = [
      {
        id: 1,
        title: "Crew",
        company: "PT TRIPLEK",
        location: "Mandonga",
        type: "Remote",
        salary: "2.2 jt",
        category: "it",
        desc: "Sangat terampil di bidang nya",
        address: "Jl. Poros Mandonga No. 12, Kendari",
        qualification: "Pendidikan minimal SMA/SMK, memiliki pengalaman di bidang operasional, mampu bekerja tim.",
        contact: "Email: hrd@triplek.com | WA: 081234567890"
      },
      {
        id: 2,
        title: "Mekanik",
        company: "Bengkel mobil",
        location: "Konawe",
        type: "Kontrak",
        salary: "4.5 jt",
        category: "lainnya",
        desc: "Perbaikan dan perawatan kendaraan ringan dan berat.",
        address: "Jl. Raya Konawe No. 45, Konawe",
        qualification: "Lulusan SMK Otomotif, pengalaman 1 tahun lebih.",
        contact: "WA: 085266677788"
      },
      {
        id: 3,
        title: "Frontend Developer",
        company: "PT Teknologi Nusantara",
        location: "Kendari",
        type: "Fulltime",
        salary: "4jt - 7jt",
        category: "it",
        desc: "Mengembangkan aplikasi frontend dengan React dan Tailwind.",
        address: "Kendari, Sulawesi Tenggara",
        qualification: "Mahir React, CSS, JavaScript; minimal S1",
        contact: "Email: career@teknologi.id"
      },
      {
        id: 4,
        title: "Staff Administrasi",
        company: "CV Berkah Abadi",
        location: "Kendari",
        type: "Kontrak",
        salary: "3jt - 4jt",
        category: "admin",
        desc: "Mengelola dokumen dan administrasi kantor.",
        address: "Jl. Sultan Hasanuddin No. 20, Kendari",
        qualification: "Mahir Ms. Office, teliti, rapi",
        contact: "WA: 082199887766"
      },
      {
        id: 5,
        title: "Guru Bahasa Inggris",
        company: "SMA Negeri 5 Kendari",
        location: "Kendari",
        type: "Fulltime",
        salary: "Nego",
        category: "education",
        desc: "Mengajar Bahasa Inggris untuk siswa SMA.",
        address: "Jl. Pendidikan No. 10, Kendari",
        qualification: "S1 Pendidikan Bahasa Inggris, memiliki sertifikasi",
        contact: "Email: sma5kendari@sch.id"
      },
      {
        id: 6,
        title: "Digital Marketing",
        company: "Kreatif Agency",
        location: "Kendari",
        type: "Fulltime",
        salary: "5jt - 8jt",
        category: "marketing",
        desc: "Mengelola media sosial, SEO, dan konten kreatif.",
        address: "Kendari",
        qualification: "Berpengalaman, kreatif",
        contact: "WA: 081355577799"
      }
    ];
    localStorage.setItem('lokerData', JSON.stringify(jobsData));
  }
  // Pastikan tiap job punya kategori
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
  const categories = getUniqueCategories();
  let html = `<div class="chip ${currentCategory === 'all' ? 'active' : ''}" data-cat="all"><i class="fas fa-list"></i> Semua</div>`;
  categories.forEach(cat => {
    let displayName = cat;
    if (cat === "it") displayName = "IT & Teknologi";
    else if (cat === "marketing") displayName = "Pemasaran";
    else if (cat === "admin") displayName = "Administrasi";
    else if (cat === "education") displayName = "Pendidikan";
    else if (cat === "lainnya") displayName = "Lainnya";
    html += `<div class="chip ${currentCategory === cat ? 'active' : ''}" data-cat="${cat}"><i class="fas fa-tag"></i> ${displayName}</div>`;
  });
  container.innerHTML = html;
  document.querySelectorAll('.chip').forEach(chip => {
    chip.addEventListener('click', () => {
      currentCategory = chip.getAttribute('data-cat');
      renderCategories();
      renderJobs();
    });
  });
}

function renderJobs() {
  let filtered = [...jobsData];
  if (currentCategory !== "all") {
    filtered = filtered.filter(job => job.category === currentCategory);
  }
  if (searchKeyword.trim() !== "") {
    const kw = searchKeyword.toLowerCase();
    filtered = filtered.filter(job => 
      job.title.toLowerCase().includes(kw) || job.company.toLowerCase().includes(kw)
    );
  }
  const container = document.getElementById('jobList');
  const countSpan = document.getElementById('jobCountDisplay');
  if (!container) return;
  if (filtered.length === 0) {
    container.innerHTML = `<div class="empty-msg"><i class="fas fa-folder-open"></i> Tidak ada lowongan yang cocok.</div>`;
    countSpan.innerText = `0 lowongan ditemukan`;
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
      <div class="job-desc">${escapeHtml(job.desc.length > 80 ? job.desc.substring(0, 80) + '...' : job.desc)}</div>
      <div class="card-footer">
        <button class="btn-detail" data-id="${job.id}">Lihat Selengkapnya</button>
      </div>
    </div>
  `).join('');

  document.querySelectorAll('.btn-detail').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = parseInt(btn.getAttribute('data-id'));
      const job = jobsData.find(j => j.id === id);
      if (job) showModal(job);
    });
  });
}

function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/[&<>]/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' })[m]);
}

function doSearch() {
  const input = document.getElementById('searchInput');
  searchKeyword = input.value.trim();
  renderJobs();
}

// Modal
const modal = document.getElementById('detailModal');
const modalBody = document.getElementById('modalBody');
const closeModalBtn = document.getElementById('closeModalBtn');

function showModal(job) {
  const contactHtml = job.contact ? `<div><strong>Kontak:</strong> ${escapeHtml(job.contact)}</div>` : '';
  const addressHtml = job.address ? `<div><strong>Alamat Lengkap Kantor:</strong><br>${escapeHtml(job.address)}</div>` : '<div><strong>Alamat Lengkap Kantor:</strong><br>Alamat tidak tersedia.</div>';
  const qualificationHtml = job.qualification ? `<div><strong>Kualifikasi:</strong><br>${escapeHtml(job.qualification)}</div>` : '<div><strong>Kualifikasi:</strong><br>Tidak ada informasi kualifikasi.</div>';
  const descHtml = `<div><strong>Deskripsi Pekerjaan:</strong><br>${escapeHtml(job.desc)}</div>`;
  const salaryHtml = `<div><strong>Gaji:</strong> ${escapeHtml(job.salary)}</div>`;
  const typeHtml = `<div><strong>Tipe Pekerjaan:</strong> ${escapeHtml(job.type)}</div>`;
  const locationHtml = `<div><strong>Lokasi:</strong> ${escapeHtml(job.location)}</div>`;

  modalBody.innerHTML = `
    <div class="detail-section">
      <strong>${escapeHtml(job.company)}</strong>
      <h3 style="margin:4px 0 0 0; font-size:1.3rem;">${escapeHtml(job.title)}</h3>
    </div>
    <div class="detail-section">
      ${locationHtml}
      ${typeHtml}
      ${salaryHtml}
    </div>
    <div class="detail-section">
      ${addressHtml}
    </div>
    <div class="detail-section">
      ${qualificationHtml}
    </div>
    <div class="detail-section">
      ${descHtml}
    </div>
    <div class="detail-section">
      ${contactHtml}
    </div>
  `;
  modal.classList.add('active');
}

function closeModal() {
  modal.classList.remove('active');
}

closeModalBtn.addEventListener('click', closeModal);
modal.addEventListener('click', (e) => {
  if (e.target === modal) closeModal();
});

// Inisialisasi
function init() {
  initJobsData();
  renderCategories();
  renderJobs();
  const searchBtn = document.getElementById('searchBtn');
  const searchInput = document.getElementById('searchInput');
  if (searchBtn) searchBtn.addEventListener('click', doSearch);
  if (searchInput) searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') doSearch();
  });
}

init();