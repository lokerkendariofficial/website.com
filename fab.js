// fab.js
(function() {
  const mainBtn = document.getElementById('fabMainBtn');
  const submenu = document.getElementById('fabSubmenu');
  if (mainBtn && submenu) {
    mainBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      submenu.classList.toggle('show');
    });
    document.addEventListener('click', function(event) {
      if (!mainBtn.contains(event.target) && !submenu.contains(event.target)) {
        submenu.classList.remove('show');
      }
    });
  }
})();