const form = document.getElementById('lokerForm');
const statusMessage = document.getElementById('statusMessage');
const btnKirim = document.getElementById('btnKirim');
const successButtons = document.getElementById('successButtons');

const jenisKebutuhanSelect = document.getElementById('jenis_kebutuhan');
const jenisKebutuhanManual = document.getElementById('jenis_kebutuhan_manual');
const gajiSelect = document.getElementById('gaji_select');
const gajiDetail = document.getElementById('gaji_detail');

// Event untuk pilihan jenis kerja
jenisKebutuhanSelect.addEventListener('change', function() {
    if (this.value === 'manual') {
        jenisKebutuhanManual.style.display = 'block';
        jenisKebutuhanManual.required = true;
    } else {
        jenisKebutuhanManual.style.display = 'none';
        jenisKebutuhanManual.required = false;
        jenisKebutuhanManual.value = '';
    }
});

// Event untuk pilihan gaji
gajiSelect.addEventListener('change', function() {
    if (this.value !== '' && this.value !== 'Gaji Tidak Di Sebutkan') {
        gajiDetail.style.display = 'block';
        gajiDetail.required = true;
        if (this.value === 'Gaji persen') {
            gajiDetail.placeholder = 'Contoh: 10% dari penjualan';
        } else if (this.value === 'Gaji isi manual') {
            gajiDetail.placeholder = 'Ketik keterangan gaji di sini...';
        } else {
            gajiDetail.placeholder = 'Contoh: 3.500.000';
        }
    } else {
        gajiDetail.style.display = 'none';
        gajiDetail.required = false;
        gajiDetail.value = '';
    }
});

// Submit form
form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    btnKirim.disabled = true;
    btnKirim.innerText = 'Sedang Mengirim...';

    const formData = new FormData(form);
    
    // Proses jenis kerja manual
    if (jenisKebutuhanSelect.value === 'manual') {
        formData.set('Jenis Kebutuhan', '(Manual) ' + jenisKebutuhanManual.value);
    }
    
    // Proses detail gaji
    if (gajiSelect.value !== 'Gaji Tidak Di Sebutkan') {
        formData.set('Estimasi Gaji', gajiSelect.value + ': ' + gajiDetail.value);
    } else {
        formData.set('Estimasi Gaji', 'Gaji Tidak Di Sebutkan');
    }
    
    fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData
    })
    .then(async (response) => {
        let json = await response.json();
        if (response.status == 200) {
            statusMessage.className = 'status-box success';
            statusMessage.innerHTML = '✅ Sukses! Informasi lowongan kerja telah berhasil dikirim ke Admin.';
            successButtons.style.display = 'flex';
            // Reset form
            form.reset();
            jenisKebutuhanManual.style.display = 'none';
            gajiDetail.style.display = 'none';
            jenisKebutuhanSelect.value = '';
            gajiSelect.value = '';
        } else {
            statusMessage.className = 'status-box error';
            statusMessage.innerHTML = '❌ Gagal: ' + json.message;
        }
    })
    .catch(error => {
        console.error(error);
        statusMessage.className = 'status-box error';
        statusMessage.innerHTML = '❌ Terjadi kesalahan jaringan. Silakan periksa koneksi internet Anda.';
    })
    .finally(() => {
        btnKirim.disabled = false;
        btnKirim.innerText = 'Kirim Info Loker';
    });
});

// Optional: atur link tombol "Lihat Lebih Banyak Lowongan"
document.getElementById('btnMoreLowongan').addEventListener('click', function(e) {
    e.preventDefault();
    // Ganti dengan URL halaman lowongan Anda
    window.location.href = 'https://lokerkendariofficial.github.io/lokerkendariofficial.com/lowongan.html';
});