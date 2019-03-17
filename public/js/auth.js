function changeAuth() {
  document.querySelector('#auth').classList.toggle('login-active');
  document.querySelector('#auth').classList.toggle('register-active');
  document.querySelector('#auth-details').outerHTML = document.querySelector(
    '#auth-details'
  ).outerHTML;
}

onload = () => {
  document.querySelector('#reg-form').addEventListener('submit', e => {
    e.preventDefault();
    const name = document.querySelector('#reg-form input[name="name"]').value;
    const email = document.querySelector('#reg-form input[name="email"]').value;
    const mobile = document.querySelector('#reg-form input[name="mobile"]')
      .value;
    const password = document.querySelector('#reg-form input[name="password"]')
      .value;
    fetch('/api/auth/register', {
      credentials: 'include',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, mobile, password })
    })
      .then(resp => resp.json())
      .then(data => {
        snackbar(data.msg, data.success);
        if (data.success) changeAuth();
        document.querySelector('#login-form input[name="email"]').value = email;
        document.querySelector('#login-form input[name="password"]').focus();
      });
  });
  document.querySelector('#login-form').addEventListener('submit', e => {
    e.preventDefault();
    const email = document.querySelector('#login-form input[name="email"]')
      .value;
    const password = document.querySelector(
      '#login-form input[name="password"]'
    ).value;
    fetch('/api/auth/login', {
      credentials: 'include',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })
      .then(resp => resp.json())
      .then(data => {
        snackbar(data.msg, data.success);
        if (data.success) window.location.href = '/events.html';
      });
  });
};

function snackbar(content, success = true) {
  if (!content) return;
  document.querySelector('#snackbar').classList.remove('success');
  document.querySelector('#snackbar').classList.remove('danger');
  document.querySelector('#snackbar').innerHTML = content;
  document.querySelector('#snackbar').classList.add('open');
  document
    .querySelector('#snackbar')
    .classList.add(success ? 'success' : 'danger');
  setTimeout(() => {
    document.querySelector('#snackbar').classList.remove('open');
  }, 4000);
}
