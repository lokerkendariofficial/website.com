document.getElementById('loginBtn').onclick = () => {
  const username = document.getElementById('loginId').value.trim();
  const password = document.getElementById('password').value;
  const res = login(username, password);
  if (res.success) {
    if (res.role === 'pemilik') {
      window.location.href = 'owner/index.html';
    } else if (res.role === 'admin') {
      window.location.href = 'admin/index.html';
    } else {
      window.location.href = 'posting.html';
    }
  } else {
    document.getElementById('error').innerText = res.msg;
  }
};