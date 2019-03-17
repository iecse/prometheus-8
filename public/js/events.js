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
  fetch('/api/init', { credentials: 'include' })
    .then(resp => resp.json())
    .then(data => {
      if (!data.data.logged_in) return (window.location.href = '/auth.html');
      eventData = data.data.events.sort(
        (event1, event2) => event1.name > event2.name
      );
      userData = data.data.user_data;
      registered = data.data.registered;
      teams = data.data.teams;
      teams = teams.reduce((a, c) => ({ ...a, [c.event]: c }), {});
      eventData = eventData.map(event => ({
        ...event,
        registered: registered.includes(event.id),
        team: teams[event.id]
      }));
      loaded = true;
      document.querySelector('.overlay.loading').classList.remove('loading');

      qr = new QRious({
        element: document.getElementById('qr'),
        value: userData.qr,
        background: 'white',
        foreground: 'black',
        backgroundAlpha: 0.5,
        foregroundAlpha: 1,
        level: 'L',
        mime: 'image/png',
        size: 500,
        padding: null
      });

      var qrtexture = THREE.ImageUtils.loadTexture(qr.toDataURL('image/png'));
      qrtexture.flipY = false;
      qr = new THREE.Mesh(
        new THREE.PlaneGeometry(2.5, 2.5, 2.5, 2.5),
        new THREE.MeshBasicMaterial({
          map: qrtexture
        })
      );
      qr.doubleSided = true;
      qr.scale.y = -1;
      qr.position.x = 0;
      qr.position.y = 0;
      qr.position.z = -25;
    });
};

var qr;

var eventData = [];

var currentEvent = 0;
var loaded = false;

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
  if (!loaded) return;
  var overlay = document.querySelector('.overlay');
  var modal = document.querySelector('.modal');
  overlay.classList.toggle('active');
  modal.classList.toggle('open');
}
