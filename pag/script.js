// script.js
document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');

  if (registerForm) {
    registerForm.addEventListener('submit', handleRegister);
  }

  if (loginForm) {
    loginForm.addEventListener('submit', handleLogin);
  }

  function getUsers() {
    const raw = localStorage.getItem('users');
    return raw ? JSON.parse(raw) : [];
  }

  function saveUsers(users) {
    localStorage.setItem('users', JSON.stringify(users));
  }

  function handleRegister(e) {
    e.preventDefault();
    const name = (document.getElementById('registerName').value || '').trim();
    const email = (document.getElementById('registerEmail').value || '').trim().toLowerCase();
    const password = document.getElementById('registerPassword').value || '';
    const confirm = document.getElementById('registerPasswordConfirm').value || '';
    const err = document.getElementById('registerError');
    err.textContent = '';

    if (!name || !email || !password) {
      err.textContent = 'Preencha todos os campos.';
      return;
    }
    if (password.length < 6) {
      err.textContent = 'Senha deve ter pelo menos 6 caracteres.';
      return;
    }
    if (password !== confirm) {
      err.textContent = 'As senhas não conferem.';
      return;
    }

    const users = getUsers();
    if (users.some(u => u.email === email)) {
      err.textContent = 'Já existe um usuário com esse e-mail.';
      return;
    }

    users.push({ name, email, password }); // NOTE: em produção, NÃO salve senhas em texto claro
    saveUsers(users);

    alert('Cadastro realizado com sucesso! Faça login.');
    window.location.href = 'pag_login.html';
  }

  function handleLogin(e) {
    e.preventDefault();
    const email = (document.getElementById('loginEmail').value || '').trim().toLowerCase();
    const password = document.getElementById('loginPassword').value || '';
    const err = document.getElementById('loginError');
    err.textContent = '';

    if (!email || !password) {
      err.textContent = 'Preencha email e senha.';
      return;
    }

    const users = getUsers();
    const user = users.find(u => u.email === email && u.password === password);
    if (!user) {
      err.textContent = 'Usuário ou senha inválidos.';
      return;
    }

    // Armazena sessão temporária:
    sessionStorage.setItem('loggedUser', JSON.stringify({ name: user.name, email: user.email }));
    // redireciona para página principal
    window.location.href = 'main.html';
  }
});
