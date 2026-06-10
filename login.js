// login.js
const showLoginBtn = document.getElementById('showLogin');
const showRegisterBtn = document.getElementById('showRegister');
const loginDiv = document.getElementById('loginForm');
const registerDiv = document.getElementById('registerForm');

showLoginBtn.onclick = () => {
  showLoginBtn.classList.add('active');
  showRegisterBtn.classList.remove('active');
  loginDiv.style.display = 'block';
  registerDiv.style.display = 'none';
};
showRegisterBtn.onclick = () => {
  showRegisterBtn.classList.add('active');
  showLoginBtn.classList.remove('active');
  loginDiv.style.display = 'none';
  registerDiv.style.display = 'block';
};

document.getElementById('loginBtn').onclick = () => {
  const email = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value;
  const res = login(email, password);
  if (res.success) {
    // redirect ke posting.html setelah login
    window.location.href = 'posting.html';
  } else {
    document.getElementById('loginError').innerText = res.msg;
  }
};

document.getElementById('registerBtn').onclick = () => {
  const nama = document.getElementById('regNama').value.trim();
  const email = document.getElementById('regEmail').value.trim();
  const password = document.getElementById('regPassword').value;
  const res = register(nama, email, password);
  if (res.success) {
    alert('Pendaftaran berhasil! Silakan login.');
    showLoginBtn.click();
  } else {
    document.getElementById('registerError').innerText = res.msg;
  }
};