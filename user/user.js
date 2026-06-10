// user/user.js
(function() {
  const hamburger = document.getElementById('hamburgerBtn');
  const menu = document.getElementById('menuOverlay');
  const backdrop = document.getElementById('backdrop');
  const closeBtn = document.getElementById('closeMenuBtn');
  const iframe = document.getElementById('mainFrame');

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

  function loadPage(url) {
    iframe.src = url;
    closeMenu();
  }

  document.querySelectorAll('.menu-overlay a').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const page = link.getAttribute('data-page');
      if (page === 'beranda') loadPage('beranda.html');
      else if (page === 'pasang') loadPage('pasang.html');
      else if (page === 'profil') loadPage('profil.html');
      else if (page === 'logout') logoutUnique();
    });
  });
})();