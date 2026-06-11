// auth.js (tambahkan fungsi ini, sisanya tetap)
function loginWithoutPassword(identifier) {
    let users = getUsers();
    // Coba sebagai angka (ID)
    let idNumber = !isNaN(identifier) ? parseInt(identifier) : null;
    let user = users.find(u => u.id === idNumber || u.username === identifier || u.nomorHp === identifier);
    if (!user) return { success: false, msg: 'ID / Username / Nomor HP tidak ditemukan' };
    setCurrentUser({ id: user.id, nama: user.nama, username: user.username, role: user.role });
    addLog(user.id, user.nama, 'LOGIN', 'Login tanpa password');
    return { success: true, role: user.role, nama: user.nama };
}

// Ganti fungsi login lama dengan yang baru, atau biarkan keduanya ada. 
// Untuk memudahkan, kita ekspor fungsi baru ke global.
window.loginWithoutPassword = loginWithoutPassword;