// posting.js
const user = getCurrentUser();
if (!user) {
  alert('Anda harus login untuk memasang iklan.');
  window.location.href = 'login.html';
}

document.getElementById('postForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const newJob = {
    id: Date.now(),
    title: document.getElementById('title').value,
    company: document.getElementById('company').value,
    location: document.getElementById('location').value,
    type: document.getElementById('type').value,
    category: document.getElementById('category').value,
    salary: document.getElementById('salary').value || 'Nego',
    desc: document.getElementById('desc').value,
    address: document.getElementById('address').value,
    qualification: document.getElementById('qualification').value,
    contact: document.getElementById('contact').value,
    userId: user.id,
    userName: user.nama,
    status: 'pending'
  };
  let pending = JSON.parse(localStorage.getItem('pendingIklan') || '[]');
  pending.unshift(newJob);
  localStorage.setItem('pendingIklan', JSON.stringify(pending));
  alert('Iklan terkirim! Menunggu konfirmasi admin.');
  e.target.reset();
});

document.getElementById('logoutBtn').addEventListener('click', (e) => {
  e.preventDefault();
  logout();
});