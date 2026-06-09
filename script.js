// ==================== script.js ====================
let jobsData = [];
let currentCategory = "all";
let searchKeyword = "";

// Inisialisasi data lowongan (localStorage)
function initJobsData() {
    const stored = localStorage.getItem('lokerData');
    if (stored && JSON.parse(stored).length > 0) {
        jobsData = JSON.parse(stored);
    } else {
        jobsData = [
            { id: 1, title: "Crew", company: "PT TRIPLEK", location: "Mandonga", type: "Remote", salary: "2.2 jt", category: "it", desc: "Bertanggung jawab dalam operasional harian." },
            { id: 2, title: "Mekanik", company: "Bengkel mobil", location: "Konawe", type: "Kontrak", salary: "4.5 jt", category: "lainnya", desc: "Perbaikan dan perawatan kendaraan." },
            { id: 3, title: "Frontend Developer", company: "PT Teknologi Nusantara", location: "Kendari", type: "Fulltime", category: "it", salary: "4jt - 7jt", desc: "React, Tailwind." },
            { id: 4, title: "Staff Administrasi", company: "CV Berkah Abadi", location: "Kendari", type: "Kontrak", category: "admin", salary: "3jt - 4jt", desc: "Mengelola dokumen kantor." },
            { id: 5, title: "Guru Bahasa Inggris", company: "SMA Negeri 5 Kendari", location: "Kendari", type: "Fulltime", category: "education", salary: "Nego", desc: "Mengajar Bahasa Inggris." },
            { id: 6, title: "Digital Marketing", company: "Kreatif Agency", location: "Kendari", type: "Fulltime", category: "marketing", salary: "5jt - 8jt", desc: "SEO, sosial media." }
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
            renderJobs('jobList', 'jobCountDisplay');
        });
    });
}

function renderJobs(listId = 'jobList', countId = 'jobCountDisplay') {
    let filtered = [...jobsData];
    if (currentCategory !== "all") {
        filtered = filtered.filter(job => job.category === currentCategory);
    }
    if (searchKeyword.trim() !== "") {
        const kw = searchKeyword.toLowerCase();
        filtered = filtered.filter(job => job.title.toLowerCase().includes(kw) || job.company.toLowerCase().includes(kw));
    }
    const container = document.getElementById(listId);
    const countSpan = document.getElementById(countId);
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
            <div class="card-footer">
                <button class="btn-detail" data-id="${job.id}">Lihat Selengkapnya</button>
            </div>
        </div>
    `).join('');
    document.querySelectorAll('.btn-detail').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = btn.getAttribute('data-id');
            window.location.href = `shared/detail.html?id=${id}`;
        });
    });
}

function escapeHtml(str) { if (!str) return ''; return str.replace(/[&<>]/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' })[m]); }

function bindSearchEvents() {
    const searchBtn = document.getElementById('searchBtn');
    const searchInput = document.getElementById('searchInput');
    if (searchBtn) searchBtn.addEventListener('click', () => {
        searchKeyword = document.getElementById('searchInput').value.trim();
        renderJobs();
    });
    if (searchInput) searchInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') searchBtn.click(); });
}

// Redirect role
document.addEventListener('DOMContentLoaded', () => {
    initJobsData();
    if (document.getElementById('categoriesContainer')) {
        renderCategories();
        renderJobs();
        bindSearchEvents();
    }
    const btnOwner = document.getElementById('btnOwner');
    const btnAdmin = document.getElementById('btnAdmin');
    const btnUser = document.getElementById('btnUser');
    if (btnOwner) btnOwner.onclick = () => window.location.href = 'owner.html';
    if (btnAdmin) btnAdmin.onclick = () => window.location.href = 'admin.html';
    if (btnUser) btnUser.onclick = () => window.location.href = 'user.html';
});