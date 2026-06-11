// pasang.js - logika pasang iklan
(function() {
    const user = getCurrentUser(); // dari auth.js
    if (!user) {
        alert('Anda harus login untuk memasang iklan.');
        window.location.href = 'login.html';
        return;
    }

    const form = document.getElementById('postForm');
    if (!form) return;

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        const newJob = {
            id: Date.now(),
            title: document.getElementById('title').value.trim(),
            company: document.getElementById('company').value.trim(),
            location: document.getElementById('location').value.trim(),
            type: document.getElementById('type').value,
            category: document.getElementById('category').value,
            salary: document.getElementById('salary').value.trim() || 'Nego',
            desc: document.getElementById('desc').value.trim(),
            email: document.getElementById('emailKontak').value.trim(),
            wa: document.getElementById('telepon').value.trim(),
            ig: document.getElementById('instagram').value.trim(),
            userId: user.id,
            userName: user.nama,
            status: 'pending',
            createdAt: new Date().toISOString()
        };
        let pending = JSON.parse(localStorage.getItem('pendingIklan') || '[]');
        pending.unshift(newJob);
        localStorage.setItem('pendingIklan', JSON.stringify(pending));
        alert('Iklan terkirim! Menunggu konfirmasi admin.');
        form.reset();
    });
})();