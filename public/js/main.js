onload = () => {
  var signUp = document.querySelector('#sign-up-btn');
  var joinUs = document.querySelector('.join-us-text');
  var aboutUs = document.querySelector('.about-us-text');
  var content = document.querySelector('.content');
  var delcard = document.querySelector('#delcard');
  var delemail = document.querySelector('.delcard-name');
  var delname = document.querySelector('.delcard-email');
  fetch('/api/init', { credentials: 'same-origin' })
    .then(resp => resp.json())
    .then(data => {
      if (!data.data.logged_in) return;
      var user = data.data.user_data;
      delcard.classList.remove('hidden');
      joinUs.classList.add('hidden');
      signUp.classList.add('hidden');
      content.classList.add('hidden');
      delemail.innerHTML = user.email;
      delname.innerHTML = user.name;
      var qr = new QRious({
        element: document.getElementById('qr'),
        value: user.qr,
        background: 'white',
        foreground: 'black',
        backgroundAlpha: 1,
        foregroundAlpha: 1,
        level: 'L',
        mime: 'image/png',
        size: 500,
        padding: null
      });
    });
};
