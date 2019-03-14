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
  "bamboozeled.png",
  "battleship.png",
  "cicada.png",
  "gambit.png",
  "hawk.png",
  "mystery-room.png",
  "negative-space.png",
  "online-coding.png"
].map(filename => {
  var texture = new THREE.TextureLoader().load(`images/${filename}`);
  texture.flipY = false;
  var plane = new THREE.Mesh(
    new THREE.CircleGeometry(1.3, 250),
    new THREE.MeshFaceMaterial(
      new THREE.MeshBasicMaterial({
        map: texture
      })
    )
  );
  plane.doubleSided = true;
  plane.scale.y = - 1;
  return plane;
});

var eventOffSet = 7;

events.forEach((e, i) => {
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
    " Two more lines of description goes here. asdjka lsdlaksdj aslkdj asldkja sldkjas dlkajsd "
);

loader.load("fonts/helvetiker_regular.typeface.json", function(font) {
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
    scene.add(textMesh1);
  });
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

events.forEach(event => {
  event.rotation.y -= 0.25;
});

particle = new THREE.Object3D();
scene.add(particle);

var geometry = new THREE.TetrahedronGeometry(2, 0);

var material = new THREE.MeshPhongMaterial({
  color: 0xffffff,
  shading: THREE.FlatShading
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

function animate() {
  TWEEN.update();
  requestAnimationFrame(animate);
  particle.rotation.x += 0.0002;
  particle.rotation.y += 0.0002;
  particle.children.forEach((child, i) => {
    child.rotation.x += (Math.random() / 100) * (i % 2 === 0 ? -1 : 1);
    child.rotation.y += (Math.random() / 100) * (i % 2 === 0 ? -1 : 1);
  });
  renderer.render(scene, camera);
}

onload = () => {
  document.body.appendChild(renderer.domElement);

  window.addEventListener("resize", () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
  });

  animate();
  // addEventListener('wheel', e => spin(e.deltaY > 0));
  addEventListener("keydown", e =>
    spin(
      e.keyCode === 39 || e.keyCode === 40
        ? true
        : e.keyCode === 37 || e.keyCode === 38
        ? false
        : null
    )
  );
  document.querySelector(".event-desc").innerHTML =
    eventDescriptions[currentEvent];
  document.querySelector(".event-name").innerHTML = eventNames[currentEvent];
  // document.addEventListener("click", e => spin(e.x > window.innerWidth / 2));
};

var currentEvent = 0;

var currentDegree = 0;

var eventNames = [
  "BAMBOOZLED",
  "BATTLESHIP",
  "CICADA",
  "GAMBIT",
  "HAWKEYE",
  "MYSTERY ROOM",
  "NEGATIVE SPACE",
  "ONLINE CODING"
];

var spinnable = true;
var firstEvent = 0,
  lastEvent = 7;

function spin(invert) {
  // setTimeout(() => spinnable = true, 2000);
  if (invert === null || !spinnable) return;
  // spinnable = false;
  if (invert) {
    currentEvent = ++currentEvent % events.length;
    currentDegree = -45 * currentEvent;
  } else {
    currentEvent = --currentEvent % events.length;
    if (currentEvent < 0) currentEvent = events.length - 1;
    currentDegree = -45 * currentEvent;
  }
  document.querySelector(
    ".spinner"
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
  document.querySelector(".event-name").innerHTML = eventNames[currentEvent];
  document.querySelector(".event-desc").classList.add("invisible");
  document.querySelector(".event-details").classList.add("invisible");
  document.querySelector(".event-desc").innerHTML =
    eventDescriptions[currentEvent];
  setTimeout(
    () => document.querySelector(".event-desc").classList.remove("invisible"),
    200
  );
  setTimeout(
    () =>
      document.querySelector(".event-details").classList.remove("invisible"),
    250
  );
}
