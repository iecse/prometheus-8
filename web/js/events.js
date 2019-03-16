var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

var renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setPixelRatio(window.devicePixelRatio ? window.devicePixelRatio : 1);
renderer.autoClear = false;
renderer.setClearColor(0x000000, 0.0);
renderer.setSize(window.innerWidth, window.innerHeight);

var events = [
  'bamboozeled.png',
  'battleship.png',
  'cicada.png',
  'gambit.png',
  'hawk.png',
  'mystery-room.png',
  'negative-space.png',
  'online-coding.png'
].map(filename => {
  var texture = new THREE.TextureLoader().load(`images/${filename}`);
  texture.flipY = false;
  var plane = new THREE.Mesh(
    new THREE.CircleGeometry(1.4, 250),
    new THREE.MeshBasicMaterial({
      map: texture
    })
  );
  plane.doubleSided = true;
  plane.scale.y = -1;
  return plane;
});

var eventOffSet = 7;

events.forEach((e, i) => {
  e.rotation.y -= 0.25;
  e.position.z = -7;
  e.position.x = i * 25.5 + eventOffSet;
  e.position.y = 2.7;
  scene.add(e);
});

var controls = new THREE.DeviceOrientationControls(camera);

var ambientLight = new THREE.AmbientLight(0x999999);
scene.add(ambientLight);

var loader = new THREE.FontLoader();

var eventDescriptions = [
  `An implementation of a mad house involving mild
   brain teasers, puzzles and fun games. No time for
    maths and GK, it’s all about the fun.`,
  `An offline coding event where you code efficient
   algorithms to defeat the Syndicate at sea and keep
    them at bay.`,
  `Think you're a code-breaker? Test your skills with
   Cicada, an event with some of the most head 
   scratching puzzles you've ever seen. Rack your brains,
    first online and then offline in the final round.`,
  `A fast paced offline coding event where you bet on your
   coding skills, to rise to the top of the leaderboard.`,
  `A 3 day online scavenger hunt that'll test your problem
   solving skills to the extreme. It's crazy and highly
    addictive.`,
  `Mystery Room is a non tech event based on the
   quintessential Escape Room! Be it invisible ink or
    confusing riddles, deciphering the clues is the only
     way out!`,
  `A Graphic Designing competition providing an unparalleled
   opportunity for emerging designers to gain exposure and put
    their creative skills to the test.`,
  `A 3 day long nerve racking test of your competitive coding
   proficiency where you show off your skills against the top
    coders in the game`
].map(
  a =>
    a +
    ' Two more lines of description goes here. asdjka lsdlaksdj aslkdj asldkja sldkjas dlkajsd '
);

var texts = [];

var userName, userNameBox;

loader.load('fonts/helvetiker_regular.typeface.json', function(font) {
  var materials = [
    new THREE.MeshPhongMaterial({ color: 0xffffff, flatShading: true }), // front
    new THREE.MeshPhongMaterial({ color: 0xffffff }) // side
  ];

  eventNames.forEach((eventname, i) => {
    var textGeometry = new THREE.TextGeometry(eventname, {
      font: font,
      size: 1,
      height: 0.08,
      curveSegments: 12,
      bevelEnabled: false
    });

    var textGeo = new THREE.BufferGeometry().fromGeometry(textGeometry);
    var textMesh1 = new THREE.Mesh(textGeo, materials);
    textMesh1.rotation.y = 0.1;
    textMesh1.position.x = events[i].position.x - 16;
    textMesh1.position.y = events[i].position.y;
    textMesh1.position.z = events[i].position.z;
    texts.push(textMesh1);
    scene.add(textMesh1);
  });

  var userNameGeometry = new THREE.TextGeometry('Pranav Tharoor', {
    font: font,
    size: 0.8,
    height: 0.2,
    curveSegments: 12,
    bevelEnabled: false
  });

  var userNameMaterials = [
    new THREE.MeshPhongMaterial({
      color: 0xffffff,
      flatShading: THREE.FlatShading
    }), // front
    new THREE.MeshPhongMaterial({
      color: 0x550055,
      flatShading: THREE.FlatShading
    }) // side
  ];

  userNameGeo = new THREE.BufferGeometry().fromGeometry(userNameGeometry);
  userName = new THREE.Mesh(userNameGeo, userNameMaterials);
  var box = new THREE.Box3().setFromObject(userName);
  userName.position.x = 0;
  userName.position.y = 0;
  userName.position.z = -25;
  userNameBox = new THREE.Box3().setFromObject(userName);
});

var lights = [];
lights[0] = new THREE.DirectionalLight(0xffffff, 1);
lights[0].position.set(1, 0, 1);
lights[1] = new THREE.DirectionalLight(0x11e8bb, 1);
lights[1].position.set(7.5, 10, 5);
lights[2] = new THREE.DirectionalLight(0x8200c9, 1);
lights[2].position.set(-7.5, -10, 5);
scene.add(lights[0]);
scene.add(lights[1]);
scene.add(lights[2]);

particle = new THREE.Object3D();
scene.add(particle);

var geometry = new THREE.TetrahedronGeometry(2, 0);

var material = new THREE.MeshPhongMaterial({
  color: 0xffffff,
  flatShading: THREE.FlatShading
});

for (var i = 0; i < 1000; i++) {
  var mesh = new THREE.Mesh(geometry, material);
  mesh.position
    .set(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5)
    .normalize();
  mesh.position.multiplyScalar(90 + Math.random() * 700);
  mesh.rotation.set(Math.random() * 2, Math.random() * 2, Math.random() * 2);
  particle.add(mesh);
}

var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();

function animate() {
  TWEEN.update();
  requestAnimationFrame(animate);
  particle.rotation.x += 0.0002;
  particle.rotation.y += 0.0002;
  particle.children.forEach((child, i) => {
    child.rotation.x += (Math.random() / 100) * (i % 2 === 0 ? -1 : 1);
    child.rotation.y += (Math.random() / 100) * (i % 2 === 0 ? -1 : 1);
  });

  raycaster.setFromCamera(mouse, camera);

  // calculate objects intersecting the picking ray
  var intersects = raycaster.intersectObjects(scene.children);

  for (var i = 0; i < intersects.length; i++) {
    if (intersects[i].object.geometry.type !== 'CircleGeometry') {
      // console.log(intersects[i].object)
      // intersects[i].object.rotation.y += 0.001;
    }
  }

  renderer.render(scene, camera);
}

function onMouseMove(event) {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
}

onload = () => {
  document.body.appendChild(renderer.domElement);

  window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
  });

  window.addEventListener('mousemove', onMouseMove, false);

  animate();
  // addEventListener('wheel', e => spin(e.deltaY > 0));
  addEventListener('keydown', e =>
    spin(
      e.keyCode === 39 || e.keyCode === 40
        ? true
        : e.keyCode === 37 || e.keyCode === 38
          ? false
          : null
    )
  );
  document.querySelector('.event-desc').innerHTML =
    eventDescriptions[currentEvent];
  document.querySelector('.event-name').innerHTML = eventNames[currentEvent];
  // document.addEventListener("click", e => spin(e.x > window.innerWidth / 2));

  events[lastEvent].position.x = events[firstEvent].position.x - 25.5;
  texts[lastEvent].position.x = texts[firstEvent].position.x - 25.5;
  firstEvent = --firstEvent % events.length;
  lastEvent = --lastEvent % events.length;
  if (firstEvent < 0) firstEvent = events.length - 1;
  if (lastEvent < 0) lastEvent = events.length - 1;

  document.querySelector('.profile-icon').addEventListener('click', profile);
  document.querySelector('#join-btn').addEventListener('click', profile);
  document
    .querySelector('#add-btn')
    .addEventListener('click', createTeamToggle);

  document.querySelector('#register-btn').addEventListener('click', register);
  document
    .querySelector('.overlay')
    .addEventListener('click', createTeamToggle);
  document.querySelector('.close').addEventListener('click', createTeamToggle);
  document.querySelector('.overlay.loading').classList.remove('loading');
};

var currentEvent = 0;

var currentDegree = 0;

var eventNames = [
  'BAMBOOZLED',
  'BATTLESHIP',
  'CICADA',
  'GAMBIT',
  'HAWKEYE',
  'MYSTERY ROOM',
  'NEGATIVE SPACE',
  'ONLINE CODING'
];

var spinnable = true;
var firstEvent = 0,
  lastEvent = 7;

function spin(invert) {
  // setTimeout(() => spinnable = true, 2000);
  if (invert === null || !spinnable || profileOpen) return;
  // spinnable = false;
  if (invert) {
    currentEvent = ++currentEvent % events.length;
    currentDegree -= 45;
  } else {
    currentEvent = --currentEvent % events.length;
    if (currentEvent < 0) currentEvent = events.length - 1;
    currentDegree += 45;
  }

  if (currentEvent === lastEvent) {
    events[firstEvent].position.x = events[lastEvent].position.x + 25.5;
    texts[firstEvent].position.x = texts[lastEvent].position.x + 25.5;
    firstEvent = ++firstEvent % events.length;
    lastEvent = ++lastEvent % events.length;
  }

  if (currentEvent === firstEvent) {
    events[lastEvent].position.x = events[firstEvent].position.x - 25.5;
    texts[lastEvent].position.x = texts[firstEvent].position.x - 25.5;
    firstEvent = --firstEvent % events.length;
    lastEvent = --lastEvent % events.length;
    if (firstEvent < 0) firstEvent = events.length - 1;
    if (lastEvent < 0) lastEvent = events.length - 1;
  }

  document.querySelector(
    '.spinner'
  ).style.transform = `rotate(${currentDegree}deg)`;

  var position = camera.position;
  var target = {
    ...position,
    x: events[currentEvent].position.x - eventOffSet
  };

  new TWEEN.Tween(position)
    .to(target, 500)
    .onUpdate(function() {
      camera.position.x = position.x;
      camera.position.y = position.y;
      camera.position.z = position.z;
    })
    .start();
  hideData();
  document.querySelector('.event-name').innerHTML = eventNames[currentEvent];
  document.querySelector('.event-desc').innerHTML =
    eventDescriptions[currentEvent];
  showData();
}

function hideData() {
  document.querySelector('.event-desc').classList.add('invisible');
  document.querySelector('.event-details').classList.add('invisible');
}

function showData(delay = 200, offset = 50) {
  setTimeout(
    () => document.querySelector('.event-desc').classList.remove('invisible'),
    delay
  );
  setTimeout(
    () =>
      document.querySelector('.event-details').classList.remove('invisible'),
    delay + offset
  );
}

function register() {
  document.querySelector('#register-btn').style.display = 'none';
  document.querySelector('#join-btn').style.display = 'block';
  document.querySelector('#add-btn').style.display = 'block';
}

var qrtexture = THREE.ImageUtils.loadTexture(
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAALQAAAC0CAYAAAA9zQYyAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAACXJJREFUeNrsne152kgURkfE/0MHSyoIqcBQQewKDBU4rsC4AtsVGFdgXIHlClapYJUOSAVeBg0JwUD0rXtnznkebdiNkx2ko1d3RqPRBwPgER/YBeATEbugJLO34eqf/dU2cJvldM9Pjnb+PXXbNslq++k+x7/+2yxasqMRum5xraxDt53uCNwGsTsBfrjPiI7QhQQeuVT97H7tC2xl6uT+vv51FiUcOITeTuAzl75SBf4bSyf4sxM8RegwJb5wpYRvJE7uRWjpHQUksU3eiccSHytPHlfbPITkjgIQeeQknlBhrsuSx5XYc4TWJ7IV+LrlEQlNNfe9j6kdeSaxLSu+rbZLpZ27LrBpfeOL2BEig09iR4gMPokdKZaZGrlZ7pzYS4RuVmQ75HZr3s+RgGY6j1bqO4Rupry4diUGtEu82q403KSJlMhs0/iB8qJzbFrPEJpU9gmb0lOpaR0JltnWyk+ksliuJNbWkVCZZy6ZQX5tfS5pJCQSJnLf1cpnuKIGK/NYSgkSCZKZEkM3UwmTniIhMp+5ZOZun27sZKdp2ELP3uwIxi0uUFfrF3r2ZlN5ggPekbi6ehmO0MgcgtTnbU9yijoQue86fyOOufe0PgISdSDziwnrmT6kblHqCJnBJ6l7LX4pZA6XLMyyUPNA6KwDiMxI3bjUUUsyTzie4Gh0SK/XsMwzZIYdNk8cKUvo7Jm/B44fHOBuldJXOoTOJhq9GOZmwHFqn9AUNSCzlfg/ZIYc1D6c14TQNplHgXd6lluff+75mc9bJ/ww8JO/1k7iSQOdwFFAB8Ju3399rnJQsgeB++b3mwJCEX3o+lrnshI6OyAvHu/41Py5qHjzM8myvsjI6F6MvdV6Oqppx/taN1uJFyZbgrb7R4yyByG+muwRNd/2tQ2IL1Vn59Ul9JPx6znAjcQLsS3M5L7wbL/bK9+4W6GzHfvkyQ61lzxdCxVmr9ewi1VOPEntSssjRBV3pi+lhsqFCfccCx9WYq1UelQVWnupoS+R84mtfbUp+7Kj83aF1j2qkbhLW+ztmIH+VVrHZY5PFaFtqTFQuKPELzhYs9jfXGJrK0PS1XH6VPQP9UrupJlCmRNXm4Uj8/pYrTtYX9z318TAnYwNJ7TOjuDclRhhvyN79narrLa2x+tTkeNWJqG1Xb6m69V8eOG7cdM1z83vuSbS6Rc9AaOCZ/jApbOWs/vc645ftQ6jlum9hVK6aEJfK5J5jMwHkzpRVFcXSumowFmtJZ07WbFHaVJrWVoid0oXSehrJTKPkTl3UmdXMvlJbU+8SX0JrSOdU5MNy9H58zOpc41L503oifBDsukAInP5pJ4a2aMfAzcRrqLQ2dl7qaADmGBm5Y7iWHgrL6sLLX8y+RUy1yr1VHALR678rSS05HS+k/BeD8+ktvtT8j69LC90NgAvtaOQNLFQCbirXtbJlshZlYSWms5ZJxCa7CRK3b8DF7SlhJY6ef+GseZW6ukbbWVH70i5IbUzGEt8Ja+n3AktPUZlEvqr0FJjimetlh4S+ykHy46esnLjnlKjdakXJltgRxoX+YWWWW6k7hIIXfRZlJQdhxL6VGhHkFvb3aR0LDClh/tusvSUlBspN1BI6Twp3dtTbgyMvAdgb/CJlM5TSfTy1iYdsiSdxfCoL6Hl1c/3eCQmpedG1hTTwW4drSGhSWeOx/HO4UGh5dXPC8adKTvKCy1vZt0j/ogrO+wcD0khc6pF6KXoBcfDRtJxOZrQp+w0yMGzoLb0tzuGvXe9Rjm84o3YsiM20kY7FAhNQssmFtSW0XuhswXMpZAwb0M8kq6gH/cldJ+zHwqFjsCOYe9Qb7FjvuOLijpaTsdwj9AfOftB6XESntAsHKOFVFqDepz14EVp6AY1toUeCGkaoxskdC0JLUVobqggtFclB+hB3N3CHmc9eNJ5R2jwD0oOQGgAqZxsfZayVAAlB9QgdGgvdQdKDgCEBkBoAISGtjnyrpMOSBEaqtJHaPCJASUHIHQzLBEaqvJZTj2fTZRCaKiCuLcMIzSUTMS3vqCSI0Fo8CmdlwgNVRkJassrQkNVJL1pmISGyvWzpJKDGhoqIe09lggN3pQb6fZKtQgNZcoNSQn9x5PnCA3ay40/liM7CSBRJkbGDYBY2BK0ZbkU1p44LKGNuTByxkx1C50tiCjrdvdOSFByQNFwEJvOCA1F0tmWbRNhrXpFaCjLtcA2LRAafEnn5b7FIhEa8nCrIZ0RGvKk88jIG3u2PCM0+JLOttwgoaFwOs+MwMeszJHXZiM0HJLZinwttHXPCA1FeRDaroPlhuUkx5k6a6hh81XDUrwRmc63QkuNzJsj5JnL0dRlJzYsbi5RZjui8U1wC++P/SYlB+zWzQ+CWxj/7aqO0LCR2U7cfzKyFmDc5fFvP4DQsJH5xQhcfHEL+6jVHKEhD0+CO4Ebcr3UCqFJZ1szj4S30j4Eu8jzgycc0aDLDCvzmYLW3m8/2Y3QcKhmHiporRX5Lu8PU3KEJ/NAkcyF0hmhw5PZ1sr/KpI5LZLOCB2WzDOXzH1Frb4pks7U0OGUGBpGMnZJ8ow7k9BhyTxxJcZIYeuvyvwhEppUlsi87CpTCO2XyLY+tjPlrhV/i2XZdEZo/0S+VNbp28e0aEcQoRFZKotjT6MgtL8i29rYrjM38ehbLdfpXBGE1iPx0Els514MPPyGlUoNhNZRTtgkPvVY4g3zqqUGQsuSd+CEtQL/Y7Jb08NAvr1dn+6qrr8syrGzXxr6Iulq+9HCDjsVcuAG5v1DwUNPOnNV6ubxvkUXmxO6uVR6a+n/ZOcDzASk8JuBfXXzvM6/kFvf0BU3dcuM0NBlJ7CRqyZCg+pOIEJD1zKP6xhvRmjomqWp6eYJQoMEmWsdnkNo8F5mhAavZEZo8EpmhIamSLuQ2cLkJKibxofmSGhoi7hLmUloqBN7O3vadSMQGupg2sREI4SGLjp/5110/qihoW7sI1NfJMlMQkMZbIfPzmW+k9g4hIYiJK5eTqQ2EKEhLzIeZUNoqEjsUjnV0FiEhmO18pWU4TiEhioi2/dp33V5xw+hoQ7mrlZOtX4BhAYvREZo8ErkDRHHtCXkrJykukYmoWFDvNoetY1aIDRsk64lzqZ2piF8YYT2U+KFS+MktC+P0P6UE8/rXwOUGKF1YztyVtpXJ3DMLkFoLSRO4Ff3OQmlFkZoHWXBIWl/7gicIi4AmP8FGAC6LdJn2AlYHAAAAABJRU5ErkJggg=='
);
qrtexture.flipY = false;
var qr = new THREE.Mesh(
  new THREE.CircleGeometry(1.4, 250),
  new THREE.MeshBasicMaterial({
    map: qrtexture
  })
);
qr.doubleSided = true;
qr.scale.y = -1;
qr.position.x = 0;
qr.position.y = 0;
qr.position.z = -25;

var profileOpen = false;

var profileOpening = false;

function profile() {
  if (profileOpening) return;
  profileOpening = true;
  setTimeout(() => (profileOpening = false), 500);
  qr.position.x = camera.position.x;
  qr.position.y = camera.position.y + 1;

  userName.position.x = qr.position.x - userNameBox.max.x / 2;
  userName.position.y = camera.position.y - 2;
  userName.rotation.x = -0.2;
  if (profileOpen)
    setTimeout(() => {
      scene.remove(qr);
      scene.remove(userName);
    }, 500);
  else {
    // console.log(userName);
    scene.add(qr);
    scene.add(userName);
  }
  var position = camera.position;
  var target = {
    ...position,
    z: camera.position.z + 20 * (profileOpen ? 1 : -1)
  };

  if (profileOpen) showData(0);
  else hideData();

  new TWEEN.Tween(position)
    .to(target, 500)
    .onUpdate(function() {
      camera.position.x = position.x;
      camera.position.y = position.y;
      camera.position.z = position.z;
    })
    .start();

  profileOpen = !profileOpen;
}

var createTeamOpen = false;

function createTeamToggle() {
  var overlay = document.querySelector('.overlay');
  var modal = document.querySelector('.modal');
  overlay.classList.toggle('active');
  modal.classList.toggle('open');
}
