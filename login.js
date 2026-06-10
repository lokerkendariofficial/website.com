// login.js
document.getElementById('loginBtn').onclick = () => {
  const username = document.getElementById('loginId').value.trim();
  const password = document.getElementById('loginPassword').value;
  if (!username || !password) {
    document.getElementById('loginError').innerText = 'Harap isi semua field.';
    return;
  }
  const res = login(username, password);
  if (res.success) {
    if (res.role === 'pemilik') {
      window.location.href = 'owner.html';
    } else if (res.role === 'admin') {
      window.location.href = 'admin.html';
    } else {
      window.location.href = 'posting.html';
    }
  } else {
    document.getElementById('loginError').innerText = res.msg;
  }
};