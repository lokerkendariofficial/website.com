const form = document.getElementById('lokerForm');
const alertBox = document.getElementById('alertBox');
const jenisSelect = document.getElementById('jenisSelect');
const jenisManual = document.getElementById('jenisManual');
const gajiSelect = document.getElementById('gajiSelect');
const gajiDetail = document.getElementById('gajiDetail');

jenisSelect.addEventListener('change', () => {
    if (jenisSelect.value === 'manual') {
        jenisManual.style.display = 'block';
        jenisManual.required = true;
    } else {
        jenisManual.style.display = 'none';
        jenisManual.required = false;
    }
});

gajiSelect.addEventListener('change', () => {
    if (gajiSelect.value !== 'Tidak disebutkan') {
        gajiDetail.style.display = 'block';
        gajiDetail.required = true;
    } else {
        gajiDetail.style.display = 'none';
        gajiDetail.required = false;
    }
});

form.addEventListener('submit', (e) => {
    e.preventDefault();

    let jenis = jenisSelect.value;
    if (jenis === 'manual') jenis = jenisManual.value.trim();
    let gaji = gajiSelect.value;
    if (gaji !== 'Tidak disebutkan') gaji = gaji + ': ' + gajiDetail.value.trim();

    const lowonganBaru = {
        id: Date.now(),
        email: form.email.value.trim(),
        perusahaan: form.perusahaan.value.trim(),
        posisi: form.posisi.value.trim(),
        lokasi: form.lokasi.value.trim(),
        jenis: jenis,
        gaji: gaji,
        deskripsi: form.deskripsi.value.trim(),
        tanggal: new Date().toLocaleString('id-ID')
    };

    // Ambil data lama dari localStorage
    let daftar = localStorage.getItem('lowonganOtak');
    daftar = daftar ? JSON.parse(daftar) : [];
    daftar.unshift(lowonganBaru);
    if (daftar.length > 200) daftar = daftar.slice(0, 200);
    localStorage.setItem('lowonganOtak', JSON.stringify(daftar));

    alertBox.className = 'alert success';
    alertBox.innerText = '✅ Lowongan tersimpan! Lihat di Data Center.';
    form.reset();
    jenisManual.style.display = 'none';
    gajiDetail.style.display = 'none';
    jenisSelect.value = 'Full-Time';
    gajiSelect.value = 'Tidak disebutkan';

    setTimeout(() => {
        alertBox.style.display = 'none';
        alertBox.className = 'alert';
    }, 3000);
});