(function() {
  const hamburger = document.getElementById('hamburgerBtn');
  const menu = document.getElementById('menuOverlay');
  const backdrop = document.getElementById('backdrop');
  const closeBtn = document.getElementById('closeMenuBtn');

  function openMenu() {
    menu.classList.add('open');
    backdrop.classList.add('show');
  }
  function closeMenu() {
    menu.classList.remove('open');
    backdrop.classList.remove('show');
  }
  if (hamburger) hamburger.addEventListener('click', openMenu);
  if (closeBtn) closeBtn.addEventListener('click', closeMenu);
  if (backdrop) backdrop.addEventListener('click', closeMenu);

  // Load menu items from hamburger.html
  fetch('hamburger.html')
    .then(res => res.text())
    .then(html => {
      const container = document.getElementById('menuContainer');
      if (container) {
        container.innerHTML = html;
        // Tambahkan event listener ke setiap link
        container.querySelectorAll('a').forEach(link => {
          link.addEventListener('click', (e) => {
            e.preventDefault();
            const page = link.getAttribute('data-page');
            if (page === 'beranda') {
              // Sudah di halaman beranda, tidak perlu redirect
              closeMenu();
            } else if (page === 'logout') {
              window.location.href = '../index.html';
            } else {
              alert(`Halaman ${page} belum tersedia di versi publik.`);
              closeMenu();
            }
          });
        });
      }
    });
})();