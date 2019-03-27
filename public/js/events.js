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

addEventListener('resize', () => {
  configureScreen();
});

var ratio = innerWidth / innerHeight;

function configureScreen() {
  // console.log(ratio);
  if (ratio > 1.45)
    texts.forEach((text, i) => {
      text.scale.set(1, 1, 1);
      eventOffSet = 3.5 * ratio;
      events[i].position.x = i * 25.5 + eventOffSet;
      text.position.x = events[i].position.x - 8.1 * ratio;
      events[i].scale.set(1, -1, 1);
      scene.remove(events[i]);
      scene.add(events[i]);
    });
  else
    texts.forEach((text, i) => {
      if (ratio < 0.6) text.scale.set(0.4, 0.4, 0.4);
      else if (ratio < 1.1) text.scale.set(0.5, 0.5, 0.5);
      else text.scale.set(1, 1, 1);
      eventOffSet = 2.8 * ratio;
      events[i].position.x = i * 25.5 + eventOffSet;
      // events[i].position.y = 1.2;
      scene.remove(events[i]);
      text.position.x = events[i].position.x - 7.8 * ratio;
      events[i].scale.set(0.5, -0.5, 0.5);
    });
}

events.forEach((e, i) => {
  e.rotation.y -= 0.25;
  e.position.z = -7;
  e.position.x = i * 25.5 + eventOffSet;
  e.position.y = 2.7;
  scene.add(e);
});

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
];

var texts = [];

var userName, userNameBox;

function createTexts(callback) {
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

    callback();

    var userNameGeometry = new THREE.TextGeometry(
      userData.name
        .split(' ')
        .slice(0, 2)
        .join(' '),
      {
        font: font,
        size: (ratio / window.innerWidth) * 600,
        height: 0.2,
        curveSegments: 12,
        bevelEnabled: false
      }
    );

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
}

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

var mobile = false;

onload = () => {
  if (!(window.innerWidth < 1000 && window.innerHeight > window.innerWidth))
    document.body.appendChild(renderer.domElement);
  else mobile = true;

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
  document
    .querySelector('#right-arrow')
    .addEventListener('click', e => spin(true));
  document
    .querySelector('#left-arrow')
    .addEventListener('click', e => spin(false));
  document.querySelector('.event-desc').innerHTML =
    eventDescriptions[currentEvent];
  document.querySelector('.event-name').innerHTML = eventNames[currentEvent];
  // document.addEventListener("click", e => spin(e.x > window.innerWidth / 2));

  document.querySelector('.home').addEventListener('click', profile);
  document.querySelector('.profile-icon').addEventListener('click', profile);
  document.querySelector('#join-btn').addEventListener('click', profile);
  document.querySelector('#add-btn').addEventListener('click', createTeamOpen);

  document.querySelector('#register-btn').addEventListener('click', register);
  document
    .querySelector('#unregister-btn')
    .addEventListener('click', unregister);
  document.querySelector('.overlay').addEventListener('click', modalClose);
  document.querySelector('.close').addEventListener('click', modalClose);
  document.querySelector('.create-team').addEventListener('submit', createTeam);
  document.querySelector('#team-btn').addEventListener('click', viewTeam);
  document
    .querySelector('#add-member-btn')
    .addEventListener('click', addMember);
  configureScreen();
  init();
};

function init(callback = () => {}) {
  fetch('/api/init', { credentials: 'include' })
    .then(resp => resp.json())
    .then(data => {
      if (!data.data.logged_in) return (window.location.href = '/auth');
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

      createTexts(() => {
        events[lastEvent].position.x = events[firstEvent].position.x - 25.5;
        texts[lastEvent].position.x = texts[firstEvent].position.x - 25.5;
        firstEvent = --firstEvent % events.length;
        lastEvent = --lastEvent % events.length;
        if (firstEvent < 0) firstEvent = events.length - 1;
        if (lastEvent < 0) lastEvent = events.length - 1;

        loaded = true;
        var loadingScreen = document.querySelector('.overlay.loading');
        if (loadingScreen) loadingScreen.classList.remove('loading');
      });

      qr = new QRious({
        element: document.getElementById('qr'),
        value: userData.qr,
        background: 'white',
        foreground: 'black',
        backgroundAlpha: 1,
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
      callback();
      populateDetails();
    });
}

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

function populateDetails() {
  var details = eventData[currentEvent];
  var register = document.querySelector('#register-btn');
  var start = document.querySelector('#start-btn');
  var unregister = document.querySelector('#unregister-btn');
  var join = document.querySelector('#join-btn');
  var add = document.querySelector('#add-btn');
  var team = document.querySelector('#team-btn');
  var btns = [register, unregister, join, add, team, start];
  var eventTitle = document.querySelector('.event-title');
  eventTitle.innerHTML = details.name;
  btns.forEach(btn => btn.classList.remove('hidden'));
  btns.forEach(btn => btn.classList.add('hidden'));
  document.querySelector('#max-size').innerHTML = details.max_size;
  document.querySelector('#min-size').innerHTML = details.min_size;
  document.querySelector('#to-item').classList.remove('hidden');
  document.querySelector('#max-size').classList.remove('hidden');

  if (details.max_size <= 1) {
    document.querySelector('#to-item').classList.add('hidden');
    document.querySelector('#max-size').classList.add('hidden');
  }

  if (details.registered) {
    unregister.classList.remove('hidden');

    if (details.team) {
      team.classList.remove('hidden');
    } else if (details.max_size > 1) {
      join.classList.remove('hidden');
      add.classList.remove('hidden');
    } else if (details.max_size <= 1) {
      document.querySelector('#to-item').classList.add('hidden');
      document.querySelector('#max-size').classList.add('hidden');
    }
  } else if (details.online) {
    start.classList.remove('hidden');
    start.href = details.link;
  } else {
    register.classList.remove('hidden');
  }
}

function spin(invert) {
  // setTimeout(() => spinnable = true, 2000);
  if (invert === null || !spinnable || profileOpen || modalOpenStatus) return;
  // spinnable = false;
  if (invert) {
    currentEvent = ++currentEvent % events.length;
    currentDegree -= 45;
  } else {
    currentEvent = --currentEvent % events.length;
    if (currentEvent < 0) currentEvent = events.length - 1;
    currentDegree += 45;
  }
  populateDetails();

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
  const event = eventData[currentEvent].id;
  fetch('/api/events/register', {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ event })
  })
    .then(resp => resp.json())
    .then(data => {
      snackbar(data.msg, data.success);
      if (data.success) init();
    });
}

function unregister() {
  const event = eventData[currentEvent].id;
  fetch('/api/events/unregister', {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ event })
  })
    .then(resp => resp.json())
    .then(data => {
      snackbar(data.msg, data.success);
      if (data.success) init();
    });
}

var profileOpen = false;

var profileOpening = false;

var doInit = false;

function showBack() {
  var logout = document.querySelector('.logout');
  var back = document.querySelector('.home');
  logout.classList.remove('hidden');
  back.classList.remove('hidden');
  logout.classList.add('hidden');
}

function showLogout() {
  var logout = document.querySelector('.logout');
  var back = document.querySelector('.home');
  logout.classList.remove('hidden');
  back.classList.remove('hidden');
  back.classList.add('hidden');
}

function profile() {
  if (profileOpen) init();
  profileOpening = true;
  setTimeout(() => (profileOpening = false), 500);
  qr.position.x = camera.position.x;
  qr.position.y = camera.position.y + 1;

  userName.position.x = qr.position.x - userNameBox.max.x / 2;
  userName.position.y = camera.position.y - 2;
  userName.rotation.x = -0.2;
  if (profileOpen) {
    // setTimeout(() => {
    scene.remove(userName);
    scene.remove(qr);
    // }, 500);
    if (mobile) {
      document.querySelector('.event-title').style.display = 'block';
      document.querySelector('#qr').style.display = 'none';
      document.querySelector('.scan-message').style.display = 'none';
    }
  } else {
    // console.log(userName);
    scene.add(qr);
    scene.add(userName);

    if (mobile) {
      document.querySelector('.event-title').style.display = 'none';
      document.querySelector('.scan-message').style.display = 'block';
      document.querySelector('#qr').style.display = 'block';
    }
  }
  var position = camera.position;
  var target = {
    ...position,
    z: camera.position.z + 20 * (profileOpen ? 1 : -1)
  };

  if (profileOpen) showData(0);
  else hideData();

  if (profileOpen) showLogout();
  else showBack();

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

var modalOpenStatus = false;

function createTeam(e) {
  e.preventDefault();
  const event = eventData[currentEvent].id;
  const name = document.querySelector('#team-name').value;
  if (name.length < 3) return snackbar('Choose a longer team name', false);
  fetch('/api/teams/create', {
    credentials: 'include',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ event, name })
  })
    .then(resp => resp.json())
    .then(data => {
      snackbar(data.msg, data.success);
      if (data.success) {
        document.querySelector('.team-name').innerHTML = data.data.name;
        document.querySelector('#team-name').value = '';
        init(viewTeam);
      }
    });
}

function createTeamOpen() {
  var createTeam = document.querySelector('.create-team');
  var teamData = document.querySelector('.team-data');
  var qrScanner = document.querySelector('.qr-scanner');
  qrScanner.classList.remove('hidden');
  qrScanner.classList.add('hidden');
  teamData.classList.remove('hidden');
  teamData.classList.add('hidden');
  createTeam.classList.remove('hidden');
  modalOpen();
}

function viewTeam() {
  var team = eventData[currentEvent].team;
  var createTeam = document.querySelector('.create-team');
  var addMembers = document.querySelector('.add-members');
  var teamData = document.querySelector('.team-data');
  var qrScanner = document.querySelector('.qr-scanner');
  createTeam.classList.remove('hidden');
  createTeam.classList.add('hidden');
  qrScanner.classList.remove('hidden');
  qrScanner.classList.add('hidden');
  addMembers.classList.remove('hidden');
  addMembers.classList.add('hidden');
  teamData.classList.remove('hidden');
  document.querySelector('.team-name').innerHTML = team.name;
  fetch(`/api/teams/members/${team.id}`, { credentials: 'include' })
    .then(resp => resp.json())
    .then(data => {
      snackbar(data.msg, data.success);
      if (data.success) {
        if (data.data.length < eventData[currentEvent].max_size)
          addMembers.classList.remove('hidden');
        document.querySelector('.team-members').innerHTML = data.data.reduce(
          (a, c) =>
            a +
            `
          <div class="member">
            <div>${c.name}</div>
            <!-- <div class="cross">&times;</div> -->
            ${
              userData.id === c.id
                ? `<div onclick="leaveTeam(${
                    team.id
                  })" class="team-btn">Leave</div>`
                : ''
            }
          </div>
          `,
          ''
        );
      }
    });
  modalOpen();
}

function leaveTeam(teamid) {
  fetch(`/api/teams/leave/${teamid}`, { credentials: 'include' })
    .then(resp => resp.json())
    .then(data => {
      snackbar(data.msg, data.success);
      if (data.success) {
        modalClose();
        init();
      }
    });
}

function modalOpen() {
  if (!loaded) return;
  modalOpenStatus = true;
  var overlay = document.querySelector('.overlay');
  var modal = document.querySelector('.modal');
  if (![...overlay.classList].includes('active'))
    overlay.classList.add('active');
  if (![...modal.classList].includes('open')) modal.classList.add('open');
}

function modalClose() {
  if (!loaded) return;
  if (scanner) scanner.stop();
  modalOpenStatus = false;
  var overlay = document.querySelector('.overlay');
  var modal = document.querySelector('.modal');
  overlay.classList.remove('active');
  modal.classList.remove('open');
  document.querySelector('.team-members').innerHTML = '';
}

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

function addMember() {
  var team = eventData[currentEvent].team;
  var createTeam = document.querySelector('.create-team');
  var teamData = document.querySelector('.team-data');
  var qrScanner = document.querySelector('.qr-scanner');
  createTeam.classList.remove('hidden');
  createTeam.classList.add('hidden');
  teamData.classList.remove('hidden');
  teamData.classList.add('hidden');
  qrScanner.classList.remove('hidden');
  scanning = true;

  scanner = new Instascan.Scanner({
    continuous: true,
    video: document.getElementById('preview'),
    mirror: false,
    backgroundScan: false,
    captureImage: false,
    refactoryPeriod: 5000,
    scanPeriod: 1
  });

  scanner.addListener('scan', function(qr) {
    if (!scanning) return;
    scanning = false;
    fetch('/api/teams/members/add', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ qr, team: team.id })
    })
      .then(resp => resp.json())
      .then(data => {
        snackbar(data.msg, data.success);
        if (data.success) {
          modalClose();
          viewTeam();
        }
        scanning = true;
      });
  });
  Instascan.Camera.getCameras()
    .then(function(cameras) {
      if (cameras.length > 0) scanner.start(cameras[cameras.length - 1]);
      else console.error('No cameras found');
    })
    .catch(function(e) {
      console.error(e);
    });
}

var scanner;
var scanning = true;
