// menu.js - navigasi dan sidebar kiri (final)
const hamburger = document.getElementById('hamburger');
const contentFrame = document.getElementById('contentFrame');

// Buat elemen overlay dan sidebar jika belum ada
let sidebarOverlay = document.querySelector('.sidebar-overlay');
let sidebarMenu = document.querySelector('.sidebar-menu');

if (!sidebarOverlay) {
  sidebarOverlay = document.createElement('div');
  sidebarOverlay.className = 'sidebar-overlay';
  document.body.appendChild(sidebarOverlay);
}
if (!sidebarMenu) {
  sidebarMenu = document.createElement('div');
  sidebarMenu.className = 'sidebar-menu';
  const originalLinks = document.querySelector('.nav-links');
  if (originalLinks) {
    const links = originalLinks.querySelectorAll('a');
    links.forEach(link => {
      const newLink = document.createElement('a');
      newLink.href = link.href;
      newLink.textContent = link.textContent;
      newLink.setAttribute('data-page', link.getAttribute('data-page'));
      sidebarMenu.appendChild(newLink);
    });
  }
  const closeBtn = document.createElement('div');
  closeBtn.className = 'close-sidebar';
  closeBtn.innerHTML = '<i class="fas fa-times"></i>';
  sidebarMenu.prepend(closeBtn);
  document.body.appendChild(sidebarMenu);
}

function closeSidebar() {
  sidebarMenu.classList.remove('active');
  sidebarOverlay.classList.remove('active');
}

function openSidebar() {
  sidebarMenu.classList.add('active');
  sidebarOverlay.classList.add('active');
}

// Event hamburger
hamburger.addEventListener('click', (e) => {
  e.stopPropagation();
  openSidebar();
});

// Tutup sidebar
sidebarOverlay.addEventListener('click', closeSidebar);
const closeBtn = sidebarMenu.querySelector('.close-sidebar');
if (closeBtn) closeBtn.addEventListener('click', closeSidebar);

// FUNGSI NAVIGASI TUNGGAL (sesuai dengan data-page)
function navigateTo(page) {
  let src = "";
  if (page === "beranda") src = "beranda.html";
  else if (page === "lowongan") src = "lowongan-modern.html";   // ganti sesuai file lowongan Anda
  else if (page === "kontak") src = "kontak.html";
  else if (page === "pasang") src = "pasang.html";
  else if (page === "profil") src = "profil.html";
  if (src) {
    contentFrame.src = src;
  }
}

// Navigasi dari sidebar menu
const sidebarLinks = sidebarMenu.querySelectorAll('a');
sidebarLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const page = link.getAttribute('data-page');
    if (page) navigateTo(page);
    closeSidebar();
  });
});

// Navigasi dari logo
document.getElementById('logo').addEventListener('click', () => {
  navigateTo('beranda');
  closeSidebar();
});

// Navigasi dari nav-links asli (desktop)
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const page = link.getAttribute('data-page');
    if (page) navigateTo(page);
  });
});