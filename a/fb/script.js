const form = document.getElementById('lokerForm');
const statusMessage = document.getElementById('statusMessage');
const btnKirim = document.getElementById('btnKirim');
const successButtons = document.getElementById('successButtons');

const jenisKebutuhanSelect = document.getElementById('jenis_kebutuhan');
const jenisKebutuhanManual = document.getElementById('jenis_kebutuhan_manual');
const gajiSelect = document.getElementById('gaji_select');
const gajiDetail = document.getElementById('gaji_detail');

// Event listener untuk pilihan jenis kerja
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

// Event listener untuk pilihan gaji
gajiSelect.addEventListener('change', function() {
    if (this.value !== '' && this.value !== 'Gaji Tidak Di Sebutkan') {
        gajiDetail.style.display = 'block';
        gajiDetail.required = true;
        if (this.value === 'Gaji persen') {
            gajiDetail.placeholder = "Contoh: 10% dari penjualan";
        } else if (this.value === 'Gaji isi manual') {
            gajiDetail.placeholder = "Ketik keterangan gaji di sini...";
        } else {
            gajiDetail.placeholder = "Contoh: 3.500.000";
        }
    } else {
        gajiDetail.style.display = 'none';
        gajiDetail.required = false;
        gajiDetail.value = '';
    }
});

// Fungsi menyimpan data dengan batas 200
function saveToLocalStorage(formDataObj) {
    let lowonganList = localStorage.getItem('lowonganList');
    if (lowonganList) {
        lowonganList = JSON.parse(lowonganList);
    } else {
        lowonganList = [];
    }
    // Tambah di awal
    lowonganList.unshift(formDataObj);
    // Batasi maksimal 200
    if (lowonganList.length > 200) {
        lowonganList = lowonganList.slice(0, 200);
    }
    localStorage.setItem('lowonganList', JSON.stringify(lowonganList));
}

// Submit form
form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Ambil semua data
    let formDataObj = {
        'Email Perusahaan': document.querySelector('[name="Email Perusahaan"]').value,
        'Nama Perusahaan': document.querySelector('[name="Nama Perusahaan"]').value,
        'Judul Pekerjaan': document.querySelector('[name="Judul Pekerjaan"]').value,
        'Kualifikasi': document.querySelector('[name="Kualifikasi"]').value,
        'Alamat Perusahaan': document.querySelector('[name="Alamat Perusahaan"]').value,
        'Tanggal Submit': new Date().toLocaleString('id-ID')
    };
    
    // Proses jenis kerja
    let jenis = jenisKebutuhanSelect.value;
    if (jenis === 'manual') jenis = '(Manual) ' + jenisKebutuhanManual.value;
    formDataObj['Jenis Kebutuhan'] = jenis;
    
    // Proses gaji
    let gaji = gajiSelect.value;
    if (gaji !== 'Gaji Tidak Di Sebutkan') {
        formDataObj['Estimasi Gaji'] = gaji + ': ' + gajiDetail.value;
    } else {
        formDataObj['Estimasi Gaji'] = gaji;
    }
    
    // Simpan
    saveToLocalStorage(formDataObj);
    
    // Tampilkan pesan sukses
    statusMessage.className = "status-box success";
    statusMessage.innerHTML = "✅ Lowongan tersimpan (maksimal 200 data).";
    successButtons.style.display = "flex";
    
    // Reset form
    form.reset();
    jenisKebutuhanManual.style.display = 'none';
    gajiDetail.style.display = 'none';
    jenisKebutuhanSelect.value = '';
    gajiSelect.value = '';
});

// Tombol lihat lowongan
document.getElementById('btnMoreLowongan').addEventListener('click', function(e) {
    e.preventDefault();
    window.location.href = '../data-center/';
});