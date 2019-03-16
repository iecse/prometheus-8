function changeAuth() {
  document.querySelector('#auth').classList.toggle('login-active');
  document.querySelector('#auth').classList.toggle('register-active');
  document.querySelector('#auth-details').outerHTML = document.querySelector(
    '#auth-details'
  ).outerHTML;
}
